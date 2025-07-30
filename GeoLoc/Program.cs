using DotNetEnv;
using Microsoft.AspNetCore.Builder; // Certifique-se de que esta using está presente
using Microsoft.AspNetCore.Hosting; // Certifique-se de que esta using está presente
using Microsoft.Extensions.DependencyInjection; // Certifique-se de que esta using está presente
using Microsoft.Extensions.Hosting; // Certifique-se de que esta using está presente
using System.IO; // Para Path.Combine, se necessário
using System; // Para InvalidOperationException
using Swashbuckle.AspNetCore.SwaggerGen;
using Swashbuckle.AspNetCore.SwaggerUI;
using Swashbuckle.AspNetCore.Swagger;
using GeoLoc.src.app.use_cases;
using GeoLoc.src.infra.database.supabase;
using GeoLoc.src.app.repositories;

public class Program
{
    public static void Main(string[] args)
    {
        Env.Load();
        Console.WriteLine("DotNetEnv.Env.Load() chamado.");

        var builder = WebApplication.CreateBuilder(args);

        builder.Services.AddControllers();


        builder.Services.AddOpenApi();
        builder.Services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
            {
                Title = "GeoLoc API UEL",
                Version = "v1",
                Description = "API para mapeamento e localização no campus da UEL.",
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
            Console.WriteLine("ERRO CRÍTICO: Supabase URL ou Anon Key são nulos ou vazios.");

            throw new InvalidOperationException("Supabase URL ou Anon Key não configurados.");
        }

        var options = new Supabase.SupabaseOptions
        {
            AutoConnectRealtime = true,
            AutoRefreshToken = true
        };

        //builder.Services.AddSingleton(new Supabase.Client(supabaseUrl, supabaseAnonKey, options));
        builder.Services.AddScoped<Supabase.Client>(provider =>
        {
            var client = new Supabase.Client(supabaseUrl, supabaseAnonKey, options);
            return client;
        });
        builder.Services.AddScoped<IPerfilUsuarioRepository, perfil_usuario_repository>();
        builder.Services.AddScoped<create_perfil_usuario>();

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

        app.UseHttpsRedirection();
        app.UseAuthorization();
        app.UseRouting(); 
        app.MapControllers(); 

        app.Run();
    }
}