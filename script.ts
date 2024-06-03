import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const novaPessoa = await prisma.pessoa.create({
    data: {
      nome: "Débora Helena Assunção",
      idade: 56,
      cpf: "604.632.978-72",
      rg: "13.422.101-7361",
      dataNasc: new Date("1968-01-10"),
      sexo: "Feminino",
      signo: "Capricórnio",
      email: "debora-assuncaaaa95@sunrise.com.br",
      senha: "Y5yiwRFsMN",
      altura: 1.80,
      peso: 69,
      tipoSanguineo: "B+",
      cor: "laranja",
      endereco: {
        create: {
          cep: "68908-093",
          rua: "Rua Liberdade",
          numero: 161,
          bairro: "Infraero",
          cidade: "Macapá",
          estado: "AP",
        },
      },
      contatos: {
        create: [
          {
            tipo: "Fixo",
            numero: "(96) 2733-9552",
          },
          {
            tipo: "Celular",
            numero: "(96) 98139-7361",
          },
        ],
      },
      parentescos: {
        create: [
          {
            tipo: "Mãe",
            nome: "Vitória Sandra",
          },
          {
            tipo: "Pai",
            nome: "Hugo Kevin Kaique Assunção",
          },
        ],
      },
    },
  });

  console.log(novaPessoa);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
