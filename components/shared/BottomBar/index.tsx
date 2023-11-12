'use client';

import { sidebarLinks } from '@/constants';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

const BottomBar = () => {
  const pathName = usePathname();

  return (
    <section className="bottombar">
      <div className="bottombar_container">
        {(sidebarLinks || []).map((sidebarLink) => {
          const { imgURL, label, route } = sidebarLink || {};

          // Check isActive Navigation Link
          const isActiveLink =
            (pathName.includes(route || '') && (route || '').length > 1) ||
            pathName === (route || '');

          return (
            <Link
              href={route || '/'}
              key={label || ''}
              className={`bottombar_link ${
                isActiveLink ? 'bg-primary-500' : ''
              }`}
            >
              <Image
                src={imgURL || '/'}
                alt={label || ''}
                width={24}
                height={24}
              />

              <p className="text-subtle-medium text-light-1 max-sm:hidden">
                {/* Only show the first word if have more than 1 words */}
                {(label || '').split(/\s+/)[0]}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default BottomBar;
