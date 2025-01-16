import LoginButton from "@/components/buttons/LoginButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";
import Link from "next/link";

const LoginPage = async () => {
    const session = await getServerSession(authOptions);
    return (
        <main className="h-screen p-20">
            {!session && (
                <div>
                    <div className="border-slate-400 border-2 rounded p-10 max-w-lg mb-10">
                        <p className="pb-6">Welcome to Set List Manager.</p>
                        <p>Please login to begin creating set lists with ease!</p>
                    </div>    
                    <LoginButton />
                </div>
            )}
            {session && (
                <div>
                    <p>You are logged in, please <Link href="/bands" className="underline">add a band to continue.</Link></p>
                </div>
            )}
        </main>
    );
}

export default LoginPage;
