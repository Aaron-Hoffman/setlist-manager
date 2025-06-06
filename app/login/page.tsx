import LoginButton from "@/components/LoginButton";
import RegisterForm from "@/components/RegisterForm";
import LoginForm from "@/components/LoginForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";
import Link from "next/link";

const LoginPage = async () => {
    const session = await getServerSession(authOptions);
    return (
        <main className="min-h-screen p-20">
            {!session && (
                <div className="max-w-md mx-auto">
                    <div className="border-slate-400 border-2 rounded p-10 mb-10">
                        <p className="pb-6">Welcome to Set List Manager.</p>
                        <p className="mb-6">Please login to begin creating set lists with ease!</p>
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-xl font-semibold mb-4">Login with Google</h2>
                                <LoginButton />
                            </div>
                            <div className="border-t pt-6">
                                <h2 className="text-xl font-semibold mb-4">Login with Email</h2>
                                <LoginForm />
                            </div>
                            <div className="border-t pt-6">
                                <h2 className="text-xl font-semibold mb-4">Register with Email</h2>
                                <RegisterForm />
                            </div>
                        </div>
                    </div>
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
