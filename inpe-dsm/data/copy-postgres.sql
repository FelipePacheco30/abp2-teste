COPY tbinstituicao (idinstituicao, nome)
FROM '/data/csv/tbinstituicao.csv'
DELIMITER ';'
NULL '\N'
CSV HEADER
QUOTE '"';

COPY tbreservatorio (idreservatorio, nome, lat, lng)
FROM '/data/csv/tbreservatorio.csv'
DELIMITER ';'
NULL '\N'
CSV HEADER
QUOTE '"';

COPY tbcampanha (idCampanha, idReservatorio, idInstituicao, nroDaCampanha, dataInicio, dataFim)
FROM '/data/csv/tbcampanha.csv'
DELIMITER ';'
NULL '\N'
CSV HEADER
QUOTE '"';

COPY tbtabela (idTabela, idInstituicao, nome, rotulo, excecao, sitio, campanha)
FROM '/data/csv/tbtabela.csv'
DELIMITER ';'
NULL '\N'
CSV HEADER
QUOTE '"';

COPY tbsitio (idSitio, idReservatorio, nome, lat, lng, descricao)
FROM '/data/csv/tbsitio.csv'
DELIMITER ';'
NULL '\N'
CSV HEADER
QUOTE '"';

COPY tbcampanhaportabela (idCampanha, idTabela)
FROM '/data/csv/tbcampanhaportabela.csv'
DELIMITER ';'
NULL '\N'
CSV HEADER
QUOTE '"';

COPY  tbabioticocoluna (idAbioticoColuna, idCampanha, idSitio, dataMedida, horaMedida, profundidade, dic, nt, pt, delta13c, delta15n)
FROM '/data/csv/tbabioticocoluna.csv'
DELIMITER ';'
NULL '\N'
CSV HEADER
QUOTE '"';

COPY tbabioticosuperficie (idAbioticoSuperficie, idCampanha, idSitio, dataMedida, horaMedida, dic, nt, pt, delta13c, delta15n)
FROM '/data/csv/tbabioticosuperficie.csv'
DELIMITER ';'
NULL '\N'
CSV HEADER
QUOTE '"';

COPY tbaguamateriaorganicasedimento (idAguaMateriaOrganicaSedimento, idCampanha, idSitio, dataMedida, horaMedida,
       profundidade, batimetria, agua, materiaOrganica)
FROM '/data/csv/tbaguamateriaorganicasedimento.csv'
DELIMITER ';'
NULL '\N'
CSV HEADER
QUOTE '"';

COPY tbbioticocoluna (idBioticoColuna, idCampanha, idSitio, dataMedida, horaMedida, profundidade,
       doc, toc, poc, densidadeBacteria, biomassaBacteria, clorofilaA,
       biomassaCarbonoTotalFito, densidadeTotalFito, biomassaZoo, densidadeTotalZoo)
FROM '/data/csv/tbbioticocoluna.csv'
DELIMITER ';'
NULL '\N'
CSV HEADER
QUOTE '"';


COPY tbbioticosuperficie (idBioticoSuperficie, idCampanha, idSitio, dataMedida, horaMedida,
       doc, toc, poc, densidadeBacteria, biomassaBacteria, clorofilaA,
       biomassaCarbonoTotalFito, densidadeTotalFito, biomassaZoo, densidadeTotalZoo)
FROM '/data/csv/tbbioticosuperficie.csv'
DELIMITER ';'
NULL '\N'
CSV HEADER
QUOTE '"';

COPY tbbolhas (idBolhas, idCampanha, idSitio, profundidade, nroDeFunis,
       volumeColetado, CO2, O2, N2, CH4, N2O, dataMedida, horaMedida)
FROM '/data/csv/tbbolhas.csv'
DELIMITER ';'
NULL '\N'
CSV HEADER
QUOTE '"';

COPY tbcamarasolo (idCamaraSolo, idCampanha, idSitio, dataMedida, horaMedida,
       CH4, CO2, N2O, tempAr, tempSolo, vento, altitude)
