using System.Collections.Generic;
using System.Threading.Tasks;
using Volo.Abp.Caching;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Domain.Entities.Events;
using Volo.Abp.EventBus;
using Volo.CmsKit.Contents;

namespace Volo.CmsKit.ContentBoxes;

public class ContentBoxChangedHandler :
  ILocalEventHandler<EntityUpdatedEventData<ContentBox>>,
  ILocalEventHandler<EntityDeletedEventData<ContentBox>>,
  ILocalEventHandler<EntityCreatedEventData<ContentBox>>,
  ITransientDependency
{
    protected IDistributedCache<List<ContentBoxCommonDto>> DistributedCache { get; }

    public ContentBoxChangedHandler(IDistributedCache<List<ContentBoxCommonDto>> distributedCache)
    {
        DistributedCache = distributedCache;
    }

    public Task HandleEventAsync(EntityUpdatedEventData<ContentBox> eventData)
    {
        return DistributedCache.RemoveAsync(ContentBoxApplicationConsts.ContentBoxCacheKey);
    }

    public Task HandleEventAsync(EntityDeletedEventData<ContentBox> eventData)
    {
        return DistributedCache.RemoveAsync(ContentBoxApplicationConsts.ContentBoxCacheKey);
    }

    public Task HandleEventAsync(EntityCreatedEventData<ContentBox> eventData)
    {
        return DistributedCache.RemoveAsync(ContentBoxApplicationConsts.ContentBoxCacheKey);
    }
}
