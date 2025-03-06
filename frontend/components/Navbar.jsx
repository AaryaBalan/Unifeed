import React from "react";
import { useUser, UserButton } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { user, isSignedIn } = useUser();

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-[#ff512f] to-[#dd2476] text-white shadow-lg backdrop-blur-md bg-opacity-80 rounded-xl m-4">
      {/* Left Side - Logo */}
      <h2 className="text-2xl font-bold tracking-wide">UniFeed</h2>

      {/* Right Side - Profile and Sign Out */}
      {isSignedIn ? (
        <div className="flex items-center gap-4">
          <span className="text-lg font-medium drop-shadow-lg">{user.fullName}</span>
          <UserButton afterSignOutUrl="/" />
        </div>
      ) : (
        <Link to="/login" className="text-lg font-medium hover:underline transition-all duration-300">
          Login
        </Link>
      )}
    </nav>
  );
};

export default Navbar;
