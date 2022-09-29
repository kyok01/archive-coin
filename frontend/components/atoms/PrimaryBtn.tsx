import { btnProp } from "types/btnProp";

export const PrimaryBtn = ({ children, onClick, type = "button" }: btnProp) => {
  return (
    <button className="btn btn-primary" onClick={onClick} type={type}>
      {children}
    </button>
  );
};
