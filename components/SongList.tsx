import Song from "@/types/Song";

const SongList = ({songList}) => {
    return (
        <div className="flex flex-col">
            <h2>Songs</h2>
            <ul>
                {songList && songList.map((song: Song) => {
                    return (
                        <li key={song.title}>
                            <p>{song.title}</p>
                            <p>Key: {song.key}</p>
                        </li>
                    )
                })}
            </ul>
        </ div>
    )
}

export default SongList;