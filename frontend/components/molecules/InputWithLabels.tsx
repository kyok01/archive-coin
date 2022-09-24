import React from "react";
import { InputWithLabelsProps } from "types/InputWithLabelsProps";

export const InputWithLabels = ({
  text,
  type,
  placeholder,
  AltLabel1,
  AltLabel2,
  AltLabel3,
  required = false,
}: InputWithLabelsProps) => {
  return (
    <div className="form-control w-full max-w-4xl">
      <label className="label">
        <span className="label-text">{text}</span>
        <span className="label-text-alt">{AltLabel1}</span>
      </label>
      {required ? (
        <input
          type={type}
          placeholder={placeholder}
          className="input input-bordered w-full"
          required
        />
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          className="input input-bordered w-full"
        />
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
