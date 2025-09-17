import AddSongForm from "@/components/forms/AddSongForm";
import ExportPDFButton from "@/components/buttons/ExportPDFButton";
import CreateSpotifyPlaylistModalButton from '@/components/buttons/CreateSpotifyPlaylistModalButton';
import { Song } from "@prisma/client";

export type SongListActionsProps = {
    bandId: number,
    songs: Song[],
    bandName: string,
    hasSpotify: boolean
}

const SongListActions = ({bandId, songs, bandName, hasSpotify}: SongListActionsProps) => {
    return (
        <div className="flex items-center gap-2 max-[400px]:flex-col max-[400px]:items-start max-[400px]:mt-2">
        <AddSongForm bandId={String(bandId)} />
        {songs.length > 0 && (
          <ExportPDFButton
            setList={{
              id: 0, // dummy id for full repertoire
              name: "Full Repertoire",
              createdAt: new Date(),
              updatedAt: new Date(),
              bandId: bandId,
              songs: songs,
              bandName: bandName,
              time: null,
              location: null,
              details: null,
              personel: null,
              endTime: null,
            }}
            className="ml-2 max-[400px]:ml-0"
          />
        )}
        {songs.length > 0 && (
          <div className="ml-3 max-[400px]:ml-0">
            <CreateSpotifyPlaylistModalButton setListId={String(bandId)} hasSpotify={hasSpotify} songs={songs} isBand={true} />
          </div>
        )}
      </div>
    )
}

export default SongListActions;