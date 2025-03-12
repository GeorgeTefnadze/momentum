import React, { useEffect, useState } from "react";
import axios from "axios";

import Low from "../assets/Low.svg";
import Medium from "../assets/Medium.svg";
import High from "../assets/High.svg";
import Pfp from "../assets/Ellipse 3892.png";
import Comment from "../assets/Comments.svg";

const georgianMonths = [
  "იანვ",
  "თებ",
  "მარ",
  "აპრ",
  "მაი",
  "ივნ",
  "ივლ",
  "აგვ",
  "სექ",
  "ოქტ",
  "ნოე",
  "დეკ",
];

const formatDate = (dateString) => {
  const date = new Date(dateString.replace(" ", "T"));
  const day = date.getDate();
  const month = georgianMonths[date.getMonth()];
  const year = date.getFullYear();

  return `${day} ${month}, ${year}`;
};

const API_KEY = import.meta.env.VITE_API_KEY;
const API_URL = "https://momentum.redberryinternship.ge/api";

export default function TaskBox({ item, colorid }) {
  const [commentsCount, setCommentsCount] = useState("");
  const [departmentColor, setDepartmentColor] = useState("");
  const [color, setColor] = useState("");

  useEffect(() => {
    axios
      .get(API_URL + `/tasks/${item.id}/comments`, {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          Accept: "application/json",
        },
      })
      .then((response) => {
        setCommentsCount(response.data.length);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    switch (colorid) {
      case 1:
        setColor("outline-1 outline-mainyellow");
        break;
      case 2:
        setColor("outline-1 outline-mainorange");
        break;
      case 3:
        setColor("outline-1 outline-mainpink");
        break;
      case 4:
        setColor("outline-1 outline-mainblue");
        break;
      default:
        setColor("");
    }
  }, [colorid]);

  useEffect(() => {
    switch (item.department.id) {
      case 1:
        setDepartmentColor("bg-mainpurple");
        break;
      case 2:
        setDepartmentColor("bg-mainred");
        break;
      case 3:
        setDepartmentColor("bg-mainyellow");
        break;
      case 4:
        setDepartmentColor("bg-maingreen");
        break;
      case 5:
        setDepartmentColor("bg-mainblue");
        break;
      case 6:
        setDepartmentColor("bg-mainorange");
        break;
      case 7:
        setDepartmentColor("bg-mainpink");
        break;

      default:
        break;
    }
  }, [item]);

  return (
    <div
      className={`flex flex-col gap-[28px] w-[381px] h-[217px] p-[20px] ${color} rounded-[15px]`}
    >
      <div className="flex justify-between">
        <div className="flex gap-[10px] items-center">
          <div
            className={`w-[86px] h-[26] flex gap-1 p-1 outline rounded-[5px] text-[12px] ${
              item.priority.id == 1
                ? "outline-maingreen text-maingreen"
                : item.priority.id == 2
                ? "outline-mainyellow text-mainyellow"
                : "outline-mainred text-mainred"
            }`}
          >
            <img src={item.priority.icon} alt="" />
            <p>{item.priority.name}</p>
          </div>
          <div
            className={`w-[88px] h-[24px] text-[12px] text-white flex items-center justify-center  rounded-[15px] ${departmentColor}`}
          >
            <p>
              {item.department.name.length >= 10
                ? item.department.name
                    .split(" ")
                    .map((word) =>
                      word.length > 4 ? word.slice(0, 3) + "." : word
                    )
                    .filter((word) => word !== "და")
                    .join(" ")
                : item.department.name}
            </p>
          </div>
        </div>
        <div className="text-[12px] text-maingray flex items-center">
          <p>{formatDate(item.due_date)}</p>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <h3 className="text-[15px] font-medium">{item.name}</h3>
        <p className="text-[14px] text-maingray font-normal line-clamp-2">
          {item.description}
        </p>
      </div>
      <div className="flex justify-between">
        <div className="w-[31px] h-[31px] rounded-full overflow-hidden flex items-center justify-center">
          <img src={item.employee.avatar} alt="" />
        </div>
        <div className="flex gap-1 items-center">
          <div>
            <img src={Comment} alt="" />
          </div>
          <p>{commentsCount ? commentsCount : 0}</p>
        </div>
      </div>
    </div>
  );
}
