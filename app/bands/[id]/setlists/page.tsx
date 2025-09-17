import { PageProps } from "@/.next/types/app/page";
import AddSetListForm from "@/components/forms/AddSetListForm";
import SetListList from "@/components/SetListList";
import Link from "next/link";
import prisma from "@/utils/db";
import { isEmpty } from "lodash";

const BandPage = async (context: PageProps) => {
  const bandId = context.params.id;

  const band = await prisma.band.findUnique({
    where: {
      id: Number(bandId),
    },
    include: {
      setLists: {
        include: {
          songs: { include: { song: true }, orderBy: { order: 'asc' } },
          band: true,
          sets: {
            include: {
              setSongs: {
                include: { song: true },
                orderBy: { order: 'asc' }
              }
            },
            orderBy: { order: 'asc' }
          }
        }
      },
      songs: true
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
            <Link href={`/bands/${bandId}`} className="hover:text-indigo-600 transition-colors duration-200">
              {band.name}
            </Link>
          </h2>
          <div className="mt-2 flex items-center text-sm text-gray-500">
            <svg className="h-5 w-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span>{band.setLists.length} Set Lists</span>
          </div>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          {band.songs.length === 0 ? (
            <div className="relative group">
              <button
                disabled
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-gray-400 bg-gray-300 cursor-not-allowed"
              >
                <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Create Set List
              </button>
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                Add songs to your band first
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
              </div>
            </div>
          ) : (
            <AddSetListForm songs={band.songs} bandId={bandId}/>
          )}
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Set Lists</h3>
        </div>
        <div className="border-t border-gray-200">
          {!isEmpty(band.setLists) ? (
            <SetListList 
              bandId={bandId} 
              setListList={band.setLists.map(sl => ({
                ...sl,
                bandName: sl.band.name,
                songs: Array.isArray(sl.songs) ? sl.songs.map((s: any) => s.song) : [],
                sets: Array.isArray(sl.sets) ? sl.sets.map((set: any) => ({
                  ...set,
                  setSongs: Array.isArray(set.setSongs) ? set.setSongs.map((ss: any) => ({ ...ss, song: ss.song })) : []
                })) : []
              }))}
            />
          ) : (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No set lists</h3>
              {band.songs.length === 0 ? (
                <>
                  <p className="mt-1 text-sm text-gray-500">Add songs to your band before creating set lists.</p>
                  <div className="mt-6">
                    <Link
                      href={`/bands/${bandId}`}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                      </svg>
                      Add Songs
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <p className="mt-1 text-sm text-gray-500">Get started by creating a new set list.</p>
                  <div className="mt-6">
                    <AddSetListForm songs={band.songs} bandId={bandId}/>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default BandPage;