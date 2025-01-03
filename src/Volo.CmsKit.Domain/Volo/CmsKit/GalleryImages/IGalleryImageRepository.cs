using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Volo.Abp.Domain.Repositories;

namespace Volo.CmsKit.GalleryImages;

public interface IGalleryImageRepository : IBasicRepository<GalleryImage, Guid>
{
}
