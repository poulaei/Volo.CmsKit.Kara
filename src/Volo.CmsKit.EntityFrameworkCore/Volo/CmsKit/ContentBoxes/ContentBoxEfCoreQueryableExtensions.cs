using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace Volo.CmsKit.ContentBoxes;

public static class ContentBoxEfCoreQueryableExtensions
{
    public static IQueryable<ContentBox> IncludeDetails(this IQueryable<ContentBox> queryable, bool include = true)
    {
        if (!include)
        {
            return queryable;
        }

        return queryable;
       // return queryable.Include(x => queryable.Where(y => y.ParentId == x.Id));
    }
}
