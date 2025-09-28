using System.Collections.Concurrent;
using System.Data.SqlTypes;
using System.Net.WebSockets;
using System.Text;
using System.Text.Unicode;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseWebSockets();

app.UseHttpsRedirection();

ConcurrentBag<WebSocket> sockets = new();
async Task star(WebSocket sock) {
    while (true)
    {
        Console.WriteLine("Listening...");
        ArraySegment<byte> buffer = new(new byte[500]);
        await sock.ReceiveAsync(buffer, CancellationToken.None);
        Console.WriteLine("sock");
        Console.WriteLine(Encoding.UTF8.GetString(buffer.ToArray()));
    }
}

app.MapGet("/", async (HttpContext context) =>
{
    if (context.WebSockets.IsWebSocketRequest)
    {
        using var webSocket = await context.WebSockets.AcceptWebSocketAsync();
        star(webSocket);
        sockets.Add(webSocket);
    }
});

app.Run();
