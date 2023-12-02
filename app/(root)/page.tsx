import ThreadCard from '@/components/card/ThreadCard';
import { getThreads } from '@/lib/actions/thread.actions';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
const Home = async () => {
  const { threadsDataPerPage, isHavingNextPage } = await getThreads({
    pageNumber: 1,
    pageSize: 30,
  });
  const userSessionData = await currentUser();

  if (!userSessionData) redirect('/sign-in');

  return (
    <>
      <h1 className="head-text text-left">Home</h1>

      <section className="flex flex-col mt-9 gap-10">
        {!!(threadsDataPerPage || []).length ? (
          <>
            {threadsDataPerPage.map((threadData) => {
              const {
                _id: threadId,
                parentThreadId,
                text: threadContentText,
                author,
                community,
                createdAt,
                childrenThreads,
              } = threadData || {};

              return (
                <ThreadCard
                  key={threadId}
                  currentUserId={userSessionData.id || ''}
                  id={threadId}
                  parentId={parentThreadId}
                  content={threadContentText || ''}
                  author={author}
                  community={community}
                  createdAt={createdAt}
                  comments={childrenThreads}
                />
              );
            })}
          </>
        ) : (
          <p className="no-result">No threads found.</p>
        )}
      </section>
    </>
  );
};

export default Home;
