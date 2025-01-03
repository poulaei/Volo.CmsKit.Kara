using System;
using Volo.Abp.Application.Dtos;

namespace Volo.CmsKit.Admin.GalleryImages;

[Serializable]
public class GalleryImageGetListInputDto : ExtensiblePagedAndSortedResultRequestDto
{
    public string Filter { get; set; }
}
