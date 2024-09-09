'use client'
import { signIn } from "next-auth/react"

const LoginButton = () => {
  return (
    <button onClick={() => signIn('google')}>Login</button>
  );
}

export default LoginButton;