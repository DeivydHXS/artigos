import { useContext, type Context } from "react";
/**
 * O texto aparece aqui
 * @param ctx - The context to use.
 * @returns The context value.
 * @throws Error if the context is undefined.
 */
export const  useLoadContext = <T>(ctx: Context<T>) => {
    const context = useContext(ctx);
    if (context === undefined) {
        throw new Error("useContext must be used within a Provider");
    }
    return context;
}
