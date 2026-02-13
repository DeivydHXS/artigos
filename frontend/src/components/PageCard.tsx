import type { PropsWithChildren } from "react";
import React from "react";
import { ArticleSearch } from "./ArticleSearch";
import { NavLink } from "react-router-dom";
import { TfiAngleLeft } from "react-icons/tfi";

interface PageCardProps extends PropsWithChildren {
  title?: string;
  search?: (text?: string, categories?: number[]) => Promise<void>;
  goBackTo?: string;
}

const PageCard: React.FC<PageCardProps> = ({
  title,
  children,
  search,
  goBackTo
}) => {
  return (
    <div className="mt-18 w-full bg-card border border-border rounded-xl shadow-sm p-6">
      
      {/* Header */}
      {(title || goBackTo) && (
        <div className="flex items-center justify-between mb-6">
          
          {goBackTo ? (
            <NavLink
              to={goBackTo}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <TfiAngleLeft />
              Voltar
            </NavLink>
          ) : (
            <div />
          )}

          {title && (
            <h1 className="text-2xl font-semibold text-foreground text-center flex-1">
              {title}
            </h1>
          )}

          {/* Espaçador para manter título centralizado */}
          {goBackTo && <div className="w-16" />}
        </div>
      )}

      {/* Search */}
      {search && (
        <div className="mb-6">
          <ArticleSearch search={search} />
        </div>
      )}

      {/* Conteúdo */}
      <div>{children}</div>
    </div>
  );
};

export default PageCard;
