// Todos os projetos do portfólio ficam aqui.
// Para adicionar um projeto: coloque as imagens em public/projetos/<slug>/ e
// copie um dos objetos abaixo, trocando os campos.

export type Servico = "Site" | "Posts" | "Vídeos" | "Tráfego pago";

export type Projeto = {
  slug: string;
  titulo: string;
  segmento: string;
  servicos: Servico[];
  tipo: "cliente" | "conceito"; // conceito = demonstração feita pela agência, não é cliente real
  destaque: boolean; // aparece na página inicial (até 6)
  capa: string;
  desafio: string;
  solucao: string;
  galeria: string[];
  video?: string;
  link?: string;
};

export const projetos: Projeto[] = [
  {
    slug: "conceito-site-salao",
    titulo: "[SUBSTITUIR] Site para salão de beleza",
    segmento: "Salão de beleza",
    servicos: ["Site"],
    tipo: "conceito",
    destaque: true,
    capa: "/projetos/conceito-site-salao/capa.jpg",
    desafio: "[SUBSTITUIR] O que o negócio precisava, em uma ou duas frases.",
    solucao: "[SUBSTITUIR] Resumo do que a Swipe fez e como resolveu.",
    galeria: [
      "/projetos/conceito-site-salao/01.jpg",
      "/projetos/conceito-site-salao/02.jpg",
      "/projetos/conceito-site-salao/03.jpg",
    ],
    link: "https://exemplo.com", // [SUBSTITUIR] ou apague a linha
  },
  {
    slug: "conceito-posts-clinica",
    titulo: "[SUBSTITUIR] Posts para clínica",
    segmento: "Clínica de saúde",
    servicos: ["Posts"],
    tipo: "conceito",
    destaque: true,
    capa: "/projetos/conceito-posts-clinica/capa.jpg",
    desafio: "[SUBSTITUIR] O que o negócio precisava, em uma ou duas frases.",
    solucao: "[SUBSTITUIR] Resumo do que a Swipe fez e como resolveu.",
    galeria: [
      "/projetos/conceito-posts-clinica/01.jpg",
      "/projetos/conceito-posts-clinica/02.jpg",
      "/projetos/conceito-posts-clinica/03.jpg",
      "/projetos/conceito-posts-clinica/04.jpg",
    ],
  },
  {
    slug: "conceito-video-estetica",
    titulo: "[SUBSTITUIR] Reels para estética",
    segmento: "Estética",
    servicos: ["Vídeos"],
    tipo: "conceito",
    destaque: true,
    capa: "/projetos/conceito-video-estetica/capa.jpg",
    desafio: "[SUBSTITUIR] O que o negócio precisava, em uma ou duas frases.",
    solucao: "[SUBSTITUIR] Resumo do que a Swipe fez e como resolveu.",
    galeria: ["/projetos/conceito-video-estetica/01.jpg", "/projetos/conceito-video-estetica/02.jpg"],
    video: "/projetos/conceito-video-estetica/video.mp4",
  },
];

export const filtros: { rotulo: string; valor: string; servico: Servico | null }[] = [
  { rotulo: "Todos", valor: "todos", servico: null },
  { rotulo: "Sites", valor: "sites", servico: "Site" },
  { rotulo: "Posts", valor: "posts", servico: "Posts" },
  { rotulo: "Vídeos", valor: "videos", servico: "Vídeos" },
  { rotulo: "Tráfego pago", valor: "trafego-pago", servico: "Tráfego pago" },
];

export function filtroDoServico(servico: Servico) {
  return filtros.find((f) => f.servico === servico)!.valor;
}

export const projetosEmDestaque = projetos.filter((p) => p.destaque).slice(0, 6);

export function isVideo(src: string) {
  return /\.(mp4|webm)$/i.test(src);
}
