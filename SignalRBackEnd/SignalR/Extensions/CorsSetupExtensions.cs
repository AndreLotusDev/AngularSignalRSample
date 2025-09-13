namespace SignalR.Extensions
{
    public static class CorsSetupExtensions
    {
        public static IServiceCollection AddCorsPolicy(this IServiceCollection services, IConfiguration config)
        {
            var origins = config.GetSection("Cors:Origins").Get<string[]>() ?? new[] { "http://localhost:4200" };
            services.AddCors(o => o.AddDefaultPolicy(p =>
                p.WithOrigins(origins).AllowAnyHeader().AllowAnyMethod().AllowCredentials()));
            return services;
        }
    }
}
