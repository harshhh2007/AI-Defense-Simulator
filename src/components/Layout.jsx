import { useState } from "react";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function Layout({
  children,
}) {
  const [mobileOpen, setMobileOpen] =
    useState(false);

  return (
    <div className="min-h-screen">
      <Sidebar
        mobileOpen={mobileOpen}
        onClose={() =>
          setMobileOpen(false)
        }
      />

      <Navbar
        onMenu={() =>
          setMobileOpen(true)
        }
      />

      <main
        className="
          lg:ml-[294px]
          px-4
          lg:px-6
          pb-10
        "
      >
        <div className="max-w-[1500px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}