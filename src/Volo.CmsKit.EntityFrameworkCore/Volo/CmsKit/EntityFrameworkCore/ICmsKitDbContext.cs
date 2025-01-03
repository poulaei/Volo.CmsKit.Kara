using Microsoft.EntityFrameworkCore;
using Volo.Abp.Data;
using Volo.Abp.EntityFrameworkCore;
using Volo.CmsKit.Blogs;
using Volo.CmsKit.Boxes;
using Volo.CmsKit.Comments;
using Volo.CmsKit.ContentBoxes;
using Volo.CmsKit.GalleryImages;
using Volo.CmsKit.GlobalResources;
using Volo.CmsKit.MediaDescriptors;
using Volo.CmsKit.Menus;
using Volo.CmsKit.Pages;
using Volo.CmsKit.Ratings;
using Volo.CmsKit.Reactions;
using Volo.CmsKit.Tags;
using Volo.CmsKit.Users;

namespace Volo.CmsKit.EntityFrameworkCore;

[ConnectionStringName(AbpCmsKitDbProperties.ConnectionStringName)]
public interface ICmsKitDbContext : IEfCoreDbContext
{
    DbSet<Comment> Comments { get; }
    DbSet<CmsUser> User { get; }
    DbSet<UserReaction> Reactions { get; }
    DbSet<Rating> Ratings { get; }
    DbSet<Tag> Tags { get; }
    DbSet<EntityTag> EntityTags { get; }
    DbSet<Page> Pages { get; }
    DbSet<Blog> Blogs { get; }
    DbSet<BlogPost> BlogPosts { get; }
    DbSet<BlogFeature> BlogFeatures { get; }
    DbSet<MediaDescriptor> MediaDescriptors { get; }
    DbSet<MenuItem> MenuItems { get; }
    DbSet<GlobalResource> GlobalResources { get; }
    //Added By Poolaei @1402/11/27
    DbSet<GalleryImage> GalleryImages { get; }
    DbSet<Box> Boxes { get; }
    DbSet<BoxItem> BoxItems { get; }
    DbSet<ContentBox> ContentBoxes { get; }
}
