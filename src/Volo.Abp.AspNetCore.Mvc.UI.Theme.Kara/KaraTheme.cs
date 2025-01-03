using Volo.Abp.AspNetCore.Mvc.UI.Theming;
using Volo.Abp.DependencyInjection;

namespace Volo.Abp.AspNetCore.Mvc.UI.Theme.Kara;

[ThemeName(Name)]
public class KaraTheme : ITheme, ITransientDependency
{
    public const string Name = "Kara";

    public virtual string GetLayout(string name, bool fallbackToDefault = true)
    {
        switch (name)
        {
            case StandardLayouts.Application:
                return "~/Themes/Kara/Layouts/Application-0.cshtml";
            case StandardLayouts.Account:
                return "~/Themes/Kara/Layouts/Account.cshtml";
            case StandardLayouts.Public:
                return "~/Themes/Kara/Layouts/Public.cshtml";
            case StandardLayouts.Empty:
                return "~/Themes/Kara/Layouts/Empty.cshtml";
            default:
                return fallbackToDefault ? "~/Themes/Kara/Layouts/Application.cshtml" : null;
        }
    }
}
