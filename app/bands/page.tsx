import AddBandForm from "@/components/AddBandForm";
import BandList from "@/components/BandList";
import { PrismaClient } from '@prisma/client'
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

const BandsPage = async () => {
    // Create Utility Function and useMemo to memoize 
    const prisma = new PrismaClient();
    const session = await getServerSession(authOptions);
    const user = await prisma.user.findUnique({
        where: {
          email: session?.user.email,
        },
    })

    const bands = await prisma.band.findMany({
        where: {
            userId: user.id,
        },
    })

    // Message about how to get started if no bands
    return (
        <>
            <h2>Bands</h2>
            <AddBandForm />
            <BandList bandList={bands} />
        </>
    )
}

export default BandsPage;