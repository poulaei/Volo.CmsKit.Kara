using System.Collections.Generic;
using System.IO;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using Volo.Abp;
using Volo.Abp.Account;
using Volo.Abp.Account.Web;

using Volo.Abp.AspNetCore.Serilog;
using Volo.Abp.Autofac;
using Volo.Abp.Data;
using Volo.Abp.FeatureManagement;
using Volo.Abp.Identity;
using Volo.Abp.Identity.Web;
using Volo.Abp.Localization;
using Volo.Abp.Modularity;
using Volo.Abp.MultiTenancy;
using Volo.Abp.PermissionManagement;
using Volo.Abp.PermissionManagement.HttpApi;
using Volo.Abp.PermissionManagement.Identity;
using Volo.Abp.Swashbuckle;
using Volo.Abp.TenantManagement;
using Volo.Abp.TenantManagement.Web;
using Volo.Abp.Threading;
using Volo.Abp.VirtualFileSystem;
using Volo.CmsKit.Admin.Web;
using Volo.CmsKit.Comments;
using Volo.CmsKit.MediaDescriptors;
using Volo.CmsKit.MultiTenancy;
using Volo.CmsKit.Public.Web;
using Volo.CmsKit.Ratings;
using Volo.CmsKit.Reactions;
using Volo.CmsKit.Tags;
using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.Mvc.Routing;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Volo.Abp.DependencyInjection;
using Volo.CmsKit.Public.Pages;

using Autofac.Core;
using Volo.Abp.AspNetCore.Mvc;
using Volo.CmsKit.Public;
using Volo.CmsKit.Admin;
using Microsoft.AspNetCore.Localization;
using System.Globalization;
using Volo.CmsKit.Bundling.Kendo;
using Volo.Abp.Ui.LayoutHooks;

using Volo.CmsKit.Components.Kendo;
using Newtonsoft.Json.Serialization;
using Swashbuckle.AspNetCore.SwaggerGen;
using Volo.CmsKit.Web;
using Volo.CmsKit.Web.Contents;
using Microsoft.Extensions.FileProviders;
using System;
using Volo.Abp.AspNetCore.Mvc.AntiForgery;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.Identity.Client;
using Microsoft.AspNetCore.Authentication.Cookies;
using Polly;
using System.Linq;
using Microsoft.AspNetCore.Cors;
using Volo.Abp.AspNetCore.ExceptionHandling;

using Volo.Abp.AspNetCore.Mvc.UI.Theme.Shared;
using Volo.Abp.AspNetCore.Mvc.UI.Bundling;
using Volo.Abp.AspNetCore.Mvc.UI.Theme.Basic;
using Volo.Abp.AspNetCore.Mvc.UI.Theme.Basic.Bundling;
using Volo.Abp.AspNetCore.Mvc.UI.Theme.LeptonXLite;
using Volo.Abp.AspNetCore.Mvc.UI.Theme.LeptonXLite.Bundling;
using Volo.Abp.AspNetCore.Mvc.UI.Theme.Kara;
using Volo.Abp.AspNetCore.Mvc.UI.Theme.Kara.Bundling;
using Volo.Abp.AspNetCore.Mvc.UI.Theming;
using static Kendo.Mvc.UI.UIPrimitives;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp.FeatureManagement.Pages.FeatureManagement.Components.FeatureSettingGroup;
using Volo.Abp.SettingManagement;
using Volo.Abp.SettingManagement.Web.Pages.SettingManagement.Components.EmailSettingGroup;
using Volo.Abp.SettingManagement.Web.Pages.SettingManagement.Components.TimeZoneSettingGroup;












