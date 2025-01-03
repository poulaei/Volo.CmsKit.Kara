using Volo.Abp.BlobStoring;
using Volo.Abp.Domain;
using Volo.Abp.GlobalFeatures;
using Volo.Abp.Localization;
using Volo.Abp.Modularity;
using Volo.Abp.ObjectExtending;
using Volo.Abp.ObjectExtending.Modularity;
using Volo.Abp.Threading;
using Volo.Abp.Users;
using Volo.CmsKit.Blogs;
using Volo.CmsKit.Boxes;
using Volo.CmsKit.Comments;
using Volo.CmsKit.ContentBoxes;
using Volo.CmsKit.GalleryImages;
using Volo.CmsKit.GlobalFeatures;
using Volo.CmsKit.Localization;
using Volo.CmsKit.MediaDescriptors;
using Volo.CmsKit.Menus;
using Volo.CmsKit.Pages;
using Volo.CmsKit.Ratings;
using Volo.CmsKit.Reactions;
using Volo.CmsKit.Tags;
using Volo.CmsKit.Users;

namespace Volo.CmsKit;

[DependsOn(
    typeof(CmsKitDomainSharedModule),
    typeof(AbpUsersDomainModule),
    typeof(AbpDddDomainModule),
    typeof(AbpBlobStoringModule)
)]
public class CmsKitDomainModule : AbpModule
{
    private readonly static OneTimeRunner OneTimeRunner = new OneTimeRunner();
    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        if (GlobalFeatureManager.Instance.IsEnabled<ReactionsFeature>())
        {
            Configure<CmsKitReactionOptions>(options =>
            {
                if (GlobalFeatureManager.Instance.IsEnabled<BlogsFeature>())
                {
                    options.EntityTypes.Add(
                        new ReactionEntityTypeDefinition(
                            BlogPostConsts.EntityType,
                            reactions: new[]
                            {
                                    new ReactionDefinition(StandardReactions.Smile),
                                    new ReactionDefinition(StandardReactions.ThumbsUp),
                                    new ReactionDefinition(StandardReactions.ThumbsDown),
                                    new ReactionDefinition(StandardReactions.Confused),
                                    new ReactionDefinition(StandardReactions.Eyes),
                                    new ReactionDefinition(StandardReactions.Heart),
                                    new ReactionDefinition(StandardReactions.HeartBroken),
                                    new ReactionDefinition(StandardReactions.Wink),
                                    new ReactionDefinition(StandardReactions.Pray),
                                    new ReactionDefinition(StandardReactions.Rocket),
                                    new ReactionDefinition(StandardReactions.Victory),
                                    new ReactionDefinition(StandardReactions.Rock),
                            }));
                }

                if (GlobalFeatureManager.Instance.IsEnabled<CommentsFeature>())
                {
                    options.EntityTypes.Add(
                        new ReactionEntityTypeDefinition(
                            CommentConsts.EntityType,
                            reactions: new[]
                            {
                                    new ReactionDefinition(StandardReactions.ThumbsUp),
                                    new ReactionDefinition(StandardReactions.ThumbsDown),
                            }));
                }
                //Added by Poolaei @1403/09/22  
                if (GlobalFeatureManager.Instance.IsEnabled<GalleryImageFeature>())
                {
                    options.EntityTypes.Add(
                        new ReactionEntityTypeDefinition(
                            GalleryImageConsts.EntityType,
                            reactions: new[]
                            {
                                    new ReactionDefinition(StandardReactions.Smile),
                                    new ReactionDefinition(StandardReactions.ThumbsUp),
                                    new ReactionDefinition(StandardReactions.ThumbsDown),
                                    new ReactionDefinition(StandardReactions.Confused),
                                    new ReactionDefinition(StandardReactions.Eyes),
                                    new ReactionDefinition(StandardReactions.Heart),
                                    new ReactionDefinition(StandardReactions.HeartBroken),
                                    new ReactionDefinition(StandardReactions.Wink),
                                    new ReactionDefinition(StandardReactions.Pray),
                                    new ReactionDefinition(StandardReactions.Rocket),
                                    new ReactionDefinition(StandardReactions.Victory),
                                    new ReactionDefinition(StandardReactions.Rock),
                            }));
                }
            });
        }

