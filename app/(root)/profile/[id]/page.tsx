import ProfileHeader from '@/components/shared/ProfileHeader';
import { getUserData } from '@/lib/actions/user.actions';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Image from 'next/image';
import { profileTabs } from '@/constants';
import ThreadTabContents from '@/components/shared/ProfileTabs/ThreadTabContents';

type ProfilePageProps = {
  params: {
    id: string;
  };
};

const ProfilePage = async ({ params }: ProfilePageProps) => {
  const { id: paramsId } = params || {};
  if (!paramsId) return null;

  const sessionUser = await currentUser();
  if (!sessionUser) redirect('/sign-in');

  // Only redirect to onboarding page if this is the user's account, not others.
  const userInfo = await getUserData(paramsId);
  if ((userInfo?.id || '') === (sessionUser?.id || '')) {
    if (!userInfo?.onboarded) {
      redirect('/onboarding');
    }
  }

  return (
    <section>
      <ProfileHeader
        sessionUserId={sessionUser?.id || ''}
        accountProfileId={userInfo?.id || ''}
        nameProfile={userInfo?.name || ''}
        usernameProfile={userInfo?.username || ''}
        bioProfile={userInfo?.bio || ''}
        imgUrlProfile={userInfo?.image}
      />

      <div className="mt-9">
        {/* TODO: Will be figure it out later (need to put ProfileTabs as use server)
        <ProfileTabs
          totalThreadsAmount={(userInfo?.threads || []).length}
          sessionUserId={sessionUser?.id || ''}
          profileUserId={userInfo?.id || ''}
        /> */}
        <Tabs defaultValue="threads" className="w-full">
          <TabsList className="tab">
            {profileTabs.map((profileTab) => {
              const {
                value: profileTabValue,
                label: profileTabLabel,
                icon: profileTabIcon,
              } = profileTab;

              return (
                <TabsTrigger
                  key={profileTabLabel}
                  value={profileTabValue}
                  className="tab"
                >
                  <Image
                    alt={profileTabLabel}
                    src={profileTabIcon || '/'}
                    width={24}
                    height={24}
                    className="object-contain"
                  />

                  <p className="max-sm:hidden">{profileTabLabel}</p>

                  {profileTabLabel === 'Threads' && (
                    <p className="ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">
                      {(userInfo?.threads || []).length}
                    </p>
                  )}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {/* Tabs Content */}
          {profileTabs.map((profileTab) => {
            const {
              value: profileTabValue,
              label: profileTabLabel,
              icon: profileTabIcon,
            } = profileTab;

            //TODO: Need to differentiate the content between replies, threads. Currently all tabs returning threadContent
            return (
              <TabsContent
                key={`content-${profileTabLabel}`}
                value={profileTabValue}
                className="w-full text-light-1"
              >
                <ThreadTabContents
                  sessionUserId={sessionUser?.id || ''}
                  accountTypeId={userInfo?.id || ''}
                  accountType="user"
                />
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </section>
  );
};

export default ProfilePage;
