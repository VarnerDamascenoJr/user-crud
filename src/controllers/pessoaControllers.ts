import {Request, Response} from 'express';
import { Pessoa } from '@prisma/client';

import { PrismaClient } from '@prisma/client'
import { converterData } from '../utils/convertData';

const prisma = new PrismaClient()

export const criarpessoa = async(req:Request, res: Response): Promise<void> =>{

  const { 
    nome,
		idade, 
		cpf,
		rg,
		dataNasc,
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
		telefoneFixo,
		celular,
		altura,
		peso,
		tipoSanguineo,
		cor,
    rua,
  } = req.body;
  try {
    const dataNascAdequated =  await converterData(dataNasc)
  const novaPessoa = await prisma.pessoa.create({
    data:{
      nome,
      idade,
      cpf,
      rg,
      dataNasc: new Date(dataNascAdequated),
      sexo,
      signo,
      email,
      senha,
      altura: parseFloat(altura),
      peso,
      tipoSanguineo,
      cor,
      endereco:{
        create: {
          cep,
          rua,
          numero,
          bairro,
          cidade,
          estado,
        }
      },
      contatos:{
        create:[
          {
            tipo:"Fixo",
            numero: telefoneFixo,
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
  })

  res.json(novaPessoa);


  } catch (error) {
    console.error('Erro ao criar nova pessoa:', error);
    res.status(500).json({ error: 'Erro ao criar nova pessoa' });
  }
}

export const listarPessoa = async (req: Request, res: Response): Promise<any> => {
  try {
    const pessoas = await prisma.pessoa.findMany({include:{
        endereco: true,
        contatos: true,
        parentescos: true,
    }});
    res.json(pessoas);
  } catch (error) {
    console.error('Erro ao listar pessoas:', error);
    res.status(500).json({ error: 'Erro ao listar pessoas' });
  }
}

export const listOnePerson = async (req: Request, res: Response) : Promise<any> => {
  const {id} = req.params;
  try {
    const pessoa = await prisma.pessoa.delete({
      where: { id: parseInt(id) },
    });

    if (!pessoa) {
      res.status(404).json({ error: 'Pessoa não encontrada' });
      return;
    }

    res.json(pessoa);
  } catch (error) {
    console.error('Erro ao listar pessoas:', error);
    res.status(500).json({ error: 'Erro ao listar pessoas' });
  }
}

export const deletePerson = async (req: Request, res: Response) : Promise<any> => {
  const {id} = req.params;

  try{
    const existingPerson = await prisma.pessoa.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingPerson) {
      res.status(404).json({ error: 'Pessoa não encontrada' });
      return;
    }

    // Remove todas as referências relacionadas à pessoa em outras tabelas
    await prisma.contato.deleteMany({ where: { pessoaId: parseInt(id) } });
    await prisma.parentesco.deleteMany({ where: { pessoaId: parseInt(id) } });
    // Adicione mais chamadas deleteMany conforme necessário para outras tabelas relacionadas

    // Em seguida, exclui a pessoa
    await prisma.pessoa.delete({
      where: { id: parseInt(id) },
    });

    res.json('Pessoa excluída com sucesso');
  } catch (err) {
    console.error('Erro ao listar pessoas:', err);
    res.status(500).json({ error: 'Erro ao deletar pessoa' });
  }
}
