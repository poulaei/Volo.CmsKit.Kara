using System;
using Volo.Abp.Application.Dtos;

namespace Volo.CmsKit.Admin.Boxes;

[Serializable]
public class BoxItemGetListInput : PagedAndSortedResultRequestDto
{
    public string Filter { get; set; }
}
