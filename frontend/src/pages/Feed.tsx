import React, { useCallback, useEffect, useState } from "react";
import type { ArticleInterface } from "../interfaces/ArticleInterface";
import PageCard from "../components/PageCard";
import { ArticleList } from "../components/ArticleList";
import { Loading } from "../components/Loading";
import { useApi } from "../hooks/useApi";

const Feed: React.FC = () => {
  const [feed, setFeed] = useState<ArticleInterface[]>([])
  const [load, setLoad] = useState<boolean>(false);
  const { get } = useApi();

  const getFeed = useCallback(async (search?: string, categories?: number[]) => {
    setLoad(true);

    const query = new URLSearchParams();

    if (search) query.append("search", search);

    if (categories) {
      categories.forEach((cat) => {
        query.append("categories[]", String(cat));
      });
    }

    const result = await get<ArticleInterface[]>(
      `/articles/feed${query.toString() ? `?${query.toString()}` : ""}`
    );

    if (result.isStatusValid) {
      setFeed(result.data || []);
    }

    setLoad(false);
  }, []);

  useEffect(() => {
    getFeed()
  }, [])

  return (
    <PageCard title="Feed de Artigos" search={getFeed}>
      {load ? (
        <div className="py-10 flex justify-center">
          <Loading />
        </div>
      ) : feed.length === 0 ? (
        <div className="text-center text-muted-foreground py-10">
          Nenhum artigo encontrado.
        </div>
      ) : (
        <ArticleList articles={feed} />
      )}
    </PageCard>
  );
};

export default Feed;
