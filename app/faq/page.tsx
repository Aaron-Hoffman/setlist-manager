import React from "react";

const FAQPage = () => {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">FAQ: Spotify Playlist Creation</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Learn how the Spotify playlist feature works, what &ldquo;perfect match&rdquo; means, and how to get the most out of your setlists.
        </p>
      </div>
      <div className="space-y-10 max-w-2xl mx-auto">
        <section>
          <h2 className="text-xl font-semibold text-indigo-700 mb-2">How does the Spotify playlist feature work?</h2>
          <p className="text-gray-700">
            When you click <b>Create Spotify Playlist</b> for a setlist, the app will attempt to find each song on Spotify and add it to a new private playlist in your Spotify account.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-indigo-700 mb-2">What does the Spotify logo mean?</h2>
          <p className="text-gray-700">
            A song is considered a <b>perfect match</b> if both its title and artist closely match a track found on Spotify. Songs with the logo beside them are considered a perfect match. Only songs with a perfect match will be included in the playlist as others are likely to be the wrong song.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-indigo-700 mb-2">Why are some songs skipped when creating a playlist?</h2>
          <p className="text-gray-700">
            If a song in your setlist does not have a perfect match on Spotify, it will be skipped and not included in the playlist. Before creating the playlist, you&apos;ll see a confirmation modal listing any songs that will be excluded.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-indigo-700 mb-2">What should I do if a song is skipped but I know it&apos;s on Spotify?</h2>
          <p className="text-gray-700">
            Double-check the song&apos;s title and artist for typos or alternate spellings. Even small differences can prevent a match. Edit the song in your setlist and try again. If you really think it should be working, you may have found an edge case. Please contact the developer.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-indigo-700 mb-2">Can I manually add skipped songs to my Spotify playlist?</h2>
          <p className="text-gray-700">
            Yes! After the playlist is created, you can open it in Spotify and add any missing songs manually.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-indigo-700 mb-2">Who can use this feature?</h2>
          <p className="text-gray-700">
            You must be signed in with your Spotify account to create playlists. If you haven&apos;t connected Spotify yet, you&apos;ll be prompted to do so.
          </p>
        </section>
      </div>
    </main>
  );
};

export default FAQPage; 