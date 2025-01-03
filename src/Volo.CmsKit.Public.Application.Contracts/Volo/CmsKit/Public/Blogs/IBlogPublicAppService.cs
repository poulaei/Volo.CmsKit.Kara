using System;
using System.Threading.Tasks;
using JetBrains.Annotations;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;
using Volo.CmsKit.Contents;
using Volo.CmsKit.Users;

namespace Volo.CmsKit.Public.Blogs;
//Added by Poolaei @1403/03/25  For Royan
public interface IBlogPublicAppService : IApplicationService
{
    Task<PagedResultDto<BlogCommonDto>> GetListAsync(BlogGetListInput input);

    //Task<BlogPostCommonDto> GetAsync([NotNull] string blogSlug, [NotNull] string blogPostSlug);

    //Task<PagedResultDto<CmsUserDto>> GetAuthorsHasBlogPostsAsync(BlogPostFilteredPagedAndSortedResultRequestDto input);

    //Task<CmsUserDto> GetAuthorHasBlogPostAsync(Guid id);

    //Task DeleteAsync(Guid id);

    //Task<string> GetTagNameAsync([NotNull] Guid tagId);
}