#if EntityFrameworkCore
using Volo.Abp.SettingManagement.EntityFrameworkCore;
using Volo.Abp.TenantManagement.EntityFrameworkCore;
using Volo.Abp.Identity.EntityFrameworkCore;
using Volo.Abp.PermissionManagement.EntityFrameworkCore;
using Volo.Abp.FeatureManagement.EntityFrameworkCore;
using Volo.Abp.EntityFrameworkCore;
using Volo.Abp.EntityFrameworkCore.SqlServer;
using Volo.Abp.BlobStoring.Database.EntityFrameworkCore;
using Volo.CmsKit.EntityFrameworkCore;
using Volo.Abp.AuditLogging.EntityFrameworkCore;
#elif MongoDB
using Volo.Abp.SettingManagement.MongoDB;
using Volo.Abp.TenantManagement.MongoDB;
using Volo.Abp.Identity.MongoDB;
using Volo.Abp.PermissionManagement.MongoDB;
using Volo.Abp.FeatureManagement.MongoDB;
using Volo.Abp.BlobStoring.Database.MongoDB;
using Volo.Abp.AuditLogging.MongoDB;
using Volo.CmsKit.MongoDB;
#endif

namespace Volo.CmsKit;

[DependsOn(
    typeof(CmsKitWebModule),
    typeof(CmsKitApplicationModule),
    typeof(CmsKitHttpApiModule),
#if EntityFrameworkCore
    typeof(CmsKitEntityFrameworkCoreModule),
    typeof(AbpAuditLoggingEntityFrameworkCoreModule),
    typeof(AbpEntityFrameworkCoreSqlServerModule),
    typeof(AbpSettingManagementEntityFrameworkCoreModule),
    typeof(AbpPermissionManagementEntityFrameworkCoreModule),
    typeof(AbpIdentityEntityFrameworkCoreModule),
    typeof(AbpFeatureManagementEntityFrameworkCoreModule),
    typeof(AbpTenantManagementEntityFrameworkCoreModule),
    typeof(BlobStoringDatabaseEntityFrameworkCoreModule),
#elif MongoDB
    typeof(CmsKitMongoDbModule),
    typeof(AbpAuditLoggingMongoDbModule),
    typeof(AbpSettingManagementMongoDbModule),
    typeof(AbpPermissionManagementMongoDbModule),
    typeof(AbpIdentityMongoDbModule),
    typeof(AbpFeatureManagementMongoDbModule),
    typeof(AbpTenantManagementMongoDbModule),
    typeof(BlobStoringDatabaseMongoDbModule),
#endif
    typeof(AbpAutofacModule),
    typeof(AbpAccountWebModule),
    typeof(AbpAccountApplicationModule),
    typeof(AbpAccountHttpApiModule),
    typeof(AbpPermissionManagementApplicationModule),
    typeof(AbpPermissionManagementHttpApiModule),
    typeof(AbpIdentityWebModule),
    typeof(AbpIdentityApplicationModule),
    typeof(AbpIdentityHttpApiModule),
    typeof(AbpPermissionManagementDomainIdentityModule),
    typeof(AbpFeatureManagementApplicationModule),
    typeof(AbpFeatureManagementHttpApiModule),
    typeof(AbpFeatureManagementWebModule),
    typeof(AbpTenantManagementWebModule),
    typeof(AbpTenantManagementApplicationModule),
    typeof(AbpTenantManagementHttpApiModule),
    //typeof(AbpAspNetCoreMvcUiLeptonXLiteThemeModule), 
    //typeof(AbpAspNetCoreMvcUiBasicThemeModule),
    typeof(AbpAspNetCoreMvcUiKaraThemeModule),
    typeof(AbpAspNetCoreSerilogModule),
    typeof(AbpSwashbuckleModule)
)]

public class CmsKitWebUnifiedModule : AbpModule
{
    private const string DefaultCorsPolicyName = "Default";
    public override void PreConfigureServices(ServiceConfigurationContext context)
    {
        FeatureConfigurer.Configure();
    }

    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        var hostingEnvironment = context.Services.GetHostingEnvironment();
        ConfigureBundles();
        ConfigureCmsKit();
        ConfigureKendo(context.Services);
        ConfigureAntiForgeryToken(context.Services);
        ConfigureCorsPloicy(context.Services);

        //context.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)

        //    .AddCookie(options =>
        //    {
        //        //options.Cookie.Name = "AvreenCMSAppCookie";
        //        //options.Cookie.Domain = ".avreenco.com";
        //        options.LoginPath = "/Account/Login";  // مسیر ورود کاربر
        //        options.SlidingExpiration = true;  // فعال‌سازی انقضای شناسه کوکی
        //    });


