import { useEffect } from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  useEffect(() => {
    document.title = "Página não encontrada | Move AI";
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex";
    document.head.appendChild(meta);
    return () => {
      document.title = "Move AI";
      meta.remove();
    };
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="text-center">
        <h1 className="mb-4 text-5xl font-bold text-foreground">404</h1>
        <p className="mb-6 text-lg text-muted-foreground">Ops! Esta página não existe.</p>
        <Link to="/" className="btn-gradient inline-block px-6 py-3 text-sm">
          Voltar para o início
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
