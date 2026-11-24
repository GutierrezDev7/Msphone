import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { AdminCatalogEditor } from '@/components/admin/admin-catalog-editor'
import { AdminLogin } from '@/components/admin/admin-login'
import {
  ADMIN_SESSION_COOKIE,
  getAdminSetupStatus,
  verifyAdminSession,
} from '@/lib/admin-auth'

export const metadata: Metadata = {
  title: 'Admin — MS PHONE',
  robots: { index: false, follow: false },
}

export default async function AdminPage() {
  const cookieStore = await cookies()
  const setup = getAdminSetupStatus()
  const isAuthenticated =
    setup.ready && verifyAdminSession(cookieStore.get(ADMIN_SESSION_COOKIE)?.value)

  return (
    <main className="mx-auto min-h-[calc(100svh-5rem)] max-w-7xl px-4 pb-20 pt-24 sm:px-5 md:px-8 md:pb-24 md:pt-40">
      <header className="mb-10 max-w-3xl">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
          MS PHONE · Área administrativa
        </p>
        <h1 className="font-display text-4xl leading-[0.95] text-balance sm:text-6xl">
          Gestão da <span className="text-primary">loja.</span>
        </h1>
      </header>

      {!setup.ready ? (
        <section
          aria-labelledby="admin-setup-title"
          className="max-w-2xl rounded-[1.75rem] border border-amber-400/20 bg-amber-400/5 p-6 sm:p-8"
        >
          <h2 id="admin-setup-title" className="font-display text-2xl">
            Falta configurar o acesso administrativo
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Conecte um armazenamento Vercel Blob ao projeto e configure as credenciais de acesso
            administrativo no painel da Vercel. Nenhum segredo deve ser salvo no repositório.
          </p>
          <ul className="mt-5 space-y-2 text-sm">
            {setup.missing.map((item) => (
              <li key={item} className="rounded-lg border border-border/70 bg-background/50 px-3 py-2">
                <code>{item}</code>
              </li>
            ))}
          </ul>
        </section>
      ) : isAuthenticated ? (
        <AdminCatalogEditor />
      ) : (
        <AdminLogin />
      )}
    </main>
  )
}
