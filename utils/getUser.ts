import prisma from "./db";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

// maybe memoize?
const getUser = async (withBands: boolean = false) => {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) return undefined;
    
    const user = await prisma.user.findUnique({
        where: {
          email: session.user.email,
        },
        include: {
          bands: withBands ? {
            include: {
              songs: true,
              setLists: true
            }
          } : false
        }
    })

    return user
}

export default getUser;