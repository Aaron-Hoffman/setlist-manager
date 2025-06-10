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
            <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">Please sign in to access your bands</h2>
                    <Link 
                        href="/login" 
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                    >
                        Sign In
                    </Link>
                </div>
            </div>
        )
    }

    const bands = userWithBands.bands

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="md:flex md:items-center md:justify-between mb-8">
                <div className="flex-1 min-w-0">
                    <h2 className="text-3xl font-bold leading-7 text-gray-900 sm:text-4xl sm:truncate">
                        My Bands
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Manage your bands and their set lists
                    </p>
                </div>
                <div className="mt-4 flex md:mt-0 md:ml-4">
                    <AddBandForm user={user} />
                </div>
            </div>

            {isEmpty(bands) ? (
                <div className="text-center py-12">
                    <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No bands</h3>
                    <p className="mt-1 text-sm text-gray-500">Get started by creating a new band.</p>
                </div>
            ) : (
                <BandList bandList={bands} />
            )}
        </main>
    )
}

export default BandsPage;