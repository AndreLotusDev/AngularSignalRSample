using Microsoft.IdentityModel.Tokens;
using SignalR.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace SignalR.Services
{
    public class TokenService : ITokenService
    {
        private readonly string _issuer;
        private readonly string _audience;
        private readonly SymmetricSecurityKey _signingKey;
        private readonly IRefreshTokenStore _refreshTokens;

        public TokenService(IConfiguration config, IRefreshTokenStore refreshTokens)
        {
            var key = config["Jwt:Key"] ?? "dev-super-secret-key-change-32chars";
            _issuer = config["Jwt:Issuer"] ?? "demo.api";
            _audience = config["Jwt:Audience"] ?? "demo.front";
            _signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
            _refreshTokens = refreshTokens;
        }

        public TokenResponse GenerateForUser(string username)
        {
            var expires = DateTime.UtcNow.AddMinutes(15);

            if(username == "admin") expires = DateTime.UtcNow.AddSeconds(10);
            var handler = new JwtSecurityTokenHandler();
            var descriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, username),
                    new Claim(ClaimTypes.Name, username),
                    new Claim(ClaimTypes.Role, "Admin")
                }),
                Expires = expires,
                Issuer = _issuer,
                Audience = _audience,
                SigningCredentials = new SigningCredentials(_signingKey, SecurityAlgorithms.HmacSha256)
            };
            var token = handler.CreateToken(descriptor);
            var accessToken = handler.WriteToken(token);

            var refreshToken = Guid.NewGuid().ToString("N");
            _refreshTokens.Save(refreshToken, username);

            return new TokenResponse(accessToken, refreshToken, expires);
        }
    }
}
