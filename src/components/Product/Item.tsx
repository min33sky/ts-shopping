import { IGetProducts } from '../../typings/shop';

function Item({ category, description, image, id, price, rating, title }: IGetProducts) {
  return (
    <li className="product-item">
      <p className="product-item__category">{category}</p>
      <p className="product-item__title">{title}</p>
      <img className="product-item__image" src={image} alt="product_image" />
      <p className="product-item__price">{price}</p>
      <p className="product-item__rating">{rating.rate}</p>
    </li>
  );
}

export default Item;
