import { PrimaryBtn } from "components/atoms/PrimaryBtn";
import { InputWithLabels } from "components/molecules/InputWithLabels";
import { TextareaWithLabels } from "components/molecules/TextareaWithLabels";

export const WritePostForm = ({ onSubmit }) => {
  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-col justify-center items-center">
        <InputWithLabels
          text="title"
          type="text"
          placeholder="write"
          AltLabel1="*"
          required={true}
        />

      <TextareaWithLabels text="text" placeholder="write" />
      </div>
      <div className="flex justify-center my-2">
      <PrimaryBtn type="submit">Submit</PrimaryBtn>
      </div>
    </form>
  );
};
