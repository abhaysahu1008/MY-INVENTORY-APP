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
    <div>
      <AddProduct categories={categories} companySlug={company} />
    </div>
  );
};

export default AddProductPage;
