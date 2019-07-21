using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Cors.Internal;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Castle.Facilities.Logging;
using Swashbuckle.AspNetCore.Swagger;
using Abp.AspNetCore;
using Abp.AspNetCore.SignalR.Hubs;
using Abp.Castle.Logging.Log4Net;
using Abp.Extensions;
using ManufactureSys.Configuration;
using ManufactureSys.Controllers;
using ManufactureSys.Identity;
using Microsoft.AspNetCore.StaticFiles;

namespace ManufactureSys.Web.Host.Startup
{
    public class Startup
    {
        private const string _defaultCorsPolicyName = "localhost";

        private readonly IConfigurationRoot _appConfiguration;

        public Startup(IHostingEnvironment env)
        {
            _appConfiguration = env.GetAppConfiguration();
        }

        public IServiceProvider ConfigureServices(IServiceCollection services)
        {
            // MVC
            services.AddMvc(
                options => options.Filters.Add(new CorsAuthorizationFilterFactory(_defaultCorsPolicyName))
            );
            
            IdentityRegistrar.Register(services);
            AuthConfigurer.Configure(services, _appConfiguration);

            services.AddSignalR();

            // Configure CORS for angular2 UI
            services.AddCors(
                options => options.AddPolicy(
                    _defaultCorsPolicyName,
                    builder => builder
                        .WithOrigins(
                            // App:CorsOrigins in appsettings.json can contain more than one address separated by comma.
                            _appConfiguration["App:CorsOrigins"]
                                .Split(",", StringSplitOptions.RemoveEmptyEntries)
                                .Select(o => o.RemovePostFix("/"))
                                .ToArray()
                        )
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .AllowCredentials()
                )
            );

            // Swagger - Enable this line and the related lines in Configure method to enable swagger UI
            services.AddSwaggerGen(options =>
            {
                options.SwaggerDoc("v1", new Info {Title = "ManufactureSys API", Version = "v1"});
                options.DocInclusionPredicate((docName, description) => true);
                // Define the BearerAuth scheme thaContentTypet's in use
                options.AddSecurityDefinition("bearerAuth", new ApiKeyScheme()
                {
                    Description =
                        "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
                    Name = "Authorization",
                    In = "header",
                    Type = "apiKey"
                });
            });

            // Configure Abp and Dependency Injection
            return services.AddAbp<ManufactureSysWebHostModule>(
                // Configure Log4Net logging
                options => options.IocManager.IocContainer.AddFacility<LoggingFacility>(
                    f => f.UseAbpLog4Net().WithConfig("log4net.config")
                )
            );
        }
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            app.UseAbp(options => { options.UseAbpRequestLocalization = false; }); // Initializes ABP framework.

            app.UseCors(_defaultCorsPolicyName); // Enable CORS!
            //ASP.NET Core静态文件中间件能够支持超过400种已知文件内容类型。
            //如果用户请求一个未知的文件类型，静态文件中间件将返回HTTP404。
            //新增一些新的映射
            var provider = new FileExtensionContentTypeProvider();
            provider.Mappings[".docx"] = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
            provider.Mappings[".svf"] = "image/vnd";
            provider.Mappings[".pf"] = "image/vnd";
            provider.Mappings[".pack"] = "image/vnd";

            app.UseStaticFiles(new StaticFileOptions()
            {
                ContentTypeProvider = provider
            });

            app.UseAuthentication();

            app.UseAbpRequestLocalization();

            app.UseSignalR(routes => {
                routes.MapHub<AbpCommonHub>("/signalr");
                routes.MapHub<MessageHub>("/signalrMessage");
            });
//            app.Use(async (context, next) => {
//                context.Request.EnableRewind();
//                await next();
//            });

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "defaultWithArea",
                    template: "{area}/{controller=Home}/{action=Index}/{id?}");

                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");
            });

            // Enable middleware to serve generated Swagger as a JSON endpoint
            app.UseSwagger();
            // Enable middleware to serve swagger-ui assets (HTML, JS, CSS etc.)
            app.UseSwaggerUI(options =>
            {
                options.SwaggerEndpoint(
                    _appConfiguration["App:ServerRootAddress"].EnsureEndsWith('/') + "swagger/v1/swagger.json",
                    "ManufactureSys API V1");

                options.IndexStream = () => Assembly.GetExecutingAssembly()
                    .GetManifestResourceStream("ManufactureSys.Web.Host.wwwroot.swagger.ui.index.html");

                // 不展开swagger
                options.DocExpansion(DocExpansion.None);
            }); // URL: /swagger
        }
    }
}