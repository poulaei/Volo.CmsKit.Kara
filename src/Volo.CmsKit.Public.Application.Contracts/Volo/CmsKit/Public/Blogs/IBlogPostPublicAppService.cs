using System;
using System.Threading.Tasks;
using JetBrains.Annotations;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;
using Volo.CmsKit.Contents;
using Volo.CmsKit.Users;

namespace Volo.CmsKit.Public.Blogs;

public interface IBlogPostPublicAppService : IApplicationService
{   //Added by Poolaei @1403/03/25  For Royan -------------------------
    Task<BlogPostCommonDto> GetAsync(Guid id);
    Task<PagedResultDto<BlogPostCommonNoContentDto>> GetListWithOutContentAsync(BlogPostGetListInput input);
    /*-------------------------------------------------------------------*/
   
    Task<PagedResultDto<BlogPostCommonDto>> GetListAsync([NotNull] string blogSlug, BlogPostGetListInput input);

    Task<BlogPostCommonDto> GetAsync([NotNull] string blogSlug, [NotNull] string blogPostSlug);

    Task<PagedResultDto<CmsUserDto>> GetAuthorsHasBlogPostsAsync(BlogPostFilteredPagedAndSortedResultRequestDto input);

    Task<CmsUserDto> GetAuthorHasBlogPostAsync(Guid id);

    Task DeleteAsync(Guid id);

    Task<string> GetTagNameAsync([NotNull] Guid tagId);
}
