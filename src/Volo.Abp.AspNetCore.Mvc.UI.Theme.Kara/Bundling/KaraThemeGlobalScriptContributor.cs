using System.Collections.Generic;
using Volo.Abp.AspNetCore.Mvc.UI.Bundling;

namespace Volo.Abp.AspNetCore.Mvc.UI.Theme.Kara.Bundling;

public class KaraThemeGlobalScriptContributor : BundleContributor
{
    public override void ConfigureBundle(BundleConfigurationContext context)
    {
        context.Files.Add("/themes/basic/layout.js");

        // context.Files.AddIfNotContains("/themes/kara/js/vendor/jquery.min.js");

        //context.Files.Add("/themes/kara/js/vendor/kara.min.js");
        context.Files.Add("/themes/kara/js/vendor/popper.min.js");
        //context.Files.Add("/themes/kara/js/vendor/bootstrap.min.js");
        context.Files.Add("/themes/kara/js/jquery.meanmenu.js");
        context.Files.Add("/themes/kara/js/swiper.bundle.min.js");
        context.Files.Add("/themes/kara/js/slick.min.js");
        context.Files.Add("/themes/kara/js/jquery.easypiechart.min.js");
        context.Files.Add("/themes/kara/js/jquery.counterup.min.js");
        context.Files.Add("/themes/kara/js/jquery.magnific.popup.min.js");
        context.Files.Add("/themes/kara/js/metisMenu.min.js");
        context.Files.Add("/themes/kara/js/wow.min.js");
        context.Files.Add("/themes/kara/js/jquery.waypoints.min.js");
        context.Files.Add("/themes/kara/js/aos.js");
        context.Files.Add("/themes/kara/js/jquery.nice.select.min.js");
        context.Files.Add("/themes/kara/js/jquery-ui.js");
        context.Files.Add("/themes/kara/js/jquery.scrollUp.min.js");
        context.Files.Add("/themes/kara/js/plugins.js");
        context.Files.Add("/themes/kara/js/main.js");


    }
}
