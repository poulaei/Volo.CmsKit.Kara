using System;
using Volo.Abp.Application.Dtos;

namespace Volo.CmsKit.Public.Boxes;

[Serializable]
public class BoxGetListInput : PagedAndSortedResultRequestDto
{
    public string? Filter { get; set; }
}
