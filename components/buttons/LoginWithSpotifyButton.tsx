"use client";
import { signIn } from "next-auth/react";

export default function LoginWithSpotifyButton() {
  return (
    <button
      type="button"
      onClick={() => signIn("spotify")}
      className="w-full flex items-center justify-center gap-2 bg-[#1DB954] hover:bg-[#1ed760] text-white font-bold py-2 px-4 rounded shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1DB954] transition"
      style={{ marginBottom: '1rem' }}
    >
      <svg viewBox="0 0 168 168" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
        <circle fill="#1ED760" cx="84" cy="84" r="84"/>
        <path d="M119.3 113.2c-1.5 2.5-4.7 3.3-7.2 1.8-19.8-12.1-44.8-14.8-74.3-8.1-2.9.6-5.8-1.2-6.4-4.1-.6-2.9 1.2-5.8 4.1-6.4 31.8-7.1 59.1-4.1 80.7 9.1 2.5 1.5 3.3 4.7 1.8 7.7zm10.3-21.7c-1.9 3-5.8 4-8.8 2.1-22.7-14-57.4-18.1-84.3-9.9-3.4 1-7-1-8-4.4-1-3.4 1-7 4.4-8 30.6-9.1 68.1-4.6 93.2 11.2 3 1.9 4 5.8 2.1 8.9zm11.2-23.2c-27.1-16.1-71.8-17.6-97.5-9.6-4 1.2-8.2-1.1-9.4-5.1-1.2-4 1.1-8.2 5.1-9.4 28.7-8.6 77.1-7 107.2 11.1 3.7 2.2 4.9 7 2.7 10.7-2.2 3.7-7 4.9-10.7 2.3z" fill="#fff"/>
      </svg>
      Sign in with Spotify
    </button>
  );
} 