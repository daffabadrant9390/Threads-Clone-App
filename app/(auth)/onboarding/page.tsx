import AccountProfile from '@/components/forms/AccountProfile';
import { getUserData } from '@/lib/actions/user.actions';
import { UserData, UserInfo } from '@/types/userDataTypes';
import { currentUser } from '@clerk/nextjs';

const Page = async () => {
  /*
    Get Logged In User Information
    TODO: Can be updated later for the types after API integration (Currently using dummy types)  
  */
  const user = await currentUser();
  // Get data from mongodb Database with the specific ID.
  const userDataFromDB: Partial<UserInfo> = await getUserData(user?.id || '');

  // const userInfo: Partial<UserInfo> = {};

  /*
    - For userData, grab the data from database and check if the user is found or not
    - If the user found, set the userData with data which found inside the database
    - If not found, set the userData from session login (clerk currentUser())
  */
  const userData: UserData = {
    id: user?.id || '',
    objectId: userDataFromDB?._id || '',
    username: userDataFromDB?.username || user?.username || '',
    name: userDataFromDB?.name || user?.firstName || '',
    bio: userDataFromDB?.bio || '',
    image: userDataFromDB?.image || user?.imageUrl || '/',
  };

  return (
    <main className="mx-auto flex flex-col justify-start max-w-3xl px-10 py-20">
      <h1 className={'head-text'}>On Boarding</h1>
      <p className="mt-3 text-base-regular text-light-2">
        Complete your profile now to use Threads
      </p>

      <section className="mt-9 bg-dark-2 p-10">
        <AccountProfile userData={userData} btnTitle={'Continue'} />
      </section>
    </main>
  );
};

export default Page;
