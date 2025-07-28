export const BASE_PRICE = 4.0;
export const SECTOR_PRICE: { [key: string]: number } = {
  Imobiliário: 2.5,
  Seguros: 2.2,
  Banca: 2.0,
  "Medicina Estética": 2.0,
  Saúde: 2.0,
  Construção: 1.3,
  "Serviços de Construção (Serralharia, Canalização, Carpintaria)": 1.8,
  Automóvel: 1.1,
  "Consultoria Informática": 1.0,
  Telecomunicações: 1.2,
  Dentária: 1.4,
  Consultoria: 1.5,
  "Indústria (Eólicas, Metalúrgicas, Têxtil, Cerâmicas)": 1.5,
  Hotelaria: 1.1,
  "Decoração Interiores": 1.1,
  Cosméticos: 1.3,
  Formação: 1.2,
  Veterinário: 1.2,
  "Recreativas (Dança, Yoga, Ginásio)": 1.1,
  "ONGs e Associações": 1.0,
  Outro: 1.1,
};

export const TURNOVER_MULT: { [key: string]: number } = {
  "0": 1.0, // menos de 100K
  "100000": 1.0, // 100-500K
  "500000": 1.5, // 500-1M
  "1000000": 1.9, // 1-5M
  "5000000": 2.3, // 5-10M
  "10000000": 2.8, // mais de 10M
};

export const getVolumeDiscount = (leadCount: number) => {
  if (leadCount >= 500) return 0.15; // 15% desconto
  if (leadCount >= 200) return 0.1; // 10% desconto
  if (leadCount >= 100) return 0.05; // 5% desconto
  return 0;
};
