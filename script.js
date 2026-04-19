
const form = document.getElementById('search-form');
const input = document.getElementById('search-input');
const wordEl = document.getElementById('word');
const phoneticEl = document.getElementById('phonetic');
const audioEl = document.getElementById('audio');
const definitionsEl = document.getElementById('definitions');
const synonymsEl = document.getElementById('synonyms');
const errorMessageEl = document.getElementById('error-message');

const API_URL = "https://api.dictionaryapi.dev/api/v2/entries/en/";

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const query = input.value.trim();

  // Clear previous results
  wordEl.textContent = "";
  phoneticEl.textContent = "";
  audioEl.src = "";
  audioEl.classList.add('hidden');
  definitionsEl.innerHTML = "";
  synonymsEl.innerHTML = "";
  errorMessageEl.classList.add('hidden');
  errorMessageEl.textContent = "";

  if (!query) {
    showError("Please enter a word.");
    return;
  }

  try {
    const response = await fetch(API_URL + query);
    if (!response.ok) throw new Error("Word not found");
    const data = await response.json();
    displayWordData(data[0]);
  } catch (error) {
    showError(error.message);
  }
});

function displayWordData(data) {
  wordEl.textContent = data.word;
  phoneticEl.textContent = data.phonetic || "";

  if (data.phonetics && data.phonetics.length > 0 && data.phonetics[0].audio) {
    audioEl.src = data.phonetics[0].audio;
    audioEl.classList.remove('hidden');
  }

  // Display definitions
  data.meanings.forEach(meaning => {
    const part = document.createElement('h3');
    part.textContent = meaning.partOfSpeech;
    definitionsEl.appendChild(part);

    meaning.definitions.forEach(def => {
      const defEl = document.createElement('p');
      defEl.classList.add('definition');
      defEl.textContent = def.definition;
      definitionsEl.appendChild(defEl);

      if (def.example) {
        const exampleEl = document.createElement('p');
        exampleEl.classList.add('example');
        exampleEl.textContent = `Example: ${def.example}`;
        definitionsEl.appendChild(exampleEl);
      }
    });

    if (meaning.synonyms && meaning.synonyms.length > 0) {
      const synTitle = document.createElement('p');
      synTitle.textContent = "Synonyms: ";
      synonymsEl.appendChild(synTitle);

      meaning.synonyms.forEach(syn => {
        const synEl = document.createElement('span');
        synEl.classList.add('synonym');
        synEl.textContent = syn + ", ";
        synonymsEl.appendChild(synEl);
      });
    }
  });
}

function showError(msg) {
  errorMessageEl.textContent = msg;
  errorMessageEl.classList.remove('hidden');
}
