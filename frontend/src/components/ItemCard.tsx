import type { PropsWithChildren } from "react";
import type React from "react";

interface ItemCardProps extends PropsWithChildren {
    
}

const ItemCard: React.FC<ItemCardProps> = ({ children }) => {
    return (
        // <div className='p-8 rounded-md border-b-1 border-b-neutral bg-white flex gap-4 justify-between'>
        <div className='p-8 rounded-md border-b-1 border-b-neutral bg-white'>
            {children}
        </div>

    );
};

export default ItemCard;