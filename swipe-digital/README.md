# Swipe Digital: site portfólio

Next.js (App Router) + TypeScript + Tailwind CSS 4, com Motion, GSAP/ScrollTrigger e Lenis.
Pronto para publicar na Vercel.

## 1. Rodar no seu computador

Precisa do [Node.js](https://nodejs.org) 20 ou mais novo.

```bash
cd swipe-digital
npm install
npm run dev
```

Abra http://localhost:3000. Para testar a versão final (mais rápida): `npm run build` e depois `npm start`.

A abertura "swipe" só aparece na primeira visita. Para ver de novo, abra uma janela anônima
ou apague a chave `swipe-abertura` do localStorage.

## 2. Adicionar um projeto ao portfólio

1. Crie uma pasta com o nome do projeto, sem acento e com hífens: `public/projetos/salao-da-maria/`.
2. Coloque lá as imagens:
   - `capa.jpg`: a capa (de preferência 1600 × 1200 px, deitada).
   - `01.jpg`, `02.jpg`…: as imagens da galeria (prints do site, posts, frames).
   - `video.mp4` (opcional): vídeo curto, sem som, de preferência com menos de 5 MB.
3. Abra `src/content/projetos.ts` e copie um dos objetos da lista `projetos`. Troque os campos:
   - `slug`: o mesmo nome da pasta (vira o endereço `/trabalhos/salao-da-maria`).
   - `servicos`: um ou mais de `"Site"`, `"Posts"`, `"Vídeos"`, `"Tráfego pago"`.
   - `tipo`: `"cliente"` para cliente real, `"conceito"` para demonstração (mostra a etiqueta "Projeto conceito").
   - `destaque: true` para aparecer na página inicial (no máximo 6 aparecem).
   - `video` e `link` são opcionais: apague a linha se não tiver.
4. Salve. A página do projeto, o filtro, o carrossel do topo e o feed do celular se atualizam sozinhos.

Para tirar os 3 projetos de exemplo, apague os objetos deles em `projetos.ts` e as pastas
`public/projetos/conceito-*`.

## 3. O que ainda é exemplo e onde trocar

| O quê | Onde |
|---|---|
| WhatsApp (hoje `5555 5555`), e-mail, Instagram, TikTok, LinkedIn | `src/config/site.ts` |
| Cidade e região (pílula do topo, card "Base em", rodapé) | `src/config/site.ts` (`cidade` e `regiao`) |
| Domínio final (usado no SEO e Open Graph) | `src/config/site.ts` (`url`) |
| 3 projetos de exemplo (`[SUBSTITUIR]`) | `src/content/projetos.ts` e `public/projetos/` |
| Fotos dos sócios (hoje aparecem as iniciais) | coloque em `public/equipe/` e preencha `foto` em `src/content/textos.ts` |
| Frase do sócio no card "Quem faz" | `src/content/textos.ts` (`fraseSocio`) |
| Foto da equipe/bastidores do card grande | troque `public/bastidores.jpg` |
| Logos originais | `public/logo/` (já estão lá; o site desenha a logo em código) |
| Imagem de compartilhamento (Open Graph) e ícones | `src/app/opengraph-image.png`, `src/app/icon.png`, `src/app/apple-icon.png` |

Serviços, diferenciais, etapas e equipe ficam em `src/content/textos.ts`.

## 4. Ajustar as animações

Tudo fica em `src/config/motion.ts`. Cada linha liga/desliga uma animação (`true`/`false`)
ou muda a velocidade:

- `abertura`, `aberturaDuracaoMs`: abertura da primeira visita.
- `rolagemSuave`, `rolagemSuaveIntensidade`: rolagem suave (Lenis).
- `celularParallax`, `tracosNeon`, `contadores`: topo.
- `carrosselIntervaloMs`, `listaServicosIntervaloMs`: trocas automáticas.
- `letreiro`, `letreiroVelocidade`, `letreiroReageARolagem`: letreiro.
- `manifestoAcendendo`, `servicosEmpilhando`, `linhaDasEtapas`, `entradaDosCards`: rolagem.
- `cursorVer`, `botoesMagneticos`, `cardsInclinacao`, `cardsSpotlight`, `transicaoCapa`: interações.

As entradas do título do topo ficam em CSS, no fim de `src/app/globals.css` (`.entra`, `.linha-sobe`),
para aparecerem antes do JavaScript carregar. Quem usa "reduzir movimento" no aparelho recebe
o site sem abertura, parallax ou letreiro correndo.

## 5. Publicar na Vercel

1. Suba o repositório no GitHub (já está em `joaomiguel00/sitestestes-`).
2. Em https://vercel.com, clique em **Add New → Project** e importe o repositório.
3. Em **Root Directory**, escolha `swipe-digital` (o site fica nessa pasta).
4. Framework: Next.js (detectado sozinho). Não precisa de variáveis de ambiente.
5. Clique em **Deploy**. Cada novo push na branch principal publica de novo.
6. Para usar seu domínio: **Settings → Domains**, e atualize `url` em `src/config/site.ts`.

## Estrutura

```
src/
  app/            páginas (/, /trabalhos, /trabalhos/[slug]), layout, CSS global, ícones
  components/     seções e peças do site (hero/, galeria/, Header, Letreiro, Servicos…)
  config/         site.ts (contatos) e motion.ts (animações)
  content/        projetos.ts (portfólio) e textos.ts (serviços, etapas, equipe)
  fonts/          Unbounded e Space Grotesk (Google Fonts, hospedadas no projeto)
public/
  projetos/       imagens e vídeos de cada projeto
  logo/  equipe/  bastidores.jpg
referencia/       guarde aqui a imagem de referência (referencia.jpg)
```
