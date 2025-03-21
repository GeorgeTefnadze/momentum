import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import useColorById from "../hooks/useColorById";
import useToastStore from "../hooks/useToastStore";

import CommentElement from "../elements/CommentElement";

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

export default function TaskPage({ reloadData }) {
  const { taskid } = useParams();
  const total_comments = useLocation();
  const { showSuccess, showError } = useToastStore();

  const [taskData, setTaskData] = useState(null);
  const [statuses, setStatuses] = useState(null);
  const [comments, setComments] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [commentInput, setCommentInput] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (!taskid) {
        console.error("Task ID is missing");
        return;
      }

      try {
        const [tasksRes, statusRes] = await Promise.all([
          axios.get(API_URL + "/tasks/" + taskid, {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${API_KEY}`,
            },
          }),
          axios.get(API_URL + "/statuses", {
            headers: {
              Accept: "application/json",
            },
          }),
        ]);

        getComments();

        setTaskData(tasksRes.data);
        setSelectedStatus(tasksRes.data.status);
        setStatuses(statusRes.data);
      } catch (err) {
        setError("Error fetching data");
        console.error(err);
      }
    };

    fetchData();
  }, []);

  const getComments = async () => {
    if (!taskid) {
      console.error("Task ID is missing");
      return;
    }
    const options = {
      method: "GET",
      url: API_URL + "/tasks/" + taskid + "/comments",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
    };

    try {
      const { data } = await axios.request(options);
      setComments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    }
  };

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
    } catch (error) {
      console.error(error);
    } finally {
      showSuccess("სტატუსი წარმატებით განახლდა");
      reloadData("tasks");
    }
  };

  const writeComment = async (comment) => {
    if (comment.replace(/\s/g, "").length === 0) {
      return;
    }
    setCommentInput("");
    const options = {
      method: "POST",
      url: API_URL + "/tasks/" + taskid + "/comments",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      data: {
        text: comment,
        parent_id: null,
      },
    };

    try {
      const { data } = await axios.request(options);
    } catch (error) {
      console.error(error);
    } finally {
      getComments();
    }
  };

  if (!taskData || !comments) {
    return <div>Loading</div>;
  }

  return (
    <div className="flex justify-between  py-[40px]">
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
        <div className="flex flex-col gap-[26px] pt-[12px] w-[715px]">
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
                    className="w-[32px] h-[32px] rounded-full object-cover"
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
      <div className="w-[741px] h-fit bg-commentsbg px-[45px] py-[40px] rounded-[10px]">
        <div className="flex flex-col items-end bg-white w-full min-h-[135px] rounded-[10px] px-[20px] pt-[18px] pb-[15px]">
          <textarea
            onChange={(e) => setCommentInput(e.target.value)}
            value={commentInput}
            type="text"
            name="comment"
            id="comment"
            placeholder="დაწერე კომენტარი"
            className="w-full p-2 border border-none rounded-md focus:outline-none focus:ring-0 resize-none"
          />
          <button
            onClick={() => writeComment(commentInput)}
            className="px-[20px] py-2 bg-mainpurple text-white rounded-[20px] cursor-pointer"
          >
            დააკომენტარე
          </button>
        </div>
        <div className="pt-[66px]">
          <div className="flex gap-[7px] items-center">
            <h2 className="text-[20px] font-semibold">კომენტარები</h2>
            <p className="px-[10px] rounded-[30px] text-[14px] bg-mainpurple text-white">
              {total_comments?.state}
            </p>
          </div>
          <div className="flex flex-col gap-[38px] pt-[40px]">
            {comments
              .sort((a, b) => b.id - a.id)
              .map((item) => (
                <CommentElement
                  key={item.id}
                  commentinfo={item}
                  getComments={getComments}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
