import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import ModuleCard from "./ModuleCard";
import { useDroppable } from "@dnd-kit/core";

const SortableModuleCard = ({
  id,
  module,
  items,
  setItems,
  onEdit,
  onDelete,
  onAddItem,
  onDeleteItem,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

 const { setNodeRef: setDroppableRef } = useDroppable({
  id: `module-droppable-${module.id}`,
});


  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: "grab",
  };

  

  return (
    <div ref={setNodeRef} style={style} >
      <ModuleCard
        module={module}
        items={items.filter(item => item.moduleId === module.id)}
        setItems={setItems}
        onEdit={onEdit}
        onDelete={onDelete}
        onAddItem={onAddItem}
        onDeleteItem={onDeleteItem}
        dragHandleProps={{...attributes, ...listeners}}
        setDroppableRef={setDroppableRef}
      />
    </div>
  );
};

export default SortableModuleCard;
