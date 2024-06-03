import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

function converterData(data: string): string {
  const partes = data.split('/');
  const dataFormatada = `${partes[2]}-${partes[1].padStart(2, '0')}-${partes[0].padStart(2, '0')}`;
  return dataFormatada;
}

async function populateDB() {
  try {
    // Caminho absoluto para o arquivo JSON de dados
    const filePath = path.resolve(__dirname, 'data/data.json');
    const rawData = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(rawData);

    // Povoa o banco de dados com os dados lidos do arquivo JSON
    for (const pessoaData of data) {
      const {
        nome,
		idade, 
		cpf,
		rg,
		data_nasc,
		sexo,
		signo,
		mae,
		pai,
		email,
		senha,
		cep,
		endereco,
		numero,
		bairro,
		cidade,
		estado,
		telefone_fixo,
		celular,
		altura,
		peso,
		tipo_sanguineo,
		cor,
      } = pessoaData;

      const dataNascFormatada = converterData(data_nasc);

      const novaPessoa = await prisma.pessoa.create({
        data:{
            nome,
            idade,
            cpf,
            rg,
            dataNasc: new Date(dataNascFormatada),
            sexo,
            signo,
            email,
            senha,
            altura: parseFloat(altura),
            peso,
            tipoSanguineo:tipo_sanguineo,
            cor,
            endereco:{
              create: {
                cep,
                rua: endereco,
                numero: numero,
                bairro,
                cidade,
                estado,
              }
            },
            contatos:{
              create:[
                {
                  tipo:"Fixo",
                  numero: telefone_fixo,
                },
                {
                  tipo:"Celular",
                  numero:celular,
                }
              ]
            },
            parentescos: {
              create: [
                {
                tipo:"Mãe",
                nome: mae,
                },
                {
                  tipo: 'Pai',
                  nome: pai,
                },
              ]
            },
          }
      });

      console.log('Pessoa criada:', novaPessoa);
    }


    console.log(data)

    console.log('Povoamento do banco de dados concluído.');
  } catch (error) {
    console.error('Erro ao popular o banco de dados:', error);
  } finally {
    await prisma.$disconnect();
  }
}

populateDB();