using Microsoft.AspNetCore.Mvc;
using SignalR.Models;
using SignalR.Services;

namespace SignalR.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ITokenService _tokens;
        private readonly IRefreshTokenStore _refresh;
        public AuthController(ITokenService tokens, IRefreshTokenStore refresh)
        {
            _tokens = tokens; _refresh = refresh;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest req)
        {
            var result = _tokens.GenerateForUser(req.Username);
            return Ok(result);
        }

        //[HttpPost("refresh")]
        //public IActionResult Refresh([FromBody] RefreshRequest req)
        //{
        //    if (string.IsNullOrWhiteSpace(req.RefreshToken) || !_refresh.TryGetUser(req.RefreshToken, out var username))
        //        return Unauthorized();

        //    var newTokens = _tokens.GenerateForUser(username);
        //    _refresh.Rotate(req.RefreshToken, newTokens.RefreshToken, username);
        //    return Ok(newTokens);
        //}
    }
}
