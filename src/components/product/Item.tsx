import { useMutation } from 'react-query';
import { Link } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { cartItemSelector } from '../../atoms/cart';
import { ADD_CART } from '../../graphql/cart';
import { Product } from '../../graphql/products';
import { graphqlFetcher } from '../../queryClient';

function ProductItem({ imageUrl, id, price, title }: Product) {
  // const [cartAmount, setCartAmount] = useRecoilState(cartItemSelector(id));
  const { mutate: addCart } = useMutation((id: string) => graphqlFetcher(ADD_CART, { id }));

  return (
    <li className="product-item">
      <Link to={`/products/${id}`}>
        <p className="product-item__title">{title}</p>
        <img className="product-item__image" src={imageUrl} alt="product_image" />
        <p className="product-item__price">{price}</p>
      </Link>
      <button className="product-item__add-cart" onClick={() => addCart(id)}>
        담기
      </button>
    </li>
  );
}

export default ProductItem;
