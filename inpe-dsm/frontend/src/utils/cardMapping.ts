// frontend/src/utils/cardMapping.ts
export type CardDef = {
  id: string;         // chave curta (ex: "abioticos")
  title: string;      // rótulo exibido
  tables: string[];   // tabelas reais no banco
  description?: string;
  icon?: string;
};

const cards: CardDef[] = [
  { id: "abioticos", title: "Abióticos", tables: ["tbabioticocoluna", "tbabioticosuperficie"], description: "Medições abióticas (profundidade, dic, nt, ...)", icon: "🌡️" },
  { id: "bioticos", title: "Bióticos", tables: ["tbbioticocoluna", "tbbioticosuperficie"], description: "Dados bióticos (clorofila, biomassa...)", icon: "🦠" },
  { id: "parametros_fisicoquimicos", title: "Físico-Químicos", tables: ["tbvariaveisfisicasquimicasdaagua", "tbparametrosbiologicosfisicosagua", "tbhoriba", "tbpfq"], description: "pH, condutividade, turbidez, etc.", icon: "🧪" },
  { id: "gases_fluxos", title: "Gases & Fluxos", tables: ["tbconcentracaogasagua","tbconcentracaogassedimento","tbfluxobolhasinpe","tbfluxocarbono","tbfluxodifusivo","tbfluxodifusivoinpe","tbgasesembolhas","tbbolhas","tbdifusao","tbdupladessorcaoagua"], description: "Concentração e fluxos de gases", icon: "🫧" },
  { id: "campo_medidas", title: "Campo Medidas", tables: ["tbmedidacampocoluna","tbmedidacamposuperficie"], description: "Medidas de campo (secchi, temp, turbidez)", icon: "📏" },
  { id: "nutrientes", title: "Nutrientes & Sedimento", tables: ["tbnutrientessedimento","tbaguamateriaorganicasedimento","tbionsnaaguaintersticialdosedimento"], icon: "🟫" },
  { id: "metadados", title: "Reservatórios & Campanhas", tables: ["tbreservatorio","tbsitio","tbinstituicao","tbcampanha","tbtabela"], icon: "📍" },
  // adicione/ajuste conforme sua base
];

export default cards;
