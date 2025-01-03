using Microsoft.AspNetCore.Authorization;
using System;
using System.Collections.Generic;
using System.Linq.Dynamic.Core;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;
using Volo.CmsKit.Boxes;
using Volo.CmsKit.Permissions;


namespace Volo.CmsKit.Admin.Boxes;
//TODO:
//با استفاده از کلاس اپ سرویس پیش فرض نمی توان روی موادی مانند
// MediaId 
//کنترل داشت
//بهتراست از
// AppServiceBase و
//اینترفیس شخص سازی شده
//استفاده و پیاده سازی شود
public class BoxItemAdminAppService :
        CrudAppService<BoxItem, BoxItemDto, Guid, PagedAndSortedResultRequestDto, CreateBoxItemDto, UpdateBoxItemDto>,
        IBoxItemAdminAppService
{
    private IRepository<BoxItem, Guid> BoxItemRepository { get; }
    public BoxItemAdminAppService(IRepository<BoxItem, Guid> repository) : base(repository)
    {
        CreatePolicyName = CmsKitAdminPermissions.BoxItems.Create;
        UpdatePolicyName = CmsKitAdminPermissions.BoxItems.Update;
        DeletePolicyName = CmsKitAdminPermissions.BoxItems.Delete;
        BoxItemRepository = repository;    }

    [Authorize(CmsKitAdminPermissions.BoxItems.Delete)]
    public async Task<bool> HazfAsync(Guid id)
    {
        var box = await BoxItemRepository.GetAsync(id);
        await BoxItemRepository.DeleteAsync(box);
        return true;
    }
}
