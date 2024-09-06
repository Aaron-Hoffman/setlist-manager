import Link from "next/link";

const HeaderNavMenu = () => {
    return (
        <nav>
            <ul className="flex">
                <li>
                    <Link className="px-5" href="/repertoire">Repertoire</Link>
                </li>
                <li>
                    <Link className="px-5" href="/setlists">Set Lists</Link>
                </li>
            </ul>
        </nav>
    )
}

export default HeaderNavMenu;