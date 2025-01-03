using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Volo.Abp.Application.Services;
using Volo.CmsKit.Contents;

namespace CmsKitDemo.Services
{
    public interface IGalleryImagePublicAppService : IReadOnlyAppService<GalleryImageCommonDto, Guid>
    {
        Task<List<GalleryImageWithDetailsDto>> GetDetailedListAsync();
    }
}
