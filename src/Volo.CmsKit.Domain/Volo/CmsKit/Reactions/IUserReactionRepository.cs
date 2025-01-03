using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using JetBrains.Annotations;
using Volo.Abp.Domain.Repositories;

namespace Volo.CmsKit.Reactions;

public interface IUserReactionRepository : IBasicRepository<UserReaction, Guid>
{
    Task<UserReaction> FindAsync(
        Guid userId,
        [NotNull] string entityType,
        [NotNull] string entityId,
        [NotNull] string reactionName,
        CancellationToken cancellationToken = default
    );

    Task<List<UserReaction>> GetListForUserAsync(
        Guid userId,
        [NotNull] string entityType,
        [NotNull] string entityId,
        CancellationToken cancellationToken = default
    );

    Task<List<ReactionSummaryQueryResultItem>> GetSummariesAsync(
        [NotNull] string entityType,
        [NotNull] string entityId,
        CancellationToken cancellationToken = default
    );
    /// <summary>
    /// Added By Poolaei @1402/11/27
    /// </summary>
    /// <param name="entityId"></param>
    /// <param name="entityType"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<long> GetCountAsync(
     string entityId = null,
      string entityType = null,
      CancellationToken cancellationToken = default
  );
}
