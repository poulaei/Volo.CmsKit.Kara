using Microsoft.AspNetCore.Mvc.RazorPages;
using Volo.CmsKit.Public.Web.Pages;
using System.Collections.Generic;
using Volo.CmsKit.Contents;
using CmsKitDemo.Services;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Volo.CmsKit.Public.Web.Pages.Public.CmsKit.Gallery
{
    public class ImageGalleryModel : CmsKitPublicPageModelBase
    {
        public List<GalleryImageWithDetailsDto> Images { get; set; }

        private readonly IGalleryImagePublicAppService _imageGalleryAppService;

        public ImageGalleryModel(IGalleryImagePublicAppService imageGalleryAppService)
        {
            _imageGalleryAppService = imageGalleryAppService;
        }

        public virtual async Task OnGetAsync()
        {
            Images = await _imageGalleryAppService.GetDetailedListAsync();
        }
    }
}
