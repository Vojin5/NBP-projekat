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

    
}
