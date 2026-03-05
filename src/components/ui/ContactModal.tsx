import { createContext, useContext, useState } from "react";
import { X } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface ContactModalContextType {
  openModal: () => void;
}

const ContactModalContext = createContext<ContactModalContextType>({ openModal: () => {} });

export function useContactModal() {
  return useContext(ContactModalContext);
}

export function ContactModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ nome: "", email: "", whatsapp: "", problema: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openModal = () => {
    setForm({ nome: "", email: "", whatsapp: "", problema: "" });
    setSubmitted(false);
    setIsOpen(true);
  };

  const closeModal = () => setIsOpen(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.from("formulario").insert({
      nome: form.nome,
      email: form.email,
      descricao: form.problema,
    });

    setLoading(false);

    if (error) {
      setError("Erro ao enviar. Tente novamente.");
    } else {
      setSubmitted(true);
    }
  };

  return (
    <ContactModalContext.Provider value={{ openModal }}>
      {children}
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative z-10 w-full max-w-md rounded-2xl bg-card border border-white/10 p-8 shadow-2xl animate-fade-in-up">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors"
              aria-label="Fechar"
            >
              <X className="h-4 w-4" />
            </button>

            {submitted ? (
              <div className="text-center py-6">
                <div className="text-4xl mb-4">✅</div>
                <h3 className="text-xl font-bold text-foreground mb-2">Mensagem enviada!</h3>
                <p className="text-muted-foreground text-sm">
                  Nossa equipe entrará em contato em breve.
                </p>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-bold text-foreground mb-1">Fale com a MoveAI</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Preencha seus dados e entraremos em contato.
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Nome</label>
                    <input
                      type="text"
                      required
                      value={form.nome}
                      onChange={(e) => setForm({ ...form, nome: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background/60 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="Seu nome"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">E-mail</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background/60 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="seu@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">WhatsApp</label>
                    <input
                      type="tel"
                      required
                      value={form.whatsapp}
                      onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background/60 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Descreva seu problema</label>
                    <textarea
                      value={form.problema}
                      onChange={(e) => setForm({ ...form, problema: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background/60 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                      placeholder="Ex: Preciso automatizar meu processo de vendas..."
                      rows={3}
                    />
                  </div>
                  {error && (
                    <p className="text-red-400 text-xs text-center">{error}</p>
                  )}
                  <button type="submit" disabled={loading} className="btn-gradient w-full py-3 text-sm mt-2 disabled:opacity-60">
                    {loading ? "Enviando..." : "Enviar mensagem"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </ContactModalContext.Provider>
  );
}
