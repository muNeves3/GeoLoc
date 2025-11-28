using DotNetEnv;
using GeoLoc.src.app.repositories;
using GeoLoc.src.app.use_cases;
using GeoLoc.src.app.use_cases.centros;
using GeoLoc.src.infra.database.supabase;
using GeoLoc.src.infra.services;
using Microsoft.AspNetCore.Builder; // Certifique-se de que esta using est� presente
using Microsoft.AspNetCore.Hosting; // Certifique-se de que esta using est� presente
using Microsoft.Extensions.DependencyInjection; // Certifique-se de que esta using est� presente
using Microsoft.Extensions.Hosting; // Certifique-se de que esta using est� presente
using Swashbuckle.AspNetCore.Swagger;
using Swashbuckle.AspNetCore.SwaggerGen;
using Swashbuckle.AspNetCore.SwaggerUI;
using System; // Para InvalidOperationException
using System.IO; // Para Path.Combine, se necess�rio

public class Program
{
    public static void Main(string[] args)
    {
        Console.WriteLine("--- VERS�O 2.0 - TESTE DE DEPLOY ---");
        Env.Load();
        Console.WriteLine("DotNetEnv.Env.Load() chamado.");

        var builder = WebApplication.CreateBuilder(args);

        builder.WebHost.UseUrls("http://localhost:5000");

        builder.Services.AddControllers();


        builder.Services.AddOpenApi();
        builder.Services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
            {
                Title = "GeoLoc API UEL",
                Version = "v1",
                Description = "API para mapeamento e localiza��o no campus da UEL.",
                Contact = new Microsoft.OpenApi.Models.OpenApiContact
                {
                    Name = "Murilo de Souza Neves",
                    Email = "murilodesouzaneves@gmail.com"
                },
            });
        });

        string? supabaseUrl = builder.Configuration["NEXT_PUBLIC_SUPABASE_URL"];
        string? supabaseAnonKey = builder.Configuration["NEXT_PUBLIC_SUPABASE_ANON_KEY"];

        Console.WriteLine($"Valor lido para NEXT_PUBLIC_SUPABASE_URL: '{supabaseUrl}'");
        Console.WriteLine($"Valor lido para NEXT_PUBLIC_SUPABASE_ANON_KEY: '{supabaseAnonKey}'");

        if (string.IsNullOrEmpty(supabaseUrl) || string.IsNullOrEmpty(supabaseAnonKey))
        {
            Console.WriteLine("ERRO CR�TICO: Supabase URL ou Anon Key s�o nulos ou vazios.");

            throw new InvalidOperationException("Supabase URL ou Anon Key n�o configurados.");
        }

        var options = new Supabase.SupabaseOptions
        {
            AutoConnectRealtime = true,
            AutoRefreshToken = true
        };

        builder.Services.AddScoped<Supabase.Client>(provider =>
        {
            var client = new Supabase.Client(supabaseUrl, supabaseAnonKey, options);
            return client;
        });

        builder.Services.AddHttpClient();
        builder.Services.AddScoped<INavegacaoService, navegacao_service>();


        builder.Services.Scan(scan => scan
            .FromAssemblyOf<Program>()

            .AddClasses(classes => classes.InNamespaces("GeoLoc.src.infra.database.supabase"))
                .AsImplementedInterfaces()
                .WithScopedLifetime()
            .AddClasses(classes => classes.InNamespaces("GeoLoc.src.app.use_cases"))
                .AsSelf()
                .WithScopedLifetime()
        );

        var myAllowSpecificOrigins = "_myAllowSpecificOrigins";

        builder.Services.AddCors(options =>
        {
            options.AddPolicy(name: myAllowSpecificOrigins,
                              policy =>
                              {
                                  policy.WithOrigins("http://localhost:5173")
                                        .AllowAnyHeader()
                                        .AllowAnyMethod();

                                  policy.WithOrigins("http://127.0.0.1:5173")
                                        .AllowAnyHeader()
                                        .AllowAnyMethod();

                                  policy.AllowAnyOrigin()
                                        .AllowAnyMethod()
                                        .AllowAnyHeader();
                              });
        });


        var app = builder.Build();

        if (app.Environment.IsDevelopment())
        {
            app.MapOpenApi();

            app.UseSwagger();
            app.UseRouting();

            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "GeoLoc API V1");
                c.RoutePrefix = "swagger";
                c.DocumentTitle = "GeoLoc API UEL Documentation";
            });

            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "GeoLoc API V1");
                c.RoutePrefix = "swagger";
                c.DocumentTitle = "GeoLoc API UEL Documentation";
            });
        }

        // app.UseHttpsRedirection();
        app.UseCors(x => x
            .AllowAnyMethod()
            .AllowAnyHeader()
            .SetIsOriginAllowed(origin => true) // allow any origin
            .AllowCredentials());
        app.UseAuthorization();
        app.UseRouting();
        app.MapControllers();

        app.Run();
    }
}