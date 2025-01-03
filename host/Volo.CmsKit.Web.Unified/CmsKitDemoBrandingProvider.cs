using Microsoft.Extensions.Localization;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Ui.Branding;
using Volo.CmsKit.Localization;

namespace Volo.CmsKit;

[Dependency(ReplaceServices = true)]
public class CmsKitAvreenBrandingProvider : DefaultBrandingProvider
{
    private IStringLocalizer<CmsKitResource> _localizer;
    public CmsKitAvreenBrandingProvider(IStringLocalizer<CmsKitResource> localizer)
    {
        _localizer = localizer;
    }

    public override string AppName => _localizer["AppName"];
    public override string? LogoUrl => "/images/logo/lepton/logo-light.png";
    public override string? LogoReverseUrl => "/images/logo/lepton/logo-dark.png";
}
