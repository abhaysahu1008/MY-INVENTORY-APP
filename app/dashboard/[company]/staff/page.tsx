import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "../../../lib/prisma";
import { decodeTokenHelper } from "../../../utils/helper";
import StaffList from "@/components/StaffList";

export default async function StaffManagementPage({
  params,
}: {
  params: Promise<{ company: string }>;
}) {
  const { company } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) redirect("/login");

  const payload = decodeTokenHelper(token);
  if (!payload?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: payload.id },
    select: { companyId: true, role: true },
  });

  if (!user || !user.companyId || user.role !== "OWNER") {
    redirect(`/dashboard/${company}`);
  }

  return (
    <div className="p-8 md:p-12 min-h-screen bg-gray-950 text-gray-100 space-y-8 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-gray-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Staff Management
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Manage managers and branch employees for{" "}
            <span className="text-blue-400 font-semibold">{company}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/dashboard/${company}/add-staff?role=MANAGER&companyId=${user.companyId}`}
            className="px-5 py-2.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white font-semibold text-sm rounded-xl transition shadow"
          >
            + Add Manager
          </Link>
          <Link
            href={`/dashboard/${company}/add-staff?role=EMPLOYEE&companyId=${user.companyId}`}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-xl transition shadow-lg active:scale-95"
          >
            + Add Employee
          </Link>
        </div>
      </div>

      <StaffList companyId={user.companyId} />
    </div>
  );
}
