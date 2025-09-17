import RemoveFromBandButton from "@/components/buttons/RemoveFromBandButton";
import { User } from "@prisma/client";

export type BandUsersProps = {
    users: User[],
    bandName: string,
    bandId: number,
    currentUserId: string | undefined
}

const BandUsers = ({users, bandName, bandId, currentUserId}: BandUsersProps) => {
    return (
        <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Band Members</h3>
        <ul className="bg-white shadow rounded-lg divide-y divide-gray-200">
          {users.length === 0 ? (
            <li className="px-4 py-3 text-gray-500">No users in this band.</li>
          ) : (
            users.map((user) => (
              <li key={user.id} className="px-4 py-3 flex flex-wrap items-center justify-between gap-y-2">
                <div className="flex items-center space-x-3">
                  <span className="font-medium text-gray-800">{user.name || 'Unnamed User'}</span>
                  {user.email && (
                    <span className="text-gray-500 text-sm">({user.email})</span>
                  )}
                  {currentUserId === user.id && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      You
                    </span>
                  )}
                </div>
                {currentUserId === user.id && (
                  <div className="w-full sm:w-auto mt-2 sm:mt-0">
                    <RemoveFromBandButton 
                      bandId={bandId}
                      bandName={bandName}
                      userId={user.id}
                      isLastUser={users.length === 1}
                    />
                  </div>
                )}
              </li>
            ))
          )}
        </ul>
      </div>
    )
}

export default BandUsers;