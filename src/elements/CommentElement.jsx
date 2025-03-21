import React, { useState } from "react";
import axios from "axios";

import replyIcon from "../assets/reply.svg";

import SubComment from "./SubComment";

// API_KEY ანუ BearerToken და API_URL რომლებსაც ვიღებთ .env ფაილიდან
const API_KEY = import.meta.env.VITE_API_KEY;
const API_URL = import.meta.env.VITE_API_URL;

export default function CommentElement({ commentinfo, getComments }) {
  const [isOpen, setIsOpen] = useState(false);
  const [replyInput, setReplyInput] = useState("");

  function toggleOpen() {
    setIsOpen((prev) => !prev);
  }

  const writeReply = async (reply, p_id) => {
    setReplyInput("");
    toggleOpen();
    const options = {
      method: "POST",
      url: API_URL + "/tasks/" + commentinfo.task_id + "/comments",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      data: {
        text: reply,
        parent_id: p_id,
      },
    };

    try {
      const { data } = await axios.request(options);
    } catch (error) {
      console.error(error);
    } finally {
      getComments();
    }
  };
  return (
    <div>
      <div className="flex gap-[12px] w-full">
        <div>
          <img
            src={commentinfo.author_avatar}
            alt=""
            className="w-[38px] h-[38px] rounded-full"
          />
        </div>
        <div className="flex flex-col gap-2 flex-1">
          <h2 className="text-[18px] font-semibold">
            {commentinfo.author_nickname}
          </h2>
          <p>{commentinfo.text}</p>
          <button
            onClick={() => toggleOpen()}
            className="flex gap-[6px] w-fit items-center cursor-pointer"
          >
            <img src={replyIcon} alt="" className="w-4 h-4" />
            <p className="text-[12px] text-mainpurple">უპასუხე</p>
          </button>
          <div
            className={`flex items-center gap-2 pt-2 ${
              !isOpen ? "hidden" : ""
            }`}
          >
            <input
              onChange={(e) => setReplyInput(e.target.value)}
              value={replyInput}
              type="text"
              className="flex-1 bg-white rounded-[30px] px-2 focus:outline-mainpurple focus:outline-1"
            />
            <button
              onClick={() => writeReply(replyInput, commentinfo.id)}
              className="bg-mainpurple px-[20px] py-[2px] rounded-[30px] cursor-pointer"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_29_253)">
                  <path
                    d="M16.0007 13.9993H14.6673V11.9993C14.6673 8.66602 12.0007 5.99935 8.66732 5.99935H5.33398V4.66602H8.66732C12.734 4.66602 16.0007 7.93268 16.0007 11.9993V13.9993Z"
                    fill="#fff"
                  />
                  <path
                    d="M2 5.33333L5.33333 8.66667V2L2 5.33333Z"
                    fill="#fff"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_29_253">
                    <rect width="16" height="16" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </button>
          </div>
          <div className="flex flex-col gap-4 pt-2">
            {commentinfo.sub_comments
              .sort((a, b) => b.id - a.id)
              .map((item) => (
                <SubComment key={item.id} commentinfo={item} />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
