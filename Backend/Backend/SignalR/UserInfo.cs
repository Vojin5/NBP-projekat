namespace Backend.SignalR;

public class UserInfo
{
    public string ConnectionId { get; set; }
    public string Username { get; set; }
    public string DocumentId { get; set; }

    public UserInfo(string connectionId)
    {
        ConnectionId = connectionId;    
    }

    public override bool Equals(object? obj)
    {
        var other = obj as UserInfo;
        return ConnectionId == other.ConnectionId;
    }

}
