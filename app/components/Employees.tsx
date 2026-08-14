import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";

export type StaffMember = Prisma.UserGetPayload<{
  select: {
    id: true;
    name: true;
    email: true;
    role: true;
    createdAt: true;
  };
}>;

export default async function StaffList({ companyId }: { companyId: number }) {
  const staff: StaffMember[] = await prisma.user.findMany({
    where: {
      companyId: companyId,
      role: { in: ["MANAGER", "EMPLOYEE"] },
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  if (staff.length === 0) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center text-zinc-400 text-sm">
        No managers or employees registered yet.
      </div>
    );
  }

  // 1. Separate array into Managers and Employees
  const managers = staff.filter((member) => member.role === "MANAGER");
  const employees = staff.filter((member) => member.role === "EMPLOYEE");

  return (
    <div className="space-y-8">
      {/* 2. Managers Section (Always First) */}
      {managers.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-yellow-400 uppercase tracking-wider">
            Managers ({managers.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {managers.map((member) => (
              <StaffCard key={member.id} member={member} />
            ))}
          </div>
        </div>
      )}

      {/* 3. Employees Section (Stacked Below) */}
      {employees.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            Employees ({employees.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {employees.map((member) => (
              <StaffCard key={member.id} member={member} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Reusable card component to avoid repetitive JSX
function StaffCard({ member }: { member: StaffMember }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl flex justify-between items-center shadow-sm hover:border-zinc-700 transition">
      <div className="space-y-1">
        <p className="font-semibold text-zinc-100 text-sm">
          {member.name || "Unnamed User"}
        </p>
        <p className="text-xs text-zinc-400">{member.email}</p>
      </div>

      <span
        className={`text-xs px-3 py-1 rounded-xl font-semibold border ${member.role === "MANAGER"
          ? "bg-yellow-400/10 text-yellow-300 border-yellow-400/20"
          : "bg-zinc-800 text-zinc-300 border-zinc-700"
          }`}
      >
        {member.role}
      </span>
    </div>
  );
}
