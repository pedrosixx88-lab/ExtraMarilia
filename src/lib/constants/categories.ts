export interface Category {
  id?: string;
  name: string;
  slug: string;
  icon: string;
  sort_order: number;
}

export const CATEGORIES: Category[] = [
  { name: "Diarista / Limpeza", slug: "diarista", icon: "sparkles", sort_order: 1 },
  { name: "Elétrica", slug: "eletrica", icon: "zap", sort_order: 2 },
  { name: "Encanamento", slug: "encanamento", icon: "droplets", sort_order: 3 },
  { name: "Pedreiro / Construção", slug: "pedreiro", icon: "hard-hat", sort_order: 4 },
  { name: "Pintura", slug: "pintura", icon: "paint-roller", sort_order: 5 },
  { name: "Jardinagem", slug: "jardinagem", icon: "leaf", sort_order: 6 },
  { name: "Mudança / Frete", slug: "mudanca", icon: "truck", sort_order: 7 },
  { name: "Marcenaria / Móveis", slug: "marcenaria", icon: "hammer", sort_order: 8 },
  { name: "Ar-condicionado", slug: "ar-condicionado", icon: "wind", sort_order: 9 },
  { name: "Informática / TI", slug: "informatica", icon: "monitor", sort_order: 10 },
  { name: "Design / Criação", slug: "design", icon: "palette", sort_order: 11 },
  { name: "Fotografia", slug: "fotografia", icon: "camera", sort_order: 12 },
  { name: "Aulas / Tutoria", slug: "aulas", icon: "book-open", sort_order: 13 },
  { name: "Cuidador / Saúde", slug: "cuidador", icon: "heart", sort_order: 14 },
  { name: "Segurança / Câmeras", slug: "seguranca", icon: "shield", sort_order: 15 },
  { name: "Outros", slug: "outros", icon: "more-horizontal", sort_order: 16 },
];
