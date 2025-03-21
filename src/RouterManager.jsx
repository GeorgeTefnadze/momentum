import React from "react";
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import useModalStore from "./hooks/useModalStore";

import Nav from "./components/Nav";
import TaskPage from "./routes/TaskPage";
import CreateTask from "./routes/CreateTask";
import TasksComponent from "./components/Tasks";
import Modal from "./components/Modal";
import { Toaster } from "react-hot-toast";

import axios from "axios";

// API_KEY ანუ BearerToken და API_URL რომლებსაც ვიღებთ .env ფაილიდან
const API_KEY = import.meta.env.VITE_API_KEY;
const API_URL = import.meta.env.VITE_API_URL;

export default function RouterManager() {
  // თანამშრომლის შექმნისთვის საჭირო მოდალის state (zustand)
  const { isOpen, openModal, closeModal } = useModalStore();

  const [APIData, setAPIData] = useState({
    tasks: [],
    statuses: [],
    departments: [],
    priorities: [],
    employees: [],
  });

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

        setAPIData({
          tasks: tasksRes.data,
          statuses: statusRes.data,
          departments: departmentRes.data,
          priorities: priorityRes.data,
          employees: employeesRes.data,
        });
      } catch (err) {
        setError("Error fetching data");
        console.error(err);
      }
    };

    fetchData();
  }, []);

  async function reloadData(Res) {
    if (!Res) {
      console.error("Res is undefined or invalid");
      return;
    }

    if (!(Res in APIData)) {
      console.error("Res is invalid");
      return;
    }

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
      setAPIData((prev) => ({ ...prev, [Res]: data }));
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <Toaster
        reverseOrder={false}
        toastOptions={{
          duration: 2000,
          autoClose: true,
          isClosable: true,
          pauseOnHover: true,
          closeOnClick: true,
          draggable: false,
          progress: undefined,
          limit: undefined,
          newestOnTop: true,
          theme: "light",
          toastClassName: "toast",
          containerClassName: "toast-container",
          bodyClassName: "toast-body",
          progressClassName: "toast-progress",
          closeButtonClassName: "toast-close-button",
          icon: undefined,
          iconPosition: "left",
          iconSize: undefined,
          offset: [0, 30],
          position: "top-center",
          rtl: false,
          draggablePercent: 80,
          transitionDuration: 0.3,
          easing: "ease",
          className: undefined,
          content: undefined,
          children: undefined,
          component: undefined,
          style: {
            outline: "1px solid #b588f4",
            textAlign: "center",
          },
        }}
      />
      <Nav openModal={openModal} />
      {isOpen && (
        <Modal
          isOpen={isOpen}
          onClose={closeModal}
          departments={APIData.departments}
          reloadData={reloadData}
        />
      )}

      <div className="pt-[100px] px-[120px]">
        <Routes>
          <Route
            path="/"
            element={
              <TasksComponent
                departments={APIData.departments}
                priorities={APIData.priorities}
                statuses={APIData.statuses}
                employees={APIData.employees}
                tasks={APIData.tasks}
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
                statusesData={APIData.statuses}
                departmentsData={APIData.departments}
                prioritiesData={APIData.priorities}
                employeesData={APIData.employees}
                reloadData={reloadData}
              />
            }
          />
        </Routes>
      </div>
    </>
  );
}
