import type React from "react";
import type { LikeInterface } from "../interfaces/LikeInterface";
import type { IconBaseProps } from "react-icons";
import { PiFireFill, PiHandsClappingFill, PiHeartFill, PiThumbsUpFill } from "react-icons/pi";

const ArticleItemLike: React.FC<{ like: LikeInterface }> = ({ like }) => {
    const iconProps: IconBaseProps = {
        size: 20
    }

    const chooseIcon = () => {
        switch (like.reaction) {
            case "H":
                return <PiHeartFill {...iconProps} color="oklch(52.5% 0.223 3.958)" />
            case "L":
                return <PiThumbsUpFill {...iconProps} color="oklch(52% 0.105 223.128)" />
            case "F":
                return <PiFireFill {...iconProps} color="oklch(50.5% 0.213 27.518)" />
            case "C":
                return <PiHandsClappingFill {...iconProps} color="oklch(55.4% 0.135 66.442)" />
        }
    }

    return (
        <div>
            {chooseIcon()}
        </div>
    );
}

export default ArticleItemLike;