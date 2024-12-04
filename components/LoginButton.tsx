'use client'
import { signIn } from "next-auth/react"

const LoginButton = () => {
  return (
    <button className="px-5 text-xl" onClick={async () => await signIn('google')}>Login</button>
  );
}

export default LoginButton;