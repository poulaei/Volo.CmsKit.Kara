using System;
using Volo.Abp.Application.Dtos;


namespace Volo.CmsKit.Admin.GalleryImages;

[Serializable]
public class GalleryImageWithDetailsDto : ExtensibleEntityDto<Guid>
    {
        public string Description { get; set; }
        public Guid CoverImageMediaId { get; set; }

        public int LikeCount { get; set; }

        public int CommentCount { get; set; }
    }

