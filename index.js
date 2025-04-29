const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>OneClick Clonador</title>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;800&display=swap" rel="stylesheet">
  <style>:root { --verde: #00FF88; --fundo: #0f0f1c; --texto: #f2f2f2; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background-color: var(--fundo); font-family: 'Poppins', sans-serif; color: var(--texto); overflow: hidden; }
  .particles { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: -1;
  background: radial-gradient(circle at center, #1a1a2e 0%, #0f0f1c 100%); overflow: hidden; }
  .fade-in { animation: fadeIn 1.2s ease-in-out forwards; opacity: 0; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  main { display: flex; flex-direction: column; align-items: center; justify-content: center;
  min-height: 100vh; padding: 40px 20px; z-index: 1; position: relative; }
  h1 { font-size: 2.8rem; text-align: center; font-weight: 800; color: white; margin-bottom: 10px; }
  h1 span { color: var(--verde); } p { font-size: 1rem; color: #aaa; text-align: center; margin-bottom: 40px; }
  .form-container { width: 100%; max-width: 500px; background-color: #1a1a2e; padding: 30px; border-radius: 14px;
  box-shadow: 0 0 25px rgba(0, 255, 136, 0.05); }
  label { font-size: 0.9rem; color: #ccc; margin-bottom: 8px; display: block; }
  input[type="text"] { width: 100%; padding: 14px; font-size: 16px; border: 1px solid var(--verde); border-radius: 10px;
  background-color: #0f0f1c; color: white; outline: none; margin-bottom: 20px; }
  input[type="text"]::placeholder { color: #666; }
  button { width: 100%; padding: 14px; font-size: 16px; font-weight: 600; background-color: var(--verde);
  color: #0f0f1c; border: none; border-radius: 10px; cursor: pointer; transition: all 0.3s ease; }
  button:hover { background-color: #00e676; box-shadow: 0 0 15px var(--verde); }
  footer { margin-top: 60px; font-size: 13px; color: #555; text-align: center; }
  @media (max-width: 500px) { h1 { font-size: 2rem; } }</style></head>
  <body><div class="particles"></div><main class="fade-in">
  <h1><span>OneClick</span> Clonador</h1><p>Clone qualquer página com um clique</p>
  <div class="form-container"><form action="/gerar" method="POST">
  <label for="url">Link da página de afiliado</label>
  <input type="text" name="url" id="url" placeholder="https://exemplo.com/pagina" required />
  <button type="submit">Gerar Arquivo</button></form></div>
  <footer>© 2025 OneClick Clonador · Norton Dev</footer></main>
  <script>
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  document.querySelector('.particles').appendChild(canvas);
  let width, height, particles;
  function initCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    particles = Array.from({ length: 40 }, () => ({
      x: Math.random() * width, y: Math.random() * height, r: Math.random() * 2 + 1,
      dx: (Math.random() - 0.5) * 0.5, dy: (Math.random() - 0.5) * 0.5
    }));
  }
  function animateParticles() {
    ctx.clearRect(0, 0, width, height); ctx.fillStyle = '#00ff88';
    particles.forEach(p => {
      p.x += p.dx; p.y += p.dy;
      if (p.x < 0 || p.x > width) p.dx *= -1;
      if (p.y < 0 || p.y > height) p.dy *= -1;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
    });
    requestAnimationFrame(animateParticles);
  }
  window.addEventListener('resize', initCanvas); initCanvas(); animateParticles();
  </script></body></html>`);
});

app.post('/gerar', async (req, res) => {
  const url = req.body.url;
  const data = new Date().toISOString().split('T')[0];
  const nomeArquivo = `index-${data}.html`;

  try {
    const resposta = await axios.get(url);
    const html = resposta.data;
    const dir = path.join(__dirname, 'arquivos');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    const caminho = path.join(dir, nomeArquivo);
    fs.writeFileSync(caminho, html, 'utf-8');
    res.download(caminho);
  } catch (erro) {
    console.error('Erro ao gerar arquivo:', erro.message);
    res.send('Erro ao gerar o arquivo. Verifique o link e tente novamente.');
  }
});

app.listen(port, () => {
  console.log(\`Servidor rodando na porta \${port}\`);
});