        context.Services.ConfigureApplicationCookie(options =>
        {
           // options.Cookie.Domain = ".avreenco.com";
            //options.Cookie.HttpOnly = true;
            //options.Cookie.Path = "/";
            //options.Cookie.SameSite = SameSiteMode.None;
        });
        context.Services.Configure<CookiePolicyOptions>(options =>
        {
            options.Secure = CookieSecurePolicy.Always;
            options.HttpOnly = Microsoft.AspNetCore.CookiePolicy.HttpOnlyPolicy.Always;
            options.MinimumSameSitePolicy = SameSiteMode.None;

            //options.OnAppendCookie = cookiecontext =>
            //{
            //    cookiecontext.CookieOptions.Path = "/";
            //    cookiecontext.CookieOptions.Domain = ".avreenco.com";
            //    cookiecontext.CookieOptions.HttpOnly = true;
            //    cookiecontext.CookieOptions.SameSite = SameSiteMode.None;

            //};
        });
#if EntityFrameworkCore
        context.Services.AddDbContext<UnifiedDbContext>();
        Configure<AbpDbContextOptions>(options =>
        {
            options.UseSqlServer();
        });
#endif

        if (hostingEnvironment.IsDevelopment())
        {
            Configure<AbpVirtualFileSystemOptions>(options =>
            {
                //options.FileSets.ReplaceEmbeddedByPhysical<AbpAspNetCoreMvcUiThemeSharedModule>(Path.Combine(hostingEnvironment.ContentRootPath, string.Format("..{0}..{0}..{0}/apb-dev/framework/src{0}Volo.Abp.AspNetCore.Mvc.UI.Theme.Shared", Path.DirectorySeparatorChar)));
                options.FileSets.ReplaceEmbeddedByPhysical<AbpAspNetCoreMvcUiKaraThemeModule>(Path.Combine(hostingEnvironment.ContentRootPath, string.Format("..{0}..{0}src{0}Volo.Abp.AspNetCore.Mvc.UI.Theme.Kara", Path.DirectorySeparatorChar)));

                options.FileSets.ReplaceEmbeddedByPhysical<CmsKitDomainSharedModule>(Path.Combine(hostingEnvironment.ContentRootPath, string.Format("..{0}..{0}src{0}Volo.CmsKit.Domain.Shared", Path.DirectorySeparatorChar)));
                options.FileSets.ReplaceEmbeddedByPhysical<CmsKitDomainModule>(Path.Combine(hostingEnvironment.ContentRootPath, string.Format("..{0}..{0}src{0}Volo.CmsKit.Domain", Path.DirectorySeparatorChar)));

                options.FileSets.ReplaceEmbeddedByPhysical<CmsKitCommonWebModule>(Path.Combine(hostingEnvironment.ContentRootPath, string.Format("..{0}..{0}src{0}Volo.CmsKit.Common.Web", Path.DirectorySeparatorChar)));

                options.FileSets.ReplaceEmbeddedByPhysical<CmsKitAdminWebModule>(Path.Combine(hostingEnvironment.ContentRootPath, string.Format("..{0}..{0}src{0}Volo.CmsKit.Admin.Web", Path.DirectorySeparatorChar)));
                options.FileSets.ReplaceEmbeddedByPhysical<CmsKitPublicWebModule>(Path.Combine(hostingEnvironment.ContentRootPath, string.Format("..{0}..{0}src{0}Volo.CmsKit.Public.Web", Path.DirectorySeparatorChar)));

                options.FileSets.ReplaceEmbeddedByPhysical<CmsKitApplicationContractsModule>(Path.Combine(hostingEnvironment.ContentRootPath, string.Format("..{0}..{0}src{0}Volo.CmsKit.Application.Contracts", Path.DirectorySeparatorChar)));
                options.FileSets.ReplaceEmbeddedByPhysical<CmsKitApplicationModule>(Path.Combine(hostingEnvironment.ContentRootPath, string.Format("..{0}..{0}src{0}Volo.CmsKit.Application", Path.DirectorySeparatorChar)));
                options.FileSets.ReplaceEmbeddedByPhysical<CmsKitWebModule>(Path.Combine(hostingEnvironment.ContentRootPath, string.Format("..{0}..{0}src{0}Volo.CmsKit.Web", Path.DirectorySeparatorChar)));
            });
        }

