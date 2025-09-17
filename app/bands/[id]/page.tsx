import { PageProps } from "@/.next/types/app/page";
import BandInfo from "@/components/BandInfo";
import BandLinks from "@/components/BandLinks";
import RemoveFromBandButton from "@/components/buttons/RemoveFromBandButton";
import FilteredRepertoire from "@/components/FilteredRepertoire";
import prisma from "@/utils/db";
import getUser from "@/utils/getUser";
import Link from "next/link";
import SongListActions from "@/components/SongListActions";

const BandPage = async (context: PageProps) => {
  const bandId = context.params.id;
  const session = await getUser();
  const accessToken = session?.accessToken;
  const hasSpotify = !!accessToken;

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
        <BandInfo bandName={band.name} numberOfSongs={band.songs.length} numberOfSetlists={band.setLists.length} numberOfUsers={band.users.length} />
        <BandLinks bandId={band.id} songs={band.songs} />
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center max-sm:flex-col max-sm:items-start">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Songs</h3>
          <SongListActions bandId={bandId} songs={band.songs} bandName={band.name} hasSpotify={hasSpotify}/>
        </div>
        <div className="border-t border-gray-200">
          <FilteredRepertoire songs={band.songs} bandId={Number(bandId)} />
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Band Members</h3>
        <ul className="bg-white shadow rounded-lg divide-y divide-gray-200">
          {band.users.length === 0 ? (
            <li className="px-4 py-3 text-gray-500">No users in this band.</li>
          ) : (
            band.users.map((user) => (
              <li key={user.id} className="px-4 py-3 flex flex-wrap items-center justify-between gap-y-2">
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
                  <div className="w-full sm:w-auto mt-2 sm:mt-0">
                    <RemoveFromBandButton 
                      bandId={band.id}
                      bandName={band.name}
                      userId={user.id}
                      isLastUser={band.users.length === 1}
                    />
                  </div>
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