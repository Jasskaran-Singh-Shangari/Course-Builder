import { useSortable } from "@dnd-kit/sortable"
import Item from "./Item";
import { CSS } from "@dnd-kit/utilities";

const SortableItem = ({id, item, onDelete}) => {
    const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform), 
    transition,
    opacity: isDragging ? 0.5 : 1,
  }


  return (
    <div ref={setNodeRef} style={style} >
      <Item 
      item={item} 
      onDelete={onDelete}
      dragHandleProps={{...attributes, ...listeners}}
      />
    </div>
  )
}

export default SortableItem;
