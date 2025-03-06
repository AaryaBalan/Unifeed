import { SignUp } from '@clerk/clerk-react';
import React from 'react';

const Sign = () => {
  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-r from-white to-[#ff371a]">
      <div className="bg-white rounded-lg shadow-lg flex w-3/4 max-w-4xl p-10">
        {/* Left Section */}
        <div className="w-1/2 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Sign up</h2>
          <p className="text-gray-600 mb-6">
            Already have an account? <a href="/login" className="text-blue-600 hover:underline">Login here</a>
          </p>
          
          {/* Clerk Sign Up Component */}
          <div className="w-full">
            <SignUp appearance={{ elements: { card: "bg-white p-6 border border-gray-300 shadow-lg rounded-lg" } }}               redirectUrl="/dashboard"  // Redirect after successful login
 />
          </div>
        </div>
        
        {/* Right Section - Illustration */}
        <div className="w-1/2 flex items-center justify-center">
          <img src="signup.png" alt="Signup Illustration" className="w-80" />
        </div>
      </div>
    </div>
  );
};

export default Sign;
