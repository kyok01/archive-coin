// eslint react/display-name: 0
import React from "react";

export const CommentCard = ({ text },ref) => {
  return (
    <div className="card max-w-4xl inline-box bg-base-100 shadow-md p-0" >
      <div className="card-body p-2 inline-box max-w-4xl">
        <p style={{ overflowWrap: "normal" }}>{text}</p>
      </div>
    </div>
  );
};