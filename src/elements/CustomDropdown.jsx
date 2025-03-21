import React, { useState, useRef, useEffect } from "react";
import arrowIcon from "../assets/arrowdown.svg";
import addemployeeIcon from "../assets/addemployee.svg";
import useModalStore from "../hooks/useModalStore";

export default function CustomDropdown({
  handler,
  options,
  label,
  department_id,
  defaultValue,
  createEmployee,
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [filteredOptions, setFilteredOptions] = useState(options);
  const dropdownRef = useRef(null);
  const { openModal } = useModalStore();

  useEffect(() => {
    setSelectedOption(null);
  }, [department_id]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  useEffect(() => {
    if (department_id !== undefined) {
      setFilteredOptions(
        options.filter((item) => item.department.id == department_id)
      );
    } else {
      setFilteredOptions(options);
    }
  }, [department_id, options]);

  useEffect(() => {
    setSelectedOption(defaultValue);
  }, [defaultValue]);

  function handleClick() {
    if (department_id != "") {
      setIsDropdownOpen((prev) => !prev);
    } else {
      alert("გთხოვთ აირჩიეთ დეპარტამენტი");
    }
  }

  return (
    <div className="flex flex-col gap-[3px]" ref={dropdownRef}>
      <p>
        {label}
        <span>*</span>
      </p>
      <div className="relative h-[50px]">
        <div
          className={`p-3 h-full border border-mainoutline ${
            isDropdownOpen ? "border-mainpurple" : ""
          } hover:border-hoverpurple rounded-md bg-white flex ${
            selectedOption ? "justify-between" : "justify-end"
          } items-center cursor-pointer duration-200`}
          onClick={() => handleClick()}
        >
          <div className="flex items-center gap-[10px]">
            {selectedOption?.icon ? (
              <img src={selectedOption.icon} alt="" />
            ) : null}
            {selectedOption?.avatar ? (
              <img
                src={selectedOption.avatar}
                alt=""
                className="w-[30px] h-[30px] rounded-full"
              />
            ) : null}
            <p>
              {selectedOption?.name} {selectedOption?.surname}
            </p>
          </div>

          <span className="text-textgray">
            <img
              src={arrowIcon}
              alt=""
              className={isDropdownOpen ? "rotate-180" : ""}
            />
          </span>
        </div>
        {isDropdownOpen && (
          <ul className="absolute w-full max-h-[150px] overflow-y-scroll mt-1 bg-white border border-gray-300 rounded-md shadow-md z-10">
            {createEmployee && (
              <li
                onClick={openModal}
                className="flex items-center gap-[10px] p-3 cursor-pointer hover:bg-gray-200 rounded-md text-mainpurple"
              >
                <img src={addemployeeIcon} alt="" />
                <p>დაამატე თანამშრომელი</p>
              </li>
            )}
            {filteredOptions?.map((option) => (
              <li
                key={option.id}
                className="flex items-center gap-[10px] p-3 cursor-pointer hover:bg-gray-200 rounded-md"
                onClick={() => {
                  handler(option.id);
                  setSelectedOption(option);
                  setIsDropdownOpen(false);
                }}
              >
                {option?.icon ? <img src={option.icon} alt="" /> : null}
                {option?.avatar ? (
                  <img
                    src={option.avatar}
                    alt=""
                    className="w-[30px] h-[30px] rounded-full"
                  />
                ) : null}
                <p>
                  {option.name} {option?.surname}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
