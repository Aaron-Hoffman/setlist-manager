"use client";
import { useState } from "react";
import Modal from "./Modal";

// Client component only
export default function CreateSpotifyPlaylistModalButton({ setListId, hasSpotify }: { setListId: string, hasSpotify: boolean }) {
  const [showModal, setShowModal] = useState(false);
  const [playlistUrl, setPlaylistUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!hasSpotify) {
    return (
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded mb-4 text-yellow-800">
        <p className="font-medium">To create a Spotify playlist, please sign in with Spotify.</p>
      </div>
    );
  }

  const handleCreate = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/create-spotify-playlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ setListId: Number(setListId) }),
      });
      const data = await res.json();
      if (data.url) {
        setPlaylistUrl(data.url);
        setShowModal(true);
      } else {
        setError(data.error || "Failed to create playlist");
      }
    } catch (e) {
      setError("Failed to create playlist");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (playlistUrl) {
      navigator.clipboard.writeText(playlistUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <>
      <button
        onClick={handleCreate}
        disabled={loading}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
      >
        <svg className="-ml-1 mr-2 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
        </svg>
        {loading ? "Creating..." : "Create Spotify Playlist"}
      </button>
      <Modal show={showModal}>
        <div className="p-6 bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Playlist Created!</h3>
          <p className="mb-4">Your Spotify playlist has been created successfully.</p>
          <a
            href={playlistUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline break-all"
          >
            Open Playlist
          </a>
          <div className="mt-4 flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1 bg-indigo-600 text-white rounded"
            >
              {copied ? 'Copied!' : 'Copy Playlist URL'}
            </button>
            <button
              onClick={() => setShowModal(false)}
              className="px-3 py-1 bg-gray-200 rounded"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
      {error && <div className="text-red-600 mt-2">{error}</div>}
    </>
  );
} 