FROM '/data/csv/tbcamarasolo.csv'
DELIMITER ';'
NULL '\N'
CSV HEADER
QUOTE '"';

COPY tbcarbono (idCarbono, idCampanha, idSitio, dataMedida, horaMedida,
       DC, DOC, POC, TOC, DIC, TC)
FROM '/data/csv/tbcarbono.csv'
DELIMITER ';'
NULL '\N'
CSV HEADER
QUOTE '"';

COPY tbconcentracaogasagua (idConcentracaoGasAgua, idCampanha, idSitio, dataMedida, horaMedida,
       batimetria, altura, replica, CH4, CO2)
FROM '/data/csv/tbconcentracaogasagua.csv'
DELIMITER ';'
NULL '\N'
CSV HEADER
QUOTE '"';

COPY tbconcentracaogassedimento (idConcentracaoGasSedimento, idCampanha, idSitio, dataMedida, horaMedida,
       batimetria, profundidadeDoSedimento, replica, CH4, CO2)
FROM '/data/csv/tbconcentracaogassedimento.csv'
DELIMITER ';'
NULL '\N'
CSV HEADER
QUOTE '"';

COPY tbdifusao (idDifusao, idCampanha, idSitio, dataMedida, horaMedida,
       CH4, CO2, N2O, pH, tempAgua, tempAr,
       profundidade, altitude, vento)
FROM '/data/csv/tbdifusao.csv'
DELIMITER ';'
NULL '\N'
CSV HEADER
QUOTE '"';

COPY tbdupladessorcaoagua (idDuplaDessorcaoAgua, idCampanha, idSitio, dataMedida, horaMedida,
       profundidade, CO2, O2, N2, CH4, N2O)
FROM '/data/csv/tbdupladessorcaoagua.csv'
DELIMITER ';'
NULL '\N'
CSV HEADER
QUOTE '"';

COPY tbfluxobolhasinpe (idFluxoBolhasInpe, idCampanha, idSitio, profundidade,
       CH4, CH4_desvioPadrao, CH4_amostras, dataMedida, horaMedida)
FROM '/data/csv/tbfluxobolhasinpe.csv'
DELIMITER ';'
NULL '\N'
CSV HEADER
QUOTE '"';

COPY tbfluxocarbono (idFluxoCarbono, idCampanha, idSitio,
       producaoFitoplanctonica, carbonoOrganicoExcretado, respiracaoFito,
       producaoBacteriana, respiracaoBacteriana, taxaSedimentacao,
       dataMedida, horaMedida)
FROM '/data/csv/tbfluxocarbono.csv'
DELIMITER ';'
NULL '\N'
CSV HEADER
QUOTE '"';


COPY tbfluxodifusivo (idFluxoDifusivo, idCampanha, idSitio, batimetria, intervalo,
       CH4, CO2, dataMedida, horaMedida)
FROM '/data/csv/tbfluxodifusivo.csv'
DELIMITER ';'
NULL '\N'
CSV HEADER
QUOTE '"';

COPY tbfluxodifusivoinpe (idFluxoDifusivoInpe, idCampanha, idSitio, profundidade,
       CO2, CO2_desvioPadrao, CO2_amostras,
       CH4, CH4_desvioPadrao, CH4_amostras,
       dataMedida, horaMedida)
FROM '/data/csv/tbfluxodifusivoinpe.csv'
DELIMITER ';'
NULL '\N'
CSV HEADER
QUOTE '"';

COPY tbgasesembolhas (idGasesEmBolhas, idCampanha, idSitio, profundidade,
       CO2, O2, N2, CH4, N2O, dataMedida)
FROM '/data/csv/tbgasesembolhas.csv'
DELIMITER ';'
NULL '\N'
CSV HEADER
QUOTE '"';

COPY tbhoriba (idHoriba, idCampanha, idSitio, profundidade,
       tempAgua, condutividade, pH, _DO,
       TDS, redox, turbidez, dataMedida)
FROM '/data/csv/tbhoriba.csv'
DELIMITER ';'
NULL '\N'
CSV HEADER
QUOTE '"';

COPY tbionsnaaguaintersticialdosedimento (idIonsNaAguaIntersticialDoSedimento, idCampanha, idSitio,
       profundidade, batimetria, F, Cl, NO2, Br, NO3,
       PO4, SO4, Na, NH4, K, Mg, Ca, acetato,
       dataMedida, horaMedida)
FROM '/data/csv/tbionsnaaguaintersticialdosedimento.csv'
DELIMITER ';'
NULL '\N'
CSV HEADER
QUOTE '"';

COPY tbmedidacampocoluna (idMedidaCampoColuna, idCampanha, idSitio,
       profundidade, secchi, tempAgua, condutividade,
       _DO, pH, turbidez, materialEmSuspensao,
       intensidadeLuminosa, dataMedida, horaMedida)
FROM '/data/csv/tbmedidacampocoluna.csv'
DELIMITER ';'
NULL '\N'
CSV HEADER
QUOTE '"';

COPY tbmedidacamposuperficie (idMedidaCampoSuperficie, idCampanha, idSitio,
       secchi, tempAgua, condutividade,
       _DO, pH, turbidez, materialEmSuspensao,
       dataMedida, horaMedida)
FROM '/data/csv/tbmedidacamposuperficie.csv'
DELIMITER ';'
NULL '\N'
CSV HEADER
QUOTE '"';

COPY tbnutrientessedimento (idNutrientesSedimento, idCampanha, idSitio,
       profundidade, batimetria, N2, PT, TC,
       dataMedida, horaMedida)
FROM '/data/csv/tbnutrientessedimento.csv'
DELIMITER ';'
NULL '\N'
CSV HEADER
QUOTE '"';

COPY tbparametrosbiologicosfisicosagua (idParametrosBiologicosFisicosAgua, idCampanha, idSitio, dataMedida, profundidade,
       secchi, tempagua, condutividade, _DO, pH, turbidez, materialEmSuspensao,
       DOC, TOC, POC, DIC, NT, PT, densidadeBacteria, biomassaBacteria,
       clorofilaA, biomassaCarbonoTotalFito, densidadeTotalFito, biomassaZoo,
       densidadeTotalZoo, producaoFitoplanctonica, carbonoOrganicoExcretado,
       respiracaoFito, producaoBacteriana, respiracaoBacteriana, taxaSedimentacao,
       delta13c, delta15n, intensidadeLuminosa)
FROM '/data/csv/tbparametrosbiologicosfisicosagua.csv'
DELIMITER ';'
NULL '\N'
CSV HEADER
QUOTE '"';

COPY tbpfq (idPFQ, idCampanha, idSitio, dataMedida, horaMedida,
       profundidade, batimetria, tempar, tempagua, _DO,
       pH, redox, vento)
FROM '/data/csv/tbpfq.csv'
DELIMITER ';'
NULL '\N'
CSV HEADER
QUOTE '"';

COPY tbtc (idtc, idCampanha, idSitio, dataMedida,
       profundidade, tc)
FROM '/data/csv/tbtc.csv'
DELIMITER ';'
NULL '\N'
CSV HEADER
QUOTE '"';


COPY tbvariaveisfisicasquimicasdaagua (idVariaveisFisicasQuimicasDaAgua, idCampanha, idSitio, dataMedida, horaMedida,
       profundidade, secchi, batimetria, F, Cl, NNO3, PPO43, SSO42,
       Li, Na, NNH4, K, Mg, Ca, clorofila, feofitina,
       turbidez, NT, PT, TDC)
FROM '/data/csv/tbvariaveisfisicasquimicasdaagua.csv'
DELIMITER ';'
NULL '\N'
CSV HEADER
QUOTE '"';