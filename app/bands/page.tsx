import AddBandForm from "@/components/AddBandForm";
import BandList from "@/components/BandList";
import getUser from "@/utils/getUser";
import prisma from "@/utils/db";
import { isEmpty } from "lodash";

const BandsPage = async () => {
    const user = await getUser();

    if (!user) {
        return (
            <p>Login to access this page.</p>
        )
    }

    const bands = await prisma.band.findMany({
        where: {
            userId: user?.id,
        },
    })

    return (
        <div className="mx-10">
            <h2>Bands</h2>
            <AddBandForm user={user}/>
            {!isEmpty(bands) && <BandList bandList={bands} />}
            {isEmpty(bands) && <p>Add a band to get started.</p>}
        </div>
    )
}

export default BandsPage;