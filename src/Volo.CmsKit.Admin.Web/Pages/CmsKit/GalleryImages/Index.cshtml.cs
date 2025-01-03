using Volo.CmsKit.Permissions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Volo.CmsKit.Admin.Web.Pages;

namespace Volo.CmsKit.Admin.Web.Pages.CmsKit.GalleryImages;

[Authorize(CmsKitAdminPermissions.GalleryImages.Default)]
public class IndexModel : CmsKitAdminPageModel
    {
        public void OnGet()
        {
        }
    }

