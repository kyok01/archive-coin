import { ReactNode } from "react"

export type btnProp = {
    children: ReactNode | undefined;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    type?: "button" | "submit" | "reset";
}