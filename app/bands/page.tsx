import AddBandForm from "@/components/AddBandForm";
import BandList from "@/components/BandList";
import getUser from "@/utils/getUser";
import { PrismaClient } from '@prisma/client'

const BandsPage = async () => {
    const prisma = new PrismaClient();

    const user = await getUser();

    const bands = await prisma.band.findMany({
        where: {
            userId: user.id,
        },
    })

    // Message about how to get started if no bands
    return (
        <>
            <h2>Bands</h2>
            <AddBandForm user={user}/>
            <BandList bandList={bands} />
        </>
    )
}

export default BandsPage;