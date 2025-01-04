'use client';
import React, { useEffect, useState } from "react";
import { HoveredLink, Menu, MenuItem } from "./ui/navbar-menu";
import { cn } from "../lib/utils";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie"; // Import js-cookie

function Navbarr({ className }) {
  const [active, setActive] = useState(null);
  const [userActive, setUserActive] = useState(false);
  const router = useRouter(); // Initialize the router

  // Function to check the current auth token and update the state
  const checkAuthToken = () => {
    const token = Cookies.get('auth-token'); // Get the 'auth-token' cookie
    console.log("auth-token from cookies:", token);

    if (token) {
      setUserActive(true); // If token exists, set userActive to true
    } else {
      setUserActive(false); // If no token, set userActive to false
    }
  };

  // Handle sign-out by removing the cookie and redirecting
  const handleSignOut = () => {
    Cookies.remove("auth-token"); // Remove the auth-token cookie
    setUserActive(false); // Set userActive state to false
    router.push("/sign-in"); // Redirect to sign-in page
  };

  useEffect(() => {
    checkAuthToken(); // Check token immediately on mount

    // Set an interval to check the token every second
    const intervalId = setInterval(checkAuthToken, 1000); // Check token every second

    // Clean up interval on unmount
    return () => {
      clearInterval(intervalId);
    };
  }, []); // Empty dependency array ensures effect runs once on mount

  return (
    <div className={cn("fixed top-10 inset-x-0 max-w-2xl mx-auto z-50 dark", className)}>
      <Menu setActive={setActive}>
        <MenuItem setActive={setActive} active={active} item="Home">
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="/home">Home</HoveredLink>
          </div>
        </MenuItem>

        {userActive && (
          <MenuItem setActive={setActive} active={active} item="dashboard">
            <div className="flex flex-col space-y-4 text-sm">
              <HoveredLink href="/dashboard">Dashboard</HoveredLink>
            </div>
          </MenuItem>
        )}

        {/* Conditional rendering based on session */}
        {userActive ? (
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
            <MenuItem setActive={setActive} active={active} item="Login">
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
  return (
    <>
      <Navbarr />
    </>
  );
}

export default Navbar;
