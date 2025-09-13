using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using SignalR.Hubs;

namespace SignalR.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class NotifyController : ControllerBase
    {
        private readonly IHubContext<NotificationsHub> _hub;
        public NotifyController(IHubContext<NotificationsHub> hub) => _hub = hub;

        [HttpPost]
        public async Task<IActionResult> Post([FromQuery] string message)
        {
            var payload = new { message, ts = DateTimeOffset.UtcNow, by = User.Identity?.Name };
            await _hub.Clients.All.SendAsync("notification", payload);
            return Ok(payload);
        }
    }
}
