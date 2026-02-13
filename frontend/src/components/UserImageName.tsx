import type React from "react";
import type { UserInterface } from "../interfaces/UserInterface";

interface Props {
  user: UserInterface | null;
  onNavbar?: boolean;
}

const UserImageName: React.FC<Props> = ({ user, onNavbar = false }) => {

    return (
        <div className="flex justify-baseline items-center gap-2">
            <div className={("w-8 h-8") + " rounded-full border-1 overflow-hidden flex justify-center items-center bg-primary"}>
                {user?.image_url ? <img src={user?.image_url} /> : user?.name[0]}
            </div>
            <p className={onNavbar ? "text-md" : "text-xs"}>{user?.name}</p>
        </div>
    );
}

export default UserImageName;