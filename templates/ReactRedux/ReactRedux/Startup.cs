using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using ReactRedux.Options;

namespace ReactRedux
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            var spaOptionsSection = Configuration.GetSection(nameof(SpaOptions));
            var spaOptions = spaOptionsSection.Get<SpaOptions>();
            services.Configure<SpaOptions>(spaOptionsSection);

            services.AddSpaStaticFiles(configuration => { configuration.RootPath = $"{spaOptions.SourcePath}/build"; });
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, IOptionsMonitor<SpaOptions> spaOptions)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();

            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = spaOptions.CurrentValue.SourcePath;

                if (env.IsDevelopment() && spaOptions.CurrentValue.UseReactDevelopmentServer)
                {
                    spa.UseReactDevelopmentServer(npmScript: "start");
                }
            });
        }
    }
}