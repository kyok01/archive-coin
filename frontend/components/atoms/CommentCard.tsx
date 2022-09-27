export const CommentCard = ({ text }) => {
  return (
    <div className="card w-full max-w-4xl bg-base-100 shadow-md p-0">
      <div className="card-body p-2 w-full max-w-4xl">
        <p style={{ overflowWrap: "normal" }}>{text}</p>
      </div>
    </div>
  );
};
