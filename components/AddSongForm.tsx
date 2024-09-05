import KEYS from "@/constants/KEYS";


const AddSongForm = ({addSongHandler}) => {
    return (
        <div className="flex flex-col">
            <h2>Add A Song</h2>
            <form action="">
                <label htmlFor="title">Title</label>
                <input type="text" name="title" id="title" placeholder="Song title here..."/>
                <label htmlFor="key">Key</label>
                <select name="key" id="key">
                    {KEYS.map(key => <option value={key.value} key={key.value}>{key.label}</option>)}
                </select>
                <button type='submit' onClick={addSongHandler}>Add Song</button>
            </form>
        </div>
    )
}

export default AddSongForm;