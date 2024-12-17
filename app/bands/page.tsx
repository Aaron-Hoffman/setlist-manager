import AddBandForm from "@/components/AddBandForm";
import BandList from "@/components/BandList";
import getUser from "@/utils/getUser";
import { isEmpty } from "lodash";
import Link from "next/link";

const BandsPage = async () => {
    const user = await getUser();
    const userWithBands = await getUser(true)

    if (!user || !userWithBands) {
        return (
            <p><Link href="/login">Login</Link> to access this page.</p>
        )
    }

    const bands = userWithBands.bands

    return (
        <main className="p-24">
            <h2 className="text-5xl underline text-center mb-10">Bands</h2>
            <AddBandForm user={user}/>
            {!isEmpty(bands) && <BandList bandList={bands} />}
            {isEmpty(bands) && <p>Add a band to get started.</p>}
        </main>
    )
}

export default BandsPage;