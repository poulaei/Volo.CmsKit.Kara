using System;
using Volo.Abp.Application.Dtos;

namespace Volo.CmsKit.Admin.Boxes;

[Serializable]
public class BoxGetListInput : PagedAndSortedResultRequestDto
{
    public string? Filter { get; set; }
}
