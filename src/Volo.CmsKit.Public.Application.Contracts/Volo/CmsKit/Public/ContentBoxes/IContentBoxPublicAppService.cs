using JetBrains.Annotations;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;
using Volo.CmsKit.ContentBoxes;
using Volo.CmsKit.Contents;
using Volo.CmsKit.Menus;

namespace Volo.CmsKit.Public.ContentBoxes;

public interface IContentBoxPublicAppService : IApplicationService
{
    Task<ContentBoxDto> GetAsync(Guid id);
    Task<ListResultDto<ContentBoxDto>> GetByParentAsync(Guid? parentId);
    Task<PagedResultDto<ContentBoxDto>> GetListAsync();
    Task<PagedResultDto<ContentBoxDto>> GetListAsync(ContentBoxGetListInput input);
    Task<ContentBoxDto> GetBySectionAsync([NotNull] string section);
    Task<List<HierarchyNode<ContentBoxDto>>> GetHierarchyAsync();
    Task<List<ContentBoxTree>> GetTreeAsync();
    Task<List<ContentBoxTree>> GetTreeAsync(Guid id);
    Task<List<ContentBoxTree>> GetTreeBySectionAsync([NotNull]  string section);

}
