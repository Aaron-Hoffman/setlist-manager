import Link from "next/link";

const Home = async () => {
 
  return (
    <main className="flex flex-row items-start justify-around p-24">
      <p>Welcome to setlist manager. Organize your repertoire and setlists with ease!</p>
      <Link href="/bands">Add a band to get started!</Link>
    </main>
  );
}

export default Home;