"use client";

import Aside from "@/components/layouts/UserLayout/Aside";
import { UserType } from "@/types/user";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const enableNavbar = [
  "/dashboard",
  "/profile",
  "/accounts",
  "/orders",
  "/orders/history",
];

export default function Auth({
  children,
  user,
}: {
  children: React.ReactNode;
  user: UserType;
}) {
  const pathname = usePathname();

  const [isSidebar, setSidebar] = useState<boolean>(false);

  useEffect(() => {
    if (window.innerWidth >= 640) {
      setSidebar(true);
    }
  }, []);

  return enableNavbar.includes(pathname) ? (
    <>
      <main
        className={`${
          isSidebar ? "md:left-[250px] md:w-[calc(100%-250px)]" : ""
        } left-[60px] w-[calc(100%-60px)] relative bg-three min-h-screen h-fit`}>
        {children}
      </main>
      {enableNavbar.includes(pathname) && (
        <Aside isSidebar={isSidebar} setSidebar={setSidebar} user={user} />
      )}
    </>
  ) : (
    children
  );
}