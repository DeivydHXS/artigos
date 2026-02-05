import React, { useCallback, useEffect, useState } from 'react';
import type { ArticleInterface } from '../interfaces/ArticleInterface';
import PageCard from '../components/PageCard';
import { ArticleList } from '../components/ArticleList';
import { Loading } from '../components/Loading';
import { useApi } from '../hooks/useApi';

const Favorites: React.FC = () => {
    const { get } = useApi();
    const [articles, setArticles] = useState<ArticleInterface[]>([])
    const [load, setLoad] = useState<boolean>(true);

    const getFavorites = useCallback(async () => {
        setLoad(true);
        const result = await get<ArticleInterface[]>('/user/favorites');
        setArticles(result.data || []);
        setLoad(false);
    }, []);

    useEffect(() => {
        getFavorites();
    }, []);

    return (
        <PageCard title="Meus Favoritos">
            {load ? <Loading /> :
                <ArticleList articles={articles} />}
        </PageCard>

    );
};

export default Favorites;
