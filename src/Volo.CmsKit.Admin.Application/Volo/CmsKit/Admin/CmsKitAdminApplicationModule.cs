using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using System.Collections.Generic;
using Volo.Abp.Account;
using Volo.Abp.AutoMapper;
using Volo.Abp.GlobalFeatures;
using Volo.Abp.Identity;
using Volo.Abp.Localization;
using Volo.Abp.Modularity;
using Volo.CmsKit.Blogs;
using Volo.CmsKit.Boxes;
using Volo.CmsKit.Comments;
using Volo.CmsKit.ContentBoxes;
using Volo.CmsKit.GalleryImages;
using Volo.CmsKit.GlobalFeatures;
using Volo.CmsKit.Localization;
using Volo.CmsKit.MediaDescriptors;
using Volo.CmsKit.Pages;
using Volo.CmsKit.Permissions;
using Volo.CmsKit.Tags;

namespace Volo.CmsKit.Admin;

[DependsOn(
    typeof(CmsKitAdminApplicationContractsModule),
    typeof(AbpAutoMapperModule),
    typeof(CmsKitCommonApplicationModule),
     typeof(AbpIdentityApplicationModule),
        typeof(AbpAccountApplicationModule)
    )]
public class CmsKitAdminApplicationModule : AbpModule
{
    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        context.Services.AddAutoMapperObjectMapper<CmsKitAdminApplicationModule>();

        ConfigureTagOptions();

        ConfigureCommentOptions();

        ConfigureMediaOptions();

        Configure<AbpAutoMapperOptions>(options =>
        {
            options.AddMaps<CmsKitAdminApplicationModule>(validate: true);
        });
    }
    private void ConfigureMediaOptions()
    {
        if (GlobalFeatureManager.Instance.IsEnabled<MediaFeature>())
        {
            Configure<CmsKitMediaOptions>(options =>
            {
                if (GlobalFeatureManager.Instance.IsEnabled<BlogsFeature>())
                {
                    options.EntityTypes.AddIfNotContains(
                        new MediaDescriptorDefinition(
                            BlogPostConsts.EntityType,
                            createPolicies: new[]
                            {
                                    CmsKitAdminPermissions.BlogPosts.Create,
                                    CmsKitAdminPermissions.BlogPosts.Update
                            },
                            deletePolicies: new[]
                            {
                                    CmsKitAdminPermissions.BlogPosts.Create,
                                    CmsKitAdminPermissions.BlogPosts.Update,
                                    CmsKitAdminPermissions.BlogPosts.Delete
                            }));
                }

                if (GlobalFeatureManager.Instance.IsEnabled<PagesFeature>())
                {
                    options.EntityTypes.AddIfNotContains(
                        new MediaDescriptorDefinition(
                            PageConsts.EntityType,
                            createPolicies: new[]
                            {
                                    CmsKitAdminPermissions.Pages.Create,
                                    CmsKitAdminPermissions.Pages.Update
                            },
                            deletePolicies: new[]
                            {
                                    CmsKitAdminPermissions.Pages.Create,
                                    CmsKitAdminPermissions.Pages.Update,
                                    CmsKitAdminPermissions.Pages.Delete
                            }));
                }


                if (GlobalFeatureManager.Instance.IsEnabled<GalleryImageFeature>())
                {
                    options.EntityTypes.AddIfNotContains(
                        new MediaDescriptorDefinition(
                            GalleryImageConsts.EntityType,
                            createPolicies: new[]
                            {
                                    CmsKitAdminPermissions.GalleryImages.Create,
                                    CmsKitAdminPermissions.GalleryImages.Update
                            },
                            deletePolicies: new[]
                            {
                                    CmsKitAdminPermissions.GalleryImages.Create,
                                    CmsKitAdminPermissions.GalleryImages.Update,
                                    CmsKitAdminPermissions.GalleryImages.Delete
                            }));
                }
                //Added by poolaei @1402/12/21
                if (GlobalFeatureManager.Instance.IsEnabled<BoxFeature>())
                {
                    options.EntityTypes.AddIfNotContains(
                        new MediaDescriptorDefinition(
                            BoxConsts.EntityType,
                            createPolicies: new[]
                            {
                                    CmsKitAdminPermissions.Boxes.Create,
                                    CmsKitAdminPermissions.Boxes.Update
                            },
                            deletePolicies: new[]
                            {
                                    CmsKitAdminPermissions.Boxes.Create,
                                    CmsKitAdminPermissions.Boxes.Update,
                                    CmsKitAdminPermissions.Boxes.Delete
                            }));
                }

                //Added by poolaei @1403/04/14
                //در صورت فعال بودن فیچر

                //EntityType انتیتی تایپ
                //با پالیسی های مربوطه
                //به لیست
                //MediaDescriptorDefinition [List<MediaDescriptorDefinition> EntityTypes]
                //افزوده می شود
                //تا امکان افزودن مدیا به موجودیت مربوطه آن فراهم شود.
                //(مورد استفاده کلاس DefaultMediaDescriptorDefinitionStore )
                if (GlobalFeatureManager.Instance.IsEnabled<ContentBoxFeature>())
            {
                options.EntityTypes.AddIfNotContains(
                    new MediaDescriptorDefinition(
                        ContentBoxConsts.EntityType,
                        createPolicies: new[]
                        {
                                    CmsKitAdminPermissions.ContentBoxes.Create,
                                    CmsKitAdminPermissions.ContentBoxes.Update
                        },
                        deletePolicies: new[]
                        {
                                    CmsKitAdminPermissions.ContentBoxes.Create,
                                    CmsKitAdminPermissions.ContentBoxes.Update,
                                    CmsKitAdminPermissions.ContentBoxes.Delete
                        }));
            }
        });
    }
    }
    private void ConfigureTagOptions()
    {
        Configure<CmsKitTagOptions>(opts =>
        {
            if (GlobalFeatureManager.Instance.IsEnabled<BlogsFeature>())
            {
                opts.EntityTypes.AddIfNotContains(
                    new TagEntityTypeDefiniton(
                        BlogPostConsts.EntityType,
                        LocalizableString.Create<CmsKitResource>("BlogPost"),
                        createPolicies: new[]
                        {
                                CmsKitAdminPermissions.BlogPosts.Create,
                                CmsKitAdminPermissions.BlogPosts.Update
                        },
                        updatePolicies: new[]
                        {
                                CmsKitAdminPermissions.BlogPosts.Create,
                                CmsKitAdminPermissions.BlogPosts.Update
                        },
                        deletePolicies: new[]
                        {
                                CmsKitAdminPermissions.BlogPosts.Create,
                                CmsKitAdminPermissions.BlogPosts.Update
                        }));
            }
        });


    }

    private void ConfigureCommentOptions()
    {
        if (GlobalFeatureManager.Instance.IsEnabled<CommentsFeature>())
        {
            Configure<CmsKitCommentOptions>(options =>
            {
                if (GlobalFeatureManager.Instance.IsEnabled<BlogsFeature>())
                {
                    options.EntityTypes.AddIfNotContains(
                        new CommentEntityTypeDefinition(BlogPostConsts.EntityType));

                }
                //Added by Poolaei @1403/09/22   
                if (GlobalFeatureManager.Instance.IsEnabled<GalleryImageFeature>())
                {
                    options.EntityTypes.AddIfNotContains(
                        new CommentEntityTypeDefinition(GalleryImageConsts.EntityType));

                }
            });
        }
    }
}
