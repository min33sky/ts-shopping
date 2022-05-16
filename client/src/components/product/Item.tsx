import React from 'react';
import { useMutation } from 'react-query';
import { Link } from 'react-router-dom';
import { ADD_CART } from '../../graphql/cart';
import { Product } from '../../graphql/products';
import { graphqlFetcher } from '../../queryClient';

function ProductItem({ imageUrl, id, price, title }: Product) {
  // const [cartAmount, setCartAmount] = useRecoilState(cartItemSelector(id));

  const { mutate: addCart } = useMutation((id: string) =>
    graphqlFetcher(ADD_CART, { productId: id })
  );

  const handleAddCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    //? 장바구니 버튼은 Link 이벤트가 호출되지 않도록 막는다.
    e.preventDefault();
    addCart(id);
  };

  return (
    <li className="product-item">
      <Link to={`/products/${id}`}>
        <p className="product-item__title">{title}</p>
        <img className="product-item__image" src={imageUrl} alt="product_image" />
        <div className="product-item__footer">
          <p className="product-item__price">${price}</p>
          <button className="product-item__add-cart" onClick={handleAddCart}>
            담기
          </button>
        </div>
      </Link>
    </li>
  );
}

export default ProductItem;
