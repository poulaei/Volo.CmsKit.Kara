using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MongoDB.Driver;
using MongoDB.Driver.Linq;
using Volo.Abp;
using Volo.Abp.Domain.Repositories.MongoDB;
using Volo.Abp.MongoDB;
using Volo.CmsKit.Reactions;
using Volo.CmsKit.Users;

namespace Volo.CmsKit.MongoDB.Reactions;

public class MongoUserReactionRepository : MongoDbRepository<ICmsKitMongoDbContext, UserReaction, Guid>, IUserReactionRepository
{
    public MongoUserReactionRepository(IMongoDbContextProvider<ICmsKitMongoDbContext> dbContextProvider) : base(dbContextProvider)
    {
    }

    public virtual async Task<UserReaction> FindAsync(
        Guid userId,
        string entityType,
        string entityId,
        string reactionName,
        CancellationToken cancellationToken = default)
    {
        Check.NotNullOrWhiteSpace(entityType, nameof(entityType));
        Check.NotNullOrWhiteSpace(entityId, nameof(entityId));
        Check.NotNullOrWhiteSpace(reactionName, nameof(reactionName));

        return await (await GetMongoQueryableAsync(cancellationToken))
            .Where(x =>
                x.CreatorId == userId &&
                x.EntityType == entityType &&
                x.EntityId == entityId &&
                x.ReactionName == reactionName)
            .FirstOrDefaultAsync(GetCancellationToken(cancellationToken));
    }

    public virtual async Task<List<UserReaction>> GetListForUserAsync(
        Guid userId,
        string entityType,
        string entityId,
        CancellationToken cancellationToken = default)
    {
        Check.NotNullOrWhiteSpace(entityType, nameof(entityType));
        Check.NotNullOrWhiteSpace(entityId, nameof(entityId));

        return await (await GetMongoQueryableAsync(cancellationToken))
            .Where(x =>
                x.CreatorId == userId &&
                x.EntityType == entityType &&
                x.EntityId == entityId)
            .ToListAsync(GetCancellationToken(cancellationToken));
    }

    public virtual async Task<List<ReactionSummaryQueryResultItem>> GetSummariesAsync(
        string entityType,
        string entityId,
        CancellationToken cancellationToken = default)
    {
        Check.NotNullOrWhiteSpace(entityType, nameof(entityType));
        Check.NotNullOrWhiteSpace(entityId, nameof(entityId));

        return await (await GetMongoQueryableAsync(cancellationToken))
            .Where(x =>
                x.EntityType == entityType &&
                x.EntityId == entityId)
            .GroupBy(x => x.ReactionName)
            .Select(g => new ReactionSummaryQueryResultItem
            {
                ReactionName = g.Key,
                Count = g.Count()
            })
            .ToListAsync(GetCancellationToken(cancellationToken));
    }
    /// <summary>
    /// Added By Poolaei @1402/11/27
    /// </summary>
    /// <param name="entityId"></param>
    /// <param name="entityType"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    public virtual async Task<long> GetCountAsync(
      string entityId = null,
       string entityType = null,
       CancellationToken cancellationToken = default
   )
    {
        var token = GetCancellationToken(cancellationToken);
        var query = await GetListQueryAsync(
            entityId,
            entityType,
            token);

       // return await query.LongCountAsync(token);
        return await query.As<IMongoQueryable<UserReaction>>()
           .LongCountAsync(GetCancellationToken(cancellationToken));
    }
    /// <summary>
    /// Added By Poolaei @1402/11/27
    /// </summary>
    /// <param name="entityId"></param>
    /// <param name="entityType"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    protected virtual async Task<IQueryable<ReactionWithUserQueryResultItem>> GetListQueryAsync(

       string entityId = null,
       string entityType = null,
       CancellationToken cancellationToken = default
   )
    {
        var userReactionDbSet = await GetMongoQueryableAsync(cancellationToken);
        var cmsUserSet = await GetMongoQueryableAsync<CmsUser>(cancellationToken);
       
        var query = from userReaction in userReactionDbSet
                    join user in cmsUserSet
                        on userReaction.CreatorId equals user.Id
                    select new ReactionWithUserQueryResultItem
                    {
                        Reaction = userReaction,
                        User = user
                    };

        return query.WhereIf(!entityId.IsNullOrWhiteSpace(), c => c.Reaction.EntityId == entityId)
            .WhereIf(!entityType.IsNullOrWhiteSpace(), c => c.Reaction.EntityType.Contains(entityType));

    }
}
