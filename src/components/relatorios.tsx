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

    // Escalas não concluídas
    if (!concluido) {
      naoConcluidas.push(
        `- ${plantonista} como ${funcao} no dia ${data} no hospital ${local}`
      );
    }

    // Escalas concluídas
    if (concluido) {
      if (observacoes) {
        concluidas.push(
          `Observação do médico ${plantonista} na função ${funcao} no dia ${data} no hospital ${local}: ${observacoes}`
        );
      }
    }

    // Contar os médicos (plantonistas)
    if (plantonista) {
      plantonistasCount[plantonista] =
        (plantonistasCount[plantonista] || 0) + 1;
    }
  });

  // Formatar relatório
  const relatorio = `
          Relatório ${
            filtroPorMes
              ? `do mês ${dataSelecionada}`
              : `do dia ${dataSelecionada}`
          }:
          
          Escalas não concluídas: (${naoConcluidas.length})
          ${naoConcluidas.join("\n") || "Nenhuma escala não concluída"}
      
          Escalas concluídas: (${concluidas.length})
          ${concluidas.join("\n") || "Nenhuma escala concluída"}
      
          Médicos:
          ${
            Object.keys(plantonistasCount)
              .map(
                (plantonista) =>
                  `- ${plantonista}: ${plantonistasCount[plantonista]} Escalas`
              )
              .join("\n") || "Nenhum médico encontrado"
          }
        `;

  return relatorio;
};
