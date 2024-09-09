import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { getServerSession } from "next-auth";
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const prisma = new PrismaClient();

const AddBandForm = async () => {
    const session = await getServerSession(authOptions);
    const addSong = async (formData: FormData) => {
        'use server'
        const band = {
          name: formData.get('name') as string,
        }

        const user = await prisma.user.findUnique({
            where: {
              email: session?.user.email,
            },
          })
    
       await prisma.band.create({
            data: {
                name: formData.get('name') as string,
                userId: user.id
            },
        })
        revalidatePath('/bands')
        return 
    }

    return (
        <div className="flex flex-col">
            <h2 className="text-center text-2xl pb-5">Add A Band</h2>
            <form action={addSong} className="flex flex-col p-5 border-slate-400 border-2">
                <div className="p-5">
                    <label htmlFor="name" className="pr-3">Title:</label>
                    <input type="text" name="name" id="name" placeholder="Band name here..." className="rounded p-2 "/>
                </div>
                <button className="p-5 mt-5 bg-blue-400 rounded font-bold text-lg" type='submit'>Add Band</button>
            </form>
        </div>
    )
}

export default AddBandForm;