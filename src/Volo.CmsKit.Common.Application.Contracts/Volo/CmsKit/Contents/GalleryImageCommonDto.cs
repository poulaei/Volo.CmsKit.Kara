using System;
using Volo.Abp.Application.Dtos;

namespace Volo.CmsKit.Contents
{
    public class GalleryImageCommonDto : ExtensibleCreationAuditedEntityDto<Guid>
    {
        public string Description { get; set; }
        public Guid CoverImageMediaId { get; set; }

    }
}
