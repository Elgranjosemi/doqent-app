// Base de datos local con localStorage
let deliveries = JSON.parse(localStorage.getItem('deliveries')) || [];
let companions = JSON.parse(localStorage.getItem('companions')) || [];

// Función para guardar datos
function saveData() {
  localStorage.setItem('deliveries', JSON.stringify(deliveries));
  localStorage.setItem('companions', JSON.stringify(companions));
}

// Cargar compañeros en el select
function loadCompanionsInForm() {
  const select = document.getElementById('persona_entrega');
  if (!select) return;

  select.innerHTML = '';
  companions.forEach((comp, idx) => {
    const option = document.createElement('option');
    option.value = comp.nombre_completo;
    option.textContent = comp.nombre_completo;
    select.appendChild(option);
  });
}

// Cargar compañeros en el filtro
function loadCompanionsInFilter() {
  const select = document.getElementById('filtroCompanero');
  if (!select) return;

  select.innerHTML = '<option value="">Todos los compañeros</option>';
  companions.forEach((comp, idx) => {
    const option = document.createElement('option');
    option.value = comp.nombre_completo;
    option.textContent = comp.nombre_completo;
    select.appendChild(option);
  });
}

// Inicializar firma
let signaturePad;
if (document.getElementById('signatureCanvas')) {
  const canvas = document.getElementById('signatureCanvas');
  signaturePad = new SignaturePad(canvas);

  document.getElementById('clearSignature').addEventListener('click', () => {
    signaturePad.clear();
  });
}

// Registrar compañero
document.getElementById('companionForm')?.addEventListener('submit', (e) => {
  e.preventDefault();

  const companion = {
    nombre_completo: document.getElementById('nombre_completo').value,
    cargo_o_rol: document.getElementById('cargo_o_rol').value,
  };

  companions.push(companion);
  saveData();

  alert('Compañero agregado');
  document.getElementById('companionForm').reset();
  loadCompanionsInForm();
  loadCompanionsInFilter();
  renderCompanionsList();
});

// Registrar entrega
document.getElementById('deliveryForm')?.addEventListener('submit', (e) => {
  e.preventDefault();

  const delivery = {
    producto_entregado: document.getElementById('producto_entregado').value,
    comunidad_empresa: document.getElementById('comunidad_empresa').value,
    fecha_entrega: document.getElementById('fecha_entrega').value,
    nombre_receptor: document.getElementById('nombre_receptor').value,
    persona_entrega: document.getElementById('persona_entrega').value,
    firma_receptor: signaturePad.toDataURL(), // Imagen de la firma
    timestamp_registro: new Date().toISOString(),
  };

  deliveries.push(delivery);
  saveData();

  alert('Entrega registrada');
  document.getElementById('deliveryForm').reset();
  signaturePad.clear();
});

// Mostrar compañeros en lista
function renderCompanionsList() {
  const container = document.getElementById('companionsList');
  if (!container) return;

  container.innerHTML = '<h3>Compañeros registrados:</h3>';
  companions.forEach((comp, idx) => {
    const div = document.createElement('div');
    div.textContent = `${comp.nombre_completo} - ${comp.cargo_o_rol}`;
    container.appendChild(div);
  });
}

// Mostrar historial de entregas
function renderHistory() {
  const container = document.getElementById('deliveryList');
  if (!container) return;

  container.innerHTML = '';

  deliveries.forEach((delivery, idx) => {
    const div = document.createElement('div');
    div.innerHTML = `
      <h3>${delivery.producto_entregado}</h3>
      <p><strong>Comunidad/Empresa:</strong> ${delivery.comunidad_empresa}</p>
      <p><strong>Fecha:</strong> ${new Date(delivery.fecha_entrega).toLocaleString()}</p>
      <p><strong>Receptor:</strong> ${delivery.nombre_receptor}</p>
      <p><strong>Entrega:</strong> ${delivery.persona_entrega}</p>
      <img src="${delivery.firma_receptor}" alt="Firma" width="200">
      <button onclick="generatePDF(${idx})">Generar PDF</button>
    `;
    container.appendChild(div);
  });
}

// Generar PDF de entrega
function generatePDF(index) {
  const delivery = deliveries[index];
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text('COMPROBANTE DE ENTREGA DOQENT', 10, 10);

  doc.setFontSize(12);
  doc.text(`Producto: ${delivery.producto_entregado}`, 10, 30);
  doc.text(`Comunidad/Empresa: ${delivery.comunidad_empresa}`, 10, 40);
  doc.text(`Fecha de Entrega: ${new Date(delivery.fecha_entrega).toLocaleString()}`, 10, 50);
  doc.text(`Nombre del Receptor: ${delivery.nombre_receptor}`, 10, 60);
  doc.text(`Persona que Entrega: ${delivery.persona_entrega}`, 10, 70);
  doc.text(`Fecha de Registro: ${new Date(delivery.timestamp_registro).toLocaleString()}`, 10, 80);

  // Agregar firma
  const img = new Image();
  img.src = delivery.firma_receptor;
  img.onload = () => {
    doc.addImage(img, 'PNG', 10, 90, 100, 40);
    doc.save(`Doqent-${delivery.fecha_entrega}.pdf`);
  };
}

// Filtrar historial
document.getElementById('searchBox')?.addEventListener('input', filterHistory);
document.getElementById('startDate')?.addEventListener('change', filterHistory);
document.getElementById('endDate')?.addEventListener('change', filterHistory);
document.getElementById('filtroCompanero')?.addEventListener('change', filterHistory);

function filterHistory() {
  const search = document.getElementById('searchBox').value.toLowerCase();
  const startDate = document.getElementById('startDate').value;
  const endDate = document.getElementById('endDate').value;
  const companion = document.getElementById('filtroCompanero').value;

  const filtered = deliveries.filter(d => {
    const matchesSearch = d.producto_entregado.toLowerCase().includes(search) || d.comunidad_empresa.toLowerCase().includes(search);
    const matchesStart = !startDate || new Date(d.fecha_entrega) >= new Date(startDate);
    const matchesEnd = !endDate || new Date(d.fecha_entrega) <= new Date(endDate);
    const matchesCompanion = !companion || d.persona_entrega === companion;

    return matchesSearch && matchesStart && matchesEnd && matchesCompanion;
  });

  renderFilteredHistory(filtered);
}

function renderFilteredHistory(list) {
  const container = document.getElementById('deliveryList');
  if (!container) return;

  container.innerHTML = '';
  if (list.length === 0) {
    container.innerHTML = '<p>No se encontraron entregas.</p>';
    return;
  }

  list.forEach((delivery, idx) => {
    const div = document.createElement('div');
    div.innerHTML = `
      <h3>${delivery.producto_entregado}</h3>
      <p><strong>Comunidad/Empresa:</strong> ${delivery.comunidad_empresa}</p>
      <p><strong>Fecha:</strong> ${new Date(delivery.fecha_entrega).toLocaleString()}</p>
      <p><strong>Receptor:</strong> ${delivery.nombre_receptor}</p>
      <p><strong>Entrega:</strong> ${delivery.persona_entrega}</p>
      <img src="${delivery.firma_receptor}" alt="Firma" width="200">
      <button onclick="generatePDF(${deliveries.indexOf(delivery)})">Generar PDF</button>
    `;
    container.appendChild(div);
  });
}

// Inicializar al cargar
window.onload = () => {
  loadCompanionsInForm();
  loadCompanionsInFilter();
  renderCompanionsList();
  renderHistory();
};