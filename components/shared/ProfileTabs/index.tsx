'use server';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Image from 'next/image';
import { profileTabs } from '@/constants';
import ThreadTabContents from './ThreadTabContents';

type ProfileTabsProps = {
  totalThreadsAmount: number;
  sessionUserId: string;
  profileUserId: string;
};

const ProfileTabs = ({
  totalThreadsAmount,
  sessionUserId,
  profileUserId,
}: ProfileTabsProps) => {
  return (
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
                  {totalThreadsAmount}
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

        return (
          <TabsContent
            key={`content-${profileTabLabel}`}
            value={profileTabValue}
            className="w-full text-light-1"
          >
            <ThreadTabContents
              sessionUserId={sessionUserId}
              profileUserId={profileUserId}
              accountType="user"
            />
          </TabsContent>
        );
      })}
    </Tabs>
  );
};

export default ProfileTabs;
