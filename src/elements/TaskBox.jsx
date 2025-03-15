import React, { useEffect, useState } from "react";

import useColorById from "../hooks/useColorById";

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

// აბრუნებს თარიღს დიზაინში მოცემულ ფორმატში
const formatDate = (dateString) => {
  const date = new Date(dateString.replace(" ", "T"));
  const day = date.getDate();
  const month = georgianMonths[date.getMonth()];
  const year = date.getFullYear();

  return `${day} ${month}, ${year}`;
};

export default function TaskBox({ item, colorid }) {
  const color = useColorById("status", colorid);
  const departmentColor = useColorById("department", item.department.id);

  return (
    <div
      className={`flex flex-col gap-[28px] w-[381px] h-[217px] p-[20px] outline-1 outline-${color} rounded-[15px]`}
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
            className={`w-[88px] h-[24px] text-[12px] text-white flex items-center justify-center  rounded-[15px] bg-${departmentColor}`}
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
          <p>{item.total_comments}</p>
        </div>
      </div>
    </div>
  );
}
