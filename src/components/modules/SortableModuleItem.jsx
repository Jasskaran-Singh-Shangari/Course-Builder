import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import ModuleItem from "./ModuleItem";

const SortableModuleItem = ({id, item, onDelete}) => {

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
        cursor:'pointer',
        opacity: isDragging ? 0.5 : 1,
    }

  return (
    <div ref={setNodeRef} style={style}>
      <ModuleItem 
      item={item} 
      onDelete={onDelete} 
      dragHandleProps={{...attributes, ...listeners}}
      />
    </div>
  )
}

export default SortableModuleItem
