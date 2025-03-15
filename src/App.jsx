import Nav from "./components/Nav";
import TasksComponent from "./components/Tasks";
import Modal from "./components/Modal";
import useModalStore from "./useModalStore";

import { useEffect, useState } from "react";
import axios from "axios";

// API_KEY ანუ BearerToken და API_URL რომლებსაც ვიღებთ .env ფაილიდან
const API_KEY = import.meta.env.VITE_API_KEY;
const API_URL = import.meta.env.VITE_API_URL;

const App = () => {
  const [statuses, setStatuses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // თანამშრომლის შექმნისთვის საჭირო მოდალის state (zustand)
  const { isOpen, openModal, closeModal } = useModalStore();

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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <Modal isOpen={isOpen} onClose={closeModal} departments={departments} />
      <Nav openModal={openModal} />
      <TasksComponent
        departments={departments}
        priorities={priorities}
        statuses={statuses}
        employees={employees}
        tasks={tasks}
      />
    </div>
  );
};

export default App;
