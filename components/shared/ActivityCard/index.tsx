'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

type ActivityCardProps = {
  parentThreadId: string;
  authorImage: string;
  authorMongoId: string;
  authorName: string;
};

const ActivityCard = ({
  parentThreadId,
  authorImage,
  authorMongoId,
  authorName,
}: ActivityCardProps) => {
  const router = useRouter();

  const handleClickActivity = (parentThreadId: string) => {
    if (!parentThreadId) return null;

    router.push(`/thread/${parentThreadId}`);
  };

  return (
    <article
      className="activity-card cursor-pointer"
      onClick={() => handleClickActivity(parentThreadId)}
    >
      <div className="relative w-8 h-8 flex-shrink-0 object-cover">
        <Image
          src={authorImage || '/'}
          alt={`profile-image-${authorMongoId || ''}`}
          fill
          className="rounded-full"
        />
      </div>
      <p className="!text-small-regular text-light-1">
        <span className="text-primary-500">{authorName || ''}</span> replied to
        your thread
      </p>
    </article>
  );
};

export default ActivityCard;
