
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using server.Repositories;
using server.Services;
using server.Services.Interfaces;

namespace server
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();


            var connection = String.Empty;
            if (builder.Environment.IsDevelopment())
            {
                //builder.Configuration.AddEnvironmentVariables().AddJsonFile("appsettings.Development.json");
                connection = builder.Configuration.GetConnectionString("LOCAL_SQL_CONNECTIONSTRING");
            }
            else
            {
                connection = builder.Configuration.GetConnectionString("AZURE_SQL_CONNECTIONSTRING");
            }

            builder.Services.AddDbContext<SpeedTyperDbContext>(options => options.UseSqlServer(connection));

            builder.Services.AddScoped<IUserRepository, UserRepository>();
            builder.Services.AddScoped<IScoreRepository, ScoreRepository>();
            builder.Services.AddScoped<IPasswordService, PasswordService>();


            builder.Services.AddCors(options =>
            {
                var allowedOrigins = builder.Configuration.GetSection("AllowedCorsOrigins").Get<string[]>();
                options.AddPolicy("AllowCors",
                    builder =>
                    {
                        builder.WithOrigins(allowedOrigins ?? [])
                            .AllowAnyHeader()
                            .AllowAnyMethod();
                    });
            });

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseAuthorization();


            app.MapControllers();

            app.UseCors("AllowCors");

            app.Run();
        }
    }
}