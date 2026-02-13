import type { ReactNode } from "react";

interface buttonIconInterface {
    icon: ReactNode;
    handle: () => void;
    count?: number;
    dataCy?: string;
    disabled?: boolean;
}

const ButtonIcon: React.FC<buttonIconInterface> = ({ icon, handle, count, dataCy, disabled = false }) => {
    return (
        <button
            disabled={disabled}
            onClick={() => handle()}
            className="flex items-center gap-2 cursor-pointer transition-transform duration-150 hover:scale-110"
            data-cy={dataCy}>

            {icon}
            {count ? <p>{count}</p> : ""}
        </button>
    );
}

export default ButtonIcon;