import React, { useState } from "react";

import checkmark from "../assets/checkmark.svg";

export default function FormInputs({ label, formData, handleFormInputs }) {
  return (
    <div className="flex flex-col gap-[3px]">
      <label htmlFor={label}>
        {label}
        <span>*</span>
      </label>
      <input
        value={formData}
        onChange={(e) => handleFormInputs(label, e.target.value)}
        required
        type="text"
        id={label}
        name={label}
        className="w-[384px] h-[42px] p-[10px] rounded-[6px] outline outline-mainoutline"
      />
      <div className="mt-[6px] flex flex-col gap-0.5 text-textgray">
        <div
          className={`flex items-center gap-0.5 h-[16px] ${
            formData.length > 0
              ? formData.length >= 2
                ? "text-maingreen"
                : "text-mainred"
              : ""
          }`}
        >
          <svg
            className="w-[11px] h-[7px]"
            width="14"
            height="10"
            viewBox="0 0 14 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12.3327 1L4.99935 8.33333L1.66602 5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p className={`text-[10px] `}>მინიმუმ 2 სიმბოლო</p>
        </div>
        <div
          className={`flex items-center gap-0.5 h-[16px] ${
            formData.length > 0
              ? formData.length <= 225
                ? "text-maingreen"
                : "text-mainred"
              : ""
          }`}
        >
          <svg
            className="w-[11px] h-[7px]"
            width="14"
            height="10"
            viewBox="0 0 14 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12.3327 1L4.99935 8.33333L1.66602 5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p className={`text-[10px]`}>მაქსიმუმ 225 სიმბოლო</p>
        </div>
      </div>
    </div>
  );
}
