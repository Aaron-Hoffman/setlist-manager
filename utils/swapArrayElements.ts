import { Song } from "@prisma/client";

const swapArrayElements = (setList: Song[], from: number, to: number) => {
    [setList[from], setList[to]] = [setList[to], setList[from]]

    return setList
}

export default swapArrayElements;