import { IProducts } from '../../typings/shop';

function ProductDetail({
  item: { category, description, image, price, rating, title },
}: {
  item: IProducts;
}) {
  return (
    <div className="product-detail">
      <p className="product-detail__category">{category}</p>
      <p className="product-detail__title">{title}</p>
      <img className="product-detail__image" src={image} alt="product_image" />
      <p className="product-detail__price">{price}</p>
      <p className="product-detail__rating">{rating.rate}</p>
    </div>
  );
}

export default ProductDetail;
