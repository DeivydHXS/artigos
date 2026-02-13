import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Code2, Shield, Terminal, Flame } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-6 py-28 text-center relative">

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-6xl font-bold tracking-tight leading-tight"
        >
          Compartilhe conhecimento.
          <span className="text-primary drop-shadow-[0_0_2px_var(--primary)]">
            {" "}Explore o código.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto"
        >
          Uma comunidade para desenvolvedores, hackers éticos e entusiastas
          de tecnologia. Artigos profundos, experimentos reais e aprendizado contínuo.
        </motion.p>

        <div className="mt-12 flex justify-center gap-4">
          <Button
            onClick={() => navigate("/artigos")}
            className="
              rounded-xl px-8 py-6 text-lg
              bg-gradient-to-br from-primary to-primary/80
              text-primary-foreground
              transition-all duration-300
              hover:shadow-primary-glow
              hover:-translate-y-0.5
            "
          >
            Explorar Artigos
          </Button>

          <Button
            onClick={() => navigate("/login")}
            variant="outline"
            className="
              rounded-xl px-8 py-6 text-lg
              border-border/70
              backdrop-blur-xs
              bg-card/50
              transition-all duration-300
              hover:border-primary
              hover:shadow-primary-glow
              hover:-translate-y-0.5
            "
          >
            Entrar
          </Button>
        </div>
      </section>

      {/* CATEGORIAS */}
      <section className="max-w-6xl mx-auto px-6 pb-28 grid md:grid-cols-3 gap-8">
        <FeatureCard
          icon={<Code2 size={28} />}
          title="Desenvolvimento"
          description="Frontend, backend, arquitetura, DevOps e tudo que envolve construir software moderno."
        />

        <FeatureCard
          icon={<Shield size={28} />}
          title="Segurança & Hacking"
          description="Cybersegurança, pentest, análise de vulnerabilidades e práticas de defesa digital."
        />

        <FeatureCard
          icon={<Terminal size={28} />}
          title="Low-Level & Sistemas"
          description="Redes, sistemas operacionais, engenharia reversa e exploração técnica profunda."
        />
      </section>

      {/* TRENDING */}
      <section className="max-w-6xl mx-auto px-6 pb-32">
        <div className="flex items-center gap-3 mb-10">
          <Flame className="text-primary" />
          <h2 className="text-2xl font-semibold tracking-tight">
            Em Alta
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((item) => (
            <Card
              key={item}
              className="
                rounded-xl
                bg-card/70
                backdrop-blur-xs
                border border-border/50
                transition-all duration-300
                hover:border-primary
                hover:shadow-primary-glow
                hover:-translate-y-1
              "
            >
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">
                  Como funciona o Event Loop no Node.js
                </h3>

                <p className="text-muted-foreground text-sm">
                  Uma análise detalhada sobre concorrência, filas e como o Node gerencia operações assíncronas.
                </p>

                <div className="mt-4 text-xs text-muted-foreground">
                  12 min leitura • Backend
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card
      className="
        rounded-xl
        bg-card/70
        backdrop-blur-xs
        border border-border/50
        transition-all duration-300
        hover:border-primary
        hover:shadow-primary-glow
        hover:-translate-y-1
      "
    >
      <CardContent className="p-8">
        <div className="mb-4 text-primary">
          {icon}
        </div>

        <h3 className="text-xl font-semibold mb-2">
          {title}
        </h3>

        <p className="text-muted-foreground text-sm">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}

export default Home;
