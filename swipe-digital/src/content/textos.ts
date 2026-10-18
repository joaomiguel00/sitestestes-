import type { Servico } from "./projetos";

export const servicos: {
  numero: string;
  titulo: string;
  frase: string;
  etiquetas: string[];
  filtro: Servico;
}[] = [
  {
    numero: "01",
    titulo: "Criação de sites",
    frase: "Sites rápidos e bonitos, feitos para o seu cliente encontrar e entender o seu negócio.",
    etiquetas: ["Site institucional", "Landing page", "Celular primeiro"],
    filtro: "Site",
  },
  {
    numero: "02",
    titulo: "Posts para Instagram e redes sociais",
    frase: "Conteúdo com identidade visual padronizada e calendário fixo de postagens.",
    etiquetas: ["Feed", "Carrossel", "Stories"],
    filtro: "Posts",
  },
  {
    numero: "03",
    titulo: "Vídeos editados e com IA",
    frase: "Vídeos curtos para Reels e anúncios, que fazem a pessoa parar o scroll.",
    etiquetas: ["Reels", "Edição", "Vídeo com IA"],
    filtro: "Vídeos",
  },
  {
    numero: "04",
    titulo: "Tráfego pago",
    frase: "Anúncios no Instagram, Facebook e Google, com relatório mensal simples.",
    etiquetas: ["Meta Ads", "Google Ads", "Relatório mensal"],
    filtro: "Tráfego pago",
  },
];

export const diferenciais = [
  { titulo: "Tudo em um só lugar", texto: "Site, posts, vídeos e anúncios com um único time." },
  { titulo: "Demonstração antes de fechar", texto: "Mostramos uma prévia feita para o seu negócio." },
  { titulo: "Atendimento próximo e simples", texto: "Um responsável por cliente, sem jargão." },
  { titulo: "Velocidade com IA", texto: "Usamos inteligência artificial para entregar mais rápido, sem perder qualidade." },
];

export const etapas = [
  { titulo: "Conversa inicial", texto: "Entendemos o seu negócio." },
  { titulo: "Proposta", texto: "Plano e prazo de entrega." },
  { titulo: "Produção", texto: "Site, posts, vídeos e anúncios." },
  { titulo: "Aprovação", texto: "Você aprova antes de qualquer publicação." },
  { titulo: "Acompanhamento", texto: "Relatório mensal simples." },
];

// foto: coloque a imagem em public/equipe/ e informe o caminho, ex.: "/equipe/isaac.jpg".
// Enquanto estiver vazio, aparecem as iniciais.
export const equipe = [
  { nome: "Isaac", funcao: "Edição de vídeo e vídeos com IA", foto: "" },
  { nome: "João", funcao: "Tráfego pago (anúncios)", foto: "" },
  { nome: "Ricardo", funcao: "Criação de sites", foto: "" },
];

// Card "Quem faz" do bento grid: frase de um sócio sobre o jeito de trabalhar.
export const fraseSocio = {
  nome: "Ricardo",
  frase: "[FRASE DO SÓCIO] Escreva aqui, em uma ou duas linhas, como a Swipe trabalha.",
};

export const publicos = ["Salões de beleza", "Estética", "Clínicas", "Saúde"];
