import React, { useCallback, useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import PageCard from "../components/PageCard";
import { useNavigate, useParams } from "react-router-dom";
import type { CategoryInterface } from "../interfaces/CategoryInterface";
import type { ArticleInterface } from "../interfaces/ArticleInterface";
import { useApi } from "../hooks/useApi";
import { Loading } from "../components/Loading";
import { useLoadContext } from "../hooks/useContext";
import { AlertContext } from "../contexts/AlertContext";
import { TfiTrash } from "react-icons/tfi";
import { PiPlus } from "react-icons/pi";
import { CgClose } from "react-icons/cg";
import { lazy, Suspense } from "react";
const RichTextEditor = lazy(() => import("../components/RichTextEditor"));

interface FormErrors {
  title?: string[],
  categories?: string[],
  body?: string[],
  thumbnail?: string[],
  support_files?: string[],
}

const Write: React.FC = () => {
  const { get, post } = useApi();
  const { addAlert } = useLoadContext(AlertContext);
  const navigate = useNavigate();
  const [load, setLoad] = useState<boolean>(true);
  const [errors, setErrors] = useState<FormErrors>({});

  const { articleId } = useParams();
  const [article, setArticle] = useState<ArticleInterface>();
  const [categories, setCategories] = useState<CategoryInterface[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<CategoryInterface[]>([]);
  const [content, setContent] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);

  const showCategories = useMemo(() => {
    return categories.filter(category =>
      !selectedCategories.some(selected => selected.id === category.id)
    );
  }, [categories, selectedCategories]);

  const config = useMemo(() => ({
    readonly: false,
    placeholder: articleId ? "" : "Comece a escrever...",
    buttons: ["bold", "italic", "underline", "ul", "ol", "link", "eraser"],
    removeButtons: [
      "strikethrough",
      "font", "fontsize", "paragraph", "image", "table",
      "align", "indent", "outdent", "brush", "file", "video"
    ],
  }),
    []
  );

  const handleSubmit = useCallback(async (form: FormEvent<HTMLFormElement>) => {
    form.preventDefault()
    const data = new FormData(form.currentTarget);

    if (files.length > 0) {
      for (var i = 0; i < files.length; i++) {
        data.append("support_files[]", files[i]);
      }
    }

    if (selectedCategories.length > 0) {
      for (var i = 0; i < selectedCategories.length; i++) {
        data.append("categories[]", selectedCategories[i].id.toString());
      }
    }

    setErrors({});
    setLoad(true);

    var result;
    if (articleId) {
      result = await post<ArticleInterface | FormErrors>(`/articles/${articleId}`, data);
      if (result.isStatusValid) {
        addAlert({
          type: "success",
          message: result.message
        });
        setLoad(false);
        setArticle(result.data as ArticleInterface);
        return
      }
    }
    else {
      result = await post<ArticleInterface | FormErrors>("/articles", data);
      if (result.isStatusValid) {
        addAlert({
          type: "success",
          message: result.message
        });
        setLoad(false);
        navigate("/articles");
        return
      }
    }

    addAlert({
      type: "error",
      message: result.message
    });
    setErrors(result.errors as FormErrors);
    setLoad(false);
  }, [files, selectedCategories]);

  const getCategories = useCallback(async () => {
    const result = await get<CategoryInterface[]>("/categories");
    setCategories(result.data || []);
  }, []);

  const getArticle = useCallback(async () => {
    const result = await get<{ article: ArticleInterface }>(`/articles/${articleId}`);
    setArticle(result.data?.article);
    setContent(result?.data?.article.body || "");
    setSelectedCategories(result?.data?.article?.categories || []);
  }, []);

  const handleSupportFileDelete = useCallback(async (id: number) => {
    var result = await post<ArticleInterface | FormErrors>(`/articles/delete-support-file/${id}`);
    if (result.isStatusValid) {
      addAlert({
        type: "success",
        message: result.message
      });
      getArticle();
      setLoad(false);
      return
    }
  }, [addAlert, getArticle]);

  useEffect(() => {
    if (articleId) {
      getArticle();
    }

    getCategories();
    setLoad(false);
  }, []);

  const handleAddSupportFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles([...files, e.target.files[0]]);
    }
  }

  const handleRemoveSupportFile = (filename: string) => {
    setFiles(files.filter((file) => file.name !== filename));
  }

  return (
    <PageCard goBackTo="/articles" title={articleId ? "Editar artigo" : "Criar artigo"}>
      <div className="flex p-6">
        {load ? <Loading /> :
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
            <div className="flex justify-between gap-16">
              <div className="w-full">
                <div>
                  <div className="flex flex-col gap-1">
                    <label htmlFor="title">Título</label>
                    <input
                      type="text"
                      name="title"
                      defaultValue={article ? article.title : ""}
                      className={`w-full rounded-md border px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition
                        ${errors.title ? "border-destructive" : "border-border"}`}
                    />
                    <small className="text-destructive text-sm">{errors.title}</small>
                  </div>
                  <p>Selecione categoria(s)</p>
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
                    className="w-[220px] rounded-md border border-border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition cursor-pointer">
                    <option value="">Categoria</option>
                    {showCategories.map((category) => (
                      <option data-cy={`option-category-${category.id}`} key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>

                  <div className="flex items-center gap-2 mt-2 min-h-10 flex-wrap">
                    {selectedCategories.map((cat) => (
                      <div key={cat.id} className="flex items-center gap-2 border border-primary/40 bg-primary/10 text-primary rounded-md px-2 py-1 text-sm">
                        {cat.name}
                        <CgClose data-cy={`delete-selected-category-${cat.id}`} onClick={() => setSelectedCategories(selectedCategories.filter(item => item.id !== cat.id))} className="cursor-pointer" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="w-full flex flex-col gap-1">
                <label htmlFor="thumbnail">Imagem de capa</label>
                <div className="w-full h-[180px] rounded-lg overflow-hidden border border-border bg-card">
                  {article ? <img className="h-full w-full" src={article?.thumbnail_url} /> :
                    <img className="h-full w-full object-cover" src="https://ppgm.ufpr.br/wp-content/uploads/2021/05/SEM-IMAGEM.jpg" />
                  }
                </div>
                <div className={`relative flex items-center justify-center rounded-md border px-3 py-2 min-h-[42px] cursor-pointer transition
                      ${errors.thumbnail ? "border-destructive" : "border-border"}
                      bg-secondary hover:bg-secondary/80 text-secondary-foreground`}>
                  <div className="w-full h-full">
                    <input type="file" name="thumbnail"
                      className="absolute min-h-[35px] min-w-[35vw] opacity-0"
                    />
                    <p className="text-white text-center">Adicionar imagem de capa</p>
                  </div>
                </div>
              </div>
            </div>


            <div className="w-full">
              <label htmlFor="body">Conteúdo</label>
              <div className={`rounded-lg border bg-card p-2
                    ${errors.body ? "border-destructive" : "border-border"}`}>
                <Suspense fallback={<div>Carregando editor...</div>}>
                  <RichTextEditor
                    value={content}
                    config={config}
                    onChange={(value: string) => setContent(value)}
                  />
                </Suspense>
              </div>
              <small className="text-error text-wrap w-full">{errors.body}</small>
            </div>

            <div className="flex flex-col gap-1">
              <p>Subir material de apoio</p>

              <div>
                <ul className="flex gap-2 flex-wrap">
                  <li className="flex items-center justify-center w-[15vw] h-10 px-3 gap-2 border border-dashed border-border rounded-md bg-card hover:border-primary hover:bg-primary/5 transition cursor-pointer">
                    <input
                      type="file"
                      onChange={handleAddSupportFile}
                      className="w-[15vw] h-10 opacity-0 absolute"
                    />
                    <div className="w-full flex items-center justify-between gap-1 px-1">
                      <p>Adicionar arquivo</p>
                      <PiPlus />
                    </div>
                  </li>
                  {files &&
                    files.map((support_file) => (
                      support_file ?
                        <li className="flex items-center justify-between min-w-[15vw] h-10 px-3 gap-2 border border-border rounded-md bg-card">
                          <div className="w-full flex items-center justify-between gap-1 px-1">
                            <p>{support_file.name}</p>
                            <button type="button" onClick={() => handleRemoveSupportFile(support_file.name)} className="text-destructive hover:text-destructive/70 transition">
                              < TfiTrash />
                            </button>
                          </div>
                        </li> : ""
                    ))
                  }
                  {article?.support_files &&
                    article?.support_files.map((support_file) => (
                      support_file ?
                        <li className="flex items-center justify-center w-fit min-w-[15vw] h-10 px-2 gap-2 border-neutral-400 border-1 rounded-md">
                          <div className="w-full flex items-center justify-between gap-1 px-1">
                            <p>{support_file.name}</p>
                            <button type="button" onClick={() => handleSupportFileDelete(support_file.id)} className="text-destructive hover:text-destructive/70 transition">
                              < TfiTrash />
                            </button>
                          </div>
                        </li> : ""
                    ))
                  }
                </ul>
              </div>

            </div>

            <div className="w-full">
              <input type="submit" disabled={load} value="Salvar" className="w-full bg-primary text-primary-foreground rounded-md py-2 font-semibold hover:bg-primary/90 transition disabled:opacity-50" />
            </div>
          </form>}
      </div >

    </PageCard >
  );
};

export default Write;
