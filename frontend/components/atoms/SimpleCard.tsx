import { cardProp } from "types/cardProp";

export const SimpleCard = ({ title, text, status, sender, timestamp }: cardProp) => {
  return (
    <div className="card w-96 bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">{title}</h2>
        <p>{text}</p>
        <div className="card-actions justify-between flex items-center ">
            <div className="flex flex-col">
            <p>{sender}</p>
            <p>{timestamp}</p>
            </div>

          <button className="btn btn-primary">{status}</button>
        </div>
      </div>
    </div>
  );
};
