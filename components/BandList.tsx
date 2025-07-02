import { Prisma } from "@prisma/client";
import Link from "next/link";

const bandWithRelations = Prisma.validator<Prisma.BandArgs>()({
    include: {
        songs: true,
        setLists: true,
    },
});

type BandWithRelations = Prisma.BandGetPayload<typeof bandWithRelations>;

export type BandListProps = {
    bandList: BandWithRelations[]
}

const BandList = ({bandList}: BandListProps) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {bandList && bandList.map(band => (
                <div 
                    key={band.id} 
                    className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden group"
                >
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <Link 
                                href={`/bands/${band.id}`} 
                                className="text-xl font-semibold text-gray-900 hover:text-indigo-600 transition-colors duration-200"
                            >
                                {band.name}
                            </Link>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                                </svg>
                                <span>{band.songs?.length || 0} Songs</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                <span>{band.setLists?.length || 0} Set Lists</span>
                            </div>
                        </div>
                    </div>
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                        <Link 
                            href={`/bands/${band.id}`}
                            className="text-sm font-medium text-indigo-600 hover:text-indigo-500 flex items-center space-x-1 group-hover:underline"
                        >
                            <span>View Details</span>
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default BandList;