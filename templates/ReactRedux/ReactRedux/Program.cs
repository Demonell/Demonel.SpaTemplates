using System;
using System.IO;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using ReactRedux.Options;

namespace ReactRedux
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var host = CreateHostBuilder(args).Build();

            using (var scope = host.Services.CreateScope())
            {
                var services = scope.ServiceProvider;

                Console.Title = services.GetService<IOptions<SpaOptions>>().Value.ApplicationName;
            }

            host.Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args)
        {
            var config = BuildConfiguration(args);
            SetupSpaRuntimeConfig(config);

            return
                Host.CreateDefaultBuilder(args)
                    .ConfigureWebHostDefaults(webBuilder =>
                    {
                        webBuilder
                            .UseConfiguration(config)
                            .UseStartup<Startup>();
                    });
        }

        private static IConfiguration BuildConfiguration(string[] args)
        {
            var environmentName = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
            Console.WriteLine($"ENVIRONMENT: {environmentName}");

            return new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .AddJsonFile($"appsettings.{environmentName}.json", optional: true, reloadOnChange: true)
                .AddEnvironmentVariables()
                .AddCommandLine(args)
                .Build();
        }

        private static void SetupSpaRuntimeConfig(IConfiguration configuration)
        {
            var spaOptions = configuration.GetSection(nameof(SpaOptions)).Get<SpaOptions>();
            var runtimeConfig = new SpaRuntimeConfig(spaOptions);

            TryOverrideRuntimeConfig(runtimeConfig, $@"{spaOptions.SourcePath}/public/index.html");
            TryOverrideRuntimeConfig(runtimeConfig, $@"{spaOptions.SourcePath}/build/index.html");
        }

        private static void TryOverrideRuntimeConfig(SpaRuntimeConfig runtimeConfig, string path)
        {
            if (File.Exists(path))
            {
                var configContent = "";
                foreach (var propertyInfo in runtimeConfig.GetType().GetProperties())
                    configContent += $"{propertyInfo.Name}:\'{propertyInfo.GetValue(runtimeConfig)}\',";

                var indexHtml = File.ReadAllText(path);
                indexHtml = Regex.Replace(indexHtml,
                    @"window\.runConfig\s?=\s?{(.|\n)*?}",
                    $"window.runConfig={{{configContent}}}");

                File.WriteAllText(path, indexHtml);
            }
        }
    }
}