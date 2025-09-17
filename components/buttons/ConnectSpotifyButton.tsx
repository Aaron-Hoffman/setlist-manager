"use client";
import { signIn } from "next-auth/react";

export default function ConnectSpotifyButton() {
  return (
    <button
      onClick={() => signIn('spotify')}
      className="ml-2 px-3 py-1 bg-[#1DB954] hover:bg-[#1ed760] text-white rounded font-semibold text-sm shadow"
    >
      Connect Spotify
    </button>
  );
} 