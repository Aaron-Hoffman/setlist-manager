import prisma from "./db";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

// maybe memoize?
const getUser = async () => {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) return undefined;
    
    const user = await prisma.user.findUnique({
        where: {
          email: session.user.email,
        },
    })

    return user
}

export default getUser;