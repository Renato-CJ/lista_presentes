const API_URL = 'http://localhost:3000';

function entrar() {
  const nome = document.getElementById('nomeUsuario').value.trim();
  if (!nome) return alert("Digite seu nome!");

  localStorage.setItem('usuario', nome);
  document.getElementById('login-area').style.display = 'none';
  document.getElementById('app').style.display = 'block';
  document.getElementById('nomeExibido').textContent = `Olá, ${nome}!`;

  carregarPresentes();
}

function sair() {
  localStorage.removeItem('usuario');
  location.reload();
}

async function carregarPresentes() {
  try {
    const res = await fetch(`${API_URL}/presentes`);
    const presentes = await res.json();

    const lista = document.getElementById('listaPresentes');
    lista.innerHTML = '';

    if (presentes.length === 0) {
      lista.innerHTML = '<p>Nenhum presente adicionado ainda 😢</p>';
      return;
    }

    presentes.forEach(p => {
      const div = document.createElement('div');
      div.className = 'presente' + (p.recebido ? ' recebido' : '');
      div.innerHTML = `
        <h4>${p.nome}</h4>
        <p>${p.desc}</p>
        ${p.link ? `<a href="${p.link}" target="_blank">Ver mais</a><br>` : ''}
        ${p.img ? `<img src="${p.img}" />` : ''}
        <button onclick="alternarRecebido(${p.id})">
          ${p.recebido ? 'Desmarcar' : 'Marcar'} como recebido
        </button>
      `;
      lista.appendChild(div);
    });
  } catch (e) {
    console.error(e);
    alert("Erro ao carregar presentes");
  }
}

async function adicionarPresente() {
  const nome = document.getElementById('nome').value.trim();
  const desc = document.getElementById('desc').value.trim();
  const link = document.getElementById('link').value.trim();
  const img = document.getElementById('img').value.trim();

  if (!nome || !desc) return alert("Preencha nome e descrição!");

  await fetch(`${API_URL}/presentes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome, desc, link, img })
  });

  document.getElementById('nome').value = '';
  document.getElementById('desc').value = '';
  document.getElementById('link').value = '';
  document.getElementById('img').value = '';

  carregarPresentes();
}

async function alternarRecebido(id) {
  await fetch(`${API_URL}/presentes/${id}`, { method: 'PUT' });
  carregarPresentes();
}

// Auto-login se já tiver salvo
window.onload = () => {
  const nome = localStorage.getItem('usuario');
  if (nome) {
    document.getElementById('login-area').style.display = 'none';
    document.getElementById('app').style.display = 'block';
    document.getElementById('nomeExibido').textContent = `Olá, ${nome}!`;
    carregarPresentes();
  }
};
