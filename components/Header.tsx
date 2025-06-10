import HeaderNavMenu from "./HeaderNavMenu";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";

const Header = async () => {
    const session = await getServerSession(authOptions);

    return (
        <header className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center space-x-2">
                            <svg className="h-8 w-8 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                            </svg>
                            <h1 className="text-2xl font-bold text-gray-900">Set List Manager</h1>
                        </Link>
                    </div>

                    <div className="flex items-center space-x-4">
                        {session ? (
                            <div className="flex items-center space-x-4">
                                <Link 
                                    href="/bands" 
                                    className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                                >
                                    My Bands
                                </Link>
                                <div className="flex items-center space-x-2">
                                    {session.user?.image ? (
                                        <img 
                                            src={session.user.image} 
                                            alt={session.user.name || 'User'} 
                                            className="h-8 w-8 rounded-full"
                                        />
                                    ) : (
                                        <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                                            <span className="text-indigo-600 font-medium">
                                                {session.user?.name?.[0]?.toUpperCase() || 'U'}
                                            </span>
                                        </div>
                                    )}
                                    <span className="text-sm font-medium text-gray-700">
                                        {session.user?.name || 'User'}
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <Link 
                                href="/login"
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                            >
                                Sign In
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;