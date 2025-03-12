import React, { useEffect, useRef, useState } from "react";
import Dropdown from "../elements/Dropdown";
import Status from "../elements/Status";
import { preconnect } from "react-dom";

export default function Tasks({
  departments,
  priorities,
  statuses,
  employees,
  tasks,
}) {
  const [departmentFilters, setDepartmentFilters] = useState([]);
  const [priorityFilters, setpriorityFilters] = useState([]);
  const [employeesFilters, setEmployeesFilters] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState(tasks);

  function getDropdownFilters(label, option) {
    switch (label) {
      case "დეპარტამენტი":
        setDepartmentFilters((prev) =>
          prev.includes(option.id)
            ? prev.filter((item) => item !== option.id)
            : [...prev, option.id]
        );
        break;
      case "პრიორიტეტი":
        setpriorityFilters((prev) =>
          prev.includes(option.id)
            ? prev.filter((item) => item !== option.id)
            : [...prev, option.id]
        );
        break;
      case "თანამშრომელი":
        setEmployeesFilters((prev) =>
          prev.includes(option.id)
            ? prev.filter((item) => item !== option.id)
            : [...prev, option.id]
        );
        break;
      default:
        break;
    }
  }

  function filterTasks() {
    const filters = [
      { list: priorityFilters, key: "priority.id" },
      { list: departmentFilters, key: "department.id" },
      { list: employeesFilters, key: "employee.id" },
    ];

    let filtered = tasks;

    filters.forEach(({ list, key }) => {
      if (list.length > 0) {
        filtered = filtered.filter((item) =>
          list.includes(getNestedValue(item, key))
        );
      }
    });

    setFilteredTasks(filtered);
  }

  function getNestedValue(obj, path) {
    return path.split(".").reduce((acc, key) => acc?.[key], obj);
  }

  useEffect(() => {
    filterTasks();
  }, [departmentFilters, priorityFilters, employeesFilters]);
  return (
    <div className="px-[120px] pt-[140px] pb-[131px]">
      <h1 className="text-[34px]">დავალებების გვერდი</h1>
      <div className="flex justify-between relative w-[688px] mt-[53px] border border-gray-300 rounded-lg">
        <Dropdown
          label="დეპარტამენტი"
          options={departments}
          getDropdownFilters={getDropdownFilters}
        />
        <Dropdown
          label="პრიორიტეტი"
          options={priorities}
          getDropdownFilters={getDropdownFilters}
        />
        <Dropdown
          label="თანამშრომელი"
          options={employees}
          getDropdownFilters={getDropdownFilters}
        />
      </div>
      <div className="mt-[79px] flex justify-between">
        {statuses.map((item, index) => (
          <Status
            key={index}
            item={item}
            tasks={filteredTasks.filter((task) => task.status.id == item.id)}
          />
        ))}
      </div>
    </div>
  );
}
