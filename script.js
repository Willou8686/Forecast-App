// Navigation entre les pages
function goToPage(pageId) {
  const pages = document.querySelectorAll('.page');
  pages.forEach(page => page.classList.remove('active'));
  const targetPage = document.getElementById(pageId);
  if (targetPage) {
    targetPage.classList.add('active');
  }
}

// Charger le fichier à l'étape 1
function processFile() {
  const fileInput = document.getElementById('fileInput');
  const file = fileInput.files[0];

  if (!file) {
    alert("Veuillez sélectionner un fichier.");
    return;
  }

  // Vérification du format
  const allowedExtensions = ['csv', 'xlsx'];
  const fileExtension = file.name.split('.').pop().toLowerCase();
  if (!allowedExtensions.includes(fileExtension)) {
    alert("Veuillez sélectionner un fichier CSV ou Excel.");
    return;
  }

  alert(`Fichier ${file.name} chargé avec succès.`);
  document.getElementById('nextToPage2').disabled = false;
}

// Afficher ou masquer le formulaire d'augmentation de prix (Étape 3)
function showPriceIncreaseForm(show) {
  const form = document.getElementById('priceIncreaseForm');
  form.style.display = show ? 'block' : 'none';
  if (show) generateSkuTable();
}

// Générer dynamiquement la table des SKU à l'étape 3
function generateSkuTable() {
  const skuTableBody = document.querySelector('#skuTable tbody');
  skuTableBody.innerHTML = '';
  const salesData = [
    { sku_blended_emea: 'SKU001' },
    { sku_blended_emea: 'SKU002' },
    { sku_blended_emea: 'SKU003' },
  ];

  const skuSet = new Set(salesData.map(item => item.sku_blended_emea));
  skuSet.forEach(sku => {
    const row = document.createElement('tr');

    const skuCell = document.createElement('td');
    skuCell.textContent = sku;
    row.appendChild(skuCell);

    const percentCell = document.createElement('td');
    const percentInput = document.createElement('input');
    percentInput.type = 'number';
    percentInput.step = '0.01';
    percentInput.placeholder = '% Augmentation';
    percentCell.appendChild(percentInput);
    row.appendChild(percentCell);

    const monthCell = document.createElement('td');
    const monthInput = document.createElement('input');
    monthInput.type = 'month';
    monthCell.appendChild(monthInput);
    row.appendChild(monthCell);

    skuTableBody.appendChild(row);
  });
}

// Sauvegarder les augmentations de prix (Étape 3)
function savePriceIncrease() {
  const inputs = document.querySelectorAll('#skuTable tbody tr');
  const priceIncreaseData = Array.from(inputs).map(row => {
    const sku = row.children[0].textContent;
    const percentInput = row.children[1].querySelector('input');
    const monthInput = row.children[2].querySelector('input');

    return {
      sku,
      increasePercent: parseFloat(percentInput.value) || 0,
      effectiveMonth: monthInput.value || null,
    };
  });

  console.log('Augmentations de prix sauvegardées :', priceIncreaseData);
  alert('Augmentations de prix enregistrées avec succès !');
}
// Gestion de l'importation de fichier
function handleFileImport(event) {
  const fileInput = event.target;
  const fileNameContainer = document.getElementById('file-name-container');
  const fileNameText = document.getElementById('file-name');

  if (fileInput.files && fileInput.files[0]) {
    // Affiche le nom du fichier sélectionné
    fileNameText.textContent = fileInput.files[0].name;
    fileNameContainer.classList.remove('hidden');
  }
}

// Gestion du glisser-déposer
const dropZone = document.getElementById('file-drop-zone');
dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropZone.style.backgroundColor = '#eef7ff';
});

dropZone.addEventListener('dragleave', () => {
  dropZone.style.backgroundColor = '#f9f9f9';
});

dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropZone.style.backgroundColor = '#f9f9f9';

  const fileInput = document.getElementById('fileInput');
  fileInput.files = e.dataTransfer.files;
  handleFileImport({ target: fileInput });
});
// Données des SKU (remplacez par les données réelles du fichier importé à l'étape 1)
const skuData = [
  { name: "SKU 1", id: "sku1" },
  { name: "SKU 2", id: "sku2" },
  { name: "SKU 3", id: "sku3" }
];

// Générer dynamiquement les cartes SKU
function renderSKUCards() {
  const container = document.getElementById('skuContainer');
  container.innerHTML = ''; // Réinitialiser le conteneur

  skuData.forEach((sku) => {
    const card = document.createElement('div');
    card.classList.add('sku-card');
    card.innerHTML = `
      <h4>${sku.name}</h4>
      <label for="${sku.id}_increase">Augmentation (%)</label>
      <input type="number" id="${sku.id}_increase" placeholder="0" onchange="updateSummary('${sku.id}')">
      <label for="${sku.id}_month">Mois d'entrée</label>
      <select id="${sku.id}_month" onchange="updateSummary('${sku.id}')">
        <option value="">Sélectionnez un mois</option>
        <option value="Janvier">Janvier</option>
        <option value="Février">Février</option>
        <option value="Mars">Mars</option>
        <option value="Avril">Avril</option>
        <option value="Mai">Mai</option>
        <option value="Juin">Juin</option>
        <option value="Juillet">Juillet</option>
        <option value="Août">Août</option>
        <option value="Septembre">Septembre</option>
        <option value="Octobre">Octobre</option>
        <option value="Novembre">Novembre</option>
        <option value="Décembre">Décembre</option>
      </select>
    `;
    container.appendChild(card);
  });
}

// Mettre à jour le tableau récapitulatif
function updateSummary(skuId) {
  const increase = document.getElementById(`${skuId}_increase`).value || 0;
  const month = document.getElementById(`${skuId}_month`).value || "Non spécifié";

  const summaryBody = document.getElementById('summaryBody');
  const existingRow = document.querySelector(`#row-${skuId}`);
  if (existingRow) {
    // Mettre à jour une ligne existante
    existingRow.innerHTML = `
      <td>${skuId}</td>
      <td>${increase} %</td>
      <td>${month}</td>
    `;
  } else {
    // Ajouter une nouvelle ligne
    const row = document.createElement('tr');
    row.id = `row-${skuId}`;
    row.innerHTML = `
      <td>${skuId}</td>
      <td>${increase} %</td>
      <td>${month}</td>
    `;
    summaryBody.appendChild(row);
  }
}

// Fonction de finalisation (placeholder pour le moment)
function finalizeForecast() {
  alert('Prévision finalisée !');
}

// Appel initial pour rendre les cartes SKU
renderSKUCards();