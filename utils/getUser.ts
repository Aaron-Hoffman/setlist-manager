import prisma from "./db";
import { getServerSession } from "next-auth";
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// maybe memoize?
const getUser = async () => {
    const session = await getServerSession(authOptions);
    if (!session) return null;
    
    const user = await prisma.user.findUnique({
        where: {
          email: session?.user.email,
        },
    })

    return user
}

export default getUser;