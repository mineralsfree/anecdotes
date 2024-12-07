import jsonServer from 'json-server';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

const PORT = process.env.PORT || 5000;

const validator = (request, response, next) => {
  const { content } = request.body;

  if (request.method === 'POST' && (!content || content.length < 5)) {
    return response.status(400).json({
      error: 'too short anecdote, must have length 5 or more',
    });
  } else {
    next();
  }
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

server.use(express.static(path.join(__dirname, 'dist')));

server.use(middlewares);
server.use(jsonServer.bodyParser);
server.use(validator);

server.use('/api', router);

server.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

server.listen(PORT, () => {
  console.log(`JSON Server is running on http://localhost:${PORT}`);
})