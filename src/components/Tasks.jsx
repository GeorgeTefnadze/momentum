import React, { useEffect, useRef, useState } from "react";

import Dropdown from "../elements/Dropdown";
import Status from "../elements/Status";
import Filters from "../elements/Filters";

import useLocalStorageState from "../hooks/useLocalStorageState";

export default function Tasks({
  departments,
  priorities,
  statuses,
  employees,
  tasks,
}) {
  const [employeesFilters, setEmployeesFilters] = useLocalStorageState(
    "employeesFilters",
    []
  );

  const [departmentFilters, setDepartmentFilters] = useLocalStorageState(
    "departmentFilters",
    []
  );
  const [priorityFilters, setPriorityFilters] = useLocalStorageState(
    "priorityFilters",
    []
  );

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
        setPriorityFilters((prev) =>
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

  function handleFilters(identifyer, id) {
    switch (identifyer) {
      case 1:
        setDepartmentFilters((prev) => prev.filter((item) => item != id));
        break;
      case 2:
        setPriorityFilters((prev) => prev.filter((item) => item != id));
        break;
      case 3:
        setEmployeesFilters((prev) => prev.filter((item) => item != id));
        break;

      default:
        break;
    }
  }

  function clearFilters() {
    setEmployeesFilters([]);
    setDepartmentFilters([]);
    setPriorityFilters([]);
  }
  return (
    <div className="px-[120px] pt-[140px] pb-[131px]">
      <h1 className="text-[34px]">დავალებების გვერდი</h1>
      <div className="flex justify-between relative w-[688px] mt-[53px] border border-gray-300 rounded-lg">
        <Dropdown
          label="დეპარტამენტი"
          options={departments}
          getDropdownFilters={getDropdownFilters}
          identifyer={1}
          arrgetter={departmentFilters}
          arrsetter={setDepartmentFilters}
        />
        <Dropdown
          label="პრიორიტეტი"
          options={priorities}
          getDropdownFilters={getDropdownFilters}
          identifyer={2}
          arrgetter={priorityFilters}
          arrsetter={setPriorityFilters}
        />
        <Dropdown
          label="თანამშრომელი"
          options={employees}
          getDropdownFilters={getDropdownFilters}
          identifyer={3}
          arrgetter={employeesFilters}
          arrsetter={setEmployeesFilters}
        />
      </div>
      <div className="flex gap-4 flex-wrap items-center mt-[25px] min-h-[29px] w-full">
        {departmentFilters.map((item) => (
          <Filters
            key={item}
            info={departments.find((el) => el.id == item)}
            identifyer={1}
            handleFilters={handleFilters}
          />
        ))}
        {priorityFilters.map((item) => (
          <Filters
            key={item}
            info={priorities.find((el) => el.id == item)}
            identifyer={2}
            handleFilters={handleFilters}
          />
        ))}
        {employeesFilters.map((item) => (
          <Filters
            key={item}
            info={employees.find((el) => el.id == item)}
            identifyer={3}
            handleFilters={handleFilters}
          />
        ))}
        {departmentFilters.length ||
        priorityFilters.length ||
        employeesFilters.length ? (
          <button
            onClick={() => clearFilters()}
            className="text-[14px] text-textgray cursor-pointer"
          >
            გასუფთავება
          </button>
        ) : null}
      </div>
      <div className="mt-[24px] flex justify-between">
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
