using Cassandra;
using Microsoft.AspNetCore.SignalR;
using StackExchange.Redis;

namespace Backend.SignalR;

public class EditorHub : Hub
{
    public static Dictionary<string, UserInfo> _users = new();
    public static Dictionary<string, List<UserInfo>> _documents = new();

    public async Task SendMyInfo(string documentId, string username)
    {
        var user = _users[Context.ConnectionId];
        user.Username = username;
        user.DocumentId = documentId;
        var documentUsers = _documents[user.DocumentId];
        documentUsers.Add(user);
        if (documentUsers.Count == 1)
        {
            var CassandraConnection = Cluster.Builder().AddContactPoint("127.0.0.1").WithPort(9042).Build().Connect("nbp");
            var ss = new SimpleStatement($"SELECT content FROM documents_by_id WHERE id={user.DocumentId};");
            var content = (await CassandraConnection.ExecuteAsync(ss)).FirstOrDefault()!["content"];

            var RedisConnection = ConnectionMultiplexer.Connect("localhost").GetDatabase();
            await RedisConnection.ListRightPushAsync(user.DocumentId, content.ToString());
            await Clients.Client(user.ConnectionId).SendAsync("handleRedisDocumentChanges", content);
        }
        else
        {
            var RedisConnection = ConnectionMultiplexer.Connect("localhost").GetDatabase();
            var deltas = await RedisConnection.ListRangeAsync(user.DocumentId, 0, -1);
            await Clients.Client(user.ConnectionId).SendAsync("handleRedisDocumentChanges", deltas);
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

    public override Task OnConnectedAsync()
    {
        _users[Context.ConnectionId] = new UserInfo(Context.ConnectionId);
        return base.OnConnectedAsync();
    }

    public override Task OnDisconnectedAsync(Exception? exception)
    {
        return base.OnDisconnectedAsync(exception);
    }
}
