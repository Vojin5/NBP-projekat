using Cassandra;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace Backend.Controllers;
[ApiController]
[Route("[controller]")]
public class DocumentController : ControllerBase
{
    public Cassandra.ISession CassandraDB { get; set; } = Cluster.Builder().AddContactPoint("127.0.0.1").WithPort(9042).Build().Connect("nbp");

    [HttpPost("create/{owner}/{documentName}")]
    public async Task<IActionResult> createDocument([FromRoute] string documentName, [FromBody] List<string> usernames, [FromRoute] string owner)
    {
        
        string batch = "BEGIN BATCH\n";
        
        string list = "[";
        usernames.ForEach(u =>
        {
            list += $"'{u}'";
        });
        list += "'"+owner+"'";
        list+= "]";
        var uuid = System.Guid.NewGuid().ToString();
        batch+= ($"INSERT INTO document_card_by_username" +
            "(username,document_id,owner,favourite,document_name,people)" +
            $" VALUES ('{owner}',{uuid},true,false,'{documentName}',{list});\n");
        foreach (var name in usernames)
        {
            batch+=($"INSERT INTO document_card_by_username" +
            "(username,document_id,owner,favourite,document_name,people)" +
            $" VALUES ('{name}',{uuid},false,false,'{documentName}',{list});\n");
        }

        batch += "INSERT INTO documents_by_id (id,document_name,people)" +
            $" VALUES ({uuid},'{documentName}',{list});";

        batch += "APPLY BATCH;";
        await CassandraDB.ExecuteAsync(new SimpleStatement(batch));


        return Ok();
    }

    [HttpGet("my-documents/{username}")]
    public async Task<IActionResult> getMyDocument([FromRoute] string username)
    {
        var simpleStatement = new SimpleStatement($"SELECT * FROM document_card_by_username WHERE username='{username}';");
        var rows = await CassandraDB.ExecuteAsync(simpleStatement);

        return Ok(rows.Select(r => new
        {
            DocumentId = r["document_id"],
            DocumentName = r["document_name"],
            Favourite = Boolean.Parse(r["favourite"].ToString()!),
            Owner = Boolean.Parse(r["owner"].ToString()!),
            People = ((string[])r["people"])[0].Split("'")
        }));
    }

    [HttpGet("documents/{id}")]
    public async Task<IActionResult> getDocument([FromRoute] string id)
    {
        var simpleStatement = new SimpleStatement($"SELECT * FROM documents_by_id WHERE id={id};");

        var rows = await CassandraDB.ExecuteAsync(simpleStatement);
        return Ok(rows.Select(r => new
        {
            Id = r["id"],
            Content = r["content"],
            DocumentName = r["document_name"],
            People = ((string[])r["people"])[0].Split("'")
        }));
    }

    [HttpPost("add-content/{id}")]
    public async Task<IActionResult> addContent([FromRoute]string id, [FromBody]JsonDocument content)
    {
        var str = content.RootElement.ToString();
        var simpleStatement = new SimpleStatement($"UPDATE documents_by_id\n\rSET content = '{str}'\n\rWHERE id = {id};");
        await CassandraDB.ExecuteAsync(simpleStatement);
        return Ok();
    }

    [HttpGet("get-content/{id}")]
    public async Task<IActionResult> getContent([FromRoute] string id)
    {
        var simpleStatement = new SimpleStatement($"SELECT content FROM documents_by_id WHERE id={id};");
        var content = (await CassandraDB.ExecuteAsync(simpleStatement)).FirstOrDefault()!["content"];

        return Ok(content);
    }

    [HttpDelete("remove-document/{id}")]
    public async Task<IActionResult> deleteDocument([FromRoute] string id)
    {
        var people = await CassandraDB.ExecuteAsync(new SimpleStatement($"SELECT people FROM documents_by_id WHERE id = {id}"));
        string[] peopleNames;
        peopleNames = ((string[])people.ElementAt(0)["people"])[0].Split("'");
        string batch = "BEGIN BATCH\n";
        batch += $"DELETE FROM documents_by_id WHERE id = {id}\n";
        foreach(var person in peopleNames)
        {
            batch += $"DELETE FROM document_card_by_username WHERE document_id = {id} AND username = '{person}'\n";
        }
        batch += "APPLY BATCH;";
        var simpleStatement = new SimpleStatement(batch);
        await CassandraDB.ExecuteAsync(simpleStatement);
        return Ok();
    }



}
