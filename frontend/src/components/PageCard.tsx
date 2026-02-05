import type { PropsWithChildren } from "react";
import React from "react";
import { ArticleSearch } from "./ArticleSearch";
import { NavLink } from "react-router-dom";
import { TfiAngleLeft } from "react-icons/tfi";

interface PageCardProps extends PropsWithChildren {
    title?: string;
    search?: (text?: string, categories?: number[]) => Promise<void>;
    goBackTo?: string;
}

const PageCard: React.FC<PageCardProps> = ({ title, children, search, goBackTo }) => {

    return (
        <div className='bg-white w-full rounded-md border-b-1 border-b-neutral flex flex-col p-4 mt-20'>
            <div className="flex items-center mb-8">
                {
                    goBackTo ?
                        <NavLink to={goBackTo} className='absolute'>
                            <TfiAngleLeft />
                        </NavLink>
                        : ''
                }
                {
                    title ?
                        <div className="w-full flex justify-center">
                            <h1 className="text-2xl font-bold">{title}</h1>
                        </div>
                        :
                        ''
                }
            </div>
            {search && (<ArticleSearch search={search} />)}

            {children}
        </div>

    );
};

export default PageCard;