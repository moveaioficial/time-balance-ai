import type { SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

let client: SupabaseClient | null = null;

/**
 * Cliente criado sob demanda:
 * - a biblioteca do Supabase só é baixada quando alguém envia o formulário
 *   (não pesa no carregamento inicial do site);
 * - se as variáveis de ambiente faltarem, só o envio falha (com mensagem),
 *   e não o site inteiro;
 * - o site não usa login, então nenhuma sessão é salva no navegador.
 */
export async function getSupabase(): Promise<SupabaseClient> {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY não configuradas");
  }
  if (!client) {
    const { createClient } = await import("@supabase/supabase-js");
    client = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    });
  }
  return client;
}
