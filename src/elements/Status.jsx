import React, { useState, useEffect } from "react";
import TaskBox from "./TaskBox";

import useColorById from "../hooks/useColorById";

export default function Status({ item, tasks }) {
  return (
    <div>
      <div
        className={`w-[381px] h-[54px] rounded-[10px] flex items-center justify-center text-white text-[20px] font-medium ${useColorById(
          "status",
          item.id,
          "bg"
        )}`}
      >
        {item.name}
      </div>
      <div className="mt-[30px] flex flex-col gap-[30px]">
        {tasks.map((item, id) => (
          <TaskBox key={item.id} item={item} colorid={item.status.id} />
        ))}
      </div>
    </div>
  );
}
