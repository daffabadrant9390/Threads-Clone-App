import SearchUserCard from '@/components/shared/SearchUserCard';
import { getUserData, getUsersDataByQuery } from '@/lib/actions/user.actions';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

const SearchPage = async () => {
  const sessionUser = await currentUser();
  if (!sessionUser) redirect('/sign-in');

  const userInfo = await getUserData(sessionUser.id || '');
  if (!userInfo?.onboarded) redirect('/onboarding');

  // Fetch the users data which will be shown on the UI
  const usersData = await getUsersDataByQuery({
    userId: sessionUser.id || '',
    searchString: '',
    pageNumber: 1,
    pageSize: 25,
  });

  return (
    <section>
      <h2 className="head-text mb-10">Search</h2>

      {/* Search Bar */}

      <div className="mt-14 flex flex-col gap-9">
        {!!Array.isArray(usersData.users) && !!usersData.users.length ? (
          <>
            {usersData.users.map((person) => {
              return (
                <SearchUserCard
                  key={person?.id || ''}
                  searchedUserId={person?.id || ''}
                  name={person?.name || ''}
                  username={person?.username || ''}
                  profileImgUrl={person?.image}
                  personType="User"
                />
              );
            })}
          </>
        ) : (
          <p className="no-result">No users found</p>
        )}
      </div>
    </section>
  );
};

export default SearchPage;
