import type React from "react";
import type { ArticleInterface } from "../interfaces/ArticleInterface";
import { NavLink } from "react-router-dom";
import type { IconBaseProps } from "react-icons";
import { useCallback, useState } from "react";

import { RxBookmark } from "react-icons/rx";
import { RxBookmarkFilled } from "react-icons/rx";
import { RxChatBubble } from "react-icons/rx";
import { useApi } from "../hooks/useApi";
import UserImageName from "./UserImageName";
import { PiFireFill, PiHandsClappingFill, PiHeartFill, PiThumbsUp, PiThumbsUpFill } from "react-icons/pi";
import type { LikeInterface } from "../interfaces/LikeInterface";
import ArticleItemLike from "./ArticleItemLike";
import ButtonIcon from "./ButtonIcon";
import { BiEdit, BiTrash } from "react-icons/bi";
import { useLoadContext } from "../hooks/useContext";
import { AlertContext } from "../contexts/AlertContext";

interface ArticlesItemProps {
    article: ArticleInterface;
    refresh?: () => Promise<void>;
    self?: boolean;
}

const ArticlesItem: React.FC<ArticlesItemProps> = (props) => {
    const { post, del } = useApi();
    const [article, setArticle] = useState<ArticleInterface>(props.article);
    const [openReactionModal, setOpenReactionModal] = useState<boolean>(false);
    const [canLike, setCanLike] = useState<boolean>(false);
    const { addAlert } = useLoadContext(AlertContext);

    function onMouseEnter() {
        setOpenReactionModal(true);
    }

    function onMouseLeave() {
        setOpenReactionModal(false);
    }

    function formatDate(date: string): string {
        const data = new Date(date);
        return data.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    }

    const handleFavorite = useCallback(async (is_favorite: boolean) => {
        if (is_favorite) {
            await del(`/articles/${article.id}/favorite`);
            setArticle(prev => { return { ...prev, is_favorite: false } });
            addAlert({
                type: 'error',
                message: 'Artigo removido dos favoritos.'
            });
        }
        else {
            await post(`/articles/${article.id}/favorite`, {});
            setArticle(prev => { return { ...prev, is_favorite: true } });
            addAlert({
                type: 'success',
                message: 'Artigo adicionado aos favoritos.'
            });
        }
    }, []);

    const handleLike = useCallback(async (like: LikeInterface | null, reaction: string = 'L') => {
        setCanLike(true);
        if (like != null && reaction == like.reaction) {
            await del(`/articles/${article.id}/like`);

            setArticle(prev => {
                return {
                    ...prev,
                    count_likes: prev.count_likes - 1,
                    user_like: null
                }
            })
        } else {
            const response = await post<LikeInterface>(`/articles/${article.id}/like`, { reaction: reaction });
            setArticle(prev => {
                return {
                    ...prev,
                    count_likes: like == null ? prev.count_likes + 1 : prev.count_likes,
                    user_like: response.data || null
                }
            });
        }

        setCanLike(false);
        setOpenReactionModal(false);
    }, []);

    const handleDelete = useCallback(async (id: number) => {
        await del(`/articles/${id}`);
        props.refresh && await props.refresh();
    }, []);

    const iconProps: IconBaseProps = {
        size: 20,
    }

    const buttons: Array<{ dataCy: string, icon: any, handle: () => void }> = [
        {
            dataCy: `button-heart-article-${article.id}`,
            icon: < PiHeartFill {...iconProps} color='oklch(52.5% 0.223 3.958)' />,
            handle: () => handleLike(article.user_like, 'H')
        },
        {
            dataCy: `button-like-article-${article.id}`,
            icon: < PiThumbsUpFill {...iconProps} color='oklch(52% 0.105 223.128)' />,
            handle: () => handleLike(article.user_like, 'L')
        },
        {
            dataCy: `button-fire-article-${article.id}`,
            icon: < PiFireFill {...iconProps} color='oklch(50.5% 0.213 27.518)' />,
            handle: () => handleLike(article.user_like, 'F')
        },
        {
            dataCy: `button-clapping-article-${article.id}`,
            icon: < PiHandsClappingFill  {...iconProps} color='oklch(55.4% 0.135 66.442)' />,
            handle: () => handleLike(article.user_like, 'C')
        },
    ]

    return (
        <div className='rounded-md border-b-1 border-b-neutral bg-white flex flex-col'>
            <div className="w-full h-[180px] rounded-t-md overflow-clip">
                <NavLink data-cy={`link-image-article-${article.id}`} to={`/article/${article.id}`} className="text-2xl font-bold text-neutral-800">
                    <img className="h-full w-full" src={article.thumbnail_url ?
                        article.thumbnail_url :
                        "https://fillthis.io/i/600x400?text=Sem+imagem&font=roboto"} />
                </NavLink>
            </div>

            <div className="p-8 h-full flex flex-col justify-between">
                <div className="flex flex-col items-baseline justify-between mb-2 gap-2">
                    <div className="flex justify-between items-baseline gap-2 w-full">
                        <NavLink to={`/article/${article.id}`} className="text-xl font-bold text-neutral-800 whitespace-pre-wrap" data-cy={`link-title-article-${article.id}`}>
                            {article.title.slice(0, 18) + (article.title.length > 18 ? '...' : '')}
                        </NavLink>
                        <ButtonIcon dataCy={`button-favorite-article-${article.id}`} icon={article.is_favorite ? <RxBookmarkFilled {...iconProps} color="oklch(28.3% 0.141 291.089)" /> : <RxBookmark {...iconProps} color="oklch(38% 0.189 293.745)" />}
                            handle={() => handleFavorite(article.is_favorite)}
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-1">
                    <UserImageName user={article.author} />
                    <div className="flex items-center justify-baseline gap-4">
                        <div>
                            <p className="text-sm">{formatDate(article.created_at)}</p>
                        </div>

                        <div>
                            <div onMouseEnter={onMouseEnter}
                                onMouseLeave={onMouseLeave}
                                className="relative">
                                <div className="flex gap-1 items-center justify-center cursor-pointer">
                                    {article.user_like ?
                                        <ButtonIcon
                                            disabled={canLike}
                                            dataCy={`button-user-like-article-${article.id}`}
                                            icon={<ArticleItemLike like={article.user_like} />}
                                            handle={() => handleLike(article.user_like, article?.user_like?.reaction)}
                                        />
                                        :
                                        <ButtonIcon
                                            disabled={canLike}
                                            dataCy={`button-default-like-article-${article.id}`}
                                            icon={<PiThumbsUp {...iconProps} />}
                                            handle={() => handleLike(article.user_like, 'L')}
                                        />
                                    }
                                    <p>{article.count_likes}</p>
                                </div>
                                {
                                    openReactionModal ?
                                        <div className="-top-8 absolute p-2 bg-white flex gap-4">
                                            {buttons.map(element => {
                                                return <ButtonIcon
                                                    disabled={canLike}
                                                    dataCy={element.dataCy}
                                                    icon={element.icon}
                                                    handle={element.handle}
                                                />
                                            })}
                                        </div> : ''
                                }
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <div>
                                <RxChatBubble {...iconProps} />
                            </div>
                            <p>{article.count_comments}</p>
                        </div>
                    </div>
                </div>
            </div>

            {
                props.self &&
                <div className="w-full flex items-center justify-center gap-2 my-4">
                    <NavLink to={`/write/${article.id}`} className='bg-edit rounded-md p-2 hover:bg-edit-desc text-white font-semibold w-[45%]'>
                        <div className="flex items-center justify-between gap-2">
                            <p>Editar</p>
                            <div>
                                <BiEdit />
                            </div>
                        </div>
                    </NavLink>
                    <button onClick={() => handleDelete(article.id)} className='bg-cancel rounded-md p-2 hover:bg-cancel-desc cursor-pointer text-white font-semibold w-[45%]'>
                        <div className="flex items-center justify-between gap-2">
                            <p>Excluir</p>
                            <div>
                                <BiTrash />
                            </div>
                        </div>
                    </button>
                </div>
            }
        </div>
    );
};

export default ArticlesItem;