using System;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Domain.Entities;

namespace Volo.CmsKit.Admin.GalleryImages;

[Serializable]
public class GalleryImageDto : ExtensibleAuditedEntityDto<Guid>, IHasConcurrencyStamp
{
        public string Description { get; set; }
        public Guid CoverImageMediaId { get; set; }
        public string ConcurrencyStamp { get; set; }
}

