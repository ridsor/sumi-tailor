"use client";

import Aside from "@/components/layouts/UserLayout/Aside";
import { UserType } from "@/types/user";
import { signOut } from "next-auth/react";
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
  auth,
}: {
  children: React.ReactNode;
  auth?: UserType;
}) {
  const pathname = usePathname();

  const [isSidebar, setSidebar] = useState<boolean>(false);

  useEffect(() => {
    if (window.innerWidth >= 640) {
      setSidebar(true);
    }
  }, []);

  useEffect(() => {
    if (!auth) signOut();
  }, [auth]);

  return enableNavbar.includes(pathname) ? (
    <>
      <main
        className={`${
          isSidebar ? "md:left-[250px] md:w-[calc(100%-250px)]" : ""
        } left-[60px] w-[calc(100%-60px)] relative bg-three min-h-screen h-fit`}>
        {children}
      </main>
      {enableNavbar.includes(pathname) && (
        <Aside isSidebar={isSidebar} setSidebar={setSidebar} auth={auth} />
      )}
    </>
  ) : (
    children
  );
}
