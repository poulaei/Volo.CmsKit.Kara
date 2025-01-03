using Volo.CmsKit.Permissions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System.Threading.Tasks;
using Volo.CmsKit.Admin.Web.Pages;
using Volo.CmsKit.Admin.GalleryImages;
using AutoMapper;
using Volo.Abp.ObjectExtending;
using System.ComponentModel.DataAnnotations;
using Volo.Abp.Validation;
using Volo.CmsKit.GalleryImages;
using System;
using static Volo.CmsKit.Admin.Web.Pages.CmsKit.Blogs.CreateModalModel;

namespace Volo.CmsKit.Admin.Web.Pages.CmsKit.GalleryImages;

[Authorize(CmsKitAdminPermissions.GalleryImages.Create)]
public class CreateModalModel : CmsKitAdminPageModel
    {
        //[BindProperty]
        //public CreateUpdateGalleryImageDto Image { get; set; }

    [BindProperty]
    public GalleryImageCreateViewModel ViewModel { get; set; }

    private readonly IGalleryImageAdminAppService _imageGalleryAppService;

        public CreateModalModel(IGalleryImageAdminAppService imageGalleryAppService)
        {
            _imageGalleryAppService = imageGalleryAppService;
        }

        public void OnGet()
        {
        }

        public async Task OnPostAsync()
        {
        var dto = ObjectMapper.Map<GalleryImageCreateViewModel, GalleryImageCreateUpdateDto>(ViewModel);
        await _imageGalleryAppService.CreateAsync(dto);
        }

    [AutoMap(typeof(GalleryImageCreateUpdateDto), ReverseMap = true)]
    public class GalleryImageCreateViewModel : ExtensibleObject
    {
        [Required(ErrorMessage ="توضیحات اجباری است")]
       [DynamicMaxLength(typeof(GalleryImageConsts), nameof(GalleryImageConsts.MaxDescriptionLength))]
        public string Description { get; set; }

        [HiddenInput]
        public Guid CoverImageMediaId { get; set; }

       }
}

