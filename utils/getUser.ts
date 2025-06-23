import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

const getUser = async () => {
    return getServerSession(authOptions);
}

export default getUser;