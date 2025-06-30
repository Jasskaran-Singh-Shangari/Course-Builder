const ModuleTree = ({modules, items, generalItems}) => {
    
  return (
    <div className="module-tree">
        <h2 className="">Course Structure</h2>
        <ul className="module-tree-list">
            {modules.map((module)=>{
                const moduleItems=items.filter((item)=> item.moduleId === module.id);
                return (
                    <li key={module.id} className="">
                        <strong>{module.name}</strong>
                        {moduleItems.length>0 ? 
                            <ul className="module-tree-module-items">
                                {moduleItems.map((i)=>(
                                    <li key={i.moduleId}>
                                        {i.title}
                                    </li>
                                ))}
                            </ul>
                         : 
                         <li></li> }
                    </li>
                )
            })}

            {generalItems.length > 0 && (
                <div>
                <ul className="module-tree-general-list">
                {generalItems.map((i) => (
              <li key={i.id}>{i.title}</li>
            ))}
            </ul>
        </div>
      )}
        </ul>
    </div>
  )
}

export default ModuleTree;
