import { useState } from "react";

export function ContactSection() {
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
    <section id="contato" className="py-20 lg:py-28">
      <div className="section-container max-w-xl mx-auto text-center">
        <span className="inline-block text-xs font-semibold tracking-widest uppercase text-primary mb-4">
          Contato
        </span>
        <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-3">
          Entre em Contato
        </h2>
        <p className="text-muted-foreground mb-10">
          Solicite uma automação ou tire suas dúvidas com nossa equipe.
        </p>

        {submitted ? (
          <div className="rounded-xl border border-border bg-card p-8 text-center">
            <div className="text-2xl mb-3">✅</div>
            <p className="text-foreground font-medium">
              Recebemos suas informações. Em breve entraremos em contato.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 text-left">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Nome
              </label>
              <input
                type="text"
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                className="w-full rounded-lg border border-border bg-input px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Seu nome"
              />
              {errors.nome && (
                <p className="text-destructive text-xs mt-1">{errors.nome}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Telefone
              </label>
              <input
                type="tel"
                value={form.telefone}
                onChange={(e) => setForm({ ...form, telefone: e.target.value })}
                className="w-full rounded-lg border border-border bg-input px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="(00) 00000-0000"
              />
              {errors.telefone && (
                <p className="text-destructive text-xs mt-1">{errors.telefone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-lg border border-border bg-input px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="seu@email.com"
              />
              {errors.email && (
                <p className="text-destructive text-xs mt-1">{errors.email}</p>
              )}
            </div>

            <button type="submit" className="btn-gradient w-full text-sm py-3">
              Solicitar Contato
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
