import ThreadCard, { CommonAuthorItem } from '@/components/card/ThreadCard';
import { getThreadsByUserId } from '@/lib/actions/user.actions';

type ThreadTabContentsProps = {
  sessionUserId: string;
  profileUserId: string;
  accountType: 'user'; // TODO: Will add another enum later on
};

const ThreadTabContents = async ({
  sessionUserId,
  profileUserId,
  accountType,
}: ThreadTabContentsProps) => {
  const userProfileData = await getThreadsByUserId(profileUserId || '');
  if (!userProfileData) return null;

  const { threads: profileThreadsData } = userProfileData;

  return (
    <section className="mt-9 flex flex-col gap-10">
      {(profileThreadsData || []).map((thread: any) => {
        const {
          _id,
          id,
          parentThreadId,
          author,
          text,
          community,
          createdAt,
          childrenThreads,
        } = thread || {};

        // Need to modify the author data based on accountType
        const finalAuthorData: CommonAuthorItem =
          accountType === 'user'
            ? {
                id: userProfileData?.id || '',
                name: userProfileData?.name || '',
                image: userProfileData?.image || '',
              }
            : {
                id: author?.id || '',
                name: author?.name || '',
                image: author?.image || '',
              };

        return (
          <ThreadCard
            key={_id || ''}
            id={_id || ''}
            currentUserId={sessionUserId}
            parentId={parentThreadId}
            content={text}
            author={finalAuthorData}
            community={community}
            createdAt={createdAt}
            comments={childrenThreads}
          />
        );
      })}
    </section>
  );
};

export default ThreadTabContents;
