/* =====================================================================
   SURPRESA ROMÂNTICA — script.js
   Toda a lógica de navegação, interações e animações do site.
   ===================================================================== */

(() => {
  'use strict';

  /* ------------------------------------------------------------------
     CONFIGURAÇÃO GERAL
     Ajuste aqui a data de início do relacionamento e a senha, se quiser.
     ------------------------------------------------------------------ */
  const SENHA_CORRETA = '15092025';
  const DATA_INICIO = new Date(2025, 8, 15, 0, 0, 0); // mês 8 = setembro (índice 0-based)
  const MUSICA_INICIO_SEGUNDOS = 48;

  /* ------------------------------------------------------------------
     NAVEGAÇÃO ENTRE TELAS
     Cada <section class="screen"> tem data-screen="N".
     goToScreen troca a tela ativa com uma transição suave.
     ------------------------------------------------------------------ */
  const screens = Array.from(document.querySelectorAll('.screen'));

  function getScreen(n) {
    return document.querySelector(`.screen[data-screen="${n}"]`);
  }

  function goToScreen(n) {
    const current = document.querySelector('.screen.active');
    const next = getScreen(n);
    if (!next || next === current) return;

    if (current) current.classList.remove('active');
    next.classList.add('active');

    // Dispara comportamentos específicos de cada tela ao entrar nela
    onEnterScreen(n);
  }

  // Liga todo botão com [data-next] para navegar automaticamente
  document.querySelectorAll('[data-next]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = parseInt(btn.getAttribute('data-next'), 10);
      goToScreen(target);
    });
  });

  /* ------------------------------------------------------------------
     TELA 1 — VALIDAÇÃO DE SENHA
     ------------------------------------------------------------------ */
  const formSenha = document.getElementById('form-senha');
  const inputSenha = document.getElementById('input-senha');
  const hintErro = document.getElementById('hint-erro');

  formSenha.addEventListener('submit', (e) => {
    e.preventDefault();
    const valor = inputSenha.value.trim();

    if (valor === SENHA_CORRETA) {
      hintErro.classList.remove('show');
      goToScreen(2);
    } else {
      hintErro.classList.add('show');
      inputSenha.value = '';
      inputSenha.focus();
      // pequena vibração visual de erro
      inputSenha.style.borderColor = '#ff6b9d';
      setTimeout(() => { inputSenha.style.borderColor = ''; }, 600);
    }
  });

  /* ------------------------------------------------------------------
     TELA 2 — MÚSICA (começa no segundo 48 ao entrar na tela)
     ------------------------------------------------------------------ */
  const trilha = document.getElementById('trilha');
  const btnContinuarMusica = document.getElementById('btn-continuar-musica');

  function tocarMusicaDoSegundo48() {
    trilha.currentTime = MUSICA_INICIO_SEGUNDOS;
    const tentativa = trilha.play();
    if (tentativa && tentativa.catch) {
      tentativa.catch(() => {
        // Caso o navegador bloqueie autoplay, a música inicia no primeiro toque na tela
        const tocarNoToque = () => {
          trilha.currentTime = MUSICA_INICIO_SEGUNDOS;
          trilha.play();
          document.removeEventListener('click', tocarNoToque);
        };
        document.addEventListener('click', tocarNoToque, { once: true });
      });
    }
  }

  btnContinuarMusica.addEventListener('click', () => {
    trilha.pause();
    trilha.currentTime = 0;
    goToScreen(3);
  });

  /* ------------------------------------------------------------------
     TELA 4 — PERGUNTA DO BANHO
     Qualquer resposta revela a mesma frase e libera o botão de avançar
     ------------------------------------------------------------------ */
  const respostaBanho = document.getElementById('resposta-banho');
  const btnAvancarBanho = document.getElementById('btn-avancar-banho');

  document.querySelectorAll('#choice-banho .choice-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      respostaBanho.classList.add('show');
      btnAvancarBanho.style.display = 'inline-block';
      document.querySelectorAll('#choice-banho .choice-btn').forEach((b) => (b.disabled = true));
    });
  });

  /* ------------------------------------------------------------------
     TELA 5 — CONTADOR DE RELACIONAMENTO EM TEMPO REAL
     ------------------------------------------------------------------ */
  const elDias = document.getElementById('count-dias');
  const elHoras = document.getElementById('count-horas');
  const elMin = document.getElementById('count-min');
  const elSeg = document.getElementById('count-seg');
  let contadorInterval = null;

  function atualizarContador() {
    const agora = new Date();
    let diff = Math.max(0, agora.getTime() - DATA_INICIO.getTime());

    const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
    diff -= dias * (1000 * 60 * 60 * 24);
    const horas = Math.floor(diff / (1000 * 60 * 60));
    diff -= horas * (1000 * 60 * 60);
    const minutos = Math.floor(diff / (1000 * 60));
    diff -= minutos * (1000 * 60);
    const segundos = Math.floor(diff / 1000);

    elDias.textContent = dias;
    elHoras.textContent = String(horas).padStart(2, '0');
    elMin.textContent = String(minutos).padStart(2, '0');
    elSeg.textContent = String(segundos).padStart(2, '0');
  }

  function iniciarContador() {
    if (contadorInterval) return;
    atualizarContador();
    contadorInterval = setInterval(atualizarContador, 1000);
  }

  /* ------------------------------------------------------------------
     TELA 6 — GALERIA AUTOMÁTICA (uma foto por vez, com fade)
     ------------------------------------------------------------------ */
  const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
  const galleryDotsContainer = document.getElementById('gallery-dots');
  let galleryIndex = 0;
  let galleryInterval = null;

  // Cria os indicadores (dots) dinamicamente
  galleryItems.forEach((_, i) => {
    const dot = document.createElement('span');
    if (i === 0) dot.classList.add('active');
    galleryDotsContainer.appendChild(dot);
  });
  const galleryDots = Array.from(galleryDotsContainer.children);

  function mostrarFoto(index) {
    galleryItems.forEach((item, i) => item.classList.toggle('active', i === index));
    galleryDots.forEach((dot, i) => dot.classList.toggle('active', i === index));
  }

  function iniciarGaleria() {
    if (galleryInterval) return;
    galleryIndex = 0;
    mostrarFoto(galleryIndex);
    galleryInterval = setInterval(() => {
      galleryIndex = (galleryIndex + 1) % galleryItems.length;
      mostrarFoto(galleryIndex);
    }, 3200);
  }

  function pararGaleria() {
    clearInterval(galleryInterval);
    galleryInterval = null;
  }

  /* ------------------------------------------------------------------
     TELA 7 — BOTÃO "NÃO" QUE FOGE DO MOUSE/TOQUE
     ------------------------------------------------------------------ */
  const btnNao = document.getElementById('btn-nao');
  const tauntText = document.getElementById('taunt-text');
  const frasesNao = ['EI 😡', 'Nem tenta 😒', 'Resposta errada 😤', 'Você não vai conseguir clicar nisso 😌'];

  function fugirBotaoNao() {
    const margem = 16;
    const larguraBtn = btnNao.offsetWidth;
    const alturaBtn = btnNao.offsetHeight;
    const maxX = window.innerWidth - larguraBtn - margem;
    const maxY = window.innerHeight - alturaBtn - margem;

    const novoX = margem + Math.random() * Math.max(0, maxX - margem);
    const novoY = margem + Math.random() * Math.max(0, maxY - margem);

    btnNao.classList.add('fleeing');
    btnNao.style.left = `${novoX}px`;
    btnNao.style.top = `${novoY}px`;

    const frase = frasesNao[Math.floor(Math.random() * frasesNao.length)];
    tauntText.textContent = frase;
    tauntText.classList.add('show');
  }

  // Foge tanto no hover (desktop) quanto na tentativa de toque (mobile)
  btnNao.addEventListener('mouseenter', fugirBotaoNao);
  btnNao.addEventListener('touchstart', (e) => {
    e.preventDefault();
    fugirBotaoNao();
  }, { passive: false });
  btnNao.addEventListener('click', (e) => {
    // Em telas grandes o clique raramente acontece, mas por garantia, foge de novo
    e.preventDefault();
    fugirBotaoNao();
  });

  function resetarBotaoNao() {
    btnNao.classList.remove('fleeing');
    btnNao.style.left = '';
    btnNao.style.top = '';
    tauntText.classList.remove('show');
  }

  /* ------------------------------------------------------------------
     TELA 9 — VÍDEO DELE: libera o botão "Continuar" quando o vídeo acabar
     (o botão já é visível, mas reforçamos a indicação ao terminar)
     ------------------------------------------------------------------ */
  const videoBe = document.getElementById('video-be');
  const btnContinuarVideo = document.getElementById('btn-continuar-video');

  videoBe.addEventListener('ended', () => {
    btnContinuarVideo.classList.add('btn-pulse');
  });

  /* ------------------------------------------------------------------
     TELA 12 — SURPRESA: chuva de corações + revelação em sequência
     ------------------------------------------------------------------ */
  let chuvaInterval = null;

  function criarCoracaoCadente() {
    const coracao = document.createElement('span');
    coracao.className = 'falling-heart';
    coracao.textContent = Math.random() > 0.5 ? '💜' : '❤️';
    coracao.style.left = `${Math.random() * 100}vw`;
    const duracao = 4 + Math.random() * 3;
    coracao.style.animationDuration = `${duracao}s`;
    coracao.style.fontSize = `${1 + Math.random() * 1.4}rem`;
    document.body.appendChild(coracao);
    setTimeout(() => coracao.remove(), duracao * 1000);
  }

  function iniciarChuvaDeCoracoes() {
    if (chuvaInterval) return;
    chuvaInterval = setInterval(criarCoracaoCadente, 220);
  }

  function pararChuvaDeCoracoes() {
    clearInterval(chuvaInterval);
    chuvaInterval = null;
  }

  function revelarSurpresa() {
    iniciarChuvaDeCoracoes();
    const linha1 = document.getElementById('surprise-line-1');
    const linha2 = document.getElementById('surprise-line-2');
    const assinatura = document.getElementById('surprise-signature');
    const fromTo = document.getElementById('surprise-fromto');

    setTimeout(() => linha1.classList.add('show'), 300);
    setTimeout(() => linha2.classList.add('show'), 1400);
    setTimeout(() => assinatura.classList.add('show'), 2600);
    setTimeout(() => fromTo.classList.add('show'), 3600);

    // Transição suave para a tela final secreta
    setTimeout(() => {
      pararChuvaDeCoracoes();
      goToScreen(13);
    }, 7200);
  }

  /* ------------------------------------------------------------------
     TELA 13 — FINAL SECRETO: foto especial + música novamente no segundo 48
     ------------------------------------------------------------------ */
  function revelarFinal() {
    tocarMusicaDoSegundo48();

    const foto = document.getElementById('final-photo');
    const texto1 = document.getElementById('final-text-1');
    const coracaoFinal = document.getElementById('final-heart');
    const texto2 = document.getElementById('final-text-2');

    setTimeout(() => foto.classList.add('show'), 200);
    setTimeout(() => texto1.classList.add('show'), 1000);
    setTimeout(() => coracaoFinal.classList.add('show'), 2200);
    setTimeout(() => texto2.classList.add('show'), 3000);
  }

  /* ------------------------------------------------------------------
     GATILHOS POR TELA
     Centraliza o que deve acontecer sempre que uma tela é exibida.
     ------------------------------------------------------------------ */
  function onEnterScreen(n) {
    switch (n) {
      case 2:
        tocarMusicaDoSegundo48();
        break;
      case 5:
        iniciarContador();
        break;
      case 6:
        iniciarGaleria();
        break;
      case 7:
        resetarBotaoNao();
        break;
      case 12:
        revelarSurpresa();
        break;
      case 13:
        revelarFinal();
        break;
      default:
        break;
    }

    // Para a galeria automaticamente quando o usuário sai da tela 6
    if (n !== 6) pararGaleria();
  }

  /* ------------------------------------------------------------------
     FUNDO ANIMADO — partículas suaves em forma de corações e pontos
     Desenhado em canvas para ficar leve e fluido em qualquer tela.
     ------------------------------------------------------------------ */
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function criarParticulas() {
    const quantidade = Math.floor((window.innerWidth * window.innerHeight) / 22000);
    particles = Array.from({ length: quantidade }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: 1.5 + Math.random() * 2.5,
      speedY: 0.15 + Math.random() * 0.35,
      drift: (Math.random() - 0.5) * 0.3,
      opacity: 0.15 + Math.random() * 0.35,
      isHeart: Math.random() > 0.82,
    }));
  }

  function desenharCoracao(x, y, tamanho, opacity) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(tamanho / 10, tamanho / 10);
    ctx.beginPath();
    ctx.moveTo(0, 3);
    ctx.bezierCurveTo(-5, -3, -10, 1, 0, 8);
    ctx.bezierCurveTo(10, 1, 5, -3, 0, 3);
    ctx.fillStyle = `rgba(224, 170, 255, ${opacity})`;
    ctx.fill();
    ctx.restore();
  }

  function animarFundo() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p) => {
      p.y -= p.speedY;
      p.x += p.drift;

      if (p.y < -20) {
        p.y = canvas.height + 20;
        p.x = Math.random() * canvas.width;
      }

      if (p.isHeart) {
        desenharCoracao(p.x, p.y, p.r * 4, p.opacity);
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(157, 78, 221, ${p.opacity})`;
        ctx.fill();
      }
    });

    requestAnimationFrame(animarFundo);
  }

  resizeCanvas();
  criarParticulas();
  window.addEventListener('resize', () => {
    resizeCanvas();
    criarParticulas();
  });

  if (!prefersReducedMotion) {
    animarFundo();
  } else {
    // Ainda desenha o fundo uma vez, só não anima continuamente
    animarFundo();
  }

})();
