namespace SignalR.Services
{
    public interface IRefreshTokenStore
    {
        void Save(string refreshToken, string username);
        bool TryGetUser(string refreshToken, out string username);
        void Rotate(string oldRefreshToken, string newRefreshToken, string username);
    }
}