        context.Services.AddSwaggerGen(
            options =>
            {
                options.SwaggerDoc("v1", new OpenApiInfo { Title = "CmsKit API", Version = "v1" });
                options.DocInclusionPredicate((docName, description) => true);
                options.CustomSchemaIds(type => type.FullName);
            });
        //context.Services.AddKendo();



        Configure<AbpLocalizationOptions>(options =>
        {
            options.Languages.Add(new LanguageInfo("fa", "fa", "فارسی"));
            options.Languages.Add(new LanguageInfo("en", "en", "English"));
            options.Languages.Add(new LanguageInfo("ar", "ar", "العربی"));
            //options.Languages.Add(new LanguageInfo("hu", "hu", "Magyar"));
            //options.Languages.Add(new LanguageInfo("fi", "fi", "Finnish"));
            //options.Languages.Add(new LanguageInfo("fr", "fr", "Français"));
            //options.Languages.Add(new LanguageInfo("hi", "hi", "Hindi", "in"));
            //options.Languages.Add(new LanguageInfo("is", "is", "Icelandic", "is"));
            //options.Languages.Add(new LanguageInfo("it", "it", "Italiano", "it"));
            //options.Languages.Add(new LanguageInfo("pt-BR", "pt-BR", "Português (Brasil)"));
            //options.Languages.Add(new LanguageInfo("ro-RO", "ro-RO", "Română"));
            //options.Languages.Add(new LanguageInfo("ru", "ru", "Русский"));
            //options.Languages.Add(new LanguageInfo("sk", "sk", "Slovak"));
            //options.Languages.Add(new LanguageInfo("tr", "tr", "Türkçe"));
            //options.Languages.Add(new LanguageInfo("zh-Hans", "zh-Hans", "简体中文"));
            //options.Languages.Add(new LanguageInfo("zh-Hant", "zh-Hant", "繁體中文"));
            //options.Languages.Add(new LanguageInfo("el", "el", "Ελληνικά"));
        });

        Configure<AbpMultiTenancyOptions>(options =>
        {
            options.IsEnabled = MultiTenancyConsts.IsEnabled;
        });

        Configure<CmsKitContentWidgetOptions>(options =>
        {
            options.AddWidget("Today", "CmsToday", "Format");
        });

