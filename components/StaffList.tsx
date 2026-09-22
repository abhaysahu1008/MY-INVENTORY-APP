import { prisma } from "../app/lib/prisma";

interface StaffListProps {
  companyId: number;
}

export default async function StaffList({ companyId }: StaffListProps) {
  const staffMembers = await prisma.user.findMany({
    where: {
      companyId,
      role: { in: ["MANAGER", "EMPLOYEE"] },
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      warehouse: { select: { name: true } },
    },
    orderBy: { role: "asc" },
  });

  if (staffMembers.length === 0) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center text-gray-400 text-base w-full">
        No staff members registered yet.
      </div>
    );
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm w-full">
      <div className="flex items-center justify-between border-b border-gray-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white">Staff & Team Members</h2>
          <p className="text-xs text-gray-400 mt-1">
            Active managers and employees across company facilities
          </p>
        </div>
        <span className="text-xs font-bold px-3 py-1.5 bg-gray-800 text-gray-300 rounded-full border border-gray-700">
          Total: {staffMembers.length}
        </span>
      </div>

      <div className="overflow-x-auto w-full">
        <table className="w-full text-left text-sm text-gray-200">
          <thead className="bg-gray-950/70 text-gray-400 uppercase text-xs tracking-wider border-b border-gray-800">
            <tr>
              <th className="py-4 px-6 font-bold">Name & Email</th>
              <th className="py-4 px-6 font-bold">Role</th>
              <th className="py-4 px-6 font-bold">Assigned Facility</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/80 font-medium">
            {staffMembers.map((member) => (
              <tr key={member.id} className="hover:bg-gray-800/50 transition">
                <td className="py-4 px-6">
                  <div className="font-bold text-white text-base">
                    {member.name || "Unnamed Staff"}
                  </div>
                  <div className="text-xs text-gray-400 font-mono mt-0.5">
                    {member.email}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${member.role === "MANAGER"
                      ? "bg-amber-950/80 text-amber-300 border border-amber-800/60"
                      : "bg-blue-950/80 text-blue-300 border border-blue-800/60"
                      }`}
                  >
                    {member.role}
                  </span>
                </td>
                <td className="py-4 px-6 text-gray-300 text-sm">
                  {member.warehouse?.name ? (
                    <span className="inline-flex items-center gap-2 font-medium">
                      <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                      {member.warehouse.name}
                    </span>
                  ) : (
                    <span className="text-gray-500 italic">Unassigned</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
