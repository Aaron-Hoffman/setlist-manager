'use server'

import { User } from "@prisma/client";
import prisma from "./db";
import { revalidatePath } from "next/cache";

export const addBand = async (user: User | null, formData: FormData) => {
    if (!user) {
        throw new Error("Error must sign in to create a band");
    }

   await prisma.band.create({
        data: {
            name: formData.get('name') as string,
            userId: user.id
        },
    })
    return revalidatePath('/bands')
}