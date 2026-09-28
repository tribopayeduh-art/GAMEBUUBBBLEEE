# Bubbles Win

Site completo em `dist/`, com jogo, imagens, vídeo, login local e saldo virtual. Os valores são simulados no navegador; não há servidor de autenticação, cobrança PIX ou saques reais. A partida termina automaticamente ao alcançar a meta ou perder, e voltar ao painel durante uma rodada consome a entrada após confirmação. O cenário e as bolhas em WebP da área de jogar foram incorporados ao pacote.

## Executar localmente

Requer Node.js 20 ou superior. Na raiz do projeto:

```bash
npm start
```

Abra `http://localhost:8080`. Para conferir as regras do jogo: `npm test`.

## GitHub e AI Studio

Envie todos os arquivos e pastas da raiz, inclusive `dist/`, `package.json` e `server.mjs`. Configure o início como `npm start` e a porta como a variável `PORT` fornecida pela plataforma. Também há um `Dockerfile` para ambientes que publicam um contêiner. O servidor entrega `/painel` e outras rotas pelo `index.html`, preservando caminhos de arquivos e retornando 404 para arquivos ausentes.

Este projeto é uma versão web estática de teste. Contas e saldo são armazenados no navegador e não são compartilhados entre aparelhos. Para usar dinheiro real, autenticação persistente ou PIX é necessário construir e integrar um backend específico antes de publicar essa funcionalidade.
