
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
        <ul className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {props.plusButton &&
                <li>
                    <div
                        className="w-full h-full rounded-md bg-card border border-dashed border-border hover:border-primary flex flex-col items-center justify-center transition duration-300 ease-in-out">
                        <NavLink to="/write" className="w-full h-full flex items-center justify-center">
                            <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                                <p>Novo artigo</p>
                                <PiPlus />
                            </div>
                        </NavLink>
                    </div>
                </li>
            }
            {props.articles.map((article) => (
                <li key={article.id}>
                    <ArticlesItem self={props.self} article={article} refresh={props.refresh} />
                </li>
            ))}
            {props.articles.length === 0 && (
                <li className="col-span-full text-center text-muted-foreground py-10">
                    Nenhum artigo encontrado.
                </li>
            )}
        </ul>
    );
}
