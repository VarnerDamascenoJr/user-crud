export function converterData(data: string): string {
    const partes = data.split('/');
    const dataFormatada = `${partes[2]}-${partes[1].padStart(2, '0')}-${partes[0].padStart(2, '0')}`;
    return dataFormatada;
  }