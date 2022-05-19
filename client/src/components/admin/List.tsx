import { Products } from '../../graphql/products';
import AdminItem from './Item';

function AdminList({
  data,
  editingIndex,
  startEdit,
  exitEdit,
}: {
  data: Products[];
  editingIndex: number | null;
  startEdit: (index: number) => () => void;
  exitEdit: () => void;
}) {
  return (
    <div>
      <ul className="products">
        {data.map((pages) =>
          pages.products.map((product, idx) => (
            <AdminItem
              key={product.id}
              {...product}
              isEditing={editingIndex === idx}
              startEdit={startEdit(idx)}
              exitEdit={exitEdit}
            />
          ))
        )}
      </ul>
    </div>
  );
}

export default AdminList;
