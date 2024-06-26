"use client";

import { ReactNode, useEffect } from "react";

type Props = {
  children: ReactNode;
  active: boolean;
  openclose: () => void;
  bg?: string;
  size?: number;
};

export default function Modal({
  children,
  active,
  openclose,
  bg,
  size = 800,
}: Props) {
  useEffect(() => {
    if (active) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [active]);

  return (
    <div
      className={`${
        active ? "opacity-100" : "opacity-0 pointer-events-none"
      } transition-all fixed bg-[rgba(0,0,0,.5)] top-0 bottom-0 right-0 left-0 z-50`}>
      <div
        className="absolute top-0 left-0 right-0 bottom-0 z-10"
        onClick={() => openclose()}></div>
      <div className="w-full h-full overflow-auto py-5">
        <div
          className={`mx-auto w-full flex items-center min-h-full`}
          style={{ maxWidth: size }}>
          <div
            className={`w-full rounded-md min-h-fit shadow-md relative z-20 ${
              !bg ? "bg-white" : ""
            }`}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
