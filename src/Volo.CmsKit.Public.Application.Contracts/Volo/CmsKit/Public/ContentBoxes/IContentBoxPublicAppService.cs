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
    Task<ContentBoxCommonDto> GetAsync(Guid id);
    Task<ListResultDto<ContentBoxCommonDto>> GetByParentAsync(Guid? parentId);
    Task<PagedResultDto<ContentBoxCommonDto>> GetListAsync();
    Task<PagedResultDto<ContentBoxCommonDto>> GetListAsync(ContentBoxGetListInput input);
    Task<ContentBoxCommonDto> GetBySectionAsync([NotNull] string section);
    Task<List<HierarchyNode<ContentBoxCommonDto>>> GetHierarchyAsync();
    Task<List<ContentBoxTree>> GetTreeAsync();
    Task<List<ContentBoxTree>> GetTreeAsync(Guid id);
    Task<List<ContentBoxTree>> GetTreeBySectionAsync([NotNull]  string section);

}
