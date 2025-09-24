import Link from "next/link";

const BandNotFound = () => {
    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
            <div className="text-center">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Band not found</h2>
                <p className="text-gray-500 mb-6">This band does not exist or has been deleted.</p>
                <Link 
                    href="/bands" 
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                >
                    Back to Bands
                </Link>
            </div>
        </div>
    )
}

export default BandNotFound;