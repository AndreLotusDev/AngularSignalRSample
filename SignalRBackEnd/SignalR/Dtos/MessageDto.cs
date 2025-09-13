namespace SignalR.Dtos
{
    public class MessageDto
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string Message { get; set; }
        public string From { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
