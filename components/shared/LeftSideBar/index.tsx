'use client';

import { sidebarLinks } from '@/constants';
import { SignOutButton, SignedIn } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const LeftSideBar = () => {
  const pathName = usePathname();
  const router = useRouter();

  return (
    <section className="custom-scrollbar leftsidebar">
      <div className="flex flex-col w-full flex-1 gap-6 px-6">
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
              className={`leftsidebar_link ${
                isActiveLink ? 'bg-primary-500' : ''
              }`}
            >
              <Image
                src={imgURL || '/'}
                alt={label || ''}
                width={24}
                height={24}
              />

              <p className="text-light-1 max-lg:hidden">{label || ''}</p>
            </Link>
          );
        })}
      </div>

      <div className="mt-10 px-6">
        <SignedIn>
          <SignOutButton
            signOutCallback={() => {
              router.push('/sign-in');
            }}
          >
            <div className="flex cursor-pointer gap-4 p-4">
              <Image
                src={'/assets/logout.svg'}
                alt="Logout Icon"
                width={24}
                height={24}
              />

              <p className="text-light-2 max-lg:hidden">Logout</p>
            </div>
          </SignOutButton>
        </SignedIn>
      </div>
    </section>
  );
};

export default LeftSideBar;
