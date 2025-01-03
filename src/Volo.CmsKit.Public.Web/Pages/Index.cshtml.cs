using CmsKitDemo.Services;
using System;
using System.Threading.Tasks;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Volo.CmsKit.Contents;

namespace Volo.CmsKit.Pages;

public class IndexModel : AbpPageModel
{
    private readonly IGalleryImagePublicAppService _imageGalleryAppService;

    public GalleryImageCommonDto Image { get; set; }
    public IndexModel(IGalleryImagePublicAppService imageGalleryAppService)
    {
        _imageGalleryAppService = imageGalleryAppService;
    }
    public async Task OnGetAsync()
    {
        Image = await _imageGalleryAppService.GetAsync(Guid.Parse("7f98c48b-3e5a-e138-9fb8-3a16c84da585"));
    }
}