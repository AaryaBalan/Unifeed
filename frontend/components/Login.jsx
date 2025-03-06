import { SignIn } from '@clerk/clerk-react';
import React from 'react';

const Login = () => {
  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-r from-white to-[#ff371a]">
      <div className="bg-white rounded-lg shadow-lg flex w-3/4 max-w-4xl p-10">
        {/* Left Section */}
        <div className="w-1/2 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Sign in</h2>
          <p className="text-gray-600 mb-6">
            Don't have an account? <a href="/signup" className="text-blue-600 hover:underline">Sign up here</a>
          </p>
          
          {/* Clerk Sign In Component with Redirect on Failure */}
          <div className="w-full">
            <SignIn
              appearance={{ elements: { card: "bg-white p-6 border border-gray-300 shadow-lg rounded-lg" } }}
              redirectUrl="/dashboard"  // Redirect after successful login
              signUpUrl="/signup"        // Redirect to signup if login fails
            />
          </div>
        </div>
        
        {/* Right Section - Illustration */}
        <div className="w-1/2 flex items-center justify-center">
          <img src="login.png" alt="Login Illustration" className="w-80" />
        </div>
      </div>
    </div>
  );
};

export default Login;
