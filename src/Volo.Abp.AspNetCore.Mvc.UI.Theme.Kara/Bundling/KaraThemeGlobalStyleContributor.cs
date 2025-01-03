using Volo.Abp.AspNetCore.Mvc.UI.Bundling;

namespace Volo.Abp.AspNetCore.Mvc.UI.Theme.Kara.Bundling;

public class KaraThemeGlobalStyleContributor : BundleContributor
{
    public override void ConfigureBundle(BundleConfigurationContext context)
    {
       context.Files.Add("/themes/basic/layout.css");

        //context.Files.Add("/themes/kara/css/bootstrap.min.css");
        context.Files.Add("/themes/kara/fonts/bootstrap-icons/font-css.css");
        context.Files.Add("/themes/kara/css/animate.min.css");
        context.Files.Add("/themes/kara/css/swiper.bundle.min.css");
        context.Files.Add("/themes/kara/css/slick.css");
        context.Files.Add("/themes/kara/css/all.min.css");
        context.Files.Add("/themes/kara/css/nice-select.css");
        context.Files.Add("/themes/kara/css/magnific-popup.css");
        context.Files.Add("/themes/kara/css/metisMenu.css");
        context.Files.Add("/themes/kara/css/aos.css");
        context.Files.Add("/themes/kara/css/spacing.css");
        context.Files.Add("/themes/kara/css/main.css");
    }
}
