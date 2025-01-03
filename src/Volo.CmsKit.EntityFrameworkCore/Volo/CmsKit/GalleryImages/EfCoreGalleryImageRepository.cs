using System;
using Volo.Abp.Domain.Repositories.EntityFrameworkCore;
using Volo.Abp.EntityFrameworkCore;
using Volo.CmsKit.EntityFrameworkCore;

namespace Volo.CmsKit.GalleryImages;

public class EfCoreGalleryImageRepository : EfCoreRepository<ICmsKitDbContext, GalleryImage, Guid>, IGalleryImageRepository
{
    public EfCoreGalleryImageRepository(IDbContextProvider<ICmsKitDbContext> dbContextProvider) : base(dbContextProvider)
    {
    }
}
