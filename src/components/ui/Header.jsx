import { useState, useRef, useEffect } from 'react';
import { useSearchStore } from '../../store/useSearchStore';

const Header = ({ onAddClick }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const {searchTerm, setSearchTerm} = useSearchStore();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = event => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  const handleAddClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleCreateModule = () => {
    onAddClick('module');
    setIsDropdownOpen(false);
  };

  const handleAddLink = () => {
    onAddClick('link')
    setIsDropdownOpen(false);
  };

  const handleUpload = () => {
    onAddClick('file')
    setIsDropdownOpen(false);
  };

  return (
    <div className="header">
      <h1 className="header-title">Course builder</h1>
      <div className="header-right">
        <div className="search-container">
          <input type="text" 
          placeholder="Search..." 
          value={searchTerm}
          onChange={(e)=>setSearchTerm(e.target.value)}
          className="search-input"
           />
        </div>
        <div className="dropdown-container" ref={dropdownRef}>
          <button className="add-button" onClick={handleAddClick}>
            Add +
          </button>
          {isDropdownOpen && (
            <div className="dropdown-menu">
              <button className="dropdown-item" onClick={handleCreateModule}>
                <span className="item-icon">📄</span>
                Create module
              </button>
              <button className="dropdown-item" onClick={handleAddLink}>
                <span className="item-icon">🔗</span>
                Add a link
              </button>
              <button className="dropdown-item" onClick={handleUpload}>
                <span className="item-icon">⬆️</span>
                Upload
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
