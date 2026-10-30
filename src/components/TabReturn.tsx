import { useEffect } from "react";

// Quando a pessoa troca de aba, o título da aba do site pisca entre duas frases para chamar de volta.
// Ao voltar, o título original volta na hora. Não grava nada e não usa cookie.
const FRASES = ["Cliente perdido não avisa", "Análise gratuita da sua empresa"];

export function TabReturn() {
  useEffect(() => {
    let timer = 0;
    let original = document.title;

    const onChange = () => {
      if (document.hidden) {
        original = document.title;
        let i = 0;
        document.title = FRASES[0];
        timer = window.setInterval(() => {
          i = (i + 1) % FRASES.length;
          document.title = FRASES[i];
        }, 1500);
      } else {
        clearInterval(timer);
        document.title = original;
      }
    };

    document.addEventListener("visibilitychange", onChange);
    return () => {
      document.removeEventListener("visibilitychange", onChange);
      clearInterval(timer);
    };
  }, []);

  return null;
}
