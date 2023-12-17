'use client';

import Image from 'next/image';

type ProfileHeaderProps = {
  sessionUserId: string;
  accountProfileId: string; // Can be same as sessionUserId (open user's own profile) or different (open others profile)
  nameProfile: string;
  usernameProfile: string;
  imgUrlProfile: string;
  bioProfile: string;
  type?: 'User' | 'Community'
};

const ProfileHeader = ({
  sessionUserId,
  accountProfileId,
  nameProfile,
  usernameProfile,
  imgUrlProfile,
  bioProfile,
  type
}: ProfileHeaderProps) => {
  return (
    <div className="flex w-full flex-col justify-start">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative w-20 h-20 object-cover flex-shrink-0">
            <Image
              src={imgUrlProfile || '/'}
              alt="Profile Image"
              fill
              className="rounded-full object-cover shadow-2xl"
            />
          </div>

          <div className="flex-1 flex flex-col gap-1">
            <h2 className="text-left text-heading3-bold text-light-1">
              {nameProfile || ''}
            </h2>
            <p className="text-base-medium text-gray-1">
              @{usernameProfile || ''}
            </p>
          </div>
        </div>
        //TODO: Community
      </div>

      <p className="mt-6 max-w-lg text-light-2 text-base-regular">
        {bioProfile}
      </p>

      <div className="mt-12 h-0.5 w-full bg-dark-3" />
    </div>
  );
};

export default ProfileHeader;
