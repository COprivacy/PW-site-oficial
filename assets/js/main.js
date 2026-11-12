/**
 * PW - Conversar, Jogar e Fazer Amizades
 * JavaScript Interativo & Simulador de Cliente Discord/PW
 */

document.addEventListener('DOMContentLoaded', () => {
  // ----------------------------------------------------
  // 1. Web Audio API - Sintetizador de Efeitos Sonoros
  // ----------------------------------------------------
  let audioCtx = null;
  let isSoundMuted = localStorage.getItem('pw_sound_muted') === 'true';

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  // Desbloqueia o AudioContext no primeiro gesto do usuário em qualquer lugar da tela
  const unlockAudio = () => {
    initAudio();
    document.removeEventListener('click', unlockAudio);
    document.removeEventListener('keydown', unlockAudio);
    document.removeEventListener('touchstart', unlockAudio);
  };
  document.addEventListener('click', unlockAudio);
  document.addEventListener('keydown', unlockAudio);
  document.addEventListener('touchstart', unlockAudio);

  function playSound(type) {
    if (isSoundMuted) return;
    try {
      initAudio();
      if (!audioCtx) return;
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      const now = audioCtx.currentTime;

      if (type === 'message') {
        // Pop duplo característico de mensagem do PW/Discord
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(659.25, now); // E5
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.08); // A5
        gain.gain.setValueAtTime(0.28, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.22);
      } else if (type === 'voice-join') {
        // Acorde harmônico ascendente (Entrada em canal de voz)
        [329.63, 415.30, 493.88].forEach((freq, idx) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          const startTime = now + (idx * 0.07);
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, startTime);
          gain.gain.setValueAtTime(0.24, startTime);
          gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.25);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start(startTime);
          osc.stop(startTime + 0.25);
        });
      } else if (type === 'voice-leave') {
        // Acorde descendente (Saída de canal de voz)
        [493.88, 329.63].forEach((freq, idx) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          const startTime = now + (idx * 0.08);
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, startTime);
          gain.gain.setValueAtTime(0.22, startTime);
          gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.22);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start(startTime);
          osc.stop(startTime + 0.22);
        });
      } else if (type === 'toggle-on') {
        // Confirmação sonora clara ao ativar o som no cabeçalho
        [523.25, 659.25].forEach((freq, idx) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          const startTime = now + (idx * 0.06);
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, startTime);
          gain.gain.setValueAtTime(0.26, startTime);
          gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.18);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start(startTime);
          osc.stop(startTime + 0.18);
        });
      } else if (type === 'click') {
        // Clique nítido de interface
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(700, now);
        osc.frequency.exponentialRampToValueAtTime(250, now + 0.04);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.04);
      }
    } catch (e) {
      console.warn('Audio feedback error:', e);
    }
  }

  // Controle de Mute / Som (Botão Circular Compacto)
  const soundToggleBtn = document.getElementById('soundToggleBtn');
  function updateSoundUI() {
    if (!soundToggleBtn) return;
    if (isSoundMuted) {
      soundToggleBtn.classList.add('muted');
      soundToggleBtn.setAttribute('title', 'Som: Mudo (Clique para ativar)');
      soundToggleBtn.setAttribute('aria-label', 'Som: Mudo (Clique para ativar)');
      soundToggleBtn.innerHTML = `
        <svg class="pw-icon pw-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5L6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
      `;
    } else {
      soundToggleBtn.classList.remove('muted');
      soundToggleBtn.setAttribute('title', 'Som: Ativo (Clique para silenciar)');
      soundToggleBtn.setAttribute('aria-label', 'Som: Ativo (Clique para silenciar)');
      soundToggleBtn.innerHTML = `
        <svg class="pw-icon pw-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
      `;
    }
  }
  if (soundToggleBtn) {
    updateSoundUI();
    soundToggleBtn.addEventListener('click', () => {
      initAudio();
      isSoundMuted = !isSoundMuted;
      localStorage.setItem('pw_sound_muted', isSoundMuted);
      updateSoundUI();
      if (!isSoundMuted) playSound('toggle-on');
    });
  }

  // ----------------------------------------------------
  // 2. Header Scroll Effect & Mobile Drawer
  // ----------------------------------------------------
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      playSound('click');
    });

    // Fechar ao clicar em link
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
    });
  }

  // ----------------------------------------------------
  // 3. Canvas de Estrelas & Luzes Brilhantes Cyber Neon
  // ----------------------------------------------------
  const canvas = document.getElementById('starsCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    // Mais luzes brilhantes distribuídas dinamicamente
    const particleCount = Math.min(Math.floor(width / 9), 160);

    const colors = [
      { r: 239, g: 68, b: 68, hex: '#ef4444' },    // Vermelho Carmesim Neon
      { r: 168, g: 85, b: 247, hex: '#a855f7' },   // Roxo Neon
      { r: 192, g: 132, b: 252, hex: '#c084fc' },  // Roxo Elétrico Claro
      { r: 248, g: 113, b: 113, hex: '#f87171' },  // Coral Carmesim
      { r: 255, g: 255, b: 255, hex: '#ffffff' }   // Branco Estelar
    ];

    for (let i = 0; i < particleCount; i++) {
      const colorObj = colors[Math.floor(Math.random() * colors.length)];
      const isBigGlow = Math.random() < 0.16; // 16% são orbes de luz maiores com aura

      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: isBigGlow ? Math.random() * 3.2 + 2.2 : Math.random() * 1.8 + 0.6,
        baseAlpha: Math.random() * 0.4 + 0.45,
        alpha: 0.6,
        twinkleSpeed: Math.random() * 0.03 + 0.012,
        twinklePhase: Math.random() * Math.PI * 2,
        speedX: (Math.random() - 0.5) * (isBigGlow ? 0.22 : 0.42),
        speedY: (Math.random() - 0.5) * (isBigGlow ? 0.22 : 0.42),
        colorObj: colorObj,
        isBigGlow: isBigGlow
      });
    }

    let frame = 0;
    function animateParticles() {
      frame++;
      ctx.clearRect(0, 0, width, height);

      // Linhas sutis de constelação entre partículas próximas
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distSq = dx * dx + dy * dy;

          if (distSq < 9500) { // dist < ~97px
            const dist = Math.sqrt(distSq);
            const lineAlpha = 0.18 * (1 - dist / 97);
            ctx.beginPath();
            ctx.strokeStyle = `rgba(168, 85, 247, ${lineAlpha})`;
            ctx.lineWidth = 0.7;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Desenhar pontos e esferas de luz brilhantes
      particles.forEach(p => {
        // Pulsação / cintilação individual de cada luz
        p.alpha = p.baseAlpha + Math.sin(frame * p.twinkleSpeed + p.twinklePhase) * 0.35;
        p.alpha = Math.max(0.18, Math.min(1, p.alpha));

        const { r, g, b, hex } = p.colorObj;

        if (p.isBigGlow) {
          // Luz grande com aura radial estelar
          const auraRadius = p.radius * 4;
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, auraRadius);
          grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${p.alpha * 0.85})`);
          grad.addColorStop(0.35, `rgba(${r}, ${g}, ${b}, ${p.alpha * 0.35})`);
          grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
          
          ctx.beginPath();
          ctx.arc(p.x, p.y, auraRadius, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();
        }

        // Ponto central brilhante com sombra neon
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.alpha})`;
        ctx.shadowBlur = p.isBigGlow ? 18 : 9;
        ctx.shadowColor = hex;
        ctx.fill();
        ctx.shadowBlur = 0;

        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;
      });

      requestAnimationFrame(animateParticles);
    }

    animateParticles();
  }

  // ----------------------------------------------------
  // 4. Mascote 3D Interactive Card Tilt
  // ----------------------------------------------------
  const mascotCard = document.querySelector('.hero-mascot-card');
  const mascotInner = document.querySelector('.mascot-frame-inner');

  if (mascotCard && mascotInner) {
    mascotCard.addEventListener('mousemove', (e) => {
      const rect = mascotCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -12;
      const rotateY = ((x - centerX) / centerX) * 12;

      mascotInner.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    mascotCard.addEventListener('mouseleave', () => {
      mascotInner.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  }

  // ----------------------------------------------------
  // 5. Simulador Interativo Discord / PW Client
  // ----------------------------------------------------
  const svgIcons = {
    flame: `<svg class="pw-icon pw-icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>`,
    heart: `<svg class="pw-icon pw-icon-xs pw-icon-purple" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`,
    gamepad: `<svg class="pw-icon pw-icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 12h4m-2-2v4m9-3h.01m3 2h.01"/></svg>`,
    thumbsup: `<svg class="pw-icon pw-icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>`,
    star: `<svg class="pw-icon pw-icon-xs pw-icon-purple" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
    rocket: `<svg class="pw-icon pw-icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/></svg>`,
    music: `<svg class="pw-icon pw-icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`,
    bot: `<svg class="pw-icon pw-icon-xs pw-icon-purple" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/></svg>`
  };

  const channelData = {
    'geral': {
      title: 'geral',
      topic: 'Bem-vindo ao servidor oficial da plataforma PW! Converse sobre tudo.',
      messages: [
        {
          author: 'PW Bot Mascote',
          isBot: true,
          time: 'Hoje às 10:14',
          avatar: 'assets/images/logo-app.jpg',
          text: 'E aí galera! Sejam todos muito bem-vindos ao <strong>PW Oficial</strong>. Aqui você pode conversar com áudio de baixa latência, jogar e conhecer novos amigos!',
          reactions: [{ type: 'flame', count: 18 }, { type: 'heart', count: 24 }]
        },
        {
          author: 'SarahGamer',
          isBot: false,
          time: 'Hoje às 10:16',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
          text: 'Quem topa fechar aquele squad no Valorant mais tarde? A qualidade da sala de voz tá incrível demais sem lag!',
          reactions: [{ type: 'gamepad', count: 9 }]
        },
        {
          author: 'Lucas_Dev',
          isBot: false,
          time: 'Hoje às 10:18',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces',
          text: 'Testei a transmissão de tela em 1080p 60fps agora pouco com a rapaziada, rodou liso sem travar nada.',
          reactions: [{ type: 'thumbsup', count: 11 }]
        }
      ]
    },
    'clipes': {
      title: 'clipes-e-jogos',
      topic: 'Compartilhe suas melhores jogadas, destaques e clipes das suas partidas.',
      messages: [
        {
          author: 'PedroSniper',
          isBot: false,
          time: 'Hoje às 09:40',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces',
          text: 'Olha esse ace clutch no round final ontem à noite! O PW gravou o áudio do squad perfeitinho.',
          reactions: [{ type: 'star', count: 32 }]
        },
        {
          author: 'PW Bot Mascote',
          isBot: true,
          time: 'Hoje às 09:42',
          avatar: 'assets/images/logo-app.jpg',
          text: 'Jogada lendária detectada! Mandou muito bem no clutch!',
          reactions: [{ type: 'flame', count: 15 }]
        }
      ]
    },
    'anuncios': {
      title: 'anuncios',
      topic: 'Novidades oficiais, atualizações de recursos e eventos da comunidade PW.',
      messages: [
        {
          author: 'Equipe PW & COprivacy',
          isBot: true,
          time: 'Ontem às 18:00',
          avatar: 'assets/images/logo-pw.jpg',
          text: '<strong>Atualização 2.4.0 no ar!</strong><br>• Novo mascote robô animado no aplicativo.<br>• Supressão de ruído IA nos canais de voz.<br>• Suporte total a servidores públicos e privados.<br>Obrigado por fazerem parte dessa jornada!',
          reactions: [{ type: 'rocket', count: 142 }, { type: 'heart', count: 98 }]
        }
      ]
    },
    'comandos': {
      title: 'comandos-bot',
      topic: 'Use os comandos do PW Bot para tocar músicas, gerenciar cargos e brincadeiras.',
      messages: [
        {
          author: 'Membro_VIP',
          isBot: false,
          time: 'Hoje às 10:05',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=faces',
          text: '<code>/play synthwave lofi gaming chill</code>',
          reactions: []
        },
        {
          author: 'PW Bot Mascote',
          isBot: true,
          time: 'Hoje às 10:05',
          avatar: 'assets/images/logo-app.jpg',
          text: 'Tocando agora no canal <strong>Música & Resenha</strong>: Synthwave Lofi Beats (Ao Vivo) • [00:00 / 03:45]',
          reactions: [{ type: 'music', count: 7 }]
        }
      ]
    }
  };

  let currentChannelKey = 'geral';
  const chatMessagesEl = document.getElementById('chatMessages');
  const chatHeaderTitleEl = document.getElementById('chatHeaderTitle');
  const chatHeaderTopicEl = document.getElementById('chatHeaderTopic');
  const chatInputField = document.getElementById('chatInputField');
  const chatInputForm = document.getElementById('chatInputForm');
  const typingIndicator = document.getElementById('typingIndicator');
  const voiceCallOverlay = document.getElementById('voiceCallOverlay');
  const voiceChannelTitle = document.getElementById('voiceChannelTitle');
  const disconnectVoiceBtn = document.getElementById('disconnectVoiceBtn');

  function renderMessages(channelKey) {
    if (!chatMessagesEl) return;
    const channel = channelData[channelKey] || channelData['geral'];
    chatMessagesEl.innerHTML = '';

    channel.messages.forEach((msg, idx) => {
      const msgDiv = document.createElement('div');
      msgDiv.className = 'chat-msg';

      const reactionsHtml = msg.reactions && msg.reactions.length > 0
        ? `<div class="msg-reactions">
            ${msg.reactions.map(r => `
              <button class="reaction-pill" data-idx="${idx}">
                ${svgIcons[r.type] || ''}
                <span>${r.count}</span>
              </button>
            `).join('')}
           </div>`
        : '';

      msgDiv.innerHTML = `
        <img class="msg-avatar" src="${msg.avatar}" alt="${msg.author}">
        <div class="msg-content">
          <div class="msg-meta">
            <span class="msg-author">${msg.author}</span>
            ${msg.isBot ? '<span class="msg-badge-bot">BOT</span>' : ''}
            <span class="msg-time">${msg.time}</span>
          </div>
          <div class="msg-text">${msg.text}</div>
          ${reactionsHtml}
        </div>
      `;
      chatMessagesEl.appendChild(msgDiv);
    });

    // Rolar até o fim
    chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;

    // Vincular reações
    chatMessagesEl.querySelectorAll('.reaction-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        playSound('click');
        pill.classList.toggle('reacted');
        const countSpan = pill.querySelectorAll('span')[1];
        let count = parseInt(countSpan.textContent, 10);
        if (pill.classList.contains('reacted')) {
          countSpan.textContent = count + 1;
        } else {
          countSpan.textContent = Math.max(0, count - 1);
        }
      });
    });
  }

  // Troca de Canais de Texto
  document.querySelectorAll('.channel-btn[data-channel]').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-channel');
      if (target === currentChannelKey) return;

      document.querySelectorAll('.channel-btn[data-channel]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      currentChannelKey = target;
      const data = channelData[target];
      if (data) {
        chatHeaderTitleEl.textContent = '#' + data.title;
        chatHeaderTopicEl.textContent = data.topic;
        chatInputField.placeholder = `Conversar em #${data.title}...`;
        renderMessages(target);
        playSound('click');
      }
    });
  });

  // Canais de Voz
  document.querySelectorAll('.channel-btn[data-voice]').forEach(btn => {
    btn.addEventListener('click', () => {
      const voiceName = btn.getAttribute('data-voice');
      playSound('voice-join');

      if (voiceCallOverlay) {
        voiceCallOverlay.style.display = 'flex';
        voiceChannelTitle.textContent = voiceName;
      }

      // Adicionar mensagem avisando que o usuário entrou na call
      const now = new Date();
      const timeStr = `Hoje às ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      channelData[currentChannelKey].messages.push({
        author: 'Sistema PW',
        isBot: true,
        time: timeStr,
        avatar: 'assets/images/logo-pw.jpg',
        text: `<span class="status-indicator-live" style="margin-right: 4px;"></span> <strong>Você</strong> conectou ao canal de voz <strong>${voiceName}</strong> com baixa latência (12ms).`,
        reactions: []
      });
      renderMessages(currentChannelKey);
    });
  });

  if (disconnectVoiceBtn) {
    disconnectVoiceBtn.addEventListener('click', () => {
      playSound('voice-leave');
      if (voiceCallOverlay) {
        voiceCallOverlay.style.display = 'none';
      }
    });
  }

  // Enviar Mensagem Interativa
  if (chatInputForm) {
    chatInputForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = chatInputField.value.trim();
      if (!text) return;

      const now = new Date();
      const timeStr = `Hoje às ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

      // Mensagem do Usuário
      channelData[currentChannelKey].messages.push({
        author: 'Você (Convidado)',
        isBot: false,
        time: timeStr,
        avatar: 'assets/images/mascot-robot.jpg',
        text: escapeHTML(text),
        reactions: [{ type: 'heart', count: 1 }]
      });

      chatInputField.value = '';
      renderMessages(currentChannelKey);
      playSound('message');

      // Simular resposta amigável do Mascote PW
      if (typingIndicator) {
        typingIndicator.textContent = 'PW Bot Mascote está digitando...';
      }

      setTimeout(() => {
        if (typingIndicator) typingIndicator.textContent = '';
        const botResponses = [
          'Fala amigo! Que bom te ver aqui no PW! A plataforma está sempre pronta para jogar e trocar aquela resenha boa!',
          'Curti demais a mensagem! Bora convidar mais amigos para o seu servidor oficial!',
          'O PW está rodando super leve! Você também pode criar cargos exclusivos e bots personalizados.',
          'Partiu jogar! Já estou preparando a playlist na sala de voz!'
        ];
        const randomResp = botResponses[Math.floor(Math.random() * botResponses.length)];

        channelData[currentChannelKey].messages.push({
          author: 'PW Bot Mascote',
          isBot: true,
          time: timeStr,
          avatar: 'assets/images/logo-app.jpg',
          text: randomResp,
          reactions: [{ type: 'bot', count: 3 }, { type: 'star', count: 5 }]
        });

        renderMessages(currentChannelKey);
        playSound('message');
      }, 1400);
    });
  }

  function escapeHTML(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Inicializar mensagens padrão
  renderMessages('geral');

  // ----------------------------------------------------
  // 6. FAQ Accordion
  // ----------------------------------------------------
  document.querySelectorAll('.faq-item').forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        // Fechar outros
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
        if (!isActive) {
          item.classList.add('active');
          playSound('click');
        }
      });
    }
  });

  // ----------------------------------------------------
  // 7. Modal de Download Interativo
  // ----------------------------------------------------
  const downloadModal = document.getElementById('downloadModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalPlatformName = document.getElementById('modalPlatformName');
  const modalDownloadAction = document.getElementById('modalDownloadAction');

  function openDownloadModal(platform) {
    initAudio();
    playSound('click');
    if (modalPlatformName) modalPlatformName.textContent = platform;
    if (downloadModal) downloadModal.classList.add('active');
  }

  function closeDownloadModal() {
    if (downloadModal) downloadModal.classList.remove('active');
  }

  document.querySelectorAll('[data-download-platform]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const platform = btn.getAttribute('data-download-platform') || 'Windows';
      openDownloadModal(platform);
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeDownloadModal);
  if (downloadModal) {
    downloadModal.addEventListener('click', (e) => {
      if (e.target === downloadModal) closeDownloadModal();
    });
  }

  if (modalDownloadAction) {
    modalDownloadAction.addEventListener('click', () => {
      playSound('message');
      modalDownloadAction.innerHTML = '<span>Iniciando Download...</span>';
      setTimeout(() => {
        modalDownloadAction.innerHTML = '<span>Download Concluído! Abrir Instalador</span>';
      }, 1500);
    });
  }

  // ----------------------------------------------------
  // 8. Botão Abrir no Navegador
  // ----------------------------------------------------
  document.querySelectorAll('.btn-open-web').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      playSound('click');
      const demoSec = document.getElementById('demo');
      if (demoSec) {
        demoSec.scrollIntoView({ behavior: 'smooth' });
        // Focar no input
        setTimeout(() => {
          if (chatInputField) chatInputField.focus();
        }, 600);
      }
    });
  });

  // ----------------------------------------------------
  // 9. Gaming Stream Dashboard - Player Interativo (10s Loop)
  // ----------------------------------------------------
  const streamVideo = document.getElementById('streamDemoVideo');
  const streamWrapper = document.getElementById('streamPlayerWrapper');
  const streamPlayToggle = document.getElementById('streamPlayToggle');
  const streamMuteToggle = document.getElementById('streamMuteToggle');
  const streamBigPlayBtn = document.getElementById('streamBigPlayBtn');
  const streamFullscreenBtn = document.getElementById('streamFullscreenBtn');
  const streamSpeaker1 = document.getElementById('streamSpeaker1');
  const streamSpeaker2 = document.getElementById('streamSpeaker2');

  if (streamVideo && streamWrapper) {
    const iconPause = streamPlayToggle ? streamPlayToggle.querySelector('.icon-pause') : null;
    const iconPlay = streamPlayToggle ? streamPlayToggle.querySelector('.icon-play') : null;
    const iconMuted = streamMuteToggle ? streamMuteToggle.querySelector('.icon-muted') : null;
    const iconUnmuted = streamMuteToggle ? streamMuteToggle.querySelector('.icon-unmuted') : null;

    function updatePlayState(isPlaying) {
      if (isPlaying) {
        streamWrapper.classList.remove('paused');
        if (streamBigPlayBtn) streamBigPlayBtn.style.display = 'none';
        if (iconPause) iconPause.style.display = 'block';
        if (iconPlay) iconPlay.style.display = 'none';
        if (streamPlayToggle) streamPlayToggle.title = 'Pausar Transmissão';
      } else {
        streamWrapper.classList.add('paused');
        if (streamBigPlayBtn) streamBigPlayBtn.style.display = 'flex';
        if (iconPause) iconPause.style.display = 'none';
        if (iconPlay) iconPlay.style.display = 'block';
        if (streamPlayToggle) streamPlayToggle.title = 'Reproduzir Transmissão';
      }
    }

    function togglePlay(e) {
      if (e) e.stopPropagation();
      playSound('click');
      if (streamVideo.paused) {
        streamVideo.play();
        updatePlayState(true);
      } else {
        streamVideo.pause();
        updatePlayState(false);
      }
    }

    function toggleMute(e) {
      if (e) e.stopPropagation();
      streamVideo.muted = !streamVideo.muted;
      if (streamVideo.muted) {
        if (iconMuted) iconMuted.style.display = 'block';
        if (iconUnmuted) iconUnmuted.style.display = 'none';
        if (streamMuteToggle) streamMuteToggle.title = 'Ativar Áudio da Live';
        playSound('click');
      } else {
        if (iconMuted) iconMuted.style.display = 'none';
        if (iconUnmuted) iconUnmuted.style.display = 'block';
        if (streamMuteToggle) streamMuteToggle.title = 'Silenciar Áudio';
        playSound('toggle-on');
      }
    }

    function toggleFullscreen(e) {
      if (e) e.stopPropagation();
      playSound('click');
      if (!document.fullscreenElement) {
        if (streamWrapper.requestFullscreen) {
          streamWrapper.requestFullscreen();
        } else if (streamVideo.requestFullscreen) {
          streamVideo.requestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
    }

    if (streamPlayToggle) streamPlayToggle.addEventListener('click', togglePlay);
    if (streamBigPlayBtn) streamBigPlayBtn.addEventListener('click', togglePlay);
    if (streamWrapper) {
      streamWrapper.addEventListener('click', (e) => {
        if (e.target === streamVideo || e.target === streamWrapper) {
          togglePlay(e);
        }
      });
    }

    if (streamMuteToggle) streamMuteToggle.addEventListener('click', toggleMute);
    if (streamFullscreenBtn) streamFullscreenBtn.addEventListener('click', toggleFullscreen);

    streamVideo.addEventListener('play', () => updatePlayState(true));
    streamVideo.addEventListener('pause', () => updatePlayState(false));

    // Animação dos Avatares de Voz (Simulação de conversa em grupo no PW Voice)
    if (streamSpeaker1 && streamSpeaker2) {
      setInterval(() => {
        if (Math.random() > 0.45) {
          streamSpeaker1.classList.toggle('speaking');
          if (streamSpeaker1.classList.contains('speaking')) {
            streamSpeaker2.classList.remove('speaking');
          }
        } else {
          streamSpeaker2.classList.toggle('speaking');
          if (streamSpeaker2.classList.contains('speaking')) {
            streamSpeaker1.classList.remove('speaking');
          }
        }
      }, 2400);
    }

    // Flutuação Orgânica de Espectadores ao Vivo (Live Viewers)
    const streamViewersCount = document.getElementById('streamViewersCount');
    if (streamViewersCount) {
      let currentViewers = 1420;

      function updateLiveViewers() {
        // Variação orgânica entre -8 e +10 espectadores
        const delta = Math.floor(Math.random() * 19) - 8;
        currentViewers += delta;

        // Mantém dentro de uma faixa natural (1.390 a 1.485)
        if (currentViewers < 1390) currentViewers += Math.floor(Math.random() * 9) + 4;
        if (currentViewers > 1485) currentViewers -= Math.floor(Math.random() * 9) + 4;

        // Formatação pt-BR com ponto de milhar (ex: 1.428)
        streamViewersCount.textContent = currentViewers.toLocaleString('pt-BR');

        // Próxima atualização em intervalo variável (entre 2.5s e 5.5s) para parecer 100% humano
        const nextInterval = Math.floor(Math.random() * 3000) + 2500;
        setTimeout(updateLiveViewers, nextInterval);
      }

      // Iniciar após 3 segundos
      setTimeout(updateLiveViewers, 3000);
    }
  }
});

