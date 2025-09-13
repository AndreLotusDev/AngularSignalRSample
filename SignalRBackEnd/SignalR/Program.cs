using SignalR.Extensions;
using SignalR.Hubs;
using SignalR.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCorsPolicy(builder.Configuration);
builder.Services.AddJwtAuth(builder.Configuration);

builder.Services.AddSignalR(options =>
{
    options.MaximumReceiveMessageSize = 1024 * 1024; 
    options.StreamBufferCapacity = 10; 
});
builder.Services.AddControllers();

// Serviços de domínio/autenticação
builder.Services.AddSingleton<IRefreshTokenStore, InMemoryRefreshTokenStore>();
builder.Services.AddSingleton<ITokenService, TokenService>();

var app = builder.Build();

app.UseCors();
app.UseAuthentication();
app.UseAuthorization();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.MapControllers();
app.MapHub<NotificationsHub>("/hubs/notifications");

app.Run();
