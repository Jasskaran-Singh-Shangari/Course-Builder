import { useState } from 'react';
import SortableModuleItem from "./SortableModuleItem";
import { closestCorners, DndContext } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSearchStore } from '../../store/useSearchStore';

const ModuleCard = ({
  module,
  onEdit,
  onDelete,
  items = [],
  setItems,
  onAddItem,
  onDeleteItem,
  dragHandleProps,
  setDroppableRef
}) => {
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);

  const { filteredModules } = useSearchStore();
  const moduleItems = items.filter(item => item.moduleId === module.id);

  const toggleOptions = e => {
    e.stopPropagation();
    setIsOptionsOpen(!isOptionsOpen);
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handleEdit = () => {
    onEdit(module);
    setIsOptionsOpen(false);
  };

  const handleDelete = () => {
    onDelete(module.id);
    setIsOptionsOpen(false);
  };

  const toggleAddMenu = e => {
    e.stopPropagation();
    setIsAddMenuOpen(!isAddMenuOpen);
  };

  const handleAddClick = type => {
    onAddItem(module.id, type);
    setIsAddMenuOpen(false);
  };

  const getItemPos = (id) => items.findIndex( (item)=>item.id === id)

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) return;

    const isOverThisModule = over.id === `module-droppable-${module.id}`;
    const draggedItem = items.find((item) => item.id === active.id);

    // Step 1: Handle drop from general -> into this module
    if (isOverThisModule && draggedItem && draggedItem.moduleId !== module.id) {
      setItems((items) =>
        items.map((item) =>
          item.id === active.id ? { ...item, moduleId: module.id } : item
        )
      );
      return; // done
    }

    // Step 2: Handle reordering *within* this module
    const moduleItemIds = items
      .filter((item) => item.moduleId === module.id)
      .map((item) => item.id);

    const activeIndex = moduleItemIds.indexOf(active.id);
    const overIndex = moduleItemIds.indexOf(over.id);

    if (activeIndex !== -1 && overIndex !== -1 && activeIndex !== overIndex) {
      const newOrder = arrayMove(moduleItemIds, activeIndex, overIndex);

      setItems((prevItems) => {
        const reordered = [...prevItems];

        // Get just this module's items
        const thisModuleItems = reordered.filter((item) => item.moduleId === module.id);

        // Apply new order within this module
        const reorderedModuleItems = thisModuleItems.sort(
          (a, b) => newOrder.indexOf(a.id) - newOrder.indexOf(b.id)
        );

        let j = 0;
        return reordered.map((item) => {
          if (item.moduleId === module.id) {
            return reorderedModuleItems[j++];
          }
          return item;
        });
      });

      return;
    }
  };

  return (
    <DndContext
    collisionDetection={closestCorners}
    onDragEnd={handleDragEnd}
    >
    <div className='module-wrapper'>
    <div className="drag-handle" {...dragHandleProps}>
      ⠿ 
    </div>
    <div className="module-card-container">
      <div className="module-card" onClick={toggleExpanded}>
        <div className="module-content">
          <div className="module-icon">
            <span className={`icon ${isExpanded ? 'expanded' : ''}`}>▼</span>
          </div>
          <div className="module-info">
            <h3 className="module-title">{module.name}</h3>
            <p className="module-subtitle">
              {moduleItems.length === 0
                ? 'Add items to this module'
                : `${moduleItems.length} item${moduleItems.length !== 1 ? 's' : ''}`}
            </p>
          </div>
        </div>
        <div className="module-actions">
          <button className="btn-options" onClick={toggleOptions}>
            <span className="options-icon">⋮</span>
          </button>
          {isOptionsOpen && (
            <div className="options-menu">
              <button className="option-item" onClick={handleEdit}>
                <span className="option-icon">✏️</span>
                Edit module name
              </button>
              <button className="option-item delete" onClick={handleDelete}>
                <span className="option-icon">🗑️</span>
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
      {isExpanded && (
        <div className="module-content-expanded" ref={setDroppableRef}>
          {moduleItems.length === 0 ? (
            <div className="empty-module-content">
              <p className="empty-module-message">
                No content added to this module yet.
              </p>
              <div className="add-item-container">
                <button className="add-item-button" onClick={toggleAddMenu}>
                  <span className="add-icon">+</span> Add item
                </button>
                {isAddMenuOpen && (
                  <div className="add-item-menu">
                    <button
                      className="add-item-option"
                      onClick={() => handleAddClick('link')}
                    >
                      <span className="item-icon">🔗</span>
                      Add a link
                    </button>
                    <button
                      className="add-item-option"
                      onClick={() => handleAddClick('file')}
                    >
                      <span className="item-icon">⬆️</span>
                      Upload file
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <SortableContext
            key={moduleItems.map(item => item.id).join('-')}
            items={moduleItems.map(item => item.id)}
            strategy={verticalListSortingStrategy}>
            <div className="module-items">
              <div className="module-items-list">
                {moduleItems.map(item => (
                  <SortableModuleItem
                    key={item.id}
                    id={item.id}
                    item={item}
                    onDelete={onDeleteItem}
                  />
                ))}
              </div>
              <div className="add-item-container">
                <button className="add-item-button" onClick={toggleAddMenu}>
                  <span className="add-icon">+</span> Add item
                </button>
                {isAddMenuOpen && (
                  <div className="add-item-menu">
                    <button
                      className="add-item-option"
                      onClick={() => handleAddClick('link')}
                    >
                      <span className="item-icon">🔗</span>
                      Add a link
                    </button>
                    <button
                      className="add-item-option"
                      onClick={() => handleAddClick('file')}
                    >
                      <span className="item-icon">⬆️</span>
                      Upload file
                    </button>
                  </div>
                )}
              </div>
            </div>
            </SortableContext>
          )}
        </div>
      )}
    </div>
    </div>
    </DndContext>
  );
};

export default ModuleCard;
