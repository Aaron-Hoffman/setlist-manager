import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import prisma from "@/utils/db";
import Link from "next/link";

export default async function ProfilePage() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        redirect("/login");
    }

    const { user } = session;

    // Get user stats
    const userId = (user as any).id;
    const userRecord = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            bands: {
                include: {
                    songs: true,
                    setLists: true
                }
            }
        }
    });

    const bandsCount = userRecord?.bands.length || 0;
    const songsCount = userRecord?.bands.reduce((acc, band) => acc + band.songs.length, 0) || 0;
    const setlistsCount = userRecord?.bands.reduce((acc, band) => acc + band.setLists.length, 0) || 0;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                        User Profile
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                        Personal details and application information.
                    </p>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                    <dl className="sm:divide-y sm:divide-gray-200">
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">
                                Full name
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-center">
                                {user.image && (
                                    <Image
                                        src={user.image}
                                        alt={user.name || "User avatar"}
                                        width={32}
                                        height={32}
                                        className="h-8 w-8 rounded-full mr-3"
                                    />
                                )}
                                {user.name || "N/A"}
                            </dd>
                        </div>
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">
                                Email address
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                {user.email || "N/A"}
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>

            {/* Stats Section */}
            <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Your Stats
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                        Overview of your bands, songs, and setlists.
                    </p>
                </div>
                <div className="border-t border-gray-200">
                    <dl className="sm:divide-y sm:divide-gray-200">
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-50 transition-colors">
                            <dt className="text-sm font-medium text-gray-500">
                                Bands
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {bandsCount} {bandsCount === 1 ? 'Band' : 'Bands'}
                            </dd>
                        </div>
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-50 transition-colors">
                            <dt className="text-sm font-medium text-gray-500">
                                Songs
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {songsCount} {songsCount === 1 ? 'Song' : 'Songs'}
                            </dd>
                        </div>
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-50 transition-colors">
                            <dt className="text-sm font-medium text-gray-500">
                                Setlists
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {setlistsCount} {setlistsCount === 1 ? 'Setlist' : 'Setlists'}
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>
        </div>
    );
}
