'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { LockKeyhole, ShieldCheck } from 'lucide-react'

export function AdminLogin() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      const result: unknown = await response.json()

      if (!response.ok) {
        const message =
          typeof result === 'object' &&
          result !== null &&
          'error' in result &&
          typeof result.error === 'string'
            ? result.error
            : 'Não foi possível iniciar a sessão.'
        throw new Error(message)
      }

      setPassword('')
      router.refresh()
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Falha ao conectar. Confira sua conexão e tente novamente.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-[1.75rem] border border-border bg-card/80 p-6 shadow-2xl shadow-black/20 sm:p-8">
      <div className="mb-8 flex size-12 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
        <LockKeyhole className="size-5" aria-hidden="true" />
      </div>
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
        Acesso restrito
      </p>
      <h2 className="font-display text-3xl">Entrar no painel</h2>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        Use as credenciais administrativas configuradas nos secrets do ambiente.
      </p>

      <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="admin-username" className="mb-2 block text-sm font-medium">
            Usuário
          </label>
          <input
            id="admin-username"
            autoComplete="username"
            required
            maxLength={120}
            value={username}
            onChange={(event) => setUsername(event.currentTarget.value)}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div>
          <label htmlFor="admin-password" className="mb-2 block text-sm font-medium">
            Senha
          </label>
          <input
            id="admin-password"
            type="password"
            autoComplete="current-password"
            required
            maxLength={256}
            value={password}
            onChange={(event) => setPassword(event.currentTarget.value)}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {error && (
          <p role="alert" className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-foreground">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-wait disabled:opacity-60"
        >
          <ShieldCheck className="size-4" aria-hidden="true" />
          {isSubmitting ? 'Verificando…' : 'Acessar painel'}
        </button>
      </form>
    </div>
  )
}
