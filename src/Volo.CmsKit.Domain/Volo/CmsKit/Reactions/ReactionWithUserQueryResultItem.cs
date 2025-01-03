using Volo.CmsKit.Users;

namespace Volo.CmsKit.Reactions;
/// <summary>
/// Added By Poolaei @1402/11/27
/// </summary>
public class ReactionWithUserQueryResultItem
{
    public UserReaction  Reaction { get; set; }

    public CmsUser User { get; set; }
}
