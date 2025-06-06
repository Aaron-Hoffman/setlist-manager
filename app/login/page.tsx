import LoginButton from "@/components/LoginButton";
import RegisterForm from "@/components/RegisterForm";
import LoginForm from "@/components/LoginForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";
import Link from "next/link";

const LoginPage = async () => {
    const session = await getServerSession(authOptions);
    return (
        <main className="min-h-screen p-4 md:p-20 bg-gradient-to-b from-gray-50 to-white">
            {!session && (
                <div className="max-w-md mx-auto">
                    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-8 mb-10">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Set List Manager</h1>
                        <p className="text-gray-600 mb-8">Create and manage your setlists with ease!</p>
                        
                        <div className="space-y-8">
                            <div>
                                <LoginButton />
                            </div>
                            
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-200"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">Or continue with email</span>
                                </div>
                            </div>
                            
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                    <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                                    </svg>
                                    Login with Email
                                </h2>
                                <LoginForm />
                            </div>
                            
                            <div className="border-t border-gray-200 pt-8">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                    <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                                        <circle cx="8.5" cy="7" r="4"/>
                                        <path d="M20 8v6M23 11h-6"/>
                                    </svg>
                                    Register with Email
                                </h2>
                                <RegisterForm />
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {session && (
                <div className="max-w-md mx-auto bg-white border border-gray-200 rounded-lg shadow-lg p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome Back!</h2>
                    <p className="text-gray-600 mb-6">You're all set to manage your setlists.</p>
                    <Link 
                        href="/bands" 
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Go to Bands
                        <svg className="ml-2 -mr-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                        </svg>
                    </Link>
                </div>
            )}
        </main>
    );
}

export default LoginPage;
