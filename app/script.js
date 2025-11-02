document.querySelector('form').addEventListener('submit', function(e) {
  e.preventDefault();
  alert('Link gespeichert!');
});

async function loadLinks() {
  const response = await fetch('http://192.168.178.100:3000/api/links');
  const links = await response.json();

  const container = document.getElementById('linkContainer');
  container.innerHTML = '';

  links.forEach(link => {
    const card = document.createElement('div');
    card.className = 'link-card';
    card.innerHTML = `
      <h3>${link.title}</h3>
      <a href="${link.link}" target="_blank">${link.link}</a><br>
      <img src="${link.image}" alt="Vorschaubild" style="max-width:200px;">
    `;
    container.appendChild(card);
  });
}

document.querySelector('form').addEventListener('submit', async function(e) {
  e.preventDefault();

  const title = document.getElementById('title').value;
  const link = document.getElementById('link').value;
  const image = document.getElementById('image').value;

  await fetch('http://192.168.178.100:3000/api/links', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, link, image })
  });

  loadLinks(); // neu laden
  e.target.reset(); // Formular zurücksetzen
});
