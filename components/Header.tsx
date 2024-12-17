import HeaderNavMenu from "./HeaderNavMenu";
import Link from "next/link";

const Header = () => {
    return (
        <header className="flex justify-between items-end px-24 py-12 bg-slate-400">
            <Link href="/"><h1 className="text-4xl">Set List Manager</h1></Link>
            <HeaderNavMenu />
        </header>    
    )
}

export default Header;