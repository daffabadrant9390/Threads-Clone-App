import { fetchThreads } from '@/lib/actions/thread.actions';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
const Home = async () => {
  const { threadsDataPerPage, isHavingNextPage } = await fetchThreads({
    pageNumber: 1,
    pageSize: 30,
  });
  const userSessionData = await currentUser();

  if (!userSessionData) redirect('/sign-in');

  return (
    <>
      <h1 className="head-text text-left">Home</h1>

      <section className="mt-9 flex flex-col gap-10">
        {!(threadsDataPerPage || []).length ? (
          <p className="no-result">No threads found</p>
        ) : (
          <>
            {threadsDataPerPage.map((threadData) => {
              const {
                _id,
                parentId,
                text,
                author,
                community,
                createdAt,
                children,
              } = threadData || {};

              return (
                <div className="flex flex-col gap-4 bg-dark-4 p-4 rounded-md">
                  <p className="text-light-2">{author.name || ''}</p>
                  <p className="text-light-2">{text || ''}</p>
                </div>
              );
            })}
          </>
        )}
      </section>
    </>
  );
};

export default Home;
