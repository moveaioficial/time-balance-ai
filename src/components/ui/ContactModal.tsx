import { createContext, lazy, Suspense, useContext, useEffect, useState } from "react";
import { X } from "lucide-react";
import { getSupabase } from "@/lib/supabase";
import { PRAZO_RESPOSTA } from "@/lib/contato";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

// Agendador carregado só depois do envio do formulário
const Scheduler = lazy(() => import("@/components/scheduling/Scheduler").then((m) => ({ default: m.Scheduler })));

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
  // Campo invisível para humanos: se vier preenchido, é bot (anti-spam)
  const [honeypot, setHoneypot] = useState("");
  // Consentimento LGPD: o envio só acontece com a caixa marcada
  const [aceite, setAceite] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; whatsapp?: string }>({});

  const openModal = () => {
    setForm({ nome: "", empresa: "", email: "", whatsapp: "", problema: "" });
    setSubmitted(false);
    setError(null);
    setFieldErrors({});
    setHoneypot("");
    setAceite(false);
    setIsOpen(true);
  };

  const closeModal = () => setIsOpen(false);

  // Fecha com a tecla Esc
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

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

    if (!aceite) {
      setError("Para enviar, marque que leu e concorda com a Política de Privacidade.");
      return;
    }

    // Bot preencheu o campo oculto: finge sucesso e não grava nada
    if (honeypot) {
      setSubmitted(true);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error } = await (await getSupabase()).from("formulario").insert({
        nome: form.nome.trim(),
        empresa: form.empresa.trim() || null,
        email: form.email.trim().toLowerCase(),
        whatsapp: form.whatsapp,
        descricao: form.problema.trim(),
      });
      if (error) throw error;
      setSubmitted(true);
      // Conta como conversão: o Vercel Analytics registra uma visita em /obrigado, sem sair da página
      (window as unknown as { va?: (e: string, p: object) => void }).va?.("pageview", { route: "/obrigado", path: "/obrigado" });
    } catch {
      setError("Erro ao enviar. Tente novamente ou fale conosco pelo WhatsApp.");
    } finally {
      setLoading(false);
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
          <div role="dialog" aria-modal="true" aria-label="Fale com a Move AI" className={`relative z-10 w-full ${submitted ? "max-w-xl" : "max-w-md"} max-h-[92vh] overflow-y-auto rounded-2xl bg-card border border-white/10 p-8 shadow-2xl animate-fade-in-up`}>
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors"
              aria-label="Fechar"
            >
              <X className="h-4 w-4" />
            </button>

            {submitted ? (
              <Suspense fallback={<div className="py-16 text-center text-sm text-muted-foreground">Carregando agenda…</div>}>
              <Scheduler
                  lead={{
                    nome: form.nome.trim(),
                    empresa: form.empresa.trim() || undefined,
                    email: form.email.trim().toLowerCase(),
                    whatsapp: form.whatsapp,
                    descricao: form.problema.trim() || undefined,
                  }}
                  onClose={closeModal}
                />
              </Suspense>
            ) : (
              <>
                <h3 className="text-2xl font-bold text-foreground mb-1">Peça sua análise gratuita</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Conte rapidinho sobre a sua empresa. Depois você já escolhe um horário para conversar com a gente. A gente {PRAZO_RESPOSTA}.
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    className="absolute -left-[9999px] h-0 w-0 opacity-0"
                  />
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Nome</label>
                    <input
                      type="text"
                      required
                      value={form.nome}
                      onChange={(e) => setForm({ ...form, nome: e.target.value })}
                      maxLength={120}
                      autoComplete="name"
                      className="w-full rounded-lg border border-border bg-background/60 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="Seu nome"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Empresa <span className="font-normal text-muted-foreground">(opcional)</span></label>
                    <input
                      type="text"
                      value={form.empresa}
                      onChange={(e) => setForm({ ...form, empresa: e.target.value })}
                      maxLength={160}
                      autoComplete="organization"
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
                      maxLength={254}
                      autoComplete="email"
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
                    <label className="flex items-center gap-1.5 text-sm font-medium text-foreground mb-1.5"><WhatsAppIcon className="h-4 w-4 text-[#25D366]" /> WhatsApp</label>
                    <input
                      type="tel"
                      required
                      value={form.whatsapp}
                      onChange={handleWhatsAppChange}
                      autoComplete="tel"
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
                    <label className="block text-sm font-medium text-foreground mb-1.5">O que você precisa?</label>
                    <textarea
                      required
                      minLength={3}
                      value={form.problema}
                      onChange={(e) => setForm({ ...form, problema: e.target.value })}
                      maxLength={2000}
                      className="w-full rounded-lg border border-border bg-background/60 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                      placeholder="Ex.: quero um site novo, minha marca precisa de cara nova, meu Instagram não passa confiança..."
                      rows={3}
                    />
                  </div>
                  <label className="flex items-start gap-3 text-xs leading-relaxed text-muted-foreground">
                    <input
                      type="checkbox"
                      checked={aceite}
                      onChange={(e) => { setAceite(e.target.checked); if (e.target.checked) setError(null); }}
                      className="mt-0.5 h-4 w-4 flex-none accent-[#00C3D0]"
                      required
                    />
                    <span>
                      Li e concordo com a{" "}
                      <a href="/politica-de-privacidade" target="_blank" rel="noopener noreferrer" className="text-primary underline">Política de Privacidade</a>.
                      Usamos os seus dados só para responder ao seu pedido e preparar a sua proposta.
                    </span>
                  </label>
                  {error && (
                    <p className="text-red-400 text-xs text-center" role="alert">{error}</p>
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
