import { Products } from '../../graphql/products';
import ProductItem from './Item';

function ProductsList({ data }: { data: Products[] }) {
  return (
    <div>
      <h2>상품 리스트</h2>
      <ul className="products">
        {data.map((pages) =>
          pages.products.map((product) => <ProductItem key={product.id} {...product} />)
        )}
      </ul>
    </div>
  );
}

export default ProductsList;
