import { useParams } from "react-router-dom";
import type { ArticleInterface } from "../interfaces/ArticleInterface";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import CommentariesItem from "../components/CommentariesItem";
import PageCard from "../components/PageCard";
import type { CommentaryInterface } from "../interfaces/CommentaryInterface";
import { useApi } from "../hooks/useApi";
import { TfiDownload } from "react-icons/tfi";
import { BiSend } from "react-icons/bi";

interface ArticleCommentsInterface {
    article: ArticleInterface;
    comments: CommentaryInterface[];
}

const ShowArticle = () => {
    const { get, post } = useApi();
    let { articleId } = useParams();
    const [article, setArticle] = useState<ArticleInterface>();
    const [comments, setComments] = useState<CommentaryInterface[]>([]);

    const getArticle = useCallback(async () => {
        const result = await get<ArticleCommentsInterface>(`/articles/${articleId}`);

        if (result.isStatusValid) {
            setArticle(result.data?.article || {} as ArticleInterface);
            setComments(result.data?.comments || [] as CommentaryInterface[]);
        }
    }, []);

    const handleComment = useCallback(async (form: FormEvent<HTMLFormElement>) => {
        form.preventDefault()
        const data = new FormData(form.currentTarget);
        await post(`/articles/${articleId}/comment`, data);
        getArticle();
    }, []);

    useEffect(() => {
        getArticle();
    }, []);

    return (
        <div className='bg-white w-full rounded-md border border-white border-b-1 border-b-neutral flex flex-col mt-20 overflow-clip'>
            <div className="w-full h-[50vh]">
                <img className="h-full w-full" src={article?.thumbnail_url ?
                    article?.thumbnail_url :
                    "https://fillthis.io/i/600x400?text=Sem+imagem&font=roboto"} />
            </div>
            <div className="p-4">
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-bold my-2">{article?.title}</h1>
                    <h2 className="text-sm">Autor: {article?.author.name}</h2>
                    <div className="flex items-center gap-2 min-h-10">
                        {article?.categories.map((cat) => (
                            <div key={cat.id} className="flex items-center gap-2 border-1 border-neutral rounded-md px-2 py-1 text-sm">
                                {cat.name}
                            </div>
                        ))}
                    </div>

                    <div dangerouslySetInnerHTML={{ __html: article?.body || '' }} className="my-8" />

                    {
                        article?.support_files[0] &&
                        <div className='flex flex-col gap-1 my-4'>
                            <ul className='flex gap-2'>
                                {article.support_files.map((support_file) => (
                                    <li className='flex gap-2 bg-white border border-neutral-400 rounded-md p-2'>
                                        <p>{support_file.name}</p>
                                        <a href={support_file.path} target="_blank" className='text-blue-500 rounded-md p-1'>
                                            <TfiDownload />
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    }
                </div>

                <div className="my-8">
                    <h1 className="text-xl font-bold">Comentários</h1>
                    <div className="bg-white w-full flex flex-col gap-4 py-4">
                        <ul>
                            {comments.map((commentary, index) => (
                                <li key={index}>
                                    <CommentariesItem commentary={commentary} refresh={getArticle} />
                                </li>
                            ))}
                        </ul>
                        <form onSubmit={handleComment} className="flex gap-2 mt-4 px-2">
                            <input data-cy={`input-message-commentary`} type="text" name="message" placeholder="Escreva um comentario" className="w-full border-neutral border rounded-md p-2 focus:outline-none focus:border-primary" />
                            <button data-cy={`button-send-commentary`} type="submit" className="bg-primary rounded-md py-2 px-8 hover:bg-secondary text-white">
                                <div className="flex items-center justify-center gap-2">
                                    <p>Enviar</p>
                                    <div className="mt-0.25">
                                        <BiSend />
                                    </div>
                                </div>
                            </button>
                        </form>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default ShowArticle;