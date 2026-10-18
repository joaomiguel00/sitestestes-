// Dados de contato e da agência. Troque tudo que estiver marcado com [SUBSTITUIR].

export const site = {
  nome: "Swipe Digital",
  url: "https://swipedigital.com.br", // [SUBSTITUIR] domínio final
  descricao:
    "Agência de marketing digital: site, posts, vídeos com IA e anúncios para pequenos negócios. Veja o que a gente já criou.",

  cidade: "[SUBSTITUIR] Sua cidade",
  regiao: "[SUBSTITUIR] Sua cidade (UF) e atendimento online para todo o Brasil",

  contato: {
    // Formato do link: 55 + DDD + número, só dígitos.
    whatsapp: "55555555", // [SUBSTITUIR] ex.: 5598999999999
    whatsappExibicao: "5555 5555",
    whatsappMensagem: "Oi, Swipe! Vi o portfólio de vocês e quero conversar.",
    email: "contato@exemplo.com", // [SUBSTITUIR]
  },

  redes: {
    instagram: { usuario: "@swipedigital", url: "https://instagram.com/swipedigital" }, // [SUBSTITUIR]
    tiktok: { usuario: "@swipedigital", url: "https://tiktok.com/@swipedigital" }, // [SUBSTITUIR] ou deixe url vazia para esconder
    linkedin: { usuario: "", url: "" }, // vazio = não aparece
  },
} as const;

export function linkWhatsapp() {
  return `https://wa.me/${site.contato.whatsapp}?text=${encodeURIComponent(site.contato.whatsappMensagem)}`;
}