        Configure<AbpExceptionHandlingOptions>(options =>
        {
            options.SendExceptionsDetailsToClients = true;
            options.SendStackTraceToClients = false;
        });
    }
    //Added by Poolaei @ 1403/05/02
    //برای تغییر
    // SameSiteMode
    //از
    // None
    //به
    //Strict
    //البته این موضوع برای استفاده  در انگولار - بدون استفاده از ساختار آماده ای بی پی - تغییر پیدا کرد و باید اصلاح شود
    private void ConfigureAntiForgeryToken(IServiceCollection services)
    {
        var configurationSection = services.GetConfiguration().GetSection("App:AntiForgery");

        //Configure<CookieOptions>(options =>
        //{
        //    options.Domain = ".avreenco.com";
        //    options.HttpOnly = true;
        //    options.Path = "/";
        //    options.SameSite = SameSiteMode.None;
        //});
        Configure<CookieAuthenticationOptions>(options =>
        {
            //options.Cookie.SameSite = SameSiteMode.None;
            //options.Cookie.Name = ".Royan.Auth";CookieAuthenticationDefaults.AuthenticationScheme;
            //options.Cookie.Domain = ".avreenco.com";
            //options.Cookie.HttpOnly = true;
            //options.Cookie.Path = "/";
            // options.LoginPath = "/Account/Login";

        });
       

        Configure<AbpAntiForgeryOptions>(options =>
        {
            options.TokenCookie.SameSite = SameSiteMode.Strict;
            //options.AuthCookieSchemaName = ".Royan.Auth."; // چرا  اعمال نمی شود؟
            options.TokenCookie.Domain = configurationSection["TokenCookie:Domain"];
            //options.TokenCookie.HttpOnly = false;
            // options.TokenCookie.Path = "/";
            //options.TokenCookie.Name = "XSRF-TOKEN";
        });
    }
    private void ConfigureCorsPloicy(IServiceCollection services)
    {
        var configuration = services.GetConfiguration();

        services.AddCors(options =>
        {
            options.AddPolicy(DefaultCorsPolicyName, builder =>
            {
                builder
                     .WithOrigins(
                         configuration["App:CorsOrigins"]
                             .Split(",", StringSplitOptions.RemoveEmptyEntries)
                             .Select(o => o.RemovePostFix("/"))
                             .ToArray()
                     )
                    //.AllowAnyOrigin()
                    //.WithOrigins("http://panel.avreenco.com")
                    .WithAbpExposedHeaders()
                    .SetIsOriginAllowedToAllowWildcardSubdomains()
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                   .AllowCredentials();
                // .SetIsOriginAllowed(hostName => true);
            });
        });
    }
    private void ConfigureBundles()
    {
        //Configure<AbpLayoutHookOptions>(options =>
        //{
        //    options.Add(
        //        LayoutHooks.Head.Last, //The hook name
        //        typeof(KendoViewComponent) //The component to add
        //    );
        //});
        Configure<AbpBundlingOptions>(options =>
        {
            var rtlPostfix = CultureHelper.IsRtl ? ".rtl" : string.Empty;
            //TODO: فقط هنگام بارگذاری ماژول اجرا می شود و در آن زمان همیشه چپبه راست است
            // این مشکل باید حل شود. فعلا به روش زیر راست به چپ اجباری تنظیم شد
            rtlPostfix = ".rtl";
            options.StyleBundles.Configure(
              //LeptonXLiteThemeBundles.Styles.Global,
              //  BasicThemeBundles.Styles.Global,
              KaraThemeBundles.Styles.Global,
                bundle =>
                {
                    bundle.AddFiles($"/global-styles{rtlPostfix}.css");
                    bundle.AddContributors(typeof(KendoStyleContributor));
                }
            );

            //Configure<LeptonXLiteThemeOption>(options =>
            //{
            //    options.DefaultStyle = LeptonXStyleNames.Dark;
            //});
        });
       
    }
    private void ConfigureCmsKit()
    {
        //Adde By Poolaei @ 1402/12/21
        Configure<AbpAspNetCoreMvcOptions>(options =>
        {
            options.ConventionalControllers
                .Create(typeof(CmsKitPublicApplicationModule).Assembly, opts =>
                {
                    //جلوگیری از ساخت داینامیک ای پی آی  از کلاس های ماژول مشخص شده
                    opts.TypePredicate = type => { return false; };
                })
                 .Create(typeof(CmsKitAdminApplicationModule).Assembly, opts =>
                 {
                     //جلوگیری از ساخت داینامیک ای پی آی  از کلاس های ماژول مشخص شده
                     opts.TypePredicate = type => { return false; };
                 });
        });

        Configure<CmsKitTagOptions>(options =>
        {
            options.EntityTypes.Add(new TagEntityTypeDefiniton("quote"));
        });

        Configure<CmsKitCommentOptions>(options =>
        {
            options.EntityTypes.Add(new CommentEntityTypeDefinition("quote"));
            options.IsRecaptchaEnabled = true;
            options.AllowedExternalUrls = new Dictionary<string, List<string>>
            {
                {
                    "quote",
                    new List<string>
                    {
                        "https://abp.io/"
                    }
                }
            };
        });

        Configure<CmsKitMediaOptions>(options =>
        {
            options.EntityTypes.Add(new MediaDescriptorDefinition("quote"));
        });

        Configure<CmsKitReactionOptions>(options =>
        {
            options.EntityTypes.Add(
                new ReactionEntityTypeDefinition("quote",
                reactions: new[]
                {
                        new ReactionDefinition(StandardReactions.ThumbsUp),
                        new ReactionDefinition(StandardReactions.ThumbsDown),
                }));
        });

        Configure<CmsKitRatingOptions>(options =>
        {
            options.EntityTypes.Add(new RatingEntityTypeDefinition("quote"));
        });
    }
    private void ConfigureKendo(IServiceCollection services)
    {


        services.AddKendo();
        Configure<AbpLayoutHookOptions>(options =>
        {
            options.Add(
                LayoutHooks.Head.Last, //The hook name
                typeof(KendoViewComponent) //The component to add
               //,layout: StandardLayouts.Application //Set the layout to add
            );
        });

        //Added and Commented By Poolaei @1403/04/05
        //سرویس های مربوط به خروجی سریالیاز ها و شکل حروف پراپرتی های خروجی 
        // برای اولین بار با توجه به اینکه کنترل و ای پی آی های  ایمیج براوزر برای آپلود ادیتور کندو  در فرانت ام وی سی 
        //استفاده شد این تغییر نیاز شد 
        //بعدا با تغییرات لازم در خود کنترلر ها نیاز برطرف شد
        //در غیر اینصورت بین تنظیمات کلی پروژه و کنترلر نام برده شده کانفیلیکت پیش می آمد
        //services.AddControllersWithViews(options => options.EnableEndpointRouting = false)
        //    .AddNewtonsoftJson(options =>
        //    {
        //        options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Serialize;
        //        //options.SerializerSettings.ContractResolver = new DefaultContractResolver();
        //        options.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
        //    });
        //services
        //       .AddMvc(options => options.EnableEndpointRouting = false)//.SetCompatibilityVersion(CompatibilityVersion.Latest)
        //       .AddNewtonsoftJson(options =>
        //       {
        //          // options.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
        //           options.SerializerSettings.ContractResolver = new DefaultContractResolver();
        //            options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;

        //       });


    }
    public override void OnApplicationInitialization(ApplicationInitializationContext context)
    {
        var app = context.GetApplicationBuilder();
        var env = context.GetEnvironment();

        if (env.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
        }
        else
        {
            app.UseErrorPage();
            app.UseHsts();
        }
        app.UseStaticFiles();
        //app.UseStaticFiles(new StaticFileOptions
        //{
        //    FileProvider = new PhysicalFileProvider(
        //  Path.Combine(env.WebRootPath, "Uploads")),
        //    RequestPath = "/Uploads"
        //});
        app.UseHttpsRedirection();

        app.UseRouting();
        // app.UseCookiePolicy();
        app.UseCors(DefaultCorsPolicyName);
        app.UseAuthentication();

        if (MultiTenancyConsts.IsEnabled)
        {
            app.UseMultiTenancy();
        }

        // app.UseAbpRequestLocalization();
        var supportedCultures = new[]
            {
                new CultureInfo("fa"),
                new CultureInfo("en"),
                new CultureInfo("ar"),
            };
        app.UseAbpRequestLocalization(options =>
        {
            options.DefaultRequestCulture = new RequestCulture("fa");
            options.SupportedCultures = supportedCultures;
            options.SupportedUICultures = supportedCultures;
            options.RequestCultureProviders = new List<IRequestCultureProvider>
            {
                new QueryStringRequestCultureProvider(),
                new CookieRequestCultureProvider()
            };
        });
        app.UseAuthorization();


        app.UseSwagger();
        app.UseAbpSwaggerUI(options =>
        {
            options.SwaggerEndpoint("/swagger/v1/swagger.json", "Support APP API");
        });

        app.UseAuditing();
        app.UseAbpSerilogEnrichers();

        app.UseConfiguredEndpoints();

        using (var scope = context.ServiceProvider.CreateScope())
        {
            AsyncHelper.RunSync(async () =>
            {
                await scope.ServiceProvider
                    .GetRequiredService<IDataSeeder>()
                    .SeedAsync();
            });
        }
    }
}