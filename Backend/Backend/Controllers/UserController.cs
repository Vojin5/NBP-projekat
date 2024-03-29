﻿using Backend.Models;
using Cassandra;
using Microsoft.AspNetCore.Mvc;
using StackExchange.Redis;

namespace Backend.Controllers;
[ApiController]
[Route("[controller]")]
public class UserController : ControllerBase
{
    public Cassandra.ISession CassandraDB { get; set; } = Cluster.Builder().AddContactPoint("127.0.0.1").WithPort(9042).Build().Connect("nbp");

    [HttpPost("register")]
    public async Task<IActionResult> registerUser([FromBody] UserRegister user)
    {
        var simpleStatement = new SimpleStatement($"SELECT * FROM users_by_username WHERE username='{user.Username}';");
        RowSet rows = await CassandraDB.ExecuteAsync(simpleStatement);

        if(rows.Count() != 0)
        {
            return BadRequest();
        }

        simpleStatement = new SimpleStatement("INSERT INTO users_by_username (username,avatar,email,password) " +
            $" VALUES ('{user.Username}','{user.Avatar}','{user.Email}','{user.Password}');");

        await CassandraDB.ExecuteAsync(simpleStatement);
        return Ok();
    }

    [HttpPost("login")]
    public async Task<IActionResult> loginUser([FromBody] UserLogin user)
    {
        var RedisConnection = ConnectionMultiplexer.Connect("localhost").GetDatabase();
        var redisUsername = (await RedisConnection.StringGetAsync(user.Username));
        if(redisUsername.HasValue)
        {
            if(redisUsername.ToString() == user.Password)
            {
                Console.WriteLine("Redis cached");
                return Ok();
            }
        }
        var simpleStatement = new SimpleStatement($"SELECT * FROM users_by_username WHERE username='{user.Username}';");
        RowSet rows = await CassandraDB.ExecuteAsync(simpleStatement);
        var row = rows.FirstOrDefault();
        if(row==null || !(row["password"].ToString().Equals(user.Password)))
        {
            return BadRequest();
        }
        else
        {
            await RedisConnection.StringSetAsync(user.Username, user.Password, TimeSpan.FromMinutes(10));
            return Ok();
        }
    }
}
