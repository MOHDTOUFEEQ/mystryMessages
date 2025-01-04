"use client";
import React, { useState } from "react";
import { HoveredLink, Menu, MenuItem } from "./ui/navbar-menu";
import { useSession, signOut } from "next-auth/react";
import { cn } from "../lib/utils";
import { useRouter } from "next/navigation";

function Navbarr({ className, session }) {
  const [active, setActive] = useState(null);

  const router = useRouter(); // Initialize the router
  const handleSignOut = () => {
    signOut({ redirect: true, callbackUrl: "/sign-in" });
    router.push("/sign-in");
  };

  return (
    <div className={cn("fixed top-10 inset-x-0 max-w-2xl mx-auto z-50 dark", className)}>
      <Menu setActive={setActive}>
        <MenuItem setActive={setActive} active={active} item="Home">
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="/home">Home</HoveredLink>
          </div>
        </MenuItem>
        {session?.user ?

          <MenuItem setActive={setActive} active={active} item="dashboard">
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="/dashboard">dashboard</HoveredLink>
          </div>
        </MenuItem>: null
        }

        {/* Conditional rendering based on session */}
        {session?.user ? (
          <MenuItem setActive={setActive} active={active} item="Logout">
            <div className="flex flex-col space-y-4 text-sm">
              <button
                onClick={handleSignOut} // Non-async function to avoid async/await in Client Components
                className="bg-red-600 hover:bg-red-700 px-4 py-2 text-sm rounded-md transition-all duration-300"
              >
                Logout
              </button>
            </div>
          </MenuItem>
        ) : (
          <>
            <MenuItem setActive={setActive} active={active}  item="Login">
              <HoveredLink href="/sign-in">Login</HoveredLink>
            </MenuItem>
            <MenuItem setActive={setActive} active={active} item="Sign Up">
              <HoveredLink href="/sign-up">Sign Up</HoveredLink>
            </MenuItem>
          </>
        )}
      </Menu>
    </div>
  );
}

function Navbar() {
  const { data: session } = useSession();
  return (
    <>
      <Navbarr session={session} />
    </>
  );
}

export default Navbar;
