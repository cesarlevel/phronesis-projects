import './style.css';

const app = document.getElementById('app');

async function fetchHTML(url) {
  const response = await fetch(url);
  return response.text();
}

async function main() {
  const debriefs = await fetchHTML(`${window.location.origin}/src/modules/test.html`);
  console.log(debriefs);
  app.innerHTML = debriefs;
}

console.log(import.meta.env.VITE_API_KEY);

main();
