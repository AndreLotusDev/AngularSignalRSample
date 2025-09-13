namespace SignalR.Models
{
    public record LoginRequest(string Username, string Password);
    public record TokenResponse(string AccessToken, string RefreshToken, DateTime ExpiresAtUtc);
    public record RefreshRequest(string RefreshToken);
}
