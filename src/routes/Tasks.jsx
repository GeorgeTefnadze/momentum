import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

import Dropdown from "../elements/Dropdown";
import Status from "../elements/Status";
import Filters from "../elements/Filters";

import useLocalStorageState from "../hooks/useLocalStorageState";

const initialFilters = {
  employees: [],
  department: [],
  priority: [],
};

export default function Tasks({
  departments,
  priorities,
  statuses,
  employees,
  tasks,
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState(initialFilters);
  const [filteredTasks, setFilteredTasks] = useState([]);

  useEffect(() => {
    const employees =
      searchParams.get("employees")?.split(",").map(Number) || [];
    const department =
      searchParams.get("department")?.split(",").map(Number) || [];
    const priority = searchParams.get("priority")?.split(",").map(Number) || [];

    setFilters({ employees, department, priority });
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();

    if (filters.employees.length)
      params.set("employees", filters.employees.join(","));
    if (filters.department.length)
      params.set("department", filters.department.join(","));
    if (filters.priority.length)
      params.set("priority", filters.priority.join(","));

    setSearchParams(params);
  }, [filters]);

  useEffect(() => {
    if (tasks) {
      let filtered = tasks;

      if (filters.employees.length) {
        filtered = filtered.filter((task) =>
          filters.employees.includes(task.employee.id)
        );
      }
      if (filters.department.length) {
        filtered = filtered.filter((task) =>
          filters.department.includes(task.department.id)
        );
      }
      if (filters.priority.length) {
        filtered = filtered.filter((task) =>
          filters.priority.includes(task.priority.id)
        );
      }

      setFilteredTasks(filtered);
    }
  }, [filters, tasks]);

  function getDropdownFilters(label, option) {
    setFilters((prev) => {
      const key = getFilterKey(label);
      if (!key) return prev;

      return {
        ...prev,
        [key]:
          key === "employees"
            ? prev[key][0] === option.id
              ? []
              : [option.id]
            : prev[key].includes(option.id)
            ? prev[key].filter((item) => item !== option.id)
            : [...prev[key], option.id],
      };
    });
  }

  function filterTasks() {
    let filtered = tasks;

    Object.entries(filters).forEach(([key, list]) => {
      if (list.length > 0) {
        const taskKey = getTaskKey(key);
        filtered = filtered.filter((item) =>
          list.includes(getNestedValue(item, taskKey))
        );
      }
    });

    setFilteredTasks(filtered);
  }

  useEffect(() => {
    filterTasks();
  }, [filters]);

  function handleFilters(identifier, id) {
    setFilters((prev) => {
      const key = getFilterKeyByIdentifier(identifier);
      if (!key) return prev;

      return {
        ...prev,
        [key]: identifier === 3 ? [] : prev[key].filter((item) => item !== id),
      };
    });
  }

  function clearFilters() {
    setFilters(initialFilters);
    setSearchParams({});
  }

  function getNestedValue(obj, path) {
    return path.split(".").reduce((acc, key) => acc?.[key], obj);
  }

  function getFilterKey(label) {
    switch (label) {
      case "დეპარტამენტი":
        return "department";
      case "პრიორიტეტი":
        return "priority";
      case "თანამშრომელი":
        return "employees";
      default:
        return null;
    }
  }

  function getFilterKeyByIdentifier(identifier) {
    switch (identifier) {
      case 1:
        return "department";
      case 2:
        return "priority";
      case 3:
        return "employees";
      default:
        return null;
    }
  }

  function getTaskKey(filterKey) {
    const mapping = {
      employees: "employee.id",
      department: "department.id",
      priority: "priority.id",
    };
    return mapping[filterKey];
  }

  return (
    <div className="pt-[40px] pb-[131px]">
      <h1 className="text-[34px]">დავალებების გვერდი</h1>

      {/* Dropdown Filters */}
      <div className="flex justify-between relative w-[688px] mt-[53px] border border-gray-300 rounded-lg">
        <Dropdown
          label="დეპარტამენტი"
          options={departments}
          getDropdownFilters={getDropdownFilters}
          identifyer={1}
          arrgetter={filters.department}
        />
        <Dropdown
          label="პრიორიტეტი"
          options={priorities}
          getDropdownFilters={getDropdownFilters}
          identifyer={2}
          arrgetter={filters.priority}
        />
        <Dropdown
          label="თანამშრომელი"
          options={employees}
          getDropdownFilters={getDropdownFilters}
          identifyer={3}
          arrgetter={filters.employees}
        />
      </div>

      {/* Active Filters */}
      <div className="flex gap-4 flex-wrap items-center mt-[25px] min-h-[29px] w-full">
        {filters.department.map((item) => {
          const info = departments.find((el) => el.id === item);
          return info ? (
            <Filters
              key={item}
              info={info}
              identifyer={1}
              handleFilters={handleFilters}
            />
          ) : null;
        })}

        {filters.priority.map((item) => {
          const info = priorities.find((el) => el.id === item);
          return info ? (
            <Filters
              key={item}
              info={info}
              identifyer={2}
              handleFilters={handleFilters}
            />
          ) : null;
        })}

        {filters.employees.map((item) => {
          const info = employees.find((el) => el.id === item);
          return info ? (
            <Filters
              key={item}
              info={info}
              identifyer={3}
              handleFilters={handleFilters}
            />
          ) : null;
        })}

        {/* Clear Filters Button */}
        {(filters.department.length > 0 ||
          filters.priority.length > 0 ||
          filters.employees.length > 0) && (
          <button
            onClick={clearFilters}
            className="text-[14px] text-textgray cursor-pointer"
          >
            გასუფთავება
          </button>
        )}
      </div>

      {/* Filtered Tasks Display */}
      <div className="mt-[24px] flex justify-between">
        {statuses.map((item, index) => (
          <Status
            key={index}
            item={item}
            tasks={filteredTasks.filter((task) => task.status.id === item.id)}
          />
        ))}
      </div>
    </div>
  );
}
