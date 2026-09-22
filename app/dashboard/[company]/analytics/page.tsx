import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "../../../lib/prisma";
import { decodeTokenHelper } from "../../../utils/helper";
import { getCompanyAnalytics } from "../../../../actions/getAnalytics";
import SalesChart from "../../../../components/SalesChart";

export default async function AnalyticsPage({
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
    select: { companyId: true, warehouseId: true, role: true },
  });

  if (!user || !user.companyId) redirect("/add-company");

  if (user.role === "EMPLOYEE") {
    redirect(`/dashboard/${company}/pos`);
  }

  const targetWarehouse = user.role === "OWNER" ? undefined : user.warehouseId || undefined;
  const analyticsRes = await getCompanyAnalytics(user.companyId, targetWarehouse);
  const data = analyticsRes.data || {
    totalRevenue: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    chartData: [],
    recentSales: [],
  };

  return (
    <div className="p-6 md:p-8 text-gray-100 w-full space-y-6">
      <div className="border-b border-gray-800 pb-4">
        <h1 className="text-2xl font-bold text-white">Sales & Revenue Analytics</h1>
        <p className="text-xs text-gray-400 mt-1">
          {user.role === "OWNER" ? "Company-wide revenue metrics" : "Local warehouse metrics"}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-gray-900 border border-gray-800 rounded-2xl shadow-sm">
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Total Revenue</p>
          <p className="text-2xl font-extrabold text-green-400 mt-2">
            ${data.totalRevenue.toFixed(2)}
          </p>
        </div>

        <div className="p-5 bg-gray-900 border border-gray-800 rounded-2xl shadow-sm">
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Total Sales Orders</p>
          <p className="text-2xl font-extrabold text-white mt-2">{data.totalOrders}</p>
        </div>

        <div className="p-5 bg-gray-900 border border-gray-800 rounded-2xl shadow-sm">
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Avg Order Value</p>
          <p className="text-2xl font-extrabold text-blue-400 mt-2">
            ${data.averageOrderValue.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 shadow">
        <h2 className="text-lg font-bold text-white mb-2">Revenue Trend</h2>
        <SalesChart data={data.chartData} />
      </div>
    </div>
  );
}
