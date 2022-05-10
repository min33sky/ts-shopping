import { Link } from 'react-router-dom';
import { Product } from '../../graphql/products';

function Item({ imageUrl, id, price, title }: Product) {
  return (
    <Link to={`/products/${id}`}>
      <li className="product-item">
        <p className="product-item__title">{title}</p>
        <img className="product-item__image" src={imageUrl} alt="product_image" />
        <p className="product-item__price">{price}</p>
      </li>
    </Link>
  );
}

export default Item;
