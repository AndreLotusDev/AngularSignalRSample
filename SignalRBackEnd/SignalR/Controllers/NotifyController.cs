using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using SignalR.Dtos;
using SignalR.Hubs;

namespace SignalR.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class NotifyController : ControllerBase
    {
        private readonly IHubContext<NotificationsHub> _hub;
        private static readonly System.Collections.Concurrent.ConcurrentQueue<MessageDto> _recentMessages = NotificationsHub.GetRecentMessages;

        public NotifyController(IHubContext<NotificationsHub> hub) => _hub = hub;

        [HttpPost]
        public async Task<IActionResult> Post([FromQuery] string message)
        {
            var payload = new MessageDto()
            {
                Id = Guid.NewGuid().ToString(),
                Message = message,
                From = User.Identity?.Name ?? "Unknown",
                CreatedAt = DateTime.UtcNow,
            };

            _recentMessages.Enqueue(payload);
            // Remove old messages (older than 10 seconds)
            while (_recentMessages.TryPeek(out var msg) && msg.CreatedAt.AddSeconds(10) < DateTimeOffset.UtcNow)
            {
                _recentMessages.TryDequeue(out _);
            }

            await _hub.Clients.All.SendAsync("notification", payload);
            return Ok(payload);
        }

        [HttpGet("recent")]
        public IActionResult GetRecentMessages()
        {
            var last10Messages = _recentMessages
                .Where(m => m.CreatedAt.AddSeconds(10) > DateTimeOffset.UtcNow)
                .ToList();
            return Ok(last10Messages);
        }
    }
}
