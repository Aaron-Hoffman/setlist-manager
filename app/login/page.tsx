import LoginButton from "@/components/LoginButton";
import { getServerSession } from "next-auth";

const LoginPage = async () => {
    const session = await getServerSession();
    return (
        <>
            {!session && <LoginButton />}
        </>
    );
}

export default LoginPage;
