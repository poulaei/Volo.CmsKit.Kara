using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace Volo.CmsKit.Boxes;

public static class BoxEfCoreQueryableExtensions
{
    public static IQueryable<Box> IncludeDetails(this IQueryable<Box> queryable, bool include = true)
    {
        if (!include)
        {
            return queryable;
        }

        return queryable
            .Include(x => x.BoxItems);
    }
}
