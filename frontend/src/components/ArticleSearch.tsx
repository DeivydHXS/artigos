import React, { useCallback, useMemo, useState } from "react";
import type { CategoryInterface } from "../interfaces/CategoryInterface";
import { CgClose } from "react-icons/cg";
import { useApi } from "../hooks/useApi";

export const ArticleSearch: React.FC<Props> = ({ search }) => {
    const { get } = useApi();
    const [categories, setCategories] = useState<CategoryInterface[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<CategoryInterface[]>([]);
    const [term, setTerm] = useState<string>("");

    const getCategories = useCallback(async () => {
        const result = await get<CategoryInterface[]>("/categories");
        if (result.isStatusValid) {
            setCategories(result.data || []);
        }
    }, []);

    useState(() => {
        getCategories();
    });

    const handleSearch = useCallback(async () => {
        const categoryIds = selectedCategories.map(cat => cat.id);
        await search?.(term, categoryIds);
    }, [selectedCategories, term])

    const handleClear = useCallback(() => {
        setSelectedCategories([]);
        setTerm("");
        search?.();
    }, [search]);

    const showCategories = useMemo(() => {
        return categories.filter(category =>
            !selectedCategories.some(selected => selected.id === category.id)
        );
    }, [categories, selectedCategories]);

    return (
        <div>
            <div className="flex items-center gap-2 w-full h-[40px]">
                <input
                    data-cy="search-bar"
                    type="text"
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                    placeholder="Pesquisar..."
                    className="border border-neutral rounded-md focus:outline-none focus:border-primary flex-10 h-full px-2" />
                <select
                    data-cy="select-category"
                    onChange={(e) => {
                        const categoryId = parseInt(e.target.value);
                        if (categoryId) {
                            const selectedCategory = categories.find(cat => cat.id === categoryId);
                            if (selectedCategory && !selectedCategories.includes(selectedCategory)) {
                                setSelectedCategories([...selectedCategories, selectedCategory]);
                            }
                        }
                    }}
                    className="border border-neutral rounded-md focus:outline-none focus:border-secondary cursor-pointer flex-3 h-full">
                    <option value="">Categoria</option>
                    {showCategories.map((category) => (
                        <option data-cy={`option-category-${category.id}`} key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
                <input
                    data-cy="button-search"
                    className="text-center bg-primary text-white rounded-md p-2 hover:bg-secondary cursor-pointer w-[150px] flex-2 h-full"
                    type="button"
                    value="Buscar"
                    onClick={handleSearch}
                />
                <input
                    data-cy="button-clear"
                    className="text-center bg-cancel text-white rounded-md p-2 hover:bg-cancel-desc cursor-pointer w-[150px] flex-2 h-full"
                    type="button"
                    value="Limpar"
                    onClick={handleClear}
                />
            </div>

            <div className="flex items-center gap-2 mt-2 min-h-10">
                {selectedCategories.map((cat) => (
                    <div key={cat.id} className="flex items-center gap-2 border-1 border-primary rounded-md p-1 text-sm">
                        {cat.name}
                        <CgClose data-cy={`delete-selected-category-${cat.id}`} onClick={() => setSelectedCategories(selectedCategories.filter(item => item.id !== cat.id))} className="cursor-pointer" />
                    </div>
                ))}
            </div>

        </div>
    )
}

interface Props {
    search?: (text?: string, categories?: number[]) => Promise<void>;
}