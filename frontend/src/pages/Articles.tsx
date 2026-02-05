import React, { useCallback, useEffect, useState } from 'react';
import type { ArticleInterface } from '../interfaces/ArticleInterface';
import PageCard from '../components/PageCard';
import { ArticleList } from '../components/ArticleList';
import { Loading } from '../components/Loading';
import { useApi } from '../hooks/useApi';

const Articles: React.FC = () => {
    const { get } = useApi();

    const [articles, setArticles] = useState<ArticleInterface[]>([])
    const [load, setLoad] = useState<boolean>(true);

    const getArticles = useCallback(async () => {
        setLoad(true);
        const result = await get<ArticleInterface[]>('/articles');
        setArticles(result.data || []);
        setLoad(false);
    }, []);

    useEffect(() => {
        getArticles();
    }, []);

    return (
        <PageCard title="Meus Artigos">
            {load ? <Loading /> : 
            <ArticleList plusButton={true} articles={articles} self={true} refresh={getArticles} />}
        </PageCard>
    );
};

export default Articles;
