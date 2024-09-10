import prisma from "@/utils/db";
import { Band } from "@prisma/client";
import { revalidatePath } from 'next/cache'
import Link from "next/link";

export type BandListProps = {
    bandList: Band[]
}

const BandList = ({bandList}: BandListProps) => {
    // const deleteBand = async (id) => {
    //     'use server'
    //     await prisma.band.delete({
    //         where: {
    //           id: id,
    //         },
    //     })
    //     revalidatePath('/')
    // }

    return (
        <ul>
            {bandList && bandList.map(band => {
                return (
                    <li key={band.id}>
                        <Link href={`/bands/${band.id}`}>{band.name}</Link>
                    </li>
                )
            })}
        </ul>
    )
}

export default BandList;