'use client'
import { signIn } from "next-auth/react"

const LoginButton = () => {
  return (
    <button className="p-5 mt-5 bg-blue-400 rounded font-bold text-lg" onClick={async () => await signIn('google')}>Login</button>
  );
}

export default LoginButton;