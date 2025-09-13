using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.IdentityModel.Tokens.Jwt;

namespace SignalR.Hubs
{
    [Authorize]
    public class NotificationsHub : Hub
    {
        public override async Task OnConnectedAsync()
        {
            await base.OnConnectedAsync();
        }
        public async Task TriggerNotification(string message, string from)
        {
            var payload = new { message, ts = DateTimeOffset.UtcNow, from };
            await Clients.All.SendAsync("notification", payload);
        }
    }
}
