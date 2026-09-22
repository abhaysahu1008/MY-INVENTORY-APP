import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { prisma } from "../../../lib/prisma";
import { decodeTokenHelper } from "../../../utils/helper";
import PurchaseProductFromSupplier from "../../../../components/PurchaseProduct";

interface PageProps {
  searchParams: Promise<{ companyId?: string }>;
}

export default async function PurchaseProductPage({ searchParams }: PageProps) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) redirect("/login");

  const payload = decodeTokenHelper(token);
  if (!payload?.id) redirect("/login");

  const currentUser = await prisma.user.findUnique({
    where: { id: payload.id },
    select: { id: true, role: true, companyId: true },
  });

  if (!currentUser || !currentUser.companyId) redirect("/add-company");

  const resolvedParams = await searchParams;
  const parsedParamId = resolvedParams.companyId ? Number(resolvedParams.companyId) : null;

  const targetCompanyId =
    parsedParamId && !isNaN(parsedParamId) ? parsedParamId : currentUser.companyId;

  if (currentUser.role !== "OWNER" && targetCompanyId !== currentUser.companyId) {
    notFound();
  }

  const [warehouses, suppliers, products] = await Promise.all([
    prisma.warehouse.findMany({
      where: { companyId: targetCompanyId },
      select: { id: true, name: true },
    }),
    prisma.supplier.findMany({
      where: { companyId: targetCompanyId },
      select: { id: true, name: true },
    }),
    prisma.product.findMany({
      where: { companyId: targetCompanyId },
      select: { id: true, name: true, costPrice: true },
    }),
  ]);

  return (
    <div className="min-h-screen bg-zinc-950 p-6">
      <PurchaseProductFromSupplier
        companyId={targetCompanyId}
        userId={currentUser.id}
        warehouses={warehouses}
        suppliers={suppliers}
        products={products.map((p) => ({
          id: p.id,
          name: p.name,
          price: p.costPrice,
        }))}
      />
    </div>
  );
}
