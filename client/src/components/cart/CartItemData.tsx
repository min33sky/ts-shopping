import { CartType } from '../../graphql/cart';

function CartItemData({ imageUrl, title, price }: Pick<CartType, 'imageUrl' | 'price' | 'title'>) {
  return (
    <div className="cart-item-data">
      <img className="cart-item-data__image" src={imageUrl} alt="productImage" />
      <p className="cart-item-data__title">{title}</p>
      <p className="cart-item-data__price">${price}</p>
    </div>
  );
}

export default CartItemData;
