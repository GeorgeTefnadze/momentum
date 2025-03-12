import React, { useState, useEffect } from "react";
import momentumLogo from "../assets/momentum.svg";
import addIcon from "../assets/add.svg";

export default function Nav() {
  const [scrollY, setScrollY] = useState(window.scrollY);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <div
      className={`fixed flex justify-between items-center w-full h-[100px] px-[120px] py-[30px] bg-white z-30 duration-200 ${
        scrollY > 0 ? "drop-shadow-xl" : ""
      }`}
    >
      <img src={momentumLogo} alt="" className="w-[210px]" />
      <div className="flex gap-[40px]">
        <a
          href="#"
          className="px-[20px] py-[10px] text-[16px] border-1 border-mainpurple hover:border-hoverpurple duration-200 rounded-[5px]"
        >
          თანამშრომლის შექმნა
        </a>
        <a
          href="#"
          className=" flex gap-1 px-[20px] py-[10px] text-[16px] border-1  rounded-[5px] bg-mainpurple hover:bg-hoverpurple text-white duration-200"
        >
          <img src={addIcon} alt="" /> შექმენი ახალი დავალება
        </a>
      </div>
    </div>
  );
}
