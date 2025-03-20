import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import momentumLogo from "../assets/momentum.svg";
import addIcon from "../assets/add.svg";

export default function Nav({ openModal }) {
  // state რომელიც ინახავს ფანჯრის scrollY მდგომარეობას
  const [scrollY, setScrollY] = useState(window.scrollY);

  useEffect(() => {
    // ფუნქცია, რომელიც ანახლებს scrollY state ს
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      // ნავიგაციის პანელი ფიქსირებული პოზიციით და ჩრდილის ეფექტით
      className={`fixed flex justify-between items-center w-full h-[100px] px-[120px] py-[30px] bg-white z-30 duration-200 ${
        scrollY > 0 ? "drop-shadow-xl" : ""
      }`}
    >
      <Link to={"/"}>
        <img src={momentumLogo} alt="Momentum Logo" className="w-[210px]" />
      </Link>

      {/* ღილაკების კონტეინერი */}
      <div className="flex gap-[40px]">
        {/* ღილაკი თანამშრომლის შესაქმნელად */}
        <a
          onClick={openModal} // openModal ფუნქციის გამოძახება მოდალის გასახსნელად
          href="#"
          className="px-[20px] py-[10px] text-[16px] border-1 border-mainpurple hover:border-hoverpurple duration-200 rounded-[5px]"
        >
          თანამშრომლის შექმნა
        </a>

        {/* ღილაკი ახალი დავალების შესაქმნელად */}
        <Link
          to={"/createTask"}
          href="#"
          className="flex gap-1 px-[20px] py-[10px] text-[16px] border-1 rounded-[5px] bg-mainpurple hover:bg-hoverpurple text-white duration-200"
        >
          <img src={addIcon} alt="Add Icon" /> შექმენი ახალი დავალება
        </Link>
      </div>
    </div>
  );
}
