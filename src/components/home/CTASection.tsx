import { useState } from "react";
import { Calendar } from "lucide-react";

export function CTASection() {
  const [form, setForm] = useState({ nome: "", telefone: "", email: "" });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.nome.trim()) errs.nome = "Nome é obrigatório";
    if (!form.telefone.trim()) errs.telefone = "Telefone é obrigatório";
    if (!form.email.trim()) errs.email = "Email é obrigatório";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "Email inválido";
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setSubmitted(true);
  };

  return (
    <section id="contato" className="py-20 lg:py-32 relative overflow-hidden">
      {/* BG glows */}
      <div className="absolute top-0 left-1/4 w-72 h-72 rounded-full blur-3xl pointer-events-none opacity-15"
        style={{ background: "radial-gradient(circle, #7C3AED, transparent)" }} />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-10"
        style={{ background: "radial-gradient(circle, #3B82F6, transparent)" }} />

      <div className="section-container relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-3xl p-10 lg:p-16 text-center reveal"
            style={{
              background: "linear-gradient(135deg, rgba(124,58,237,0.12) 0%, rgba(59,130,246,0.08) 100%)",
              border: "1px solid rgba(124,58,237,0.25)",
            }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/25 bg-primary/10 mb-8">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="text-sm text-primary font-medium">Demonstração gratuita • Sem compromisso</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Pronto para recuperar seu{" "}
              <span className="text-gradient">tempo</span>?
            </h2>

            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
              Descubra como a MoveAI pode transformar seus processos em dias, não meses.
              Resposta em até 24 horas — <strong className="text-foreground">sem cartão de crédito.</strong>
            </p>

            {submitted ? (
              <div className="rounded-xl border border-border bg-card/60 p-8 text-center max-w-md mx-auto">
                <div className="text-2xl mb-3">✅</div>
                <p className="text-foreground font-medium">
                  Recebemos suas informações. Nossa equipe entrará em contato em breve.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4 text-left">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Nome</label>
                  <input
                    type="text"
                    value={form.nome}
                    onChange={(e) => setForm({ ...form, nome: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background/60 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Seu nome"
                  />
                  {errors.nome && <p className="text-destructive text-xs mt-1">{errors.nome}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Telefone</label>
                  <input
                    type="tel"
                    value={form.telefone}
                    onChange={(e) => setForm({ ...form, telefone: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background/60 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="(00) 00000-0000"
                  />
                  {errors.telefone && <p className="text-destructive text-xs mt-1">{errors.telefone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background/60 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="seu@email.com"
                  />
                  {errors.email && <p className="text-destructive text-xs mt-1">{errors.email}</p>}
                </div>

                <button type="submit" className="btn-gradient w-full text-sm py-3 mt-2">
                  Solicitar Contato
                </button>
              </form>
            )}

            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                Resposta em até 24h
              </span>
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                Zero burocracia
              </span>
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                Sem multas de rescisão
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
