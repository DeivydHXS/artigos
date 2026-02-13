import type React from "react";
import type { CommentaryInterface } from "../interfaces/CommentaryInterface";
import { TfiPencilAlt, TfiTrash } from "react-icons/tfi";
import { useCallback } from "react";
import { useApi } from "../hooks/useApi";
import UserImageName from "./UserImageName";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface CommentariesItemProps {
  commentary: CommentaryInterface;
  refresh: () => Promise<void>;
}

const CommentariesItem: React.FC<CommentariesItemProps> = ({
  commentary,
  refresh,
}) => {
  const { del } = useApi();

  const handleDelete = useCallback(async () => {
    await del(`/commentary/${commentary.id}`);
    refresh();
  }, [commentary.id, del, refresh]);

  const handleEdit = useCallback(async () => {
    refresh();
  }, [refresh]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="p-5 rounded-xl border border-border bg-card hover:border-primary transition-all duration-300"
    >
      <div className="flex items-start justify-between gap-4">
        <UserImageName user={commentary.author} />

        {commentary.is_author && (
          <div className="flex gap-2">
            <Button
              size="icon"
              variant="secondary"
              data-cy={`button-edit-commentary-${commentary.id}`}
              onClick={handleEdit}
              className="rounded-md"
            >
              <TfiPencilAlt />
            </Button>

            <Button
              size="icon"
              variant="destructive"
              data-cy={`button-delete-commentary-${commentary.id}`}
              onClick={handleDelete}
              className="rounded-md"
            >
              <TfiTrash />
            </Button>
          </div>
        )}
      </div>

      <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
        {commentary.message}
      </p>
    </motion.div>
  );
};

export default CommentariesItem;
