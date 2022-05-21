import { CartType } from '../../graphql/cart';

function CartItemData({
  product: { price, imageUrl, title, createdAt },
}: Pick<CartType, 'product'>) {
  console.log(title, createdAt);

  return (
    <div className="cart-item-data">
      <img className="cart-item-data__image" src={imageUrl} alt="productImage" />
      {!createdAt && (
        <>
          <p>품절!</p>
        </>
      )}
      {createdAt && (
        <>
          <p className="cart-item-data__title">{title}</p>
          <p className="cart-item-data__price">${price}</p>
        </>
      )}
    </div>
  );
}

export default CartItemData;
