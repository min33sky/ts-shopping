import { Product } from '../../graphql/products';

function ProductDetail({ item: { description, imageUrl, price, title } }: { item: Product }) {
  return (
    <div className="product-detail">
      <p className="product-detail__title">{title}</p>
      <img className="product-detail__image" src={imageUrl} alt="product_image" />
      <p className="product-detail__price">{price}</p>
    </div>
  );
}

export default ProductDetail;
