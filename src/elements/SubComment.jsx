import React from "react";

export default function SubComment({ commentinfo }) {
  return (
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
      </div>
    </div>
  );
}
