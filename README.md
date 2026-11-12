# PW — Conversar, Jogar e Fazer Amizades

<p align="center">
  <img src="assets/images/logo-app.jpg" alt="PW Logo" width="130" style="border-radius: 24px; box-shadow: 0 0 25px rgba(168, 85, 247, 0.5);" />
</p>

<p align="center">
  <strong>O ponto de encontro definitivo para reunir amigos, criar comunidades gamers, conversar por voz com ultra-baixa latência e realizar streaming em 1080p 60fps.</strong>
</p>

<p align="center">
  <a href="https://coprivacy.github.io/PW-site-oficial/"><strong>Acessar Site Oficial Online</strong></a> •
  <a href="#recursos-principais">Recursos</a> •
  <a href="#robo-mascote-oficial">Mascote</a> •
  <a href="#como-ativar-o-github-pages">GitHub Pages</a> •
  <a href="#licenca">Licença</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-100%25%20Online-brightgreen?style=for-the-badge" alt="Status">
  <img src="https://img.shields.io/badge/Versao-2.4.0-8b5cf6?style=for-the-badge" alt="Versão">
  <img src="https://img.shields.io/badge/SSL%2FTLS%201.3-256--Bit-10b981?style=for-the-badge" alt="SSL/TLS 1.3">
  <img src="https://img.shields.io/badge/Licenca-MIT-purple?style=for-the-badge" alt="MIT">
</p>

---

## Sobre o PW

O **PW** é uma plataforma moderna no estilo Discord com tema exclusivo em **Preto Profundo, Roxo Neon e Vermelho Carmesim**, criada especialmente para comunidades de games, grupos de estudos e amigos que desejam um ambiente rápido, leve e sem propagandas.

Construído com foco em segurança com **Certificado SSL/TLS 1.3 de 256-Bits (Let's Encrypt / GitHub Secure)**, o PW coloca a privacidade do usuário em primeiro lugar, oferecendo servidores criptografados e sem comercialização de dados pessoais. Mantido por **[COprivacy](https://github.com/COprivacy)**.

---

## Recursos Principais

- **Canais de Voz de Alta Fidelidade (Codec Opus)**: Conexões de áudio cristalinas com latência média entre 12ms e 15ms.
- **Canais de Texto Organizados**: Estrutura por tópicos (jogos, resenha, clipes, anúncios) sem poluir o chat geral.
- **Transmissão Gamer em 1080p 60fps**: Compartilhe sua tela e gameplays em tempo real sem travamentos.
- **Robô Mascote Oficial Integrado**: Moderação automática contra spam, boas-vindas e DJ de música.
- **Super Leve**: Otimizado para consumir menos de 10% da memória RAM em comparação com apps convencionais.
- **Experiência Multiplataforma**: Disponível para Windows, Android, iOS, macOS, Linux e versão Web direta.
- **Efeitos Sonoros Interativos**: Simulador web com sintetizador Web Audio API e feedback auditivo realista.
- **Design System Profissional**: 100% com ícones vetoriais SVG escaláveis.

---

## Robo Mascote Oficial

<p align="center">
  <img src="assets/images/mascot-robot.jpg" alt="Mascote Robô PW" width="300" style="border-radius: 20px; box-shadow: 0 0 30px rgba(168, 85, 247, 0.4);" />
</p>

O robô gamer estilizado com headset neon roxo e moletom do PW é o mascote e guia da plataforma. Ele atua dentro dos servidores com comandos divertidos, automações e segurança comunitária.

---

## Estrutura de Arquivos do Projeto

```text
PW-site-oficial/
├── assets/
│   ├── css/
│   │   └── style.css            # Folha de estilo completa com tema Neon Roxo, utilitários SVG e Discord Mockup
│   ├── js/
│   │   └── main.js              # Simulador interativo do cliente PW, Web Audio e animações
│   └── images/
│       ├── favicon.png          # Ícone favicon
│       ├── logo-app.jpg         # Logo oficial com fone e balão de chat
│       ├── logo-pw.jpg          # Logo futurista PW com swoosh
│       └── mascot-robot.jpg     # Foto 3D do Robô Mascote Oficial
├── favicon.ico                  # Favicon para navegadores
├── index.html                   # Página inicial completa (Landing Page Oficial)
├── .nojekyll                    # Configuração para ignorar parser Jekyll do GitHub Pages
├── LICENSE                      # Licença de código aberto
└── README.md                    # Documentação do projeto
```

---

## Como Ativar o GitHub Pages

Para publicar este site no seu repositório oficial do GitHub:

1. Acesse o seu repositório: **[https://github.com/COprivacy/PW-site-oficial](https://github.com/COprivacy/PW-site-oficial)**
2. Clique na aba **Settings** (Configurações) no topo.
3. No menu lateral esquerdo, clique em **Pages**.
4. Em **Build and deployment** > **Source**, selecione:
   - **Deploy from a branch**
   - Branch: **`main`**
   - Pasta: **`/ (root)`**
5. Clique em **Save**.
6. Em cerca de 1 a 2 minutos, seu site estará no ar no endereço:
   **`https://coprivacy.github.io/PW-site-oficial/`**

---

## Testando Localmente

Para abrir o site no seu computador:

1. Dê um duplo clique no arquivo `index.html` para abrir diretamente no navegador.
2. Ou inicie um servidor local leve:
   ```bash
   python -m http.server 8000
   ```
   E abra no navegador em `http://localhost:8000`.

---

## COprivacy

Desenvolvido e mantido pela organização **[COprivacy](https://github.com/COprivacy)**.
Todos os direitos reservados © 2026.
