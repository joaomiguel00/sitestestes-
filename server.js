// Servidor estático sem dependências para o deploy (Railway):
// - "/"       -> o jogo War of Chess (build em chess-game/dist)
// - "/site/"  -> o site institucional da raiz do repositório
// Só serve arquivos dessas pastas; nada fora delas (como .git) fica exposto.
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const PORT = Number(process.env.PORT) || 3000;
const GAME_DIR = path.join(__dirname, 'chess-game', 'dist');
const SITE_DIR = __dirname;
// Do site institucional, só estes itens da raiz podem ser servidos.
const SITE_ALLOWED = new Set([
  'index.html',
  'sobre.html',
  'contato.html',
  'areas-de-atuacao.html',
  'css',
  'js',
  'img',
]);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.ogg': 'audio/ogg',
  '.glb': 'model/gltf-binary',
  '.woff2': 'font/woff2',
};

// Resolve o caminho pedido dentro de `base`, recusando qualquer fuga (../).
function resolveInside(base, relative) {
  const target = path.normalize(path.join(base, relative));
  if (target !== base && !target.startsWith(base + path.sep)) return null;
  return target;
}

function locate(urlPath) {
  let rel;
  try {
    rel = decodeURIComponent(urlPath);
  } catch {
    return null;
  }
  if (rel.includes('\0')) return null;

  if (rel === '/site') return { redirect: '/site/' };
  if (rel.startsWith('/site/')) {
    const inner = rel.slice('/site/'.length) || 'index.html';
    if (!SITE_ALLOWED.has(inner.split('/')[0])) return null;
    return { file: resolveInside(SITE_DIR, inner) };
  }
  const inner = rel === '/' ? 'index.html' : rel.slice(1);
  return { file: resolveInside(GAME_DIR, inner) };
}

const server = http.createServer((req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { Allow: 'GET, HEAD' }).end();
    return;
  }
  const { pathname } = new URL(req.url, 'http://localhost');
  const found = locate(pathname);

  if (found?.redirect) {
    res.writeHead(301, { Location: found.redirect }).end();
    return;
  }
  if (!found?.file) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Não encontrado');
    return;
  }

  let file = found.file;
  fs.stat(file, (err, stats) => {
    if (!err && stats.isDirectory()) {
      file = path.join(file, 'index.html');
      stats = fs.existsSync(file) ? fs.statSync(file) : null;
    }
    if (err || !stats || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Não encontrado');
      return;
    }
    res.writeHead(200, {
      'Content-Type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream',
      'Content-Length': stats.size,
      // Os nomes dos arquivos do build são fixos: revalidar evita versão velha.
      'Cache-Control': 'no-cache',
      'Last-Modified': stats.mtime.toUTCString(),
      'X-Content-Type-Options': 'nosniff',
    });
    if (req.method === 'HEAD') {
      res.end();
      return;
    }
    fs.createReadStream(file).pipe(res);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`War of Chess no ar na porta ${PORT}`);
});
