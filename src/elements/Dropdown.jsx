import { forwardRef, useState, useEffect, useRef } from "react";

import useColorById from "../hooks/useColorById";

const Dropdown = ({
  label,
  options,
  getDropdownFilters,
  identifyer,
  arrgetter,
  arrsetter,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  // const [selectedOptions, setSelectedOptions] = useState([]);

  const dropdownRef = useRef(null);
  const parentRef = useRef(null);

  function getColor(id) {
    switch (id) {
      case 1:
        return "border-mainpurple after:border-mainpurple";

      case 2:
        return "border-mainred after:border-mainred";

      case 3:
        return "border-mainyellow after:border-mainyellow";

      case 4:
        return "border-maingreen after:border-maingreen";

      case 5:
        return "border-mainblue after:border-mainblue";

      case 6:
        return "border-mainorange after:border-mainorange";

      case 7:
        return "border-mainpink after:border-mainpink";

      default:
        break;
    }
  }

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleCheckboxChange = (option) => {
    getDropdownFilters(label, option);
    // arrsetter((prev) =>
    //   prev.includes(option)
    //     ? prev.filter((item) => item !== option)
    //     : [...prev, option]
    // );
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        if (!parentRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className={`w-[199px]`}>
      <button
        onClick={toggleDropdown}
        className={`w-full px-[18px] py-[10px] flex gap-2 items-center cursor-pointer hover:text-hoverpurple ${
          isOpen ? "outline outline-black rounded-[5px]" : ""
        }`}
        ref={parentRef}
      >
        <span className={`${isOpen ? "text-mainpurple" : ""}`}>{label}</span>
        <svg
          className={`w-5 h-5 transition-transform ${
            isOpen ? "rotate-180 text-mainpurple" : ""
          }`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div
          className={`absolute left-0 w-full mt-2 px-[20px] py-[15px] bg-white border border-mainpurple shadow-lg rounded-lg z-10`}
          ref={dropdownRef}
        >
          {options.map((option) => {
            return (
              <label
                key={option.id}
                className="custom-checkbox flex items-center px-4 py-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={arrgetter.includes(option.id)}
                  onChange={() => handleCheckboxChange(option)}
                  className="mr-2"
                />
                <span
                  className={`checkmark border-2 ${
                    label == "დეპარტამენტი"
                      ? useColorById("department", option.id, "border") +
                        " " +
                        useColorById("department", option.id, "after:border")
                      : "border-mainpurple after:border-mainpurple"
                  } `}
                ></span>
                {label == "თანამშრომელი" ? (
                  <div className="flex items-center gap-[15px]">
                    <div className="flex items-center justify-center  rounded-full overflow-hidden h-[28px] w-[28px]">
                      <img
                        src={option.avatar}
                        alt=""
                        className="object-cover h-full"
                      />
                    </div>
                    <p>{`${option.name} ${option.surname}`}</p>
                  </div>
                ) : (
                  option.name
                )}
              </label>
            );
          })}

          <div className="flex w-full justify-end mt-[10px]">
            <button
              onClick={toggleDropdown}
              className="w-[155px] h-[35px] bg-purple-600 text-white rounded-[20px] cursor-pointer hover:bg-purple-700"
            >
              არჩევა
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
