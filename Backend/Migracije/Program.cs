// See https://aka.ms/new-console-template for more information

using Cassandra;
using StackExchange.Redis;
//CASSANDRA INIT
var cluster = Cluster.Builder().AddContactPoint("127.0.0.1").WithPort(9042).Build();
var session = cluster.Connect("nbp");
var simpleStatement = new SimpleStatement("CREATE TABLE users_by_username (username text PRIMARY KEY, password text, email text, avatar text);");
session.Execute(simpleStatement);
simpleStatement = new SimpleStatement("CREATE TABLE documents_by_id (id UUID PRIMARY KEY, document_name text, content text, people list<text>);");
session.Execute(simpleStatement);
simpleStatement = new SimpleStatement("CREATE TABLE document_card_by_username (username text, document_id UUID, owner boolean, favourite boolean," +
    " document_name text, people list<text>, PRIMARY KEY(username,document_id));");
session.Execute(simpleStatement);
/*var stm = new SimpleStatement("select * from Room");
RowSet data = await session.ExecuteAsync(stm);
foreach (var row in data)
{
    Console.WriteLine(row["id"]);
    Console.Write(row["description"]);
}*/

/*ConnectionMultiplexer redis = ConnectionMultiplexer.Connect("localhost");
IDatabase db = redis.GetDatabase();

db.StringSet("testString", "testValue");
Console.WriteLine(db.StringGet("testString"));*/