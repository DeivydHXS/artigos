import type React from "react";
import type { CommentaryInterface } from "../interfaces/CommentaryInterface";
import { TfiPencilAlt, TfiTrash } from "react-icons/tfi";
import { useCallback } from "react";
import { useApi } from "../hooks/useApi";
import UserImageName from "./UserImageName";

interface CommentariesItemProps {
    commentary: CommentaryInterface;
    refresh: () => Promise<void>;
}

const CommentariesItem: React.FC<CommentariesItemProps> = ({ commentary, refresh }) => {
    const { del } = useApi();

    const handleDelete = useCallback(async () => {
        await del(`/commentary/${commentary.id}`);
        refresh();
    }, []);

    const handleEdit = useCallback(async () => {
        refresh();
    }, []);

    return (
        <div className="p-4 rounded-md border-b-1 border-b-neutral bg-white mb-4">
            <div className="flex items-center justify-between gap-4">
                <UserImageName user={commentary.author} />
                {commentary.is_author ?
                    <div className="flex gap-1">
                        <button data-cy={`button-edit-commentary-${commentary.id}`} onClick={handleEdit} className="flex gap-1 items-center p-2 text-white text-sm bg-edit hover:bg-edit-desc rounded-md">
                            <TfiPencilAlt scale={0.5} />
                        </button>
                        <button data-cy={`button-delete-commentary-${commentary.id}`} onClick={handleDelete} className="flex gap-1 items-center p-2 text-white text-sm bg-cancel hover:bg-cancel-desc rounded-md">
                            <TfiTrash scale={0.5} />
                        </button>
                    </div>
                    : ''}
            </div>
            <p className="p-1 mt-2">
                {commentary.message}
            </p>
        </div>
    );
};

export default CommentariesItem;