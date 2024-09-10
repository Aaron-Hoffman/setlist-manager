import AddBandForm from "@/components/AddBandForm";
import BandList from "@/components/BandList";
import getUser from "@/utils/getUser";
import prisma from "@/utils/db";

const BandsPage = async () => {
    const user = await getUser();

    const bands = await prisma.band.findMany({
        where: {
            userId: user?.id,
        },
    })

    return (
        <>
            <h2>Bands</h2>
            <AddBandForm user={user}/>
            {bands && <BandList bandList={bands} />}
            {!bands && <p>Add a band to get started.</p>}
        </>
    )
}

export default BandsPage;