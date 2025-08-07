import RegisterForm from "@/components/RegisterForm";
import LoginForm from "@/components/LoginForm";
import LoginWithGoogleButton from "@/components/LoginWithGoogleButton";
import LoginWithSpotifyButton from "@/components/LoginWithSpotifyButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";
import Link from "next/link";
import { cookies } from "next/headers";

const LoginPage = async () => {
    const session = await getServerSession(authOptions);
    const searchParams = (typeof window === 'undefined') ? (new URLSearchParams(cookies().get('next-url')?.value?.split('?')[1] || '')) : new URLSearchParams(window.location.search);
    const error = searchParams.get('error');
    return (
        <main className="min-h-screen p-4 md:p-20 bg-gradient-to-b from-gray-50 to-white">
            {!session && (
                <div className="max-w-md mx-auto">
                    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-8 mb-10">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Set List Manager</h1>
                        <p className="text-gray-600 mb-8">Create and manage your setlists with ease!</p>
                        {error === 'OAuthAccountNotLinked' && (
                          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded mb-6">
                            <div className="flex">
                              <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <div className="ml-3">
                                <p className="text-sm text-yellow-700">
                                  You already have an account with this email. Please sign in with your original provider and connect Spotify from your account settings.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        <div className="space-y-8">
                            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded mb-2">
                                <p className="text-sm text-yellow-700 font-medium">
                                    <span className="font-bold">Note:</span> This app is currently in test mode, so SSO with Google or Spotify will only work if you have been added to the list of users. Either contact the developer to be added or login with Email.
                                </p>
                            </div>
                            <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded mb-2">
                              <p className="text-sm text-green-700 font-medium">
                                <span className="font-bold">Recommended:</span> Please use <span className="font-bold">Spotify</span> to log in. Certain features, like creating Spotify playlists from your setlists, only work with a Spotify account.
                              </p>
                            </div>
                            <div>
                                <LoginWithSpotifyButton />
                            </div>
                            <div>
                                <LoginWithGoogleButton />
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
                    <p className="text-gray-600 mb-6">You&apos;re all set to manage your setlists.</p>
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
