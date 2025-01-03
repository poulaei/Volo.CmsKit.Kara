using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Threading;
using System.Threading.Tasks;
using Volo.Abp.EntityFrameworkCore;
using JetBrains.Annotations;
using Microsoft.EntityFrameworkCore;
using Volo.Abp;
using Volo.Abp.Domain.Repositories.EntityFrameworkCore;
using Volo.CmsKit.EntityFrameworkCore;

namespace Volo.CmsKit.Boxes;

public class EfCoreBoxRepository : EfCoreRepository<ICmsKitDbContext, Box, Guid>, IBoxRepository
{
    public EfCoreBoxRepository(IDbContextProvider<ICmsKitDbContext> dbContextProvider) : base(dbContextProvider)
    {
    }

    public virtual async Task<bool> ExistsAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await (await GetQueryableAsync()).AnyAsync(x => x.Id == id, GetCancellationToken(cancellationToken));
    }

    public virtual async Task<bool> SectionExistsAsync(string section, CancellationToken cancellationToken = default)
    {
        return await (await GetDbSetAsync()).AnyAsync(x => x.Section == section, GetCancellationToken(cancellationToken));
    }

    public virtual async Task<List<Box>> GetListAsync(
         string filter = null,
        int maxResultCount = int.MaxValue,
        int skipCount = 0,
        string sorting = null,
        bool includeDetails = false,
        CancellationToken cancellationToken = default)
    {
        var query = await GetListQueryAsync(filter);


        return await query
           .IncludeDetails(includeDetails)
            .OrderBy(sorting.IsNullOrEmpty() ? nameof(Box.CreationTime) + " desc" : sorting)
           .PageBy(skipCount, maxResultCount)
           .ToListAsync(GetCancellationToken(cancellationToken));
    }

    public virtual async Task<long> GetCountAsync(string filter = null, CancellationToken cancellationToken = default)
    {
        var query = await GetListQueryAsync(filter);

        return await query.LongCountAsync(GetCancellationToken(cancellationToken));
    }

    public virtual Task<Box> GetBySectionAsync([NotNull] string section, bool includeDetails = false, CancellationToken cancellationToken = default)
    {
        Check.NotNullOrEmpty(section, nameof(section));
        return GetAsync(x => x.Section == section, includeDetails: includeDetails, cancellationToken: GetCancellationToken(cancellationToken));
    }

    protected virtual async Task<IQueryable<Box>> GetListQueryAsync(string filter = null)
    {
        return (await GetDbSetAsync())
            .WhereIf(!filter.IsNullOrWhiteSpace(), b =>
              b.Title.Contains(filter)
            || b.Summary.Contains(filter)
            || b.Description.Contains(filter)

            );
    }
    //TODO: چطور باید استفاده شود در حالی که اینترفیس
    //IBoxRepository
    // این متد را ندارد
    public override async Task<IQueryable<Box>> WithDetailsAsync()
    {
        return (await GetQueryableAsync()).IncludeDetails();
    }
}
