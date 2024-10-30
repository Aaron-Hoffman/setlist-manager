import { User } from '@prisma/client';
import { addBand } from '@/utils/serverActions';

export type AddBandFormProps = {
    user: User | null
}

const AddBandForm = ({user}: AddBandFormProps) => {
    return (
        <>
            <div className="flex flex-col">
                <h2 className="text-center text-2xl pb-5">Add A Band</h2>
                <form action={addBand.bind(null, user)} className="flex flex-col p-5 border-slate-400 border-2">
                    <div className="p-5">
                        <label htmlFor="name" className="pr-3">Name:</label>
                        <input type="text" name="name" id="name" placeholder="Band name here..." className="rounded p-2 "/>
                    </div>
                    <button className="p-5 mt-5 bg-blue-400 rounded font-bold text-lg" type='submit'>Add Band</button>
                </form>
            </div>
        </>
    )
}

export default AddBandForm;