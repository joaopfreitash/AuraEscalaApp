import dayjs from "dayjs";

export const montarRelatorio = (
  plantoes: any[],
  filtroPorMes: boolean,
  dataSelecionada: string
) => {
  let naoConcluidas: string[] = [];
  let concluidas: string[] = [];
  let plantonistasCount: Record<string, number> = {};

  plantoes.forEach((plantao) => {
    const { concluido, plantonista, funcao, data, local, observacoes } =
      plantao;

    // Escalas concluídas
    if (concluido) {
      if (observacoes) {
        concluidas.push(
          `\nObservação do médico ${plantonista} na função ${funcao} no hospital ${local}:\n\n${observacoes}`
        );
      }
    }

    // Contar os médicos (plantonistas)
    if (plantonista) {
      plantonistasCount[plantonista] =
        (plantonistasCount[plantonista] || 0) + 1;
    }
  });

  const formattedDate = dayjs(dataSelecionada).format("DD-MM-YYYY");
  const formattedDateMes = dayjs(dataSelecionada).format("MM-YYYY");
  // Formatar relatório
  const relatorio = `
          Relatório ${
            filtroPorMes
              ? `do mês ${formattedDateMes}`
              : `do dia ${formattedDate}`
          }
          
          Escalas ativas: (${naoConcluidas.length})${naoConcluidas.join("\n")}
      
          Escalas concluídas: (${concluidas.length})\n${concluidas.join("\n")}
      
          Médicos:
          ${
            Object.keys(plantonistasCount)
              .map(
                (plantonista) =>
                  `${plantonista}: ${plantonistasCount[plantonista]} Escalas`
              )
              .join("\n") || "Nenhum médico encontrado"
          }
        `;

  return relatorio;
};
