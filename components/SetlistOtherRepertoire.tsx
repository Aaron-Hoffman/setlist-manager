 import { Song } from "@prisma/client"
 import FilteredRepertoire from "@/components/FilteredRepertoire"
 
 export type SetlistOtherRepertoireProps = {
    songs: Song[],
    bandId: number
 }
 
 const SetlistOtherRepertoire = ({songs, bandId}: SetlistOtherRepertoireProps) => {
    return (
        <div className="bg-white shadow rounded-lg order-2 lg:order-1">
        <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Repertoire</h3>
        </div>
        <div className="border-t border-gray-200">
            <FilteredRepertoire songs={songs} bandId={bandId} />
        </div>
    </div>

    )
 }

 export default SetlistOtherRepertoire;