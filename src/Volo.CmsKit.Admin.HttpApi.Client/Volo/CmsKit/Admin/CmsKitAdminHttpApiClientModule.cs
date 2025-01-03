using Microsoft.Extensions.DependencyInjection;
using Volo.Abp.Account;
using Volo.Abp.Http.Client;
using Volo.Abp.Identity;
using Volo.Abp.Modularity;
using Volo.Abp.VirtualFileSystem;

namespace Volo.CmsKit.Admin;

[DependsOn(
    typeof(CmsKitAdminApplicationContractsModule),
     //Added by Poolaei  @1403/02/12  
     typeof(AbpIdentityHttpApiClientModule),
    typeof(AbpAccountHttpApiClientModule),
    typeof(CmsKitCommonHttpApiClientModule))]
public class CmsKitAdminHttpApiClientModule : AbpModule
{
    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        context.Services.AddStaticHttpClientProxies(
            typeof(CmsKitAdminApplicationContractsModule).Assembly,
            CmsKitAdminRemoteServiceConsts.RemoteServiceName
        );

        Configure<AbpVirtualFileSystemOptions>(options =>
        {
            options.FileSets.AddEmbedded<CmsKitAdminHttpApiClientModule>();
        });
    }
}
