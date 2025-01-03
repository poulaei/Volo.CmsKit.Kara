using AutoMapper;
using Volo.Abp.AutoMapper;
using Volo.CmsKit.Admin.Blogs;
using Volo.CmsKit.Admin.Comments;
using Volo.CmsKit.Admin.MediaDescriptors;
using Volo.CmsKit.Admin.Pages;
using Volo.CmsKit.Blogs;
using Volo.CmsKit.Admin.Tags;
using Volo.CmsKit.Comments;
using Volo.CmsKit.MediaDescriptors;
using Volo.CmsKit.Pages;
using Volo.CmsKit.Tags;
using Volo.CmsKit.Users;
using Volo.CmsKit.Menus;
using Volo.CmsKit.Admin.Menus;
using Volo.CmsKit.GalleryImages;
using Volo.CmsKit.Admin.GalleryImages;
using Volo.CmsKit.Admin.Boxes;
using Volo.CmsKit.Boxes;
using Volo.CmsKit.ContentBoxes;
using Volo.CmsKit.Admin.ContentBoxes;


namespace Volo.CmsKit.Admin;

public class CmsKitAdminApplicationAutoMapperProfile : Profile
{
    public CmsKitAdminApplicationAutoMapperProfile()
    {
        CreateMap<CmsUser, Comments.CmsUserDto>().MapExtraProperties();

        CreateMap<Comment, CommentDto>().MapExtraProperties();
        CreateMap<Comment, CommentWithAuthorDto>()
            .Ignore(x => x.Author)
            .MapExtraProperties();

        CreateMap<Page, PageDto>().MapExtraProperties();
        CreateMap<Page, PageLookupDto>();

        CreateMap<BlogPost, BlogPostDto>(MemberList.Destination).MapExtraProperties();
        CreateMap<BlogPost, BlogPostListDto>()
            .Ignore(d => d.BlogName)
            .MapExtraProperties();
        CreateMap<CreateBlogPostDto, BlogPost>(MemberList.Source).MapExtraProperties();
        CreateMap<UpdateBlogPostDto, BlogPost>(MemberList.Source).MapExtraProperties(); 

        CreateMap<Blog, BlogDto>().MapExtraProperties();

        CreateMap<TagEntityTypeDefiniton, TagDefinitionDto>(MemberList.Destination);

        CreateMap<Tag, TagDto>().MapExtraProperties();

        CreateMap<MediaDescriptor, MediaDescriptorDto>().MapExtraProperties();

        CreateMap<MenuItem, MenuItemDto>().MapExtraProperties();

        //Added By Poolaei @1402/12/07
        CreateMap<GalleryImage, GalleryImageDto>().MapExtraProperties().Ignore(d => d.LastModificationTime).Ignore(d => d.LastModifierId) ;

        //CreateMap<Box, BoxDto>().MapExtraProperties();

        //CreateMap<CreateBoxDto, Box>(MemberList.Source).MapExtraProperties();
        //CreateMap<UpdateBoxDto, Box>(MemberList.Source).MapExtraProperties();

        //CreateMap<BoxItem, BoxItemDto>(MemberList.Destination).ReverseMap();//.MapExtraProperties();

        //CreateMap<CreateBoxItemDto, BoxItem>(MemberList.Source);
        //CreateMap<UpdateBoxItemDto, BoxItem>(MemberList.Source);


        //Added by Poolaei @1403/02/7
        CreateMap<Box, BoxDto>().MapExtraProperties();
        CreateMap<BoxItem, BoxItemDto>();
        CreateMap<CreateBoxItemDto, BoxItem>(MemberList.Source);
        CreateMap<UpdateBoxItemDto, BoxItem>(MemberList.Source);

        //CreateMap<Box, BoxCacheItem>().MapExtraProperties();
        //CreateMap<BoxCacheItem, BoxDto>().MapExtraProperties();

        //CreateMap<BoxItem, BoxItemCacheItem>() ;
        //CreateMap<BoxItemCacheItem, BoxItemDto>();


        //Added by Poolaei @1403/04/13
        CreateMap<ContentBox, ContentBoxDto>().MapExtraProperties();
       






    }
}
