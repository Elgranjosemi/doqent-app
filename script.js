// URL de tu formulario de Google Forms (con /formResponse al final)
const FORM_URL = 'https://docs.google.com/forms/u/0/d/e/1FAIpQLSebBvCdTwaTTe_89ZDKMkSZidfFfiKPQpZKLNM3RwvlQpRiUw/formResponse';

// IDs de los campos de tu formulario
const FIELD_IDS = {
  producto_entregado: 'entry.1238548678',
  comunidad_empresa: 'entry.971480510',
  fecha_entrega: 'entry.477138169',
  nombre_receptor: 'entry.1093291332',
  persona_entrega: 'entry.2112545665',
  firma_receptor: 'entry.1393363151',
};

// Función para enviar datos al formulario
function submitToGoogleForms(formData) {
  const formBody = new URLSearchParams({
    [FIELD_IDS.producto_entregado]: formData.producto_entregado,
    [FIELD_IDS.comunidad_empresa]: formData.comunidad_empresa,
    [FIELD_IDS.fecha_entrega]: formData.fecha_entrega,
    [FIELD_IDS.nombre_receptor]: formData.nombre_receptor,
    [FIELD_IDS.persona_entrega]: formData.persona_entrega,
    // La firma no se puede enviar directamente
  });

  fetch(FORM_URL, {
    method: 'POST',
    body: formBody,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })
    .then(response => {
      if (response.ok) {
        alert('✅ Entrega registrada correctamente');
      } else {
        alert('❌ Error al guardar la entrega');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('❌ Error al enviar los datos');
    });
}

// Registrar entrega (ahora envía al formulario)
document.getElementById('deliveryForm')?.addEventListener('submit', (e) => {
  e.preventDefault();

  const delivery = {
    producto_entregado: document.getElementById('producto_entregado').value,
    comunidad_empresa: document.getElementById('comunidad_empresa').value,
    fecha_entrega: document.getElementById('fecha_entrega').value,
    nombre_receptor: document.getElementById('nombre_receptor').value,
    persona_entrega: document.getElementById('persona_entrega').value,
    firma_receptor: signaturePad.toDataURL(), // No se envía al formulario
    timestamp_registro: new Date().toISOString(),
  };

  // Enviar al formulario
  submitToGoogleForms(delivery);

  // Guardar localmente también
  deliveries.push(delivery);
  saveToLocalStorage();

  document.getElementById('deliveryForm').reset();
  signaturePad.clear();
});