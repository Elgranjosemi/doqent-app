// ID de tu hoja de cálculo
const SHEET_ID = '2PACX-1vR928bVQBOt9Oc2FZnT3ijUycCCRqc7DWP0ptiiJDUC6nVCNy9Tsx8LeJvesKmBvXRINOUdpXknH7lJ';

// URL para leer la hoja de compañeros
const COMPANIONS_URL = `https://docs.google.com/spreadsheets/d/e/${SHEET_ID}/pub?gid=0&single=true&output=csv`;

// Función para leer compañeros desde Google Sheets
async function loadCompanionsFromSheet() {
  try {
    const response = await fetch(COMPANIONS_URL);
    const text = await response.text();
    const rows = text.split('\n').slice(1); // Saltamos encabezado

    companions = [];
    rows.forEach(row => {
      const [nombre_completo, cargo_o_rol] = row.split(',');
      if (nombre_completo) {
        companions.push({ nombre_completo, cargo_o_rol });
      }
    });

    // Guardar en localStorage también
    localStorage.setItem('companions', JSON.stringify(companions));
    loadCompanionsInForm();
  } catch (error) {
    console.error('Error al leer compañeros:', error);
  }
}

// Cargar compañeros al iniciar
window.onload = () => {
  loadCompanionsFromSheet();
};