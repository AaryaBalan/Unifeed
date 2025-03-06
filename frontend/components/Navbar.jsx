import React from "react";
import { useUser, UserButton } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { user, isSignedIn } = useUser();

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-[#ff371a] text-white">
      {/* Left Side - Logo */}
      <h2 className="text-2xl font-semibold ">Hackathon</h2>

      {/* Right Side - Profile and Sign Out */}
      {isSignedIn ? (
        <div className="flex items-center gap-4">
          <span className="text-lg">{user.fullName}</span>
          <UserButton afterSignOutUrl="/" />
        </div>
      ) : (
        <Link to="/login" className="text-lg hover:underline">
          Login
        </Link>
      )}
    </nav>
  );
};

export default Navbar;
