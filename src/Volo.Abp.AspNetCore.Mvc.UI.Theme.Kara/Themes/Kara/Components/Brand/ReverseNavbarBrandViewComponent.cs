﻿using Microsoft.AspNetCore.Mvc;

namespace Volo.Abp.AspNetCore.Mvc.UI.Theme.Kara.Themes.Kara.Components.Brand;

public class ReverseNavbarBrandViewComponent : AbpViewComponent
{
    public virtual IViewComponentResult Invoke()
    {
        return View("~/Themes/Kara/Components/Brand/Reverse.cshtml");
    }
}