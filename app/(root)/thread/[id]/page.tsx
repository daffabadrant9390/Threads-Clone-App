import ThreadCard from '@/components/card/ThreadCard';
import CommentForm from '@/components/forms/Comment';
import { getThreadById } from '@/lib/actions/thread.actions';
import { getUserData } from '@/lib/actions/user.actions';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

type ThreadDetailsProps = {
  params: {
    id: string;
  };
};

const ThreadDetails = async ({ params }: ThreadDetailsProps) => {
  const { id: threadId } = params || {};
  if (!(threadId || '')) return null;

  // Check user session
  const sessionUser = await currentUser();
  if (!sessionUser) redirect('/sign-in');

  // Check if the logged user already pass the onboarding page or not
  const userInfo = await getUserData(sessionUser?.id || '');
  if (!userInfo?.onboarded) redirect('/onboarding');

  const threadData = await getThreadById(threadId);
  const {
    _id: threadDataDBId,
    id: threadDataId,
    parentThreadId,
    text: threadDataContentText,
    author: threadDataAuthor,
    community: threadDataCommunity,
    childrenThreads,
    createdAt,
  } = threadData || {};

  return (
    <section className="relative">
      <ThreadCard
        key={threadDataDBId || ''}
        id={threadDataDBId || ''}
        author={threadDataAuthor || {}}
        community={threadDataCommunity}
        content={threadDataContentText || ''}
        createdAt={createdAt}
        parentId={parentThreadId}
        currentUserId={sessionUser?.id || ''}
        comments={childrenThreads || []}
        isComment={false}
      />

      <div className="mt-7">
        <CommentForm
          parentThreadId={threadDataId}
          currentUserImage={userInfo?.image || ''}
          currentUserId={(userInfo?._id || '').toString()}
        />
      </div>

      {!!(childrenThreads || []).length && (
        <div className="mt-10">
          <>
            {childrenThreads.map((childrenThread: any) => {
              const {
                _id: threadDataDBId,
                id: threadDataId,
                parentThreadId,
                text: threadDataContentText,
                author: threadDataAuthor,
                community: threadDataCommunity,
                childrenThreads,
                createdAt,
              } = childrenThread || {};

              return (
                <ThreadCard
                  key={threadDataDBId || ''}
                  id={threadDataDBId || ''}
                  author={threadDataAuthor || {}}
                  community={threadDataCommunity}
                  content={threadDataContentText || ''}
                  createdAt={createdAt}
                  parentId={parentThreadId}
                  currentUserId={sessionUser?.id || ''}
                  comments={childrenThreads || []}
                  isComment={true}
                />
              );
            })}
          </>
        </div>
      )}
    </section>
  );
};

export default ThreadDetails;
