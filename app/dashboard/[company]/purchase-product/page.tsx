import PurchaseProductFromSupplier from "../../../components/PurchaseProduct";
import { prisma } from "../../../lib/prisma";

interface PageProps {
  params: Promise<{
    company: string;
  }>;
  searchParams: Promise<{
    companyId?: string;
  }>
}

const PurchaseProduct = async ({ searchParams, params }: PageProps) => {
  const { company } = await params;
  const { companyId: companyIdStr } = await searchParams;

  const companyId = companyIdStr ? Number(companyIdStr) : undefined;

  if (!companyId) {
    return <div className="p-6 text-red-500">Missing or invalid Company ID.</div>;
  }

  const [warehouses, suppliers, products] = await Promise.all([
    prisma.warehouse.findMany({
      where: { companyId },
      select: { id: true, name: true },
    }),
    prisma.supplier.findMany({
      where: { companyId },
      select: { id: true, name: true },
    }),
    prisma.product.findMany({
      where: { companyId },
      select: { id: true, name: true, price: true },
    }),
  ]);

  return (
    <div className="p-6">
      <PurchaseProductFromSupplier
        companyId={companyId}
        warehouses={warehouses}
        suppliers={suppliers}
        products={products}
      />
    </div>
  );
};

export default PurchaseProduct;