        if (GlobalFeatureManager.Instance.IsEnabled<RatingsFeature>())
        {
            Configure<CmsKitRatingOptions>(options =>
            {
                if (GlobalFeatureManager.Instance.IsEnabled<BlogsFeature>())
                {
                    options.EntityTypes.Add(new RatingEntityTypeDefinition(BlogPostConsts.EntityType));
                }

                    // TODO: Define entity types here which can be rated.
                });
        }

        if (GlobalFeatureManager.Instance.IsEnabled<TagsFeature>())
        {
            // TODO: Configure TagEntityTypes here...
        }
    }
    
    public override void PostConfigureServices(ServiceConfigurationContext context)
    {
        OneTimeRunner.Run(() =>
        {
            ModuleExtensionConfigurationHelper.ApplyEntityConfigurationToEntity(
                CmsKitModuleExtensionConsts.ModuleName,
                CmsKitModuleExtensionConsts.EntityNames.Blog,
                typeof(Blog)
            );
            
            ModuleExtensionConfigurationHelper.ApplyEntityConfigurationToEntity(
                CmsKitModuleExtensionConsts.ModuleName,
                CmsKitModuleExtensionConsts.EntityNames.BlogPost,
                typeof(BlogPost)
            );
            
            ModuleExtensionConfigurationHelper.ApplyEntityConfigurationToEntity(
                CmsKitModuleExtensionConsts.ModuleName,
                CmsKitModuleExtensionConsts.EntityNames.BlogFeature,
                typeof(BlogFeature)
            );
            
            ModuleExtensionConfigurationHelper.ApplyEntityConfigurationToEntity(
                CmsKitModuleExtensionConsts.ModuleName,
                CmsKitModuleExtensionConsts.EntityNames.MediaDescriptor,
                typeof(MediaDescriptor)
            );
            
            ModuleExtensionConfigurationHelper.ApplyEntityConfigurationToEntity(
                CmsKitModuleExtensionConsts.ModuleName,
                CmsKitModuleExtensionConsts.EntityNames.Page,
                typeof(Page)
            );

            ModuleExtensionConfigurationHelper.ApplyEntityConfigurationToEntity(
                CmsKitModuleExtensionConsts.ModuleName,
                CmsKitModuleExtensionConsts.EntityNames.Tag,
                typeof(Tag)
            );

            ModuleExtensionConfigurationHelper.ApplyEntityConfigurationToEntity(
                CmsKitModuleExtensionConsts.ModuleName,
                CmsKitModuleExtensionConsts.EntityNames.Comment,
                typeof(Comment)
            );
            
            ModuleExtensionConfigurationHelper.ApplyEntityConfigurationToEntity(
                CmsKitModuleExtensionConsts.ModuleName,
                CmsKitModuleExtensionConsts.EntityNames.MenuItem,
                typeof(MenuItem)
            );
            
            ModuleExtensionConfigurationHelper.ApplyEntityConfigurationToEntity(
                CmsKitModuleExtensionConsts.ModuleName,
                CmsKitModuleExtensionConsts.EntityNames.CmsUser,
                typeof(CmsUser)
            );
            //Added By Poolaei @1402/11/27
            ModuleExtensionConfigurationHelper.ApplyEntityConfigurationToEntity(
               CmsKitModuleExtensionConsts.ModuleName,
               CmsKitModuleExtensionConsts.EntityNames.GalleryImage,
               typeof(GalleryImage)
           );

            //Added By Poolaei @1403/04/13
            ModuleExtensionConfigurationHelper.ApplyEntityConfigurationToEntity(
              CmsKitModuleExtensionConsts.ModuleName,
              CmsKitModuleExtensionConsts.EntityNames.Box,
              typeof(BoxItem)

          );
            ModuleExtensionConfigurationHelper.ApplyEntityConfigurationToEntity(
               CmsKitModuleExtensionConsts.ModuleName,
               CmsKitModuleExtensionConsts.EntityNames.ContentBox,
               typeof(ContentBox)
           );

        });
    }

    private static LocalizableString L(string name)
    {
        return LocalizableString.Create<CmsKitResource>(name);
    }
}
