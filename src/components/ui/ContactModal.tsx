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

// Formata o número enquanto o usuário digita: (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
function formatWhatsApp(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits.length ? `(${digits}` : "";
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function validateWhatsApp(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  return digits.length === 10 || digits.length === 11;
}

function validateEmail(value: string): boolean {
  // Validação mais estrita: deve ter domínio com extensão real
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

export function ContactModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ nome: "", empresa: "", email: "", whatsapp: "", problema: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; whatsapp?: string }>({});

  const openModal = () => {
    setForm({ nome: "", empresa: "", email: "", whatsapp: "", problema: "" });
    setSubmitted(false);
    setError(null);
    setFieldErrors({});
    setIsOpen(true);
  };

  const closeModal = () => setIsOpen(false);

  const handleWhatsAppChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatWhatsApp(e.target.value);
    setForm({ ...form, whatsapp: formatted });
    if (fieldErrors.whatsapp) {
      setFieldErrors((prev) => ({ ...prev, whatsapp: undefined }));
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, email: e.target.value });
    if (fieldErrors.email) {
      setFieldErrors((prev) => ({ ...prev, email: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors: { email?: string; whatsapp?: string } = {};

    if (!validateEmail(form.email)) {
      errors.email = "Informe um e-mail válido (ex: nome@dominio.com)";
    }
    if (!validateWhatsApp(form.whatsapp)) {
      errors.whatsapp = "Número inválido. Use DDD + número (10 ou 11 dígitos)";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    setError(null);

    const { error } = await supabase.from("formulario").insert({
      nome: form.nome,
      empresa: form.empresa,
      email: form.email,
      whatsapp: form.whatsapp,
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
                <h3 className="text-2xl font-bold text-foreground mb-1">Fale com a Move AI</h3>
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
                    <label className="block text-sm font-medium text-foreground mb-1.5">Empresa</label>
                    <input
                      type="text"
                      required
                      value={form.empresa}
                      onChange={(e) => setForm({ ...form, empresa: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background/60 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="Nome da sua empresa"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">E-mail</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={handleEmailChange}
                      className={`w-full rounded-lg border bg-background/60 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring ${
                        fieldErrors.email ? "border-red-400/60" : "border-border"
                      }`}
                      placeholder="seu@email.com"
                    />
                    {fieldErrors.email && (
                      <p className="text-red-400 text-xs mt-1">{fieldErrors.email}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">WhatsApp</label>
                    <input
                      type="tel"
                      required
                      value={form.whatsapp}
                      onChange={handleWhatsAppChange}
                      className={`w-full rounded-lg border bg-background/60 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring ${
                        fieldErrors.whatsapp ? "border-red-400/60" : "border-border"
                      }`}
                      placeholder="(11) 99999-9999"
                    />
                    {fieldErrors.whatsapp && (
                      <p className="text-red-400 text-xs mt-1">{fieldErrors.whatsapp}</p>
                    )}
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
