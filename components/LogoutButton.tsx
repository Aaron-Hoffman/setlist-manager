'use client';

import { signOut } from "next-auth/react";

const LogoutButton = () => {
    return (
        <button
            onClick={() => signOut()}
            className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
        >
            Sign Out
        </button>
    );
}

export default LogoutButton; 