import { Product, Products } from '../../graphql/products';
import ProductItem from './Item';

function ProductsList({ data }: { data: Products[] }) {
  return (
    <div>
      <ul className="products">
        {data.map((pages) =>
          pages.products.map((product) => <ProductItem key={product.id} {...product} />)
        )}
      </ul>
    </div>
  );
}

export default ProductsList;
