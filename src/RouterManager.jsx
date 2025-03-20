import React from "react";
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import useModalStore from "./useModalStore";

import Nav from "./components/Nav";
import TaskPage from "./routes/TaskPage";
import CreateTask from "./routes/CreateTask";
import TasksComponent from "./components/Tasks";
import Modal from "./components/Modal";

import axios from "axios";

// API_KEY ანუ BearerToken და API_URL რომლებსაც ვიღებთ .env ფაილიდან
const API_KEY = import.meta.env.VITE_API_KEY;
const API_URL = import.meta.env.VITE_API_URL;

export default function RouterManager() {
  // თანამშრომლის შექმნისთვის საჭირო მოდალის state (zustand)
  const { isOpen, openModal, closeModal } = useModalStore();

  const [statuses, setStatuses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // რექუესთი API endpoint თან
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statusRes, departmentRes, priorityRes, employeesRes, tasksRes] =
          await Promise.all([
            axios.get(API_URL + "/statuses"),
            axios.get(API_URL + "/departments"),
            axios.get(API_URL + "/priorities"),
            axios.get(API_URL + "/employees", {
              headers: {
                Authorization: `Bearer ${API_KEY}`,
                Accept: "application/json",
              },
            }),
            axios.get(API_URL + "/tasks", {
              headers: {
                Authorization: `Bearer ${API_KEY}`,
                Accept: "application/json",
              },
            }),
          ]);

        setStatuses(statusRes.data);
        setDepartments(departmentRes.data);
        setPriorities(priorityRes.data);
        setEmployees(employeesRes.data);
        setTasks(tasksRes.data);
      } catch (err) {
        setError("Error fetching data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  async function reloadData(Res) {
    const options = {
      method: "GET",
      url: API_URL + "/" + Res,
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        Accept: "application/json",
      },
    };

    try {
      const { data } = await axios.request(options);
      console.log(data);
      switch (Res) {
        case "statuses":
          setStatuses(data);
          break;
        case "departments":
          setDepartments(data);
          break;
        case "priorities":
          setPriorities(data);
          break;
        case "employees":
          setEmployees(data);
          break;
        case "tasks":
          setTasks(data);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <Nav openModal={openModal} />
      {isOpen && (
        <Modal
          isOpen={isOpen}
          onClose={closeModal}
          departments={departments}
          reloadData={reloadData}
        />
      )}

      <div className="pt-[100px] px-[120px]">
        <Routes>
          <Route
            path="/"
            element={
              <TasksComponent
                departments={departments}
                priorities={priorities}
                statuses={statuses}
                employees={employees}
                tasks={tasks}
              />
            }
          />
          <Route
            path="/task/:taskid"
            element={<TaskPage reloadData={reloadData} />}
          />
          <Route
            path="/createTask"
            element={
              <CreateTask
                statusesData={statuses}
                departmentsData={departments}
                prioritiesData={priorities}
                employeesData={employees}
                reloadData={reloadData}
              />
            }
          />
        </Routes>
      </div>
    </>
  );
}
