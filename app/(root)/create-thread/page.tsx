import PostThread from '@/components/forms/PostThread';
import { getUserData } from '@/lib/actions/user.actions';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

const CreateThread = async () => {
  const userSessionData = await currentUser();

  // Redirect to sign-in page if session user is not found
  if (!userSessionData) redirect('/sign-in');

  const userDataFromDB = await getUserData(userSessionData.id);

  // Redirect to onboarding page if onboarded is false
  if (!!userDataFromDB && userDataFromDB.onboarded === false)
    redirect('/onboarding');

  return (
    <>
      <h1 className="head-text">Create Thread</h1>
      <PostThread userId={userDataFromDB._id} />
    </>
  );
};

export default CreateThread;
