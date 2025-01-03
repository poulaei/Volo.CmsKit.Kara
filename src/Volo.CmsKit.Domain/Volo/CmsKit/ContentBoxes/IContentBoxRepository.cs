using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Volo.Abp.Domain.Repositories;

namespace Volo.CmsKit.ContentBoxes;

public interface IContentBoxRepository : IBasicRepository<ContentBox, Guid>
{
    Task<List<ContentBox>> GetListAsync(
        string filter = null,
        int maxResultCount = int.MaxValue,
        int skipCount = 0,
        string sorting = null,
        //bool includeDetails = false,
        CancellationToken cancellationToken = default
        );

    Task<long> GetCountAsync(
        string filter = null,
        CancellationToken cancellationToken = default
        );
    Task<List<ContentBox>> GetByParentAsync(Guid? parentId, bool includeDetails = false, CancellationToken cancellationToken = default);
    Task<ContentBox> GetBySectionAsync(string section, bool includeDetails = false, CancellationToken cancellationToken = default);

    Task<bool> ExistsAsync(Guid id, CancellationToken cancellationToken = default);

    Task<bool> SectionExistsAsync(string section, CancellationToken cancellationToken = default);

    //Task<List<ContentBox>> GetListAsync(Guid id);
    Task<List<HierarchyNode<ContentBox>>> GetHierarchyAsync();
    Task<List<HierarchyNode<ContentBox>>> GetHierarchyAsync(Guid? id);
    Task<List<HierarchyNode<ContentBox>>> GetHierarchyBySectionAsync(string section);
}
