import CommunityCard from '@/components/card/CommunityCard';
import SearchUserCard from '@/components/card/SearchUserCard';
import { getCommunitiesByQuery } from '@/lib/actions/community.actions';
import { getUserData, getUsersDataByQuery } from '@/lib/actions/user.actions';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

const SearchPage = async () => {
  const sessionUser = await currentUser();
  if (!sessionUser) redirect('/sign-in');

  const userInfo = await getUserData(sessionUser.id || '');
  if (!userInfo?.onboarded) redirect('/onboarding');

  // Fetch the users data which will be shown on the UI
  const { communities, isNextPageAvailable } = await getCommunitiesByQuery({
    searchString: '',
    pageNumber: 1,
    pageSize: 25,
  });

  return (
    <section>
      <h2 className="head-text mb-10">Communities</h2>

      {/* Search Bar */}

      <div className="mt-14 flex flex-col gap-9">
        {!!Array.isArray(communities) && !!communities.length ? (
          <div className="grid grid-cols-1 2xl:grid-cols-2 gap-6 lg:gap-4">
            {communities.map((community) => {
              return (
                <CommunityCard
                  id={community.id}
                  bio={community.bio || ''}
                  imgUrl={community.image || '/'}
                  name={community.name || ''}
                  username={community.username || ''}
                  members={community.members || []}
                />
              );
            })}
          </div>
        ) : (
          <p className="no-result">No community found</p>
        )}
      </div>
    </section>
  );
};

export default SearchPage;
