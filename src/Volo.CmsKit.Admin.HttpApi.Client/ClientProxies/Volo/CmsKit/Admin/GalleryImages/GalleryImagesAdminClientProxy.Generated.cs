// This file is automatically generated by ABP framework to use MVC Controllers from CSharp
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Volo.Abp;
using Volo.Abp.Application.Dtos;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Http.Client;
using Volo.Abp.Http.Client.ClientProxying;
using Volo.Abp.Http.Modeling;
using Volo.CmsKit.Admin.GalleryImages;

// ReSharper disable once CheckNamespace
namespace Volo.CmsKit.Admin.GalleryImages;

[Dependency(ReplaceServices = true)]
[ExposeServices(typeof(IGalleryImageAdminAppService), typeof(GalleryImagesAdminClientProxy))]
public partial class GalleryImagesAdminClientProxy : ClientProxyBase<IGalleryImageAdminAppService>, IGalleryImageAdminAppService
{
    public virtual async Task<GalleryImageDto> CreateAsync(GalleryImageCreateUpdateDto input)
    {
        return await RequestAsync<GalleryImageDto>(nameof(CreateAsync), new ClientProxyRequestTypeValue
        {
            { typeof(GalleryImageCreateUpdateDto), input }
        });
    }

    public virtual async Task<GalleryImageDto> GetAsync(Guid id)
    {
        return await RequestAsync<GalleryImageDto>(nameof(GetAsync), new ClientProxyRequestTypeValue
        {
            { typeof(Guid), id }
        });
    }

    public virtual async Task<PagedResultDto<GalleryImageDto>> GetListAsync(GalleryImageGetListInputDto input)
    {
        return await RequestAsync<PagedResultDto<GalleryImageDto>>(nameof(GetListAsync), new ClientProxyRequestTypeValue
        {
            { typeof(GalleryImageGetListInputDto), input }
        });
    }

    public virtual async Task<GalleryImageDto> UpdateAsync(Guid id, GalleryImageCreateUpdateDto input)
    {
        return await RequestAsync<GalleryImageDto>(nameof(UpdateAsync), new ClientProxyRequestTypeValue
        {
            { typeof(Guid), id },
            { typeof(GalleryImageCreateUpdateDto), input }
        });
    }

    public virtual async Task DeleteAsync(Guid id)
    {
        await RequestAsync(nameof(DeleteAsync), new ClientProxyRequestTypeValue
        {
            { typeof(Guid), id }
        });
    }
}