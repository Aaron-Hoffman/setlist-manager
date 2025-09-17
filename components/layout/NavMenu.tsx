"use client";
import Link from "next/link";
import { useState } from "react";
import SignOutButton from "../buttons/SignOutButton";
import Image from "next/image";

export default function NavMenu({ isAuthenticated, user }: { isAuthenticated: boolean, user: any }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="relative">
      {/* Hamburger for mobile */}
      <button
        className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
        aria-label="Open main menu"
        onClick={() => setMobileOpen((open) => !open)}
      >
        <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
          {mobileOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>
      {/* Desktop nav */}
      <div className="hidden md:flex items-center space-x-4">
        {isAuthenticated ? (
          <>
            {/* User avatar and name */}
            <div className="flex items-center space-x-2">
              {user?.image ? (
                <Image 
                  src={user.image} 
                  alt={user.name || 'User'} 
                  width={32}
                  height={32}
                  className="h-8 w-8 rounded-full"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                  <span className="text-indigo-600 font-medium">
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                  </span>
                </div>
              )}
              <span className="text-sm font-medium text-gray-700">
                {user?.name || 'User'}
              </span>
            </div>
            <Link
              href="/bands"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              My Bands
            </Link>
            <Link
              href="/faq"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              FAQ
            </Link>
            <SignOutButton />
          </>
        ) : (
          <Link
            href="/login"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
          >
            Sign In
          </Link>
        )}
      </div>
      {/* Mobile menu, slide down */}
      {mobileOpen && (
        <div className="fixed inset-0 w-full h-full bg-white z-50 flex flex-col">
          <button
            className="absolute top-4 right-4 p-2 rounded-md text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
          >
            <svg className="h-8 w-8" stroke="currentColor" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="flex flex-col items-center w-full max-w-xs mx-auto py-2 space-y-2 overflow-y-auto mt-8">
            {isAuthenticated ? (
              <>
                {/* User avatar and name at top of mobile menu */}
                <div className="flex flex-col items-center space-y-2">
                  {user?.image ? (
                    <Image 
                      src={user.image} 
                      alt={user.name || 'User'} 
                      width={64}
                      height={64}
                      className="h-16 w-16 rounded-full"
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center">
                      <span className="text-indigo-600 font-medium text-2xl">
                        {user?.name?.[0]?.toUpperCase() || 'U'}
                      </span>
                    </div>
                  )}
                  <span className="text-base font-semibold text-gray-800">
                    {user?.name || 'User'}
                  </span>
                </div>
                <div className="border-t border-gray-200 w-full my-2" />
                <Link
                  href="/bands"
                  className="block w-full text-center text-lg font-medium text-gray-800 py-2 rounded hover:bg-gray-100 transition-colors duration-200"
                  onClick={() => setMobileOpen(false)}
                >
                  My Bands
                </Link>
                <Link
                  href="/faq"
                  className="block w-full text-center text-lg font-medium text-gray-800 py-2 rounded hover:bg-gray-100 transition-colors duration-200"
                  onClick={() => setMobileOpen(false)}
                >
                  FAQ
                </Link>
                <div className="border-t border-gray-200 w-full my-2" />
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    // Use the signOut function from next-auth/react
                    import('next-auth/react').then(mod => mod.signOut({ callbackUrl: '/', redirect: true }));
                  }}
                  className="block w-full text-center text-lg font-medium text-gray-800 py-2 rounded hover:bg-gray-100 transition-colors duration-200"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="block w-full text-center text-lg font-medium px-8 py-4 rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                onClick={() => setMobileOpen(false)}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
} 