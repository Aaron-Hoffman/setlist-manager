import { Song } from '@prisma/client';
import { addSetList } from '@/utils/serverActions';

export type AddSetListFormProps = {
    bandId: number,
    songs: Song[]
}

const AddSetListForm = async ({bandId, songs}: AddSetListFormProps) => {
    return (
        <div className="flex flex-col">
            <h2 className="text-center text-2xl pb-5">Create a Set List</h2>
            <form action={addSetList.bind(null, bandId, songs)} className="flex flex-col p-5 border-slate-400 border-2">
                <div className="p-5">
                    <label htmlFor="name" className="pr-3">Name:</label>
                    <input type="text" name="name" id="name" placeholder="Set list name here..." className="rounded p-2 "/>
                    <label htmlFor="number" className="pr-3">Number of songs:</label>
                    <input type="number" name="number" id="number" className="rounded p-2 "/>
                </div>
                <button className="p-5 mt-5 bg-blue-400 rounded font-bold text-lg" type='submit'>Create Set List</button>
            </form>
        </div>
    )
}

export default AddSetListForm;