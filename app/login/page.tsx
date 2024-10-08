import LoginButton from "@/components/LoginButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";

const LoginPage = async () => {
    const session = await getServerSession(authOptions);
    return (
        <>
            {!session && <LoginButton />}
        </>
    );
}

export default LoginPage;
