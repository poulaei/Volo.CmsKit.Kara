using CmsKitDemo.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System;
using System.Threading.Tasks;
using Volo.CmsKit.Contents;

namespace Volo.CmsKit.Public.Web.Pages.Public.CmsKit.Gallery
{
    public class DetailModel : CmsKitPublicPageModelBase
    {
        [BindProperty(SupportsGet = true)]
        public Guid Id { get; set; }

        public GalleryImageCommonDto Image { get; set; }

        private readonly IGalleryImagePublicAppService _imageGalleryAppService;

        public DetailModel(IGalleryImagePublicAppService imageGalleryAppService)
        {
            _imageGalleryAppService = imageGalleryAppService;
        }

        public async Task OnGetAsync()
        {
            Image = await _imageGalleryAppService.GetAsync(Id);
        }
    }
}
