import React, { useEffect } from "react";
import xIcon from "../assets/x.svg";

export default function Filters({ identifyer, info, handleFilters }) {
  useEffect(() => {
    console.log(info);
  }, [info]);

  return (
    <button
      onClick={() => handleFilters(identifyer, info.id)}
      className="flex items-center gap-1 px-[10px] rounded-[43px] cursor-pointer outline outline-mainoutline h-[29px] w-fit text-[14px] font-light text-textgray"
    >
      <p>{identifyer == 3 ? `${info.name} ${info.surname}` : info.name}</p>
      <img src={xIcon} alt="" className="w-[14px] h-[14px]" />
    </button>
  );
}
