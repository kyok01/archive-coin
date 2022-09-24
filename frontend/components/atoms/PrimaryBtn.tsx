import { btnProp } from "types/btnProp";


export const PrimaryBtn = ({children, onClick}: btnProp) => {
    return (
        <button className="btn btn-primary" onClick={onClick}>{children}</button>
    );
}