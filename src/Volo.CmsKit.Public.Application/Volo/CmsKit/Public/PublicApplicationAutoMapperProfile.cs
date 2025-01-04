using AutoMapper;
using Volo.Abp.AutoMapper;
using Volo.CmsKit.Blogs;
using Volo.CmsKit.Boxes;
using Volo.CmsKit.Comments;
using Volo.CmsKit.ContentBoxes;
using Volo.CmsKit.Contents;
using Volo.CmsKit.GalleryImages;
using Volo.CmsKit.GlobalResources;
using Volo.CmsKit.Menus;
using Volo.CmsKit.Pages;
using Volo.CmsKit.Public.Blogs;
using Volo.CmsKit.Public.Comments;
using Volo.CmsKit.Public.GlobalResources;
using Volo.CmsKit.Public.Ratings;
using Volo.CmsKit.Ratings;
using Volo.CmsKit.Users;

namespace Volo.CmsKit.Public;

public class PublicApplicationAutoMapperProfile : Profile
{
    public PublicApplicationAutoMapperProfile()
    {
        CreateMap<CmsUser, Comments.CmsUserDto>().MapExtraProperties();

        CreateMap<Comment, CommentDto>()
            .Ignore(x => x.Author).MapExtraProperties();

        CreateMap<Comment, CommentWithDetailsDto>()
            .Ignore(x => x.Replies)
            .Ignore(x => x.Author)
            .MapExtraProperties();

        CreateMap<Rating, RatingDto>();

        CreateMap<Page, PageCacheItem>().MapExtraProperties();

        CreateMap<PageCacheItem, PageDto>().MapExtraProperties();

        CreateMap<Page, PageDto>().MapExtraProperties();

        CreateMap<BlogPost, BlogPostCommonDto>().MapExtraProperties();
        //Added by Poolaei @1403/03/25  For Royan
        CreateMap<Blog, BlogCommonDto>().MapExtraProperties();
        CreateMap<BlogPost, BlogPostCommonNoContentDto>().MapExtraProperties();

        CreateMap<MenuItem, MenuItemDto>().MapExtraProperties();

        CreateMap<GlobalResource, GlobalResourceDto>().MapExtraProperties();


        //Added by Poolaei @1403/02/07 ---------------------------------
        CreateMap<Box, BoxDto>().MapExtraProperties();
        CreateMap<BoxItem, BoxItemDto>();

        CreateMap<Box, BoxCacheItem>().MapExtraProperties();
        CreateMap<BoxCacheItem, BoxDto>().MapExtraProperties();
        CreateMap<BoxItem, BoxItemCacheItem>();
        CreateMap<BoxItemCacheItem, BoxItemDto>();

        CreateMap<MenuItem, RoyanMenuItemDto>().MapExtraProperties();
        /*----------------------------------------------------------------------*/

        //Added by Poolaei @1403/04/13 ---------------------------------
        CreateMap<ContentBox, ContentBoxCommonDto>().MapExtraProperties();

        CreateMap<ContentBox, ContentBoxCacheItem>().MapExtraProperties();
        CreateMap<ContentBoxCacheItem, ContentBoxCommonDto>().MapExtraProperties();

        //CreateMap(typeof(HierarchyNode<ContentBox>), typeof(HierarchyNode<ContentBoxDto>));
        CreateMap<HierarchyNode<ContentBox>, HierarchyNode<ContentBoxCommonDto>>();

        CreateMap<GalleryImage, GalleryImageCommonDto>().MapExtraProperties();
        CreateMap<GalleryImage, GalleryImageWithDetailsDto>()
            .Ignore(x => x.CommentCount)
            .Ignore(x => x.LikeCount)
            .MapExtraProperties();
    }
}
