import { prisma } from '../../../lib/prisma';
import AddProduct from '../../../components/AddProduct';

const AddProductPage = async () => {




  const categories = await prisma.category.findMany();
  console.log(categories);

  return (
    <div>

      <AddProduct categories={categories} />
    </div>
  )
}

export default AddProductPage
