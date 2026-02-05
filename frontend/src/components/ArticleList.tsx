
import type { ArticleInterface } from "../interfaces/ArticleInterface";
import ArticlesItem from "./ArticlesItem";
import { NavLink } from "react-router-dom";
import { PiPlus } from "react-icons/pi";

interface Props {
    articles: ArticleInterface[];
    self?: boolean
    refresh?: () => Promise<void>;
    plusButton?: boolean;
}

export const ArticleList: React.FC<Props> = (props) => {

    return (
        <ul className='w-full grid grid-cols-3 gap-8'>
            {props.plusButton &&
                <li>
                    <div
                    className='w-full h-full rounded-md border border-dashed bg-white flex flex-col items-center justify-center hover:border-primary transition duration-300 ease-in-out'>
                        <NavLink to='/write' className='w-full h-full flex items-center justify-center'>
                            <div className='w-full h-full flex flex-col items-center justify-center gap-2'>
                                <p>Novo artigo</p>
                                <PiPlus />
                            </div>
                        </NavLink>
                    </div>
                </li>
            }
            {props.articles.map((article, index) => (
                <li key={index}>
                    <ArticlesItem self={props.self} article={article} refresh={props.refresh} />
                </li>
            ))}
            {props.articles.length === 0 && (
                <p className="text-center col-span-3">Nenhum artigo encontrado.</p>
            )}
        </ul>
    );
}
