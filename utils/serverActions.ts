'use server'

import { Song, User } from "@prisma/client";
import createSetList from "./createSetList";
import prisma from "./db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const addBand = async (user: User | null, formData: FormData) => {
    if (!user) {
        throw new Error("Error must sign in to create a band");
    }

   await prisma.band.create({
        data: {
            name: formData.get('name') as string,
            users: {
                connect: [user]
            }
        },
    })

    return revalidatePath('/bands')
}

export const deleteBand = async (bandId: number) => {
    await prisma.band.delete({
        where: {
          id: bandId,
        },
    })

    return revalidatePath('/bands')
}

export const addSetList = async (bandId: number, songs: Song[], formData: FormData) => {
    const newSetList = await prisma.setList.create({
        data: {
            name: formData.get('name') as string,
            songs: {
                connect: createSetList(songs, Number(formData.get('number'))),
            },
            bandId: Number(bandId)
        },
    })

    return redirect(`/bands/${bandId}/setlist/${newSetList.id}`)
}

export const deleteSetList = async (setListId: number) => {
    await prisma.setList.delete({
        where: {
            id: setListId,
        },
    })

    return revalidatePath('/bands')
}

export const addSong = async (bandId: number, formData: FormData) => {
    const song = {
        title: formData.get('title') as string,
        key: formData.get('key') as string,
        bandId: Number(bandId)
      }
  
     await prisma.song.create({
          data: {
           ...song,
          },
      })
    
      return revalidatePath('/')
}

export const deleteSong = async (songId: number) => {
    await prisma.song.delete({
        where: {
          id: songId,
        },
    })

    return revalidatePath('/')
}

export const editSong = async (songId: number) => {
    await prisma.song.delete({
        where: {
          id: songId,
        },
    })

    return revalidatePath('/')
}