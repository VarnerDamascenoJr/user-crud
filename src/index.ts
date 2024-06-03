import express from 'express';
import pessoaRoutes from './routes/pessoaRoutes'
const app = express();
const port = 8000;

app.use(express.json());
app.use('/', pessoaRoutes)

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
