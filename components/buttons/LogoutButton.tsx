'use client'
import { signOut } from "next-auth/react"

const LogoutButton = () => {
  return (
    <button onClick={() => signOut()} className="px-5 text-xl">Logout</button>
  );
}

export default LogoutButton;