import SetListList from "@/components/SetListList";
import prisma from "@/utils/db";
import { isEmpty } from "lodash";

const BandPage = async (context: object) => {
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
            <h2 className="text-3xl underline text-center mb-10">{band?.name} Set Lists</h2>
            {!isEmpty(setLists) && <SetListList bandId={bandId} setListList={setLists} />}
            {isEmpty(setLists) && <p>This band has no setlists yet</p>}
        </div>
    </main>
  );
}

export default BandPage;