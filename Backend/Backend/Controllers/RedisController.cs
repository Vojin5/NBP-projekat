using Microsoft.AspNetCore.Mvc;
using StackExchange.Redis;

namespace Backend.Controllers;
[ApiController]
[Route("[controller]")]
public class RedisController : ControllerBase
{
    public IDatabase Database { get; set; } = ConnectionMultiplexer.Connect("localhost").GetDatabase();


    [HttpPost("addDelta/{DocID}")]
    public async Task<IActionResult> addDelta([FromBody] string delta, [FromRoute] int DocID)
    {
        await Database.ListRightPushAsync(DocID.ToString(),delta);
        return Ok();
    }


}
