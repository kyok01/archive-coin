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
        <h1 className="text-2xl w-full max-w-4xl mx-auto">Write Your Post</h1>
          <WritePostForm onSubmit={(e) => sendPost(0, e)} />
        </div>
      </div>
    </div>
  );
};
