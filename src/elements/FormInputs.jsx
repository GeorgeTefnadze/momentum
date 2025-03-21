import React, { useState } from "react";

import checkmark from "../assets/checkmark.svg";
import { useEffect } from "react";

export default function FormInputs({
  customKey,
  label,
  formData,
  handleFormInputs,
  min = 2,
  max = 255,
  textarea = false,
  countWords = false,
}) {
  const [validateMin, setValidateMin] = useState(0);
  const [validateMax, setValidateMax] = useState(0);

  useEffect(() => {
    if (formData.length === 0) {
      setValidateMax(0);
      setValidateMin(0);
      return;
    }

    if (countWords) {
      if (formData.trim().split(/\s+/).length < min) {
        setValidateMin(1);
      } else {
        setValidateMin(2);
      }
    } else {
      if (formData.length < min) {
        setValidateMin(1);
      } else {
        setValidateMin(2);
      }
    }

    if (formData.length > max) {
      setValidateMax(1);
    } else {
      setValidateMax(2);
    }
  }, [formData]);

  const matchingStyles =
    "flex-1 p-[10px] rounded-[6px] outline outline-mainoutline hover:outline-hoverpurple focus:outline-mainpurple bg-white";
  return (
    <div className="flex flex-col gap-[3px] h-full">
      <label htmlFor={label}>
        {label}
        <span>*</span>
      </label>
      {textarea ? (
        <textarea
          value={formData}
          onChange={(e) => handleFormInputs(customKey, e.target.value)}
          required
          type="text"
          id={label}
          name={label}
          className={`${matchingStyles} focus:ring-0 resize-none`}
        />
      ) : (
        <input
          value={formData}
          onChange={(e) => handleFormInputs(customKey, e.target.value)}
          required
          type="text"
          id={label}
          name={label}
          className={matchingStyles}
        />
      )}
      <div className="mt-[6px] flex flex-col gap-0.5 text-textgray">
        <div
          className={`flex items-center gap-0.5 h-[16px] ${
            validateMin === 1
              ? "text-mainred"
              : validateMin === 2
              ? "text-maingreen"
              : ""
          }`}
        >
          <svg
            className="w-[11px] h-[7px]"
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
          <p className={`text-[10px] `}>
            მინიმუმ {min} {countWords ? "სიტყვა" : "სიმბოლო"}
          </p>
        </div>
        <div
          className={`flex items-center gap-0.5 h-[16px] ${
            validateMax === 1
              ? "text-mainred"
              : validateMax === 2
              ? "text-maingreen"
              : ""
          }`}
        >
          <svg
            className="w-[11px] h-[7px]"
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
          <p className={`text-[10px]`}>მაქსიმუმ {max} სიმბოლო</p>
        </div>
      </div>
    </div>
  );
}
