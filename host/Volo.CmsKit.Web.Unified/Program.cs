﻿using System;
using System.IO;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Serilog;
using Serilog.Events;

namespace Volo.CmsKit;

public class Program
{
    public static int Main(string[] args)
    {
        Log.Logger = new LoggerConfiguration()
            .MinimumLevel.Debug()
            .MinimumLevel.Override("Microsoft", LogEventLevel.Information)
            .Enrich.FromLogContext()
            .WriteTo.Console()
            .WriteTo.File("Logs/logs.txt",rollingInterval:RollingInterval.Day,rollOnFileSizeLimit:true,fileSizeLimitBytes:100*1024*1024)
            .CreateLogger();

        try
        {
            Log.Information("Starting web host.");
            CreateHostBuilder(args).Build().Run();
            return 0;
        }
        catch (Exception ex)
        {
            Log.Fatal(ex, "Host terminated unexpectedly!");
            return 1;
        }
        finally
        {
            Log.CloseAndFlush();
        }
    }

    internal static IHostBuilder CreateHostBuilder(string[] args) =>
        Host.CreateDefaultBuilder(args)
        .AddAppSettingsSecretsJson()
#if MongoDB
            .ConfigureAppConfiguration(options =>
            {
              options.AddJsonFile("appsettings.MongoDB.json");
            })
#endif
            .ConfigureWebHostDefaults(webBuilder =>
            {
                webBuilder.UseStartup<Startup>();
            })
            .UseAutofac()
            .UseSerilog();
}
