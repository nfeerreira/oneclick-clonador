const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware para ler formulário
app.use(express.urlencoded({ extended: true }));

// Criar a pasta 'arquivos' automaticamente no início
const pastaArquivos = path.join(__dirname, 'arquivos');
if (!fs.existsSync(pastaArquivos)) {
  fs.mkdirSync(pastaArquivos);
}

// Página inicial
app.get('/', (req, res) => {
  const { erro } = req.query; // Captura erros via query string
  res.send(`
    <html>
      <head>
        <title>Clonador Inteligente de Páginas</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
          }
          .container {
            background: white;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            text-align: center;
            max-width: 450px;
          }
          .logo {
            width: 80px;
            margin-bottom: 10px;
          }
          h1 {
            font-size: 24px;
            color: #333;
            margin-bottom: 10px;
          }
          .slogan {
            font-size: 14px;
            color: #666;
            margin-bottom: 20px;
          }
          label {
            font-size: 14px;
            color: #555;
            display: block;
            margin-bottom: 8px;
            text-align: left;
          }
          input[type="text"] {
            width: 100%;
            padding: 12px;
            margin-bottom: 20px;
            border-radius: 6px;
            border: 1px solid #ccc;
            font-size: 14px;
          }
          .error {
            color: red;
            margin-bottom: 15px;
            font-size: 13px;
          }
          button {
            padding: 12px 20px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 16px;
            width: 100%;
          }
          button:hover {
            background-color: #0056b3;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <img src="https://via.placeholder.com/80x80.png?text=Logo" alt="Logo" class="logo" />
          <h1>Clonador Inteligente de Páginas</h1>
          <div class="slogan">Transforme Páginas em Resultados: Capture, Salve e Vença no Digital!</div>
          ${erro ? `<div class="error">${erro}</div>` : ''}
          <form method="POST" action="/gerar" target="_self">
            <label>Insira aqui o link da página que deseja clonar (Ex: página de afiliado)</label>
            <input type="text" name="url" placeholder="https://example.com" required/>
            <button type="submit">Gerar Arquivo</button>
          </form>
        </div>
      </body>
    </html>
  `);
});

// Função para validar se a URL é válida
function validarURL(url) {
  const regex = /^(https?:\/\/)[\w\-]+(\.[\w\-]+)+[/#?]?.*$/;
  return regex.test(url);
}

// Rota que gera o arquivo HTML com nome automático
app.post('/gerar', async (req, res) => {
  const { url } = req.body;

  if (!validarURL(url)) {
    // Se URL inválida, redireciona para página principal com erro
    return res.redirect('/?erro=URL+inv%C3%A1lida.+Insira+um+link+completo+com+https://');
  }

  try {
    const response = await axios.get(url);
    const htmlContent = response.data;

    // Pegar a data atual
    const dataAtual = new Date();
    const ano = dataAtual.getFullYear();
    const mes = String(dataAtual.getMonth() + 1).padStart(2, '0');
    const dia = String(dataAtual.getDate()).padStart(2, '0');

    // Nome do arquivo
    const nomeArquivo = `index-${ano}-${mes}-${dia}.html`;
    const filePath = path.join(pastaArquivos, nomeArquivo);

    // Salvar o HTML na pasta 'arquivos'
    fs.writeFileSync(filePath, htmlContent);

    // Enviar o arquivo para download
    res.download(filePath, nomeArquivo, () => {
      console.log('Arquivo enviado com sucesso!');
    });

  } catch (error) {
    console.error('Erro ao baixar a página:', error);
    res.redirect('/?erro=Erro+ao+baixar+a+p%C3%A1gina.+Verifique+o+link.');
  }
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
