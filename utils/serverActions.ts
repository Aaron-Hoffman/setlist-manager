'use server'

import { SetList, Song, User } from "@prisma/client";
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

// TODO: fix this functionality
export const shareBand = async (bandId: number, formData: FormData) => {
    const bandWithUsers = await prisma.band.findUnique({
        where: {
            id: bandId,
        },
        include: {
            users: true
        }
    })

    if (!bandWithUsers) return

    const emailToShareWith = formData.get('email') as string

    let userToShareWith

    try {
        userToShareWith = await prisma.user.findUnique({
            where: {
                email: emailToShareWith
            }
        })
    } catch(error) {
        userToShareWith = await prisma.user.create({
            data: {
                email: emailToShareWith
            }
        })
    }
    
    await prisma.band.update({
        where: {
          id: bandId,
        },
        data: {
            users: {
                set: [...bandWithUsers.users, userToShareWith],
            }
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

export const editSetList = async (setList: SetList, song: Song, add: boolean) => {

    const setListWithSongs = await prisma.setList.findUnique({
        where: {
            id: Number(setList.id),
        },
        include: {
            songs: true
        }
    })
    
    if (!setListWithSongs) return 

    const songList = add ? [...setListWithSongs.songs, song] : setListWithSongs.songs.filter(setListItem => setListItem.id !== song.id);

    await prisma.setList.update({
        where: {
          id: setList.id,
        },
        data: {
            songs: {
                set: songList,
            }
        },
    })

    return revalidatePath('/')
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

export const editSong = async (songId: number, formData: FormData) => {
    const song = {
        title: formData.get('title') as string,
        key: formData.get('key') as string,
    }

    await prisma.song.update({
        where: {
          id: songId,
        },
        data: {
            ...song
        },
    })

    return revalidatePath('/')
}