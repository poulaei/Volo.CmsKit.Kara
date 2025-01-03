using System.Threading.Tasks;

namespace Volo.CmsKit.Data
{
    public interface ICmsDbSchemaMigrator
    {
        Task MigrateAsync();
    }
}

