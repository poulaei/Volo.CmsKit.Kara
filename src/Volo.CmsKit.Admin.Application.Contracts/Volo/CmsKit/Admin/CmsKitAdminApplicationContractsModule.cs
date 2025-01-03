using Volo.Abp.Account;
using Volo.Abp.Identity;
using Volo.Abp.Modularity;
using Volo.Abp.ObjectExtending;
using Volo.Abp.ObjectExtending.Modularity;
using Volo.Abp.Threading;
using Volo.CmsKit.Admin.Blogs;
using Volo.CmsKit.Admin.Boxes;
using Volo.CmsKit.Admin.Comments;
using Volo.CmsKit.Admin.ContentBoxes;
using Volo.CmsKit.Admin.GalleryImages;
using Volo.CmsKit.Admin.GlobalResources;
using Volo.CmsKit.Admin.MediaDescriptors;
using Volo.CmsKit.Admin.Menus;
using Volo.CmsKit.Admin.Pages;
using Volo.CmsKit.Admin.Tags;

namespace Volo.CmsKit.Admin;

[DependsOn(
    typeof(CmsKitCommonApplicationContractsModule),
    typeof(AbpAccountApplicationContractsModule),
   typeof(AbpIdentityApplicationContractsModule)
)]
public class CmsKitAdminApplicationContractsModule : AbpModule
{
    private readonly static OneTimeRunner OneTimeRunner = new OneTimeRunner();

    public override void PostConfigureServices(ServiceConfigurationContext context)
    {
        OneTimeRunner.Run(() =>
        {
            ModuleExtensionConfigurationHelper.ApplyEntityConfigurationToApi(
                CmsKitModuleExtensionConsts.ModuleName,
                CmsKitModuleExtensionConsts.EntityNames.Blog,
                getApiTypes: new[] { typeof(BlogDto) },
                createApiTypes: new[] { typeof(CreateBlogDto) },
                updateApiTypes: new[] { typeof(UpdateBlogDto) }
            );

            ModuleExtensionConfigurationHelper.ApplyEntityConfigurationToApi(
                CmsKitModuleExtensionConsts.ModuleName,
                CmsKitModuleExtensionConsts.EntityNames.BlogPost,
                getApiTypes: new[] { typeof(BlogPostDto), typeof(BlogPostListDto) },
                createApiTypes: new[] { typeof(CreateBlogPostDto) },
                updateApiTypes: new[] { typeof(UpdateBlogPostDto) }
            );

            ModuleExtensionConfigurationHelper.ApplyEntityConfigurationToApi(
                CmsKitModuleExtensionConsts.ModuleName,
                CmsKitModuleExtensionConsts.EntityNames.Comment,
                getApiTypes: new[] { typeof(CommentDto), typeof(CommentWithAuthorDto) }
            );

            ModuleExtensionConfigurationHelper.ApplyEntityConfigurationToApi(
                CmsKitModuleExtensionConsts.ModuleName,
                CmsKitModuleExtensionConsts.EntityNames.GlobalResource,
                getApiTypes: new[] { typeof(GlobalResourcesDto) },
                updateApiTypes: new[] { typeof(GlobalResourcesUpdateDto) }
            );

            ModuleExtensionConfigurationHelper.ApplyEntityConfigurationToApi(
                CmsKitModuleExtensionConsts.ModuleName,
                CmsKitModuleExtensionConsts.EntityNames.MediaDescriptor,
                getApiTypes: new[] { typeof(MediaDescriptorDto) }
            );

            ModuleExtensionConfigurationHelper.ApplyEntityConfigurationToApi(
                CmsKitModuleExtensionConsts.ModuleName,
                CmsKitModuleExtensionConsts.EntityNames.MenuItem,
                createApiTypes: new[] { typeof(MenuCreateInput) , typeof(MenuItemCreateInput)},
                updateApiTypes: new[] { typeof(MenuUpdateInput) , typeof(MenuItemUpdateInput)}
            );
            
            ModuleExtensionConfigurationHelper.ApplyEntityConfigurationToApi(
                CmsKitModuleExtensionConsts.ModuleName,
                CmsKitModuleExtensionConsts.EntityNames.Page,
                getApiTypes: new[] { typeof(PageDto) },
                createApiTypes: new[] { typeof(CreatePageInputDto) },
                updateApiTypes: new[] { typeof(UpdatePageInputDto) }
            );

            ModuleExtensionConfigurationHelper.ApplyEntityConfigurationToApi(
                CmsKitModuleExtensionConsts.ModuleName,
                CmsKitModuleExtensionConsts.EntityNames.Tag,
                createApiTypes: new[] { typeof(TagCreateDto) },
                updateApiTypes: new[] { typeof(TagUpdateDto) }
            );
            //Added By Poolaei @1402/12/07
            ModuleExtensionConfigurationHelper.ApplyEntityConfigurationToApi(
                CmsKitModuleExtensionConsts.ModuleName,
                CmsKitModuleExtensionConsts.EntityNames.GalleryImage,
                 getApiTypes: new[] { typeof(GalleryImageDto), typeof(GalleryImageWithDetailsDto) },
                createApiTypes: new[] { typeof(GalleryImageCreateUpdateDto) },
                updateApiTypes: new[] { typeof(GalleryImageCreateUpdateDto) }
            );

            //Added By Poolaei @1402/12/07
            ModuleExtensionConfigurationHelper.ApplyEntityConfigurationToApi(
                CmsKitModuleExtensionConsts.ModuleName,
                CmsKitModuleExtensionConsts.EntityNames.Box,
                 getApiTypes: new[] { typeof(BoxDto) },
                createApiTypes: new[] { typeof(CreateBoxDto) },
                updateApiTypes: new[] { typeof(UpdateBoxDto) }
            );

            //Added By Poolaei @1403/04/13
            ModuleExtensionConfigurationHelper.ApplyEntityConfigurationToApi(
                CmsKitModuleExtensionConsts.ModuleName,
                CmsKitModuleExtensionConsts.EntityNames.ContentBox,
                 getApiTypes: new[] { typeof(BoxDto) },
                createApiTypes: new[] { typeof(CreateContentBoxDto) },
                updateApiTypes: new[] { typeof(UpdateContentBoxDto) }
            );

        });
    }
}