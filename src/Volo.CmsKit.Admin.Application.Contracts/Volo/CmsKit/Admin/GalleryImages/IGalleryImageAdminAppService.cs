using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;

namespace Volo.CmsKit.Admin.GalleryImages;

    public interface IGalleryImageAdminAppService : ICrudAppService<GalleryImageDto,GalleryImageDto, Guid, GalleryImageGetListInputDto, GalleryImageCreateUpdateDto, GalleryImageCreateUpdateDto>
    {

    }

