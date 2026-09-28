import { AdminNav } from "@/components/admin-nav";
import { requireAdmin } from "@/lib/admin";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await requireAdmin();

  return (
    <div className="admin-shell">
      <AdminNav demo={admin.demo} />
      <main className="admin-main">
        {admin.demo ? (
          <div className="admin-demo-banner">
            Supabase não conectado: o painel está em modo visual. Cadastros e
            alterações reais ficam habilitados após a configuração do banco.
          </div>
        ) : null}
        {children}
      </main>
    </div>
  );
}
