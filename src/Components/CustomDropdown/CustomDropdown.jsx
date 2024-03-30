import React, { useState } from 'react';
import './CustomDropdown.css'; // Import CSS file for styling
import { useDispatch } from 'react-redux';
import { setAdstemplate } from '../../redux/action';

const CustomDropdown = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const dispatch = useDispatch()

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
    dispatch(setAdstemplate(option))
  };

  return (
<div className="custom-dropdown w-100 mb-3">
  <label className='tamp-label'>template Type</label>
  <div className="selected-option form-select " style={{height:`${selectedOption ? "auto" : "50px"}`}} onClick={toggleDropdown}>
    {selectedOption ? <img src={selectedOption.imageurl} className='option-img'  alt={selectedOption.label} /> : 'Select an option'}
  </div>
  {isOpen && (
    <ul className="dropdown-menu show">
      {props?.select?.map(option => (
        <li key={option.id} onClick={() => handleOptionClick(option)}>
          <img
            src={option?.imageurl}
            alt={option.label}
            className={`${selectedOption === option ? 'selected' : ''} option-img`}
          />
          {option.label}
        </li>
      ))}
    </ul>
  )}
</div>

  );
};

export default CustomDropdown;
