import { PageProps } from "@/.next/types/app/page";
import BandInfo from "@/components/BandInfo";
import BandLinks from "@/components/BandLinks";
import FilteredRepertoire from "@/components/FilteredRepertoire";
import prisma from "@/utils/db";
import getUser from "@/utils/getUser";
import SongListActions from "@/components/SongListActions";
import BandUsers from "@/components/BandUsers";
import BandNotFound from "@/components/BandNotFound";

const BandPage = async (context: PageProps) => {
  const bandId = context.params.id;
  const session = await getUser();
  const accessToken = session?.accessToken;
  const hasSpotify = !!accessToken;

  const band = await prisma.band.findUnique({
    where: {
      id: Number(bandId),
    },
    include: {
      songs: true,
      setLists: true,
      users: true
    }
  })

  if (!band) {
    return (
      <BandNotFound />
    )
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <BandInfo bandName={band.name} numberOfSongs={band.songs.length} numberOfSetlists={band.setLists.length} numberOfUsers={band.users.length} showSongs={true} showUsers={true} showSetlists={true}/>
        <BandLinks bandId={band.id} songs={band.songs} showViewSetlists={true} showShare={true} showCreateSet={true} showPDF={false} showSpotify= {false} setListsLinkText={"View Set Lists"}/>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center max-sm:flex-col max-sm:items-start">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Songs</h3>
          <SongListActions bandId={bandId} songs={band.songs} bandName={band.name} hasSpotify={hasSpotify}/>
        </div>
        <div className="border-t border-gray-200">
          <FilteredRepertoire songs={band.songs} bandId={Number(bandId)} />
        </div>
      </div>

      <BandUsers users={band.users} bandName={band.name} bandId={band.id} currentUserId={String(session?.user?.id)}/>
    </main>
  );
}

export default BandPage;