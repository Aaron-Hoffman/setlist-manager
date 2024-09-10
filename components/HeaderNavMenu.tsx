import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import { getServerSession } from "next-auth";
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const HeaderNavMenu = async () => {
    const session = await getServerSession(authOptions);
    return (
        <nav>
            <ul className="flex">
                <li>
                    <Link className="px-5" href="/repertoire">Repertoire</Link>
                </li>
                <li>
                    <Link className="px-5" href="/setlists">Set Lists</Link>
                </li>
                <li>
                    <Link className="px-5" href="/bands">Bands</Link>
                </li>
                <li>
                    {session && <LogoutButton />}
                </li>
            </ul>
        </nav>
    )
}

export default HeaderNavMenu;