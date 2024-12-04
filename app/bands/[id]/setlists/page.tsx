import { PageProps } from "@/.next/types/app/page";
import SetListList from "@/components/SetListList";
import Link from "next/link";
import prisma from "@/utils/db";
import { isEmpty } from "lodash";

const BandPage = async (context: PageProps) => {
  const bandId = context.params.id;

  const band = await prisma.band.findUnique({
    where: {
      id: Number(bandId),
    },
  })
  
  const setLists = await prisma.setList.findMany({
    where: {
      bandId: Number(bandId)
    }
  })
 
  return (
    <main className="p-24">
        <div className="mx-10">
            <h2 className="text-3xl underline text-center mb-10"><Link href={`/bands/${bandId}`}>{band?.name}</Link> Set Lists</h2>
            {!isEmpty(setLists) && <SetListList bandId={bandId} setListList={setLists} />}
            {isEmpty(setLists) && (
              <>
                <p className="mb-5">This band has no setlists yet.</p>
                <Link href={`/bands/${bandId}/setlist`} className="text-xl underline">Create a Setlist</Link>
              </>
            )}
        </div>
    </main>
  );
}

export default BandPage;