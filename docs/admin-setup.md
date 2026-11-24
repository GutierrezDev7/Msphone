# Configuração do painel administrativo

O painel fica em `/admin`, não aparece na navegação pública e usa autenticação de servidor. A rota não é indexada, mas isso não substitui a autenticação: a página e as APIs verificam uma sessão assinada antes de permitir alterações.

## Armazenamento Vercel Blob

Não é necessário banco SQL. O catálogo é um arquivo JSON pequeno, sem imagens, salvo em um armazenamento Vercel Blob privado.

1. Na Vercel, abra o projeto e vá em **Storage → Create Storage → Blob**.
2. Selecione acesso **Private** e conecte o armazenamento ao projeto nos ambientes desejados.
3. Prefira a conexão OIDC recomendada pela Vercel. Se não usar OIDC, habilite a variável `BLOB_READ_WRITE_TOKEN` ao conectar o armazenamento.
4. Faça um novo deploy para disponibilizar a conexão no runtime.

A aplicação usa `BLOB_STORE_ID` e o token OIDC gerenciado pela Vercel quando disponíveis, ou `BLOB_READ_WRITE_TOKEN`. Na primeira visita, a vitrine usa o catálogo inicial. Ao salvar pelo painel, o catálogo passa a ser persistido em `store/catalog.json` no Blob. O acesso é feito no servidor; o token nunca vai para o navegador.

## Secrets do administrador

Configure estas variáveis na área de Environment Variables da Vercel. Não as coloque no código, no Git ou em `NEXT_PUBLIC_*`.

| Variável | Valor |
| --- | --- |
| `ADMIN_USERNAME` | `melo123` |
| `ADMIN_PASSWORD` | Uma senha nova, aleatória e com pelo menos 16 caracteres. |
| `ADMIN_SESSION_SECRET` | Um segredo aleatório com pelo menos 32 caracteres. |
| Acesso ao Blob | `BLOB_READ_WRITE_TOKEN` ou conexão OIDC configurada pela Vercel. |

Para gerar o segredo de sessão localmente, use Node.js:

```powershell
node -e "console.log(require('node:crypto').randomBytes(48).toString('base64url'))"
```

Defina os secrets nos ambientes necessários e faça um novo deploy. Depois, acesse `https://seu-dominio/admin`. A sessão usa cookie `HttpOnly`, `SameSite=Strict` e, em produção, `Secure`. Sem banco de dados, o limite de tentativas de login é mantido em memória por instância da aplicação e pode reiniciar quando a instância reiniciar.

## Gerenciar o catálogo

- Crie, edite, oculte ou remova categorias.
- Nas categorias com configurador, adicione ou remova produtos/modelos e opções, e atualize preço e quantidade. Campos vazios significam “consultar”.
- Configure a troca nas categorias com configurador e a mensagem inicial do WhatsApp em cada categoria.
- Nas categorias de atendimento direto, edite a mensagem usada para iniciar a conversa.
- Salve as alterações para publicá-las na vitrine. Opções com estoque zero ficam indisponíveis para consulta pelo configurador.

O configurador é usado por **iPhone**, **Xiaomi & POCO**, **Apple Watch**, **MacBook**, **Eletrônicos & acessórios** e **Troque seu usado**. **Assistência técnica** e novas categorias abrem o WhatsApp diretamente, sem triagem; adicionar produtos a elas não muda esse comportamento.

O catálogo inicial inclui os modelos de iPhone conhecidos e opções de consulta para as demais categorias configuráveis. Os dados iniciais não representam garantia de estoque: disponibilidade e valores só serão exibidos quando forem preenchidos no painel.
