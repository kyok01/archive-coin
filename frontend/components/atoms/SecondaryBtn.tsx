import { btnProp } from "types/btnProp";


export const SecondaryBtn = ({children, onClick, type}: btnProp) => {
    return (
        <button className="btn btn-secondary" onClick={onClick} type={type}>{children}</button>
    );
}