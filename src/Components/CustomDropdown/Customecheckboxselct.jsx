import React, { useState } from 'react';
import './CustomDropdown.css';
import { useDispatch } from 'react-redux';
import { setAdscatgoery } from '../../redux/action';

const CustomeCheckboxSelect = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
const dispatch = useDispatch()
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if(selectedOptions.length > 0 ){
      dispatch(setAdscatgoery(selectedOptions))
    }else{
      dispatch(setAdscatgoery(selectedOptions))
    }
  };

  const handleOptionClick = (option) => {
    const isSelected = selectedOptions.includes(option.categoryId);
    if (isSelected) {
      setSelectedOptions(selectedOptions.filter(item => item !== option.categoryId));
    } else {
      setSelectedOptions([...selectedOptions, option.categoryId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedOptions.length === props.select.length) {
      setSelectedOptions([]);
    } else {
      const allOptions = props.select.map(option => option.categoryId);
      setSelectedOptions(allOptions);
    }
  };

  return (
    <>
      <div className="custom-dropdown w-100 mb-3 check-box">
        <label className='tamp-label'>Offer On Category</label>
        <div className="selected-option form-select" onClick={toggleDropdown}>
          {selectedOptions.length > 0 ? (
            <span className="selected-item">{`Selected Categories (${selectedOptions.length})`}</span>
          ) : (
            'Select an option'
          )}
        </div>
        {isOpen && (
          <ul className="dropdown-menu show">
            <li key="select-all" onClick={handleSelectAll}>
              <div className="form-group">
                <input
                  type="checkbox"
                  id="select-all"
                  checked={selectedOptions.length === props.select.length}
                  onChange={handleSelectAll}
                />
                <label htmlFor="select-all">Select All</label>
              </div>
            </li>
            {props?.select?.map(option => (
              <li key={option.id} onClick={() => handleOptionClick(option)}>
                <div className="form-group mb-0">
                  <input
                    type="checkbox"
                    id={option.categoryId}
                    checked={selectedOptions.includes(option.categoryId)}
                    onChange={() => handleOptionClick(option)}
                  />
                  <label htmlFor={option.categoryId}>
                    {option.categoryName}
                  </label>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

export default CustomeCheckboxSelect;
