import AccountProfile from '@/components/forms/AccountProfile';
import { UserData, UserInfo } from '@/types/userDataTypes';
import { currentUser } from '@clerk/nextjs';

const Page = async () => {
  /*
    Get Logged In User Information
    TODO: Can be updated later for the types after API integration (Currently using dummy types)  
  */
  const user = await currentUser();
  const userInfo: Partial<UserInfo> = {};
  const userData: UserData = {
    id: user?.id || '',
    objectId: userInfo?._id || '',
    username: userInfo?.username || user?.username || '',
    name: userInfo?.name || user?.firstName || '',
    bio: userInfo?.bio || '',
    image: userInfo?.image || user?.imageUrl || '/',
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
