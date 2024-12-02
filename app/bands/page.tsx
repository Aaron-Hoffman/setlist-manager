import AddBandForm from "@/components/AddBandForm";
import BandList from "@/components/BandList";
import getUser from "@/utils/getUser";
import { isEmpty } from "lodash";

const BandsPage = async () => {
    const user = await getUser();
    const userWithBands = await getUser(true)

    if (!user || !userWithBands) {
        return (
            <p>Login to access this page.</p>
        )
    }

    const bands = userWithBands.bands

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