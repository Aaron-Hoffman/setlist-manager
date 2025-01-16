import Link from "next/link";
import LogoutButton from "@/components/buttons/LogoutButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";

const HeaderNavMenu = async () => {
    const session = await getServerSession(authOptions);

    return (
        <nav>
            <ul className="flex">
                <li>
                    <Link className="px-5 text-xl" href="/bands">Bands</Link>
                </li>
                <li>
                    {session && <LogoutButton />}
                    {!session && <Link className="px-5 text-xl" href="/login">Login</Link>}
                </li>
            </ul>
        </nav>
    )
}

export default HeaderNavMenu;