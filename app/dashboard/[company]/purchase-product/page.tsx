import PurchaseProductFromSupplier from "../../../components/PurchaseProduct";
import { prisma } from "../../../lib/prisma";

interface PageProps {
  searchParams: Promise<{ companyId?: string }>;
}

export default async function PurchaseProductPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const companyId = Number(params.companyId) || 3;

  const authorizedUser = await prisma.user.findFirst({
    where: {
      companyId,
      role: {
        in: ["OWNER", "MANAGER"],
      }
    },
    select: { id: true },
  });

  const activeUserId = authorizedUser?.id || 1;

  const [warehouses, suppliers, products] = await Promise.all([
    prisma.warehouse.findMany({ where: { companyId }, select: { id: true, name: true } }),
    prisma.supplier.findMany({ where: { companyId }, select: { id: true, name: true } }),
    prisma.product.findMany({ where: { companyId }, select: { id: true, name: true, costPrice: true } }),
  ]);

  return (
    <PurchaseProductFromSupplier
      companyId={companyId}
      userId={activeUserId}
      warehouses={warehouses}
      suppliers={suppliers}
      products={products.map((p) => ({
        id: p.id,
        name: p.name,
        price: p.costPrice,
      }))}
    />
  );
}
