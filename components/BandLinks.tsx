import ShareBandForm from "@/components/forms/ShareBandForm";
import AddSetListForm from "@/components/forms/AddSetListForm";
import ExportPDFButton from "./buttons/ExportPDFButton";
import CreateSpotifyPlaylistModalButton from "./buttons/CreateSpotifyPlaylistModalButton";
import Link from "next/link";
import { SetList, Song } from "@prisma/client";

// Minimal shape needed from the set list passed in by pages that fetch via Prisma
type BandLinksSetList = Pick<SetList, 'id' | 'createdAt' | 'updatedAt' | 'name' | 'bandId' | 'time' | 'location' | 'details' | 'personel' | 'endTime'> & {
    band: { name: string },
    sets: { setSongs: { song: Song }[] }[]
}

export type BandLinksProps = {
    bandId: number,
    songs: Song[],
    showViewSetlists: boolean,
    showShare: boolean,
    showCreateSet: boolean,
    showPDF: boolean,
    showSpotify: boolean
    setListsLinkText: string,
    setList?: BandLinksSetList
}

const BandLinks = ({bandId, songs, showViewSetlists, showShare, showCreateSet, setListsLinkText, showPDF, showSpotify, setList }: BandLinksProps) => {
    return (
        <div className="mt-4 flex space-x-3 md:mt-0 md:ml-4">
          {showPDF && setList &&
            <ExportPDFButton setList={{
              id: setList.id,
              createdAt: setList.createdAt,
              updatedAt: setList.updatedAt,
              name: setList.name,
              bandId: setList.bandId,
              time: setList.time ?? null,
              location: setList.location ?? null,
              details: setList.details ?? null,
              personel: setList.personel ?? null,
              endTime: setList.endTime ?? null,
              songs: setList.sets.flatMap(set => set.setSongs.map(s => s.song)),
              bandName: setList.band.name
            }} />
          }
          {showSpotify && setList &&
            <div className="ml-3">
              <CreateSpotifyPlaylistModalButton setListId={String(setList.id)} hasSpotify={showSpotify} songs={setList.sets.flatMap(set => set.setSongs.map(s => s.song))} />
            </div>
          }
          {showViewSetlists &&
            <Link
              href={`/bands/${bandId}/setlists`}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg className="-ml-1 mr-2 h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              {setListsLinkText}
            </Link>
          }
          {showCreateSet && songs.length === 0 ? (
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
            showCreateSet && <AddSetListForm songs={songs} bandId={bandId}/>
          )}

          {showShare && <ShareBandForm bandId={bandId} />}
        </div>
    )
}

export default BandLinks;