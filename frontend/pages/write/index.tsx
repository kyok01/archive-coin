import { H1 } from "components/atoms/H1";
import { TextareaWithLabels } from "components/molecules/TextareaWithLabels";
import { Navbar } from "components/organisms/NavBar";
import { WritePostForm } from "components/organisms/WritePostForm";
import { sendPost } from "util/sendPost";

export default () => {
  return (
    <div>
      <Navbar />
      
      <div className="m-auto w-4/5 my-2">
      
        <div className="w-4/5 mx-auto">
        <H1 text="Write Your Post" />
          <WritePostForm onSubmit={(e) => sendPost(0, e)} />
        </div>
      </div>
    </div>
  );
};
