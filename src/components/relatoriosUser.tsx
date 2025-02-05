import dayjs from "dayjs";

export const montarRelatorio = (
  plantoes: any[],
  filtroPorMes: boolean,
  dataSelecionada: string
) => {
  let naoConcluidas: string[] = [];
  let concluidas: string[] = [];
  let plantonistasCount: Record<
    string,
    { ativas: number; concluidas: number }
  > = {};

  plantoes.forEach((plantao) => {
    const { concluido, plantonista, funcao, data, local, observacoes } =
      plantao;

    // Escalas concluídas
    if (concluido) {
      concluidas.push(
        `
=> ${plantonista}
- ${funcao}
- Hospital ${local}
- Data: ${dayjs(data).format("DD-MM-YYYY")}
- Observações: ${observacoes || "Médico não fez observações"}`
      );

      // Contar escalas concluídas por plantonista
      if (plantonista) {
        if (!plantonistasCount[plantonista]) {
          plantonistasCount[plantonista] = { ativas: 0, concluidas: 0 };
        }
        plantonistasCount[plantonista].concluidas += 1;
      }
    } else {
      // Escalas ativas
      naoConcluidas.push(
        `\n=> ${plantonista}
- ${funcao}
- Hospital ${local}
- Data: ${dayjs(data).format("DD-MM-YYYY")}`
      );

      // Contar escalas ativas por plantonista
      if (plantonista) {
        if (!plantonistasCount[plantonista]) {
          plantonistasCount[plantonista] = { ativas: 0, concluidas: 0 };
        }
        plantonistasCount[plantonista].ativas += 1;
      }
    }
  });

  const formattedDate = dayjs(dataSelecionada).format("DD-MM-YYYY");
  const formattedDateMes = dayjs(dataSelecionada).format("MM-YYYY");

  // Formatar relatório
  const relatorio = `Relatório ${
    filtroPorMes ? `do mês ${formattedDateMes}` : `do dia ${formattedDate}`
  }

Escalas ativas: (${naoConcluidas.length})\n${naoConcluidas.join("\n")}
      
Escalas concluídas: (${concluidas.length})\n${concluidas.join("\n")}
      
Total:
${
  Object.keys(plantonistasCount)
    .map((plantonista) => {
      const { ativas, concluidas } = plantonistasCount[plantonista];
      return `\n${plantonista}:
- ${ativas} Escalas Ativas
- ${concluidas} Escalas Concluídas`;
    })
    .join("\n") || "\nNenhuma escala cadastrada"
}
        `;

  return relatorio;
};
