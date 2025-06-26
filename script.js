const translations = {
  tr: { inputPlaceholder: 'IP adresi girin...', submitButton: 'Sorgula', errorEmpty: 'Lütfen IP adresi girin.', errorInvalid: 'Geçersiz IP adresi.', errorNetwork: 'Ağ hatası.', errorAPI: 'IP bilgisi alınamadı.' },
  en: { inputPlaceholder: 'Enter IP address...', submitButton: 'Lookup', errorEmpty: 'Please enter IP.', errorInvalid: 'Invalid IP.', errorNetwork: 'Network error.', errorAPI: 'Failed to fetch.' },
  de: { inputPlaceholder: 'IP-Adresse eingeben...', submitButton: 'Suchen', errorEmpty: 'Bitte IP eingeben.', errorInvalid: 'Ungültige IP.', errorNetwork: 'Netzwerkfehler.', errorAPI: 'Fehler beim Abrufen.' },
  ru: { inputPlaceholder: 'Введите IP...', submitButton: 'Поиск', errorEmpty: 'Введите IP.', errorInvalid: 'Неверный IP.', errorNetwork: 'Ошибка сети.', errorAPI: 'Ошибка получения.' },
  fr: { inputPlaceholder: 'Entrez IP...', submitButton: 'Rechercher', errorEmpty: 'Veuillez entrer IP.', errorInvalid: 'IP invalide.', errorNetwork: 'Erreur réseau.', errorAPI: 'Échec de la récupération.' }
};

const ipForm = document.getElementById('ipForm');
const ipInput = document.getElementById('ipInput');
const resultContainer = document.getElementById('resultContainer');
const resultOutput = document.getElementById('resultOutput');
const errorContainer = document.getElementById('errorContainer');
const errorMessage = document.getElementById('errorMessage');
const loadingIndicator = document.getElementById('loadingIndicator');
const copyBtn = document.getElementById('copyBtn');
const clearBtn = document.getElementById('clearBtn');
const formatToggle = document.getElementById('formatToggle');
const langSelect = document.getElementById('languageSelect');

let currentLang = 'tr';
applyLang(currentLang);

langSelect.addEventListener('change', () => {
  currentLang = langSelect.value;
  applyLang(currentLang);
});

function applyLang(lang) {
  const t = translations[lang];
  ipInput.placeholder = t.inputPlaceholder;
  ipForm.querySelector('button').textContent = t.submitButton;
}

ipForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const t = translations[currentLang];
  const ip = ipInput.value.trim();
  if (!ip) return showError(t.errorEmpty);
  if (!/^((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(\\.|$)){4}$/.test(ip)) return showError(t.errorInvalid);

  errorContainer.classList.add('hidden');
  resultContainer.classList.add('hidden');
  loadingIndicator.classList.remove('hidden');

  try {
    const res = await fetch(`https://ipapi.co/${ip}/json/`);
    const data = await res.json();
    loadingIndicator.classList.add('hidden');

    if (!data || data.error || !data.ip) return showError(t.errorAPI);

    const pretty = formatToggle.checked;
    resultOutput.innerHTML = pretty ? `{
  <span class="json-key">"ip"</span>: <span class="json-string">"${data.ip}"</span>,
  <span class="json-key">"country_name"</span>: <span class="json-string">"${data.country_name}"</span>,
  <span class="json-key">"region"</span>: <span class="json-string">"${data.region}"</span>,
  <span class="json-key">"city"</span>: <span class="json-string">"${data.city}"</span>,
  <span class="json-key">"postal"</span>: <span class="json-string">"${data.postal}"</span>,
  <span class="json-key">"latitude"</span>: <span class="json-number">${data.latitude}</span>,
  <span class="json-key">"longitude"</span>: <span class="json-number">${data.longitude}</span>,
  <span class="json-key">"timezone"</span>: <span class="json-string">"${data.timezone}"</span>,
  <span class="json-key">"asn"</span>: <span class="json-string">"${data.asn}"</span>,
  <span class="json-key">"org"</span>: <span class="json-string">"${data.org}"</span>
}` : JSON.stringify(data);
    resultContainer.classList.remove('hidden');
  } catch {
    loadingIndicator.classList.add('hidden');
    showError(t.errorNetwork);
  }
});

function showError(msg) {
  errorMessage.textContent = msg;
  errorContainer.classList.remove('hidden');
  resultContainer.classList.add('hidden');
}

copyBtn.addEventListener('click', () => {
  const temp = document.createElement('textarea');
  temp.value = resultOutput.innerText;
  document.body.appendChild(temp);
  temp.select();
  document.execCommand('copy');
  document.body.removeChild(temp);
  copyBtn.textContent = 'Kopyalandı';
  setTimeout(() => copyBtn.textContent = 'Kopyala', 2000);
});

clearBtn.addEventListener('click', () => {
  ipInput.value = '';
  resultContainer.classList.add('hidden');
  errorContainer.classList.add('hidden');
});