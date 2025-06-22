import prisma from "./db";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

// maybe memoize?
const getUser = async (withBands: boolean = false) => {
    const session = await getServerSession(authOptions);
    if (!session) return undefined;
    const userSession = session.user as typeof session.user & { id?: string };
    if (!userSession?.id && !userSession?.email) return undefined;
    
    let user;
    if (userSession?.id) {
      user = await prisma.user.findUnique({
        where: { id: userSession.id },
        include: {
          bands: withBands ? {
            include: {
              songs: true,
              setLists: true
            }
          } : false
        }
      });
    } else if (userSession?.email) {
      user = await prisma.user.findUnique({
        where: { email: userSession.email },
        include: {
          bands: withBands ? {
            include: {
              songs: true,
              setLists: true
            }
          } : false
        }
      });
    }
    return user;
}

export default getUser;