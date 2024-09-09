import LoginButton from "@/components/LoginButton";
import LogoutButton from "@/components/LogoutButton";
import { getServerSession } from "next-auth";

const LoginPage = async () => {
    const session = await getServerSession();
    console.log(session)
    return (
        <>
            <LoginButton />
            <LogoutButton />
        </>
    );
}

export default LoginPage;
