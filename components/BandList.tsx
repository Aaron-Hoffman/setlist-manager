import prisma from "@/utils/db";
import { Band } from "@prisma/client";
import { revalidatePath } from 'next/cache'
import Link from "next/link";
import DeleteBandButton from "./DeleteBandButton";

export type BandListProps = {
    bandList: Band[]
}

const BandList = ({bandList}: BandListProps) => {
    const deleteBand = async (id: number) => {
        'use server'
        await prisma.band.delete({
            where: {
              id: id,
            },
        })
        revalidatePath('/bands')
    }

    return (
        <ul>
            {bandList && bandList.map(band => {
                return (
                    <li key={band.id}>
                        <Link href={`/bands/${band.id}`}>{band.name}</Link>
                        <DeleteBandButton id={band.id} deleteBandHandler={deleteBand} />
                    </li>
                )
            })}
        </ul>
    )
}

export default BandList;