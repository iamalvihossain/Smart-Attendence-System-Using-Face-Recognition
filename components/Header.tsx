"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
// import { useClerk } from "@clerk/nextjs";

const Header = () => {
  // const { signOut } = useClerk();
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSignOut = async () => {
    setLoading(true);
    router.push("/sign-in");
    setLoading(false);
  };

  return (
    <header className="hidden items-center justify-between gap-5 p-5 sm:flex lg:py-7 xl:gap-10 lg:justify-end !important">
      <div className="header-wrapper">
        <Button
          type="button"
          className="sign-out-button"
          onClick={handleSignOut}
        >
          {loading ? (
            <Image
              src={"/assets/icons/loader-brand.svg"}
              alt="logo"
              width={24}
              height={24}
              className="w-6"
            />
          ) : (
            <Image
              src={"/assets/icons/logout.svg"}
              alt="logo"
              width={24}
              height={24}
              className="w-6"
            />
          )}
        </Button>
      </div>
    </header>
  );
};

export default Header;
