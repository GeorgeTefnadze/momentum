import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import useColorById from "../hooks/useColorById";

import statusIcon from "../assets/status.svg";
import employeeIcon from "../assets/employee.svg";
import calendarIcon from "../assets/calendar.svg";
import arrowIcon from "../assets/arrowdown.svg";

// API_KEY ანუ BearerToken და API_URL რომლებსაც ვიღებთ .env ფაილიდან
const API_KEY = import.meta.env.VITE_API_KEY;
const API_URL = import.meta.env.VITE_API_URL;

function formatGeorgianDate(isoDate) {
  const daysOfWeek = ["კვი", "ორშ", "სამ", "ოთხ", "ხუთ", "პარ", "შაბ"];
  const date = new Date(isoDate);

  const dayOfWeek = daysOfWeek[date.getDay()];
  const day = String(date.getDate()).padStart(2, "0");
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${dayOfWeek} - ${day}/${month}/${year}`;
}

export default function TaskPage() {
  const { taskid } = useParams();

  const [taskData, setTaskData] = useState(null);
  const [statuses, setStatuses] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const options = {
        method: "GET",
        url: API_URL + "/tasks/" + taskid,
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
      };

      try {
        const { data } = await axios.request(options);
        console.log(data);
        setTaskData(data);
        setSelectedStatus(data.status);
      } catch (error) {
        console.error(error);
      }

      const statusoptions = {
        method: "GET",
        url: API_URL + "/statuses",
        headers: {
          Accept: "application/json",
        },
      };

      try {
        const { data } = await axios.request(statusoptions);
        console.log(data);
        setStatuses(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const updateStatus = async (statusID) => {
    const options = {
      method: "PUT",
      url: API_URL + "/tasks/" + taskid,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      data: { status_id: statusID },
    };

    try {
      const { data } = await axios.request(options);
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  if (!taskData) {
    return <div>Loading</div>;
  }

  return (
    <div className="flex justify-between  pt-[40px]">
      <div>
        {/* პრიორიტეტი და დეპარტამენტი */}
        <div className="flex items-center gap-[18px]">
          <div
            className={`flex gap-1 items-center px-[5px] py-[4px] rounded-[3px] text-[16px] outline ${useColorById(
              "priority",
              taskData.priority.id,
              "outline"
            )} ${useColorById("priority", taskData.priority.id, "text")}`}
          >
            <img
              src={taskData.priority.icon}
              alt=""
              className="w-[18px] h-[20px]"
            />
            <p>{taskData.priority.name}</p>
          </div>
          <div
            className={`px-[10px] py-[5px] rounded-[15px] text-white ${useColorById(
              "department",
              taskData.department.id,
              "bg"
            )}`}
          >
            <p>{taskData.department.name}</p>
          </div>
        </div>
        {/* სათაური და აღწერა */}
        <div className="flex flex-col gap-[26px] pt-[12px]">
          <h1 className="text-[34px] font-semibold">{taskData.name}</h1>
          <p className="text-[18px]">{taskData.description}</p>
        </div>
        <div className="pt-[63px]">
          <h2 className="text-2xl font-semibold">დავალების დეტალები</h2>
          <div className="flex w-[493px] pt-[28px]">
            <div className="left w-1/2 flex flex-col gap-[20px]">
              <div className="flex items-center h-[50px]">
                <div className="flex gap-1.5">
                  <img src={statusIcon} alt="" className="w-[24px] h-[24px]" />
                  <p>სტატუსი</p>
                </div>
              </div>
              <div className="flex items-center h-[50px]">
                <div className="flex gap-1.5">
                  <img
                    src={employeeIcon}
                    alt=""
                    className="w-[24px] h-[24px]"
                  />
                  <p>თანამშრომელი</p>
                </div>
              </div>
              <div className="flex items-center h-[50px]">
                <div className="flex gap-1.5">
                  <img
                    src={calendarIcon}
                    alt=""
                    className="w-[24px] h-[24px]"
                  />
                  <p>დავალების ვადა</p>
                </div>
              </div>
            </div>
            <div className="right w-1/2 flex flex-col gap-[23px]">
              {/* დროპდაუნი */}
              <div className="relative w-[259px] h-[45px]">
                <div
                  className={`p-3 border border-gray-300 rounded-md bg-white flex ${
                    selectedStatus ? "justify-between" : "justify-end"
                  } items-center cursor-pointer`}
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  {selectedStatus.name}
                  <span className="text-textgray">
                    <img src={arrowIcon} alt="" />
                  </span>
                </div>
                {isDropdownOpen && (
                  <ul className="absolute w-full mt-1 bg-white border border-gray-300 rounded-md shadow-md z-10">
                    {statuses?.map((option) => (
                      <li
                        key={option.id}
                        className="p-3 cursor-pointer hover:bg-gray-200 rounded-md"
                        onClick={() => {
                          updateStatus(option.id);
                          setSelectedStatus(option);
                          setIsDropdownOpen(false);
                        }}
                      >
                        {option.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {/* თანამშრომლის ინფორმაცია */}
              <div className="flex gap-3 items-center h-[50px]">
                <div>
                  <img
                    src={taskData.employee.avatar}
                    alt=""
                    className="w-[32px] h-[32px] rounded-full"
                  />
                </div>
                <div className="">
                  <p className="text-[11px] font-light text-textgray">
                    {taskData.department.name}
                  </p>
                  <p className="text-[14px]">
                    {taskData.employee.name} {taskData.employee.surname}
                  </p>
                </div>
              </div>
              <div className="h-[50px] flex items-center">
                <p>{formatGeorgianDate(taskData.due_date)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div></div>
    </div>
  );
}
