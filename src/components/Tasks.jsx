import React, { useEffect, useRef, useState } from "react";
import Dropdown from "../elements/Dropdown";
import Status from "../elements/Status";

export default function Tasks({
  departments,
  priorities,
  statuses,
  employees,
}) {
  return (
    <div className="px-[120px] pt-[40px]">
      <h1 className="text-[34px]">დავალებების გვერდი</h1>
      <div className="flex justify-between relative w-[688px] mt-[53px] border border-gray-300 rounded-lg">
        <Dropdown label="დეპარტამენტი" options={departments} />
        <Dropdown label="პრიორიტეტი" options={priorities} />
        <Dropdown label="თანამშრომელი" options={employees} />
      </div>
    </div>
  );
}
