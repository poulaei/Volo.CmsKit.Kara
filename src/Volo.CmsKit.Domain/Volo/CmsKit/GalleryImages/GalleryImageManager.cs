using System;
using System.Linq;
using System.Threading.Tasks;
using JetBrains.Annotations;
using Volo.Abp;
using Volo.Abp.Domain.Services;

namespace Volo.CmsKit.GalleryImages;

public class GalleryImageManager : DomainService
{
    protected IGalleryImageRepository GalleryImageRepository { get; }

    public GalleryImageManager(IGalleryImageRepository galleryImageRepository)
    {
        GalleryImageRepository = galleryImageRepository;
    }

    public virtual async Task<GalleryImage> CreateAsync(
         Guid CoverImageMediaId,
        [NotNull] string description
        )
    {
         Check.NotNullOrEmpty(description, nameof(description));

        

        return new GalleryImage(
            GuidGenerator.Create(),
            CoverImageMediaId,
            description
           );
    }

    

}
