using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;

namespace Volo.CmsKit.Admin.Boxes;

public interface IBoxItemAdminAppService : ICrudAppService<BoxItemDto, Guid, PagedAndSortedResultRequestDto, CreateBoxItemDto, UpdateBoxItemDto>
{
    Task<bool> HazfAsync(Guid id);
}
