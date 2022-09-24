import { btnProp } from "types/btnProp";


export const SecondaryBtn = ({children, onClick}: btnProp) => {
    return (
        <button className="btn btn-secondary" onClick={onClick}>{children}</button>
    );
}