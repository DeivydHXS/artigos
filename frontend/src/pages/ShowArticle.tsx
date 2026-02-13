import { useParams } from "react-router-dom";
import type { ArticleInterface } from "../interfaces/ArticleInterface";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import CommentariesItem from "../components/CommentariesItem";
import type { CommentaryInterface } from "../interfaces/CommentaryInterface";
import { useApi } from "../hooks/useApi";
import { TfiDownload } from "react-icons/tfi";
import { BiSend } from "react-icons/bi";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

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
    const result = await get<ArticleCommentsInterface>(
      `/articles/${articleId}`
    );

    if (result.isStatusValid) {
      setArticle(result.data?.article);
      setComments(result.data?.comments || []);
    }
  }, [articleId, get]);

  const handleComment = useCallback(
    async (form: FormEvent<HTMLFormElement>) => {
      form.preventDefault();
      const data = new FormData(form.currentTarget);
      await post(`/articles/${articleId}/comment`, data);
      getArticle();
    },
    [articleId, post, getArticle]
  );

  useEffect(() => {
    getArticle();
  }, [getArticle]);

  return (
    <div className="min-h-screen bg-background text-foreground py-20 px-6">
      <div className="max-w-5xl mx-auto space-y-10">

        {/* ARTICLE CARD */}
        <Card className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
          <div className="w-full h-[420px]">
            <img
              className="h-full w-full object-cover"
              src={
                article?.thumbnail_url ||
                "https://fillthis.io/i/1200x600?text=Sem+imagem"
              }
            />
          </div>

          <CardContent className="p-10">

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-4xl font-bold tracking-tight mb-4"
            >
              {article?.title}
            </motion.h1>

            <p className="text-muted-foreground text-sm mb-6">
              Autor: {article?.author.name}
            </p>

            {/* Categorias */}
            <div className="flex flex-wrap gap-2 mb-8">
              {article?.categories.map((cat) => (
                <div
                  key={cat.id}
                  className="px-3 py-1 text-xs rounded-md border border-primary/40 bg-primary/10 text-primary"
                >
                  {cat.name}
                </div>
              ))}
            </div>

            {/* Conteúdo */}
            <div
              dangerouslySetInnerHTML={{ __html: article?.body || "" }}
              className="prose prose-neutral dark:prose-invert max-w-none"
            />

            {/* Arquivos de apoio */}
            {article?.support_files && article?.support_files?.length > 0 && (
              <div className="mt-10">
                <h3 className="text-lg font-semibold mb-4">
                  Material de Apoio
                </h3>

                <div className="flex flex-wrap gap-3">
                  {article?.support_files.map((file) => (
                    <a
                      key={file.id}
                      href={file.path}
                      target="_blank"
                      className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-secondary hover:border-primary transition"
                    >
                      <span className="text-sm">{file.name}</span>
                      <TfiDownload className="text-muted-foreground" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* COMMENTS CARD */}
        <Card className="bg-card border border-border rounded-xl shadow-sm">
          <CardContent className="p-8">

            <h2 className="text-2xl font-semibold mb-6">
              Comentários
            </h2>

            <ul className="space-y-4">
              {comments.map((commentary, index) => (
                <li key={index}>
                  <CommentariesItem
                    commentary={commentary}
                    refresh={getArticle}
                  />
                </li>
              ))}
            </ul>

            {/* Form comentário */}
            <form
              onSubmit={handleComment}
              className="flex gap-3 mt-8"
            >
              <input
                data-cy="input-message-commentary"
                type="text"
                name="message"
                placeholder="Escreva um comentário"
                className="flex-1 rounded-md border border-border bg-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary transition"
              />

              <Button
                data-cy="button-send-commentary"
                type="submit"
                className="rounded-md px-6 flex items-center gap-2"
              >
                Enviar
                <BiSend />
              </Button>
            </form>

          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default ShowArticle;
