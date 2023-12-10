import ActivityCard from '@/components/shared/ActivityCard';
import { getUserActivities, getUserData } from '@/lib/actions/user.actions';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

const ActivityPage = async () => {
  const sessionUser = await currentUser();
  if (!sessionUser) redirect('/sign-in');

  const userInfo = await getUserData(sessionUser.id || '');
  if (!userInfo?.onboarded) redirect('/onboarding');

  const activities = await getUserActivities({
    userId: userInfo?._id || '',
  });

  return (
    <>
      <h2 className="head-text mb-10">Activity</h2>
      <section className="flex flex-col gap-5 mt-10">
        {!!(activities || []).length ? (
          <>
            {activities.map((activity) => {
              const {
                author,
                _id: activityMongoId,
                parentThreadId,
              } = activity || {};
              const { _id: authorMongoId, name, image } = author || {};

              return (
                <ActivityCard
                  authorImage={image}
                  authorName={name}
                  authorMongoId={(authorMongoId || '').toString()}
                  parentThreadId={parentThreadId}
                />
              );
            })}
          </>
        ) : (
          <p className="!text-base-regular text-gray-1">No activity found</p>
        )}
      </section>
    </>
  );
};

export default ActivityPage;
