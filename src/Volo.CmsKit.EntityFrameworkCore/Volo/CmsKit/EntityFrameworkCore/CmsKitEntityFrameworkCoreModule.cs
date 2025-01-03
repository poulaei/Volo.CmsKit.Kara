using Microsoft.Extensions.DependencyInjection;
using Volo.Abp.EntityFrameworkCore;
using Volo.Abp.Modularity;
using Volo.Abp.Users.EntityFrameworkCore;
using Volo.CmsKit.Blogs;
using Volo.CmsKit.Boxes;
using Volo.CmsKit.Comments;
using Volo.CmsKit.ContentBoxes;
using Volo.CmsKit.GalleryImages;
using Volo.CmsKit.GlobalResources;
using Volo.CmsKit.MediaDescriptors;
using Volo.CmsKit.Pages;
using Volo.CmsKit.Ratings;
using Volo.CmsKit.Reactions;
using Volo.CmsKit.Tags;
using Volo.CmsKit.Users;

namespace Volo.CmsKit.EntityFrameworkCore;

[DependsOn(
    typeof(CmsKitDomainModule),
    typeof(AbpUsersEntityFrameworkCoreModule),
    typeof(AbpEntityFrameworkCoreModule)
)]
public class CmsKitEntityFrameworkCoreModule : AbpModule
{
    //Added by poolaei @ 1403/04/10
    public override void PreConfigureServices(ServiceConfigurationContext context)
    {
        CmsKitEfCoreEntityExtensionMappings.Configure();
    }
    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        context.Services.AddAbpDbContext<CmsKitDbContext>(options =>
        {
            options.AddRepository<CmsUser, EfCoreCmsUserRepository>();
            options.AddRepository<UserReaction, EfCoreUserReactionRepository>();
            options.AddRepository<Comment, EfCoreCommentRepository>();
            options.AddRepository<Rating, EfCoreRatingRepository>();
            options.AddRepository<Tag, EfCoreTagRepository>();
            options.AddRepository<EntityTag, EfCoreEntityTagRepository>();
            options.AddRepository<Page, EfCorePageRepository>();
            options.AddRepository<Blog, EfCoreBlogRepository>();
            options.AddRepository<BlogPost, EfCoreBlogPostRepository>();
            options.AddRepository<BlogFeature, EfCoreBlogFeatureRepository>();
            options.AddRepository<MediaDescriptor, EfCoreMediaDescriptorRepository>();
            options.AddRepository<GlobalResource, EfCoreGlobalResourceRepository>();
            //Added By Poolaei @1402/11/27
            options.AddRepository<GalleryImage, EfCoreGalleryImageRepository>();
            options.AddRepository<Box, EfCoreBoxRepository>();
            //Added By Poolaei @1403/04/13
            options.AddRepository<ContentBox, EfCoreContentBoxRepository>();
        });
    }
}
