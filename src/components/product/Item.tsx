import { Link } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { cartItemSelector } from '../../atoms/cart';
import { Product } from '../../graphql/products';

function ProductItem({ imageUrl, id, price, title }: Product) {
  const [cartAmount, setCartAmount] = useRecoilState(cartItemSelector(id));
  const addToCart = () => {
    setCartAmount((prev) => (prev || 0) + 1);
  };

  return (
    <li className="product-item">
      <Link to={`/products/${id}`}>
        <p className="product-item__title">{title}</p>
        <img className="product-item__image" src={imageUrl} alt="product_image" />
        <p className="product-item__price">{price}</p>
      </Link>
      <button className="product-item__add-cart" onClick={addToCart}>
        담기
      </button>
      <span>{cartAmount || 0}</span>
    </li>
  );
}

export default ProductItem;
