using System;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;
using Volo.CmsKit.ContentBoxes;

namespace Volo.CmsKit.Admin.ContentBoxes;

public interface IContentBoxAdminAppService : ICrudAppService<ContentBoxDto, ContentBoxDto, Guid, ContentBoxGetListInput, CreateContentBoxDto, UpdateContentBoxDto>
{
    //برای ای پی آی پست حذف
    Task<bool> HazfAsync(Guid id);

    Task MoveContentBoxAsync(Guid id, ContentBoxMoveInput input);
}

