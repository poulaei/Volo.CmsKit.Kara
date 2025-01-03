using System;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;

namespace Volo.CmsKit.Admin.Boxes;

public interface IBoxAdminAppService : ICrudAppService<BoxDto, BoxDto, Guid, BoxGetListInput, CreateBoxDto, UpdateBoxDto>
{
    Task<bool> HazfAsync(Guid id);
}

