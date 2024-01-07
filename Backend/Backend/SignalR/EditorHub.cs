using Cassandra;
using Microsoft.AspNetCore.SignalR;
using StackExchange.Redis;

namespace Backend.SignalR;

public class EditorHub : Hub
{
    public static Dictionary<string, UserInfo> _users = new();
    public static Dictionary<string, LinkedList<UserInfo>> _documents = new();

    public async Task SendMyInfo(string documentId, string username)
    {
        var user = _users[Context.ConnectionId];
        user.Username = username;
        user.DocumentId = documentId;
        LinkedList<UserInfo> users;
        var isDocumentPresent = _documents.TryGetValue(user.DocumentId,out users);
        if(isDocumentPresent == false)
        {
            _documents[user.DocumentId] = new();
        }
        var documentUsers = _documents[user.DocumentId];
        documentUsers.AddLast(user);
        if (documentUsers.Count == 1)
        {
            var CassandraConnection = Cluster.Builder().AddContactPoint("127.0.0.1").WithPort(9042).Build().Connect("nbp");
            var ss = new SimpleStatement($"SELECT content FROM documents_by_id WHERE id={user.DocumentId};");
            var content = (await CassandraConnection.ExecuteAsync(ss)).FirstOrDefault()!["content"];
            if(content == null)
            {
                return;
            }
            var RedisConnection = ConnectionMultiplexer.Connect("localhost").GetDatabase();
            await RedisConnection.ListRightPushAsync(user.DocumentId, content.ToString());
            await Clients.Client(user.ConnectionId).SendAsync("handleRedisDocumentChanges", content);
        }
        else
        {
            var RedisConnection = ConnectionMultiplexer.Connect("localhost").GetDatabase();
            var deltas = await RedisConnection.ListRangeAsync(user.DocumentId, 0, -1);
           
            var content = deltas.Select(x => x.ToString()).ToList();
            string contentString = "";
            foreach (var e in content)
            {
                contentString += e.ToString();
            }

            await Clients.Client(user.ConnectionId).SendAsync("handleRedisDocumentChanges", contentString);
        }
    }

    public async Task SendDocumentChanges(string newDelta)
    {
        var user = _users[Context.ConnectionId];
        var RedisConnection = ConnectionMultiplexer.Connect("localhost").GetDatabase();
        await RedisConnection.ListRightPushAsync(user.DocumentId, newDelta);
        var documentUsers = _documents[user.DocumentId];
        var connectionIds = documentUsers.Where(u => u.ConnectionId != Context.ConnectionId)
            .Select(u => u.ConnectionId).ToList();
       
        await Clients.Clients(connectionIds).SendAsync("handleDeltaChanges", newDelta);
    }

    public async Task AcquireWriteLock()
    {
        var user = _users[Context.ConnectionId];
        var RedisConnection = ConnectionMultiplexer.Connect("localhost").GetDatabase();
        bool isAvailable = await RedisConnection.StringSetAsync(user.DocumentId+"-lock", user.Username, when: When.NotExists);
        if (isAvailable)
        {
            await Clients.Clients(_documents[user.DocumentId].Select(d => d.ConnectionId)).SendAsync("handleWriteLock",user.Username);
        }
        
    }

    public async Task ReleaseWriteLock()
    {
        var user = _users[Context.ConnectionId];
        var RedisConnection = ConnectionMultiplexer.Connect("localhost").GetDatabase();
        await RedisConnection.KeyDeleteAsync(user.DocumentId + "-lock");
        
        await Clients.Clients(_documents[user.DocumentId].Select(d => d.ConnectionId)).SendAsync("handleWriteRelease");
    }

    public override Task OnConnectedAsync()
    {
        _users[Context.ConnectionId] = new UserInfo(Context.ConnectionId);
        return base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var user = _users[Context.ConnectionId];
        var documentId = user.DocumentId;
        _users.Remove(Context.ConnectionId);
        var document = _documents[user.DocumentId];
        document.Remove(user);
       
        if(document.Count == 0)
        {
            var RedisConnection = ConnectionMultiplexer.Connect("localhost").GetDatabase();
            var contentData = await RedisConnection.ListRangeAsync(documentId, 0, -1);
            var content = contentData.Select(x => x.ToString()).ToList();
            string contentString = "";
            foreach(var e in content)
            {
                contentString += e.ToString();
            }
            var CassandraConnection = Cluster.Builder().AddContactPoint("127.0.0.1").WithPort(9042).Build().Connect("nbp");
            var ss = new SimpleStatement($"UPDATE documents_by_id SET content = '{contentString}' WHERE id = {documentId};");
            await CassandraConnection.ExecuteAsync(ss);
            await RedisConnection.KeyDeleteAsync(documentId);
            await RedisConnection.KeyDeleteAsync(documentId + "-lock");
        }
        else
        {
            var RedisConnection = ConnectionMultiplexer.Connect("localhost").GetDatabase();
            var userLock = (await RedisConnection.StringGetAsync(documentId + "-lock")).ToString();
            if(userLock == user.Username)
            {
                await RedisConnection.KeyDeleteAsync(documentId + "-lock");
                await Clients.Clients(_documents[user.DocumentId].Select(d => d.ConnectionId)).SendAsync("handleWriteRelease");
            }
        }
        await base.OnDisconnectedAsync(exception);
    }
}
