import AddProduct from '../../../../components/AddProduct';
import { prisma } from '../../../lib/prisma';

interface PageProps {
  params: Promise<{ company: string }>
  searchParams: Promise<{ companyId: string }>
}

const AddProductPage = async ({ params, searchParams }: PageProps) => {
  const { company } = await params;
  const { companyId } = await searchParams;

  const parsedCompanyId = companyId ? Number(companyId) : undefined;

  const categories = await prisma.category.findMany({
    where: {
      company: {
        id: parsedCompanyId,
      },
    },
  });

  return (
    <div className="min-h-screen bg-black flex items-start justify-center p-6">
      <div className="w-full max-w-2xl">
        <AddProduct categories={categories} companySlug={company} />
      </div>
    </div>
  );
};

export default AddProductPage;
