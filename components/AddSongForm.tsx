import KEYS from "@/constants/KEYS";

const AddSongForm = () => {
    console.log(KEYS);
    return (
        <>
            <h2>Add A Song</h2>
            <form action="">
                <label htmlFor="title">Title</label>
                <input type="text" name="title" id="title" placeholder="song title here..."/>
                <label htmlFor="key">Key</label>
                <select name="key" id="key">
                    {KEYS.map(key => <option value={key.value} key={key.value}>{key.label}</option>)}
                </select>
            </form>
        </>
    )
}

export default AddSongForm;