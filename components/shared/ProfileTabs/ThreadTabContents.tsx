import ThreadCard, { CommonAuthorItem } from '@/components/card/ThreadCard';
import { getCommunityThreadsAndPostsById } from '@/lib/actions/community.actions';
import { getThreadsByUserId } from '@/lib/actions/user.actions';
import { redirect } from 'next/navigation';

type ThreadTabContentsProps = {
  sessionUserId: string;
  accountTypeId: string;
  accountType: 'user' | 'community'; // TODO: Will add another enum later on
};

const ThreadTabContents = async ({
  sessionUserId,
  accountTypeId,
  accountType,
}: ThreadTabContentsProps) => {
  let threadDataResults: any;

  if (accountType === 'user') {
    threadDataResults = await getThreadsByUserId(accountTypeId || '');
  } else {
    threadDataResults = await getCommunityThreadsAndPostsById(
      accountTypeId || ''
    );
  }

  if (!threadDataResults) {
    redirect('/');
  }

  const { threads: profileThreadsData } = threadDataResults;

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
                id: threadDataResults?.id || '',
                name: threadDataResults?.name || '',
                image: threadDataResults?.image || '',
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
