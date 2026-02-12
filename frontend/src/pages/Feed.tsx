import React, { useCallback, useEffect, useState } from 'react';
import type { ArticleInterface } from '../interfaces/ArticleInterface';
import PageCard from '../components/PageCard';
import { ArticleList } from '../components/ArticleList';
import { Loading } from '../components/Loading';
import { useApi } from '../hooks/useApi';

const Feed: React.FC = () => {
  const [feed, setFeed] = useState<ArticleInterface[]>([])
  const [load, setLoad] = useState<boolean>(false);
  const { get } = useApi();

  const getFeed = useCallback(async (search?:string, categories?:number[]) => {
    setLoad(true);
    let params = '?'
    if (search) params += `search=${search}`;
    if (categories) {
       categories.forEach((cat) => {
          params += `&categories[]=${cat}`;
       })
    }
    const result = await get<ArticleInterface[]>(`/articles/feed${params}`);
    if (result.isStatusValid) {
      setFeed(result.data || []);
      setLoad(false);
      return 
    }

  }, []);

  useEffect(() => {
    getFeed();
  }, []);

  return (
    <PageCard title="Feed de Artigos" search={getFeed}>
      {load ? <Loading /> :
        <ArticleList articles={feed} />
      }
    </PageCard>
  );
};

export default Feed;
