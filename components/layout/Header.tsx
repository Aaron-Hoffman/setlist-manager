import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";
import NavMenu from "./NavMenu";
import Link from "next/link";

const Header = async () => {
  const session = await getServerSession(authOptions);

  return (
    <header className="bg-white border-b border-gray-200 relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <svg className="h-8 w-8 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
          <h1 className="text-2xl font-bold text-gray-900">Set List Manager</h1>
        </Link>
        {/* Nav menu (client) */}
        <NavMenu isAuthenticated={!!session} user={session?.user || null} />
      </div>
    </header>
  );
};

export default Header;