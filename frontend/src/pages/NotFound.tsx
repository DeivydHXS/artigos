import React from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";

const NotFound: React.FC = () => {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background text-foreground px-4">

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center gap-6 text-center"
      >
        {/* Código 404 */}
        <h1 className="text-6xl font-bold text-primary">
          404
        </h1>

        {/* Mensagem */}
        <p className="text-muted-foreground text-lg">
          Ops… essa página não existe ou foi movida.
        </p>

        {/* Botão */}
        <NavLink
          to="/feed"
          className="
            bg-primary
            hover:bg-primary/90
            text-primary-foreground
            font-semibold
            px-6
            py-2
            rounded-md
            transition-colors
            duration-200
          "
        >
          Ir para página inicial
        </NavLink>
      </motion.div>

    </main>
  );
};

export default NotFound;
