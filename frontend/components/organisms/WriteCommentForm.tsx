import { PrimaryBtn } from "components/atoms/PrimaryBtn";
import { InputWithLabels } from "components/molecules/InputWithLabels";
import { TextareaWithLabels } from "components/molecules/TextareaWithLabels";

export const WriteCommentForm = ({ onSubmit }) => {
  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-col justify-center items-center">
        <InputWithLabels
          text="comment"
          type="text"
          name="text"
          placeholder="write"
          AltLabel1="*"
          required={true}
        />
      </div>
      <div className="flex justify-center my-2">
        <PrimaryBtn type="submit">Submit Comment</PrimaryBtn>
      </div>
    </form>
  );
};
