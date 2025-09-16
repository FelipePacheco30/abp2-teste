import { Router } from "express";
const router = Router();
router.get("/variables", (_req,res) => {
  res.json({
    "Qualidade da Água": [
      { table: "tbvariaveisfisicasquimicasdaagua", column: "ph", label: "pH" },
      { table: "tbvariaveisfisicasquimicasdaagua", column: "turbidez", label: "Turbidez" },
      { table: "tbvariaveisfisicasquimicasdaagua", column: "oxigenio", label: "Oxigênio Dissolvido" },
      { table: "tbvariaveisfisicasquimicasdaagua", column: "clorofila", label: "Clorofila" }
    ],
    "Gases Dissolvidos": [
      { table: "tbconcentracaogasagua", column: "co2", label: "CO2" },
      { table: "tbconcentracaogasagua", column: "ch4", label: "CH4" }
    ],
    "Difusão": [
      { table: "tbdifusao", column: "valor", label: "Difusão" }
    ]
  });
});
export default router;
