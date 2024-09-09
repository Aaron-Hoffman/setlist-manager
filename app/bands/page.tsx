import AddBandForm from "@/components/AddBandForm";

const BandsPage = () => {

    // Fetch all bands for user and render a menu to navigate to different bands
    // Should show button to add bands as well
    // Message about how to get started if no bands
    return (
        <>
            <h2>Bands</h2>
            <AddBandForm />
        </>
    )
}

export default BandsPage;