import Image from 'next/image';
import { currentUser } from '@clerk/nextjs';
import { communityTabs } from '@/constants';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import ProfileHeader from '@/components/shared/ProfileHeader';
import { redirect } from 'next/navigation';
import ThreadTabContents from '@/components/shared/ProfileTabs/ThreadTabContents';
import { getCommunityDetailsById } from '@/lib/actions/community.actions';
import SearchUserCard from '@/components/card/SearchUserCard';

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

  const communityDetailsData = await getCommunityDetailsById(paramsId);

  return (
    <section>
      <ProfileHeader
        sessionUserId={sessionUser?.id || ''}
        accountProfileId={communityDetailsData?.id || ''}
        nameProfile={communityDetailsData?.name || ''}
        usernameProfile={communityDetailsData?.username || ''}
        bioProfile={communityDetailsData?.bio || ''}
        imgUrlProfile={communityDetailsData?.image}
        type="Community"
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
            {communityTabs.map((communityTab) => {
              const {
                value: profileTabValue,
                label: profileTabLabel,
                icon: profileTabIcon,
              } = communityTab;

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
                      {(communityDetailsData?.threads || []).length}
                    </p>
                  )}

                  {profileTabLabel === 'Members' && (
                    <p className="ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">
                      {(communityDetailsData?.members || []).length}
                    </p>
                  )}

                  {/* TODO: Next Phase add Requests */}
                  {profileTabLabel === 'Requests' && (
                    <p className="ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">
                      0
                    </p>
                  )}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {/* Tabs Content */}
          {communityTabs.map((communityTab) => {
            const {
              value: communityTabValue,
              label: communityTabLabel,
              icon: communityTabIcon,
            } = communityTab;

            if (communityTabValue === 'threads') {
              return (
                <TabsContent
                  key={`content-${communityTabLabel}`}
                  value={communityTabValue}
                  className="w-full text-light-1"
                >
                  <ThreadTabContents
                    sessionUserId={sessionUser?.id || ''}
                    accountTypeId={communityDetailsData?.id || ''}
                    accountType="community"
                  />
                </TabsContent>
              );
            } else if (communityTabValue === 'members') {
              return (
                <TabsContent
                  key={`content-${communityTabLabel}`}
                  value={communityTabValue}
                  className="w-full text-light-1"
                >
                  <section className="flex flex-col mt-9 gap-10">
                    {!!(communityDetailsData?.members || []).length ? (
                      communityDetailsData.members.map((member: any) => {
                        return (
                          <SearchUserCard
                            key={member.id}
                            searchedUserId={member.id}
                            name={member.name}
                            profileImgUrl={member.image}
                            username={member.username}
                            personType="User"
                          />
                        );
                      })
                    ) : (
                      <p className="!text-small-regular text-gray-1">
                        No Members
                      </p>
                    )}
                  </section>
                </TabsContent>
              );
            } else {
              //TODO: Need to be fixed for requests
              return (
                <TabsContent
                  key={`content-${communityTabLabel}`}
                  value={communityTabValue}
                  className="w-full text-light-1"
                >
                  <p className="!text-small-regular text-gray-1 text-center mt-9">
                    No Requests
                  </p>
                </TabsContent>
              );
            }
          })}
        </Tabs>
      </div>
    </section>
  );
};

export default ProfilePage;
