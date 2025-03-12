import React from "react";
import momentumLogo from "../assets/momentum.svg";
import addIcon from "../assets/add.svg";

export default function Nav() {
  return (
    <div className="flex justify-between items-center h-[100px] px-[120px] py-[30px]">
      <img src={momentumLogo} alt="" className="w-[210px]" />
      <div className="flex gap-[40px]">
        <a
          href="#"
          className="px-[20px] py-[10px] drop-shadow text-[16px] border-1 border-mainpurple rounded-[5px]"
        >
          თანამშრომლის შექმნა
        </a>
        <a
          href="#"
          className=" flex gap-1 px-[20px] py-[10px] text-[16px] border-1 border-mainpurple rounded-[5px] bg-mainpurple text-white"
        >
          <img src={addIcon} alt="" /> შექმენი ახალი დავალება
        </a>
      </div>
    </div>
  );
}
