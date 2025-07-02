import { PageProps } from "@/.next/types/app/page";
import AddSongForm from "@/components/AddSongForm";
import ShareBandForm from "@/components/ShareBandForm";
import SongList from "@/components/SongList";
import RemoveFromBandButton from "@/components/RemoveFromBandButton";
import prisma from "@/utils/db";
import getUser from "@/utils/getUser";
import Link from "next/link";

const BandPage = async (context: PageProps) => {
  const bandId = context.params.id;
  const session = await getUser();

  const band = await prisma.band.findUnique({
    where: {
      id: Number(bandId),
    },
    include: {
      songs: true,
      setLists: true,
      users: true
    }
  })

  if (!band) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Band not found</h2>
          <p className="text-gray-500 mb-6">This band does not exist or has been deleted.</p>
          <Link 
            href="/bands" 
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
          >
            Back to Bands
          </Link>
        </div>
      </div>
    )
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-3xl font-bold leading-7 text-gray-900 sm:text-4xl sm:truncate">
            {band.name}
          </h2>
          <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <svg className="h-5 w-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
              <span>{band.songs.length} Songs</span>
            </div>
            <div className="flex items-center">
              <svg className="h-5 w-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span>{band.setLists.length} Set Lists</span>
            </div>
            <div className="flex items-center">
              <svg className="h-5 w-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-5a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span>{band.users.length} User{band.users.length !== 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>
        <div className="mt-4 flex space-x-3 md:mt-0 md:ml-4">
          <Link
            href={`/bands/${bandId}/setlists`}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg className="-ml-1 mr-2 h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            View Set Lists
          </Link>
          <Link
            href={`/bands/${bandId}/setlist`}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            New Set List
          </Link>
          <ShareBandForm band={band} />
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Songs</h3>
          <AddSongForm bandId={bandId} />
        </div>
        <div className="border-t border-gray-200">
          <SongList songList={band.songs} />
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Band Members</h3>
        <ul className="bg-white shadow rounded-lg divide-y divide-gray-200">
          {band.users.length === 0 ? (
            <li className="px-4 py-3 text-gray-500">No users in this band.</li>
          ) : (
            band.users.map((user) => (
              <li key={user.id} className="px-4 py-3 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="font-medium text-gray-800">{user.name || 'Unnamed User'}</span>
                  {user.email && (
                    <span className="text-gray-500 text-sm">({user.email})</span>
                  )}
                  {session?.user?.id === user.id && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      You
                    </span>
                  )}
                </div>
                {session?.user?.id === user.id && (
                  <RemoveFromBandButton 
                    bandId={band.id}
                    bandName={band.name}
                    userId={user.id}
                    isLastUser={band.users.length === 1}
                  />
                )}
              </li>
            ))
          )}
        </ul>
      </div>
    </main>
  );
}

export default BandPage;