using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using SignalR.Dtos;
using System.Collections.Concurrent;
using System.IdentityModel.Tokens.Jwt;

namespace SignalR.Hubs
{
    [Authorize]
    public class NotificationsHub : Hub
    {
        private static readonly ConcurrentQueue<MessageDto> _recentMessages = new();
        public override Task OnConnectedAsync()
        {
            //when someone enter send the last 10 seconds messages
            var last10Messages = _recentMessages
                .Where(m => m.CreatedAt.AddSeconds(10) > DateTimeOffset.UtcNow)
                .ToList();

            Clients.Caller.SendAsync("recentMessages", last10Messages);

            return base.OnConnectedAsync();
        }
        public async Task TriggerNotification(string message, string from)
        {
            var payload = new MessageDto()
            {
                Id = Guid.NewGuid().ToString(),
                Message = message,
                From = from,
                CreatedAt = DateTime.UtcNow,
            };

            _recentMessages.Enqueue(payload);

            //not performatic, just for demo purposes, should be in a redis, or something else
            while (_recentMessages.TryPeek(out var msg) && msg.CreatedAt.AddSeconds(10) < DateTimeOffset.UtcNow)
            {
                _recentMessages.TryDequeue(out _);
            }

            await Clients.All.SendAsync("notification", payload);
        }
    }
}
