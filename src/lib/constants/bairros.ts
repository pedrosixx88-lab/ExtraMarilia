export interface Bairro {
  id?: string;
  name: string;
  slug: string;
  active: boolean;
}

export const BAIRROS: Bairro[] = [
  { name: "Centro", slug: "centro", active: true },
  { name: "Jardim América", slug: "jardim-america", active: true },
  { name: "Jardim Itaipu", slug: "jardim-itaipu", active: true },
  { name: "Jardim Europa", slug: "jardim-europa", active: true },
  { name: "Palmital", slug: "palmital", active: true },
  { name: "Bom Pastor", slug: "bom-pastor", active: true },
  { name: "Jardim Califórnia", slug: "jardim-california", active: true },
  { name: "Jardim Alvorada", slug: "jardim-alvorada", active: true },
  { name: "Parque São Domingos", slug: "parque-sao-domingos", active: true },
  { name: "Vila Mendonça", slug: "vila-mendonca", active: true },
  { name: "Jardim Cruzeiro do Sul", slug: "jardim-cruzeiro-do-sul", active: true },
  { name: "Vila Nova", slug: "vila-nova", active: true },
  { name: "Jardim Universitário", slug: "jardim-universitario", active: true },
  { name: "Higienópolis", slug: "higienopolis", active: true },
  { name: "Santa Cruz", slug: "santa-cruz", active: true },
  { name: "Parque Yolanda", slug: "parque-yolanda", active: true },
  { name: "Jardim Marabá", slug: "jardim-maraba", active: true },
  { name: "Conjunto Habitacional", slug: "conjunto-habitacional", active: true },
  { name: "Jardim Tropical", slug: "jardim-tropical", active: true },
  { name: "Cecap", slug: "cecap", active: true },
  { name: "Outro bairro", slug: "outro", active: true },
];
