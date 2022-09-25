import React from "react";
import { InputWithLabelsProps } from "types/InputWithLabelsProps";
import { TextareaWithLabelsProps } from "types/TextareaWithLabelsProps";

export const TextareaWithLabels = ({
  text,
  name,
  placeholder,
  AltLabel1,
  AltLabel2,
  AltLabel3,
  required = false,
}: TextareaWithLabelsProps) => {
  return (
    <div className="form-control w-full max-w-4xl">
      <label className="label">
        <span className="label-text">{text}</span>
        <span className="label-text-alt">{AltLabel1}</span>
      </label>
      
      {required ? (
        <textarea className="textarea textarea-bordered h-96" placeholder={placeholder} name={name} required />
      ) : (
        <textarea className="textarea textarea-bordered h-96" placeholder={placeholder} name={name}/>
      )}
      {(AltLabel2 || AltLabel3) && (
        <label className="label">
          <span className="label-text-alt">{AltLabel2}</span>
          <span className="label-text-alt">{AltLabel3}</span>
        </label>
      )}
    </div>
  );
};
