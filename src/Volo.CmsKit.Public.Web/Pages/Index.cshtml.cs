using CmsKitDemo.Services;
using Microsoft.AspNetCore.Mvc;
using System;
using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Volo.Abp.ObjectExtending;
using Volo.Abp.Validation;
using Volo.CmsKit.ContentBoxes;
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
    public class HomePageViewModel
    {
        public Guid? MediaId { get; set; }
    }
}