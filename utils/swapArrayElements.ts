import { SetListItem } from "@prisma/client";
import { find } from "lodash";

const swapArrayElements = (order: SetListItem[], from: number, to: number) => {
    const fromItem = find(order, setListItem => setListItem.index === from)
    const toItem = find(order, setListItem => setListItem.index === to)

    if (!fromItem || !toItem) return;

    fromItem.index = to
    toItem.index = from

    return [fromItem, toItem]
}

export default swapArrayElements;