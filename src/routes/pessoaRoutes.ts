import express from 'express';
import { criarpessoa, listarPessoa, listOnePerson, deletePerson } from '../controllers/pessoaControllers';

const router = express.Router();


router.get('/users', listarPessoa)
router.get('/users/:id', listOnePerson)
router.post('/users', criarpessoa)
router.delete('/users/:id', deletePerson)


export default router;
