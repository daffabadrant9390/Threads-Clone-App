'use client';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

type SearchUserCardProps = {
  searchedUserId: string;
  username: string;
  name: string;
  profileImgUrl: string;
  personType: 'User' | 'Community';
};

const SearchUserCard = ({
  searchedUserId,
  username,
  name,
  profileImgUrl,
  personType,
}: SearchUserCardProps) => {
  const router = useRouter();

  const handleClickViewButton = () => {
    router.push(`profile/${searchedUserId}`);
  };

  return (
    <article className="user-card">
      <div className="user-card_avatar">
        <div className="relative w-12 h-12 flex-shrink-0 object-cover">
          <Image
            src={profileImgUrl || '/'}
            alt="user-photo-profile"
            fill
            className="rounded-full"
          />
        </div>

        <div className="flex-1 text-ellipsis flex flex-col gap-1">
          <h4 className="text-base-semibold text-light-1">{name}</h4>
          <p className="text-small-medium text-gray-1">@{username}</p>
        </div>
      </div>

      <Button onClick={handleClickViewButton} className="user-card_btn">
        view
      </Button>
    </article>
  );
};

export default SearchUserCard;
