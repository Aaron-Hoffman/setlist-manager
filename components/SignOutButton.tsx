'use client'

import { signOut } from 'next-auth/react'

export default function SignOutButton() {
    return (
        <button
            onClick={() => signOut({ 
                callbackUrl: '/',
                redirect: true 
            })}
            className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
        >
            Sign Out
        </button>
    )
} 