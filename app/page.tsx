import AddSongForm from "@/components/addSongForm";

export default function Home() {
  return (
    <>
      <header className="flex flex-col items-center justify-between p-24">
        <h1 className="text-4xl">Setlist Manager</h1>
      </header>    
      <main className="flex flex-col items-center justify-between p-24">
        <AddSongForm />
      </main>
    </>
  );
}
