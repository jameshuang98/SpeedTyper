
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using server.Repositories;
using server.Services;
using server.Services.Interfaces;
using Swashbuckle.AspNetCore.Filters;
using System.Text;

namespace server
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddControllers().AddNewtonsoftJson();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen(options =>
            {
                options.AddSecurityDefinition("oauth2", new OpenApiSecurityScheme
                {
                    In = ParameterLocation.Header,
                    Name = "Authorization",
                    Type = SecuritySchemeType.ApiKey
                });

                options.OperationFilter<SecurityRequirementsOperationFilter>();
            });

            // Load configuration from environment variables
            builder.Configuration.AddEnvironmentVariables();

            var connection = String.Empty;
            if (builder.Environment.IsDevelopment())
            {
                builder.Configuration.AddEnvironmentVariables().AddJsonFile("appsettings.Development.json");
                connection = builder.Configuration.GetConnectionString("LOCAL_SQL_CONNECTIONSTRING");
            }
            else
            {
                builder.Configuration.AddJsonFile("appsettings.json", optional: true, reloadOnChange: true);
                connection = builder.Configuration.GetConnectionString("AZURE_SQL_CONNECTIONSTRING");
            }

            builder.Services.AddDbContext<SpeedTyperDbContext>(options => options.UseSqlServer(connection));

            var jwtKey = builder.Configuration.GetValue<string>("JWT_KEY")!;
            builder.Services.AddAuthentication().AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ValidateLifetime = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
                };
            });

            //builder.Services.AddAuthorization(options =>
            //{
            //    options.FallbackPolicy = new AuthorizationPolicyBuilder()
            //        .RequireAuthenticatedUser()
            //        .Build();
            //});


            builder.Services.AddScoped<IUserRepository, UserRepository>();
            builder.Services.AddScoped<IScoreRepository, ScoreRepository>();
            builder.Services.AddScoped<IAuthService, AuthService>();
            builder.Services.AddScoped<IUserService, UserService>();
            builder.Services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

            builder.Services.AddCors(options =>
            {
                string allowedCorsOrigins = builder.Configuration.GetValue<string>("AllowedCorsOrigins") ?? "";
                string[] corsOrigins = allowedCorsOrigins.Split(',');

                options.AddPolicy("AllowCors",
                    builder =>
                    {
                        builder.WithOrigins(corsOrigins ?? [])
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