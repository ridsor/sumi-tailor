"use client";

import { UserType } from "@/types/user";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FaBars, FaUser } from "react-icons/fa6";

const Header = ({ auth }: { auth?: UserType }) => {
  const pathname = usePathname();
  const [hamburger, setHamburger] = useState<boolean>(false);

  return (
    <header className="absolute top-0 left-0 right-0 z-50">
      <div className="container px-2 py-4">
        {hamburger && (
          <button
            onClick={() => setHamburger(false)}
            className="hamburger fixed z-40 top-0 bottom-0 right-0 left-0 bg-transparent"></button>
        )}
        <article className="bg-two w-full flex items-center text-white p-2.5 rounded-full lg:justify-between relative">
          <div className="flex items-center order-1 px-2 left gap-x-1">
            <Image
              src="/logo.png"
              alt="logo"
              width={48}
              height={48}
              className="w-10 aspect-square"
            />
            <span className="text-base font-bold">Sumi Tailor</span>
          </div>
          <div className="order-3 center lg:order-2">
            <button
              className="block p-2 mx-2 lg:hidden relative z-50 bg-two"
              onClick={() => setHamburger((prev) => !prev)}>
              <FaBars
                className={`${
                  hamburger ? "fill-gray-400" : "fill-white"
                } transition`}
                size="1.7rem"
              />
            </button>
            <nav
              className={`${
                hamburger
                  ? "opacity-100 pointer-events-auto scale-100 ease-out translate-x-0 translate-y-0"
                  : "pointer-events-none opacity-0 lg:pointer-events-auto lg:opacity-100 lg:scale-100 lg:translate-x-0 lg:translate-y-0 scale-0 ease-in translate-x-1/2 -translate-y-1/2"
              } right-0 transition-all top-[110%] z-50 lg:block lg:static absolute bg-white lg:bg-inherit shadow-md lg:shadow-none p-4 lg:p-0 w-full max-w-[250px] lg:w-auto lg:max-w-none lg:rounded-none rounded-md lg:border-none border`}>
              <ul className="flex gap-x-10 text-[#0f0f0f] lg:text-white flex-col lg:flex-row gap-y-3">
                <li>
                  <Link
                    href="/"
                    className={`after:transition-all after:content-[''] after:block after:h-1 relative after:absolute after:-bottom-1.5 after:bg-four after:rounded-full after:right-1/2 after:translate-x-1/2 ${
                      pathname === "/"
                        ? "after:w-5"
                        : "after:w-0 hover:after:w-5 lg:text-[#cdcdcd] hover:lg:text-white"
                    }`}>
                    Beranda
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className={`after:transition-all after:content-[''] after:block after:h-1 relative after:absolute after:-bottom-1.5 after:bg-four after:rounded-full after:right-1/2 after:translate-x-1/2 ${
                      pathname === "/about"
                        ? "after:w-5"
                        : "after:w-0 hover:after:w-5 lg:text-[#cdcdcd] hover:lg:text-white"
                    }`}>
                    Tentang Kami
                  </Link>
                </li>
                <li>
                  <Link
                    href="/gallery"
                    className={`after:transition-all after:content-[''] after:block after:h-1 relative after:absolute after:-bottom-1.5 after:bg-four after:rounded-full after:right-1/2 after:translate-x-1/2 ${
                      pathname === "/gallery"
                        ? "after:w-5"
                        : "after:w-0 hover:after:w-5 lg:text-[#cdcdcd] hover:lg:text-white"
                    }`}>
                    Galeri
                  </Link>
                </li>
                <li>
                  <Link
                    href="/service"
                    className={`after:transition-all after:content-[''] after:block after:h-1 relative after:absolute after:-bottom-1.5 after:bg-four after:rounded-full after:right-1/2 after:translate-x-1/2 ${
                      pathname === "/service"
                        ? "after:w-5"
                        : "after:w-0 hover:after:w-5 lg:text-[#cdcdcd] hover:lg:text-white"
                    }`}>
                    Layanan
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
          <div className="order-2 ml-auto right lg:order-3 lg:ml-0">
            <Link
              aria-label="Halaman User"
              href={auth ? "/dashboard" : "/login"}
              className="bg-white p-3 rounded-full block active:ring ring-[rgba(255,255,255,.3)]">
              <FaUser className="fill-two" size="1.2rem" />
            </Link>
          </div>
        </article>
      </div>
    </header>
  );
};

export default Header;
