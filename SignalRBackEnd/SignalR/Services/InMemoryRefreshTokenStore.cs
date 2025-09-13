namespace SignalR.Services
{
    public class InMemoryRefreshTokenStore : IRefreshTokenStore
    {
        //just for demo, please do not use this in production

        private readonly Dictionary<string, string> _store = new();
        public void Save(string refreshToken, string username) => _store[refreshToken] = username;
        public bool TryGetUser(string refreshToken, out string username) => _store.TryGetValue(refreshToken, out username!);
        public void Rotate(string oldRefreshToken, string newRefreshToken, string username)
        {
            _store.Remove(oldRefreshToken);
            _store[newRefreshToken] = username;
        }

    }
}
