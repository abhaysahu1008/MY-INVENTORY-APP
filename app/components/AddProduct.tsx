
import { prisma } from '../lib/prisma'

const AddProduct = async () => {

  const categories = await prisma.category.findMany();
  console.log(categories);

  return (
    <div>AddProduct</div>
  )
}

export default AddProduct;
