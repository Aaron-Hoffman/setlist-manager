import { PrismaClient } from '@prisma/client'
import { getServerSession } from "next-auth";
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// maybe memoize?
const getUser = async () => {
    const prisma = new PrismaClient();
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