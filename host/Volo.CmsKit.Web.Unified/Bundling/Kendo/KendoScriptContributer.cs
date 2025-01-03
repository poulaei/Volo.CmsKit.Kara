using System.Collections.Generic;
using Volo.Abp.AspNetCore.Mvc.UI.Bundling;
using Volo.Abp.AspNetCore.Mvc.UI.Packages.JQuery;
using Volo.Abp.Modularity;

namespace Volo.CmsKit.Bundling.Kendo
{
    [DependsOn(
        typeof(JQueryScriptContributor)
        )]
    public class KendoScriptContributor : BundleContributor
    {
        public override void ConfigureBundle(BundleConfigurationContext context)
        {
            context.Files.AddIfNotContains("/libs/kendo111/dist/kendo-bundle.js"); // This is the output of our webpack step
            //context.Files.AddIfNotContains("/libs/kendo/esm/kendo.web.js"); 
        }
    }
}