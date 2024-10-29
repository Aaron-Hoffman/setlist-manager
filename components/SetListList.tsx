import { SetList} from "@prisma/client";
import Link from "next/link";
import DeleteSetListButton from "./DeleteSetListButton";

export type SetListListProps = {
    setListList: SetList[],
    bandId: number
}

const SetListList = ({bandId, setListList}: SetListListProps) => {
    return (
        <ul className="pt-5">
            {setListList && setListList.map(setList => {
                return (
                    <li key={setList.id} className="py-5">
                        <Link href={`/bands/${bandId}/setlist/${setList.id}`} className="pr-5 text-2xl">{setList.name}</Link>
                        <DeleteSetListButton id={setList.id} />
                    </li>
                )
            })}
        </ul>
    )
}

export default SetListList;