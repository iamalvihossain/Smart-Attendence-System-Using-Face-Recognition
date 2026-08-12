"use client";

import { navItems } from "@/constants";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const Sidebar = () => {
  // const { isSignedIn, user, isLoaded } = useUser();

  const pathname = usePathname();
  return (
    <aside className="sidebar">
      <Link href={"/"}>
        <div className="flex items-center justify-center">
          <Image
            src={"/assets/icons/logo-brand.png"}
            alt="logo"
            width={62}
            height={52}
            className="hidden h-auto lg:block"
          />
          <h1 className="hidden lg:block text-2xl font-bold ml-2">
            Smart Attendance
          </h1>

          <Image
            src={"/assets/icons/logo-brand.png"}
            alt="logo"
            width={52}
            height={52}
            className="lg:hidden"
          />
        </div>
      </Link>

      <nav className="sidebar-nav">
        <ul className="flex flex-1 flex-col gap-6">
          {navItems.map(({ url, name, icon }) => {
            // const active = pathname === url;

            return (
              <Link href={url} key={name} className="lg:w-full">
                <li
                  className={cn(
                    "sidebar-nav-item",
                    pathname === url && "shad-active"
                  )}
                >
                  <Image
                    src={icon}
                    alt={name}
                    width={24}
                    height={24}
                    className={cn(
                      "nav-icon",
                      pathname === url && "nav-icon-active"
                    )}
                  />
                  <p className="hidden lg:block">{name}</p>
                </li>
              </Link>
            );
          })}
        </ul>
      </nav>

      {/* <Image
        src={"/assets/images/files-2.png"}
        alt="logo"
        width={506}
        height={418}
        className="w-full"
      /> */}

      {/* <UserButton /> 
      <div className="sidebar-user-info">
        <div className="hidden lg:block">
          <p className="subtitle-2 capitalize">{user?.fullName}</p>
          <p className="caption">{user?.primaryEmailAddress?.emailAddress}</p>
        </div>
      </div>
          */}
    </aside>
  );
};

export default Sidebar;
