import { useState, useEffect, useMemo } from 'react';


import EmptyState from '../ui/EmptyState';
import Header from '../ui/Header';
import { useSearchStore } from '../../store/useSearchStore';

import LinkModal from './LinkModal';
import ModuleModal from './ModuleModal';
import UploadModal from './UploadModal';
import SortableItem from './SortableItem';
import SortableModuleCard from './SortableModuleCard';
import ModuleTree from '../ui/ModuleTree';

// Drog N Drop Functionalities using @dnd-kit
import {closestCorners, DndContext, DragOverlay} from "@dnd-kit/core";
import {arrayMove, SortableContext, verticalListSortingStrategy} from "@dnd-kit/sortable";

const CourseBuilder = () => {
  const [items, setItems] = useState(()=>{
    const storedItems=localStorage.getItem("items");
    return storedItems ? JSON.parse(storedItems) : [];
  });

  const {searchTerm, setFilteredModules, filteredModules} = useSearchStore();

  const generalItems = useMemo(() =>
  items.filter((i) => i && !i.moduleId && 
    i.title?.toLowerCase().includes(searchTerm.toLowerCase())
  ), [items, searchTerm]);

  // The modules and the items will persist through reloads.

  const [modules, setModules] = useState(()=>{
    const storedModules = localStorage.getItem("modules");
    return storedModules ? JSON.parse(storedModules) : [];
  });

  useEffect(() => {
  const filtered = modules.filter((m) =>
    m.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  setFilteredModules(filtered);
}, [modules, searchTerm]);

  useEffect(()=>{
    localStorage.setItem("modules", JSON.stringify(modules))
    localStorage.setItem("items", JSON.stringify(items));
  }, [modules, items]);

  // Modal states
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Current items for editing
  const [currentModule, setCurrentModule] = useState(null);
  const [currentModuleId, setCurrentModuleId] = useState(null);

  const handleAddClick = (type) => {
    switch (type) {
      case 'module':
        setCurrentModule(null);
        setIsModuleModalOpen(true);
        break;
      case 'file':
        // This is handled through the module card now
        console.log("Opening Upload Modal");
        setCurrentModule(null);
        setIsUploadModalOpen(true);  
        break;
      case 'link':
        // This is handled through the module card now
        console.log("Opening Link Modal");
        setCurrentModule(null);
        setIsLinkModalOpen(true);
        break;
      default:
        break;
    }
  };

  const handleCloseModuleModal = () => {
    setIsModuleModalOpen(false);
    setCurrentModule(null);
  };

  const handleCloseLinkModal = () => {
    setIsLinkModalOpen(false);
    setCurrentModuleId(null);
  };

  const handleCloseUploadModal = () => {
    setIsUploadModalOpen(false);
    setCurrentModuleId(null);
  };

  const handleSaveModule = module => {
    if (currentModule) {
      // Edit existing module
      setModules(modules.map(m => (m.id === module.id ? module : m)));
    } else {
      // Add new module
      setModules([...modules, module]);
    }
    setIsModuleModalOpen(false);
    setCurrentModule(null);
  };

  const handleEditModule = module => {
    setCurrentModule(module);
    setIsModuleModalOpen(true);
  };

  const handleDeleteModule = moduleId => {
    setModules(modules.filter(module => module.id !== moduleId));
    // Also remove any items associated with this module
    setItems(items.filter(item => item.moduleId !== moduleId));
  };

  const handleAddItem = (moduleId, type) => {
    setCurrentModuleId(moduleId);
    if (type === 'link') {
      setIsLinkModalOpen(true);
    } else if (type === 'file') {
      setIsUploadModalOpen(true);
    }
  };

  const handleSaveLink = linkItem => {
    setItems([...items, linkItem]);
    setIsLinkModalOpen(false);
    setCurrentModuleId(null);
  };

  const handleSaveUpload = fileItem => {
    setItems([...items, fileItem]);
    setIsUploadModalOpen(false);
    setCurrentModuleId(null);
  };

  const handleDeleteItem = itemId => {
    setItems(items.filter(item => item.id !== itemId));
  };

  const getItemPos = (id) => items.findIndex((item)=>item.id === id);

  const getModulePos = (id) => modules.findIndex((module)=> module.id === id);
  
  const handleDragEnd = (event) =>{
    const { active, over } = event;
    console.log('Drag ended', { active: active.id, over: over?.id });

    const isModule = modules.find((m) => m.id === active.id);
    if(isModule){
      setModules(modules=>{
        const originalPos=getModulePos(active.id);
        const newPos=getModulePos(over.id);

        return arrayMove(modules, originalPos, newPos);
      })
      return;
    }
    if (over.id.startsWith("module-droppable-")) {
    const moduleId = over.id.replace("module-droppable-", "");
    setItems((items) =>
      items.map((item) =>
        item.id === active.id ? { ...item, moduleId } : item
      )
    );

    return;
  }
    setItems(items => {
      const originalPos=getItemPos(active.id);
      const newPos=getItemPos(over.id);
  
      return arrayMove(items, originalPos, newPos)
    })
  }

  const moduleIds = modules.map((m) => m.id);
  const generalItemIds = generalItems.map((i) => i.id);
  const droppableModuleIds = modules.map((m) => `module-droppable-${m.id}`);

  const allDraggableIds = [...moduleIds, ...generalItemIds, ...droppableModuleIds];

  const [activeItem, setActiveItem] = useState(null);
  return (
    
    <DndContext 
      collisionDetection={closestCorners}
      onDragStart={({ active }) => {
        const item = items.find(i => i.id === active.id);
        setActiveItem(item);
      }}
      onDragEnd={(event) => {
        handleDragEnd(event);
        setActiveItem(null); // cleanup
      }}
      onDragCancel={() => setActiveItem(null)}
    >
      
    {
      modules.length>1 ?
      <div className='green-outline'></div> :
      <div className='red-outline'></div>
    }

    <div className="course-builder">
      <Header onAddClick={handleAddClick} />
      <div className='layout-container'>
      <div className='left-side'>
      <SortableContext
          items={[...moduleIds, ...generalItemIds]}
          strategy={verticalListSortingStrategy}>
      <div className="builder-content">
        {modules.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="module-list">
            {filteredModules.map(module => (
              <SortableModuleCard
                key={module.id}
                id={module.id}
                module={module}
                items={items}
                setItems={setItems}
                onEdit={handleEditModule}
                onDelete={handleDeleteModule}
                onAddItem={handleAddItem}
                onDeleteItem={handleDeleteItem}
              />
            ))}
          </div>
        )}
      </div>

      {generalItems.length > 0 && (
        <div className='general-items'>
          <h3>General List</h3>
          {generalItems.map((item)=>(
              <SortableItem
                key={item.id} 
                id={item.id}
                item={item} 
                onDelete={handleDeleteItem} 
              />
          ))}
        </div>
        )
      }
      {/* Module Modal */}
      <ModuleModal
        isOpen={isModuleModalOpen}
        onClose={handleCloseModuleModal}
        onSave={handleSaveModule}
        module={currentModule}
      />

      {/* Link Modal */}
      <LinkModal
        isOpen={isLinkModalOpen}
        onClose={handleCloseLinkModal}
        onSave={handleSaveLink}
        moduleId={currentModuleId}
      />

      {/* Upload Modal */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={handleCloseUploadModal}
        onSave={handleSaveUpload}
        moduleId={currentModuleId}
      />
      </SortableContext>
      </div>
    
      <DragOverlay>
      {activeItem ? (
        <SortableItem
          item={activeItem}
          dragHandleProps={{}}
        />
      ) : null}
      </DragOverlay>
      <div className="module-tree right-side">
        <ModuleTree modules={modules} items={items} generalItems={generalItems} />
      </div>
      </div>

      </div>
    </DndContext>
  );
};

export default CourseBuilder;
