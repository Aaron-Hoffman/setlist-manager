import { Band } from "@prisma/client";
import Link from "next/link";
import DeleteBandButton from "./DeleteBandButton";

export type BandListProps = {
    bandList: Band[]
}

const BandList = ({bandList}: BandListProps) => {
    return (
        <ul className="pt-5">
            {bandList && bandList.map(band => {
                return (
                    <li key={band.id} className="py-5 flex-row flex justify-between max-w-lg">
                        <div>
                            <Link href={`/bands/${band.id}`} className="pr-5 text-2xl">{band.name}</Link>
                        </div>
                        <DeleteBandButton id={band.id} />
                    </li>
                )
            })}
        </ul>
    )
}

export default BandList;