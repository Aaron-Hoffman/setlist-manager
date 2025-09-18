import DeleteSetListButton from "@/components/buttons/DeleteSetListButton";
import ExportPDFButton from "./buttons/ExportPDFButton";
import { SetListWithSongsAndBand } from "@/types/pdf";

export type SetlistActionsProps = {
    setlist: SetListWithSongsAndBand
}

const SetlistActions = ({setlist}: SetlistActionsProps) => {
    return (
        <div className="flex flex-col w-full sm:w-auto sm:flex-row items-center gap-2 mt-2 sm:mt-0 sm:ml-4">
            <span className="text-sm text-gray-500">{new Date(setlist.createdAt).toLocaleDateString()}</span>
            <ExportPDFButton setList={setlist} className="w-full sm:w-auto" />
            <DeleteSetListButton id={setlist.id} className="w-full sm:w-auto" />
        </div>
    )
}

export default SetlistActions;