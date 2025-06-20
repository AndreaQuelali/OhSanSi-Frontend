export function saveFieldToLocalStorage(field: string, value: string | number) {
  const savedData = localStorage.getItem('participantData');
  const formData = savedData ? JSON.parse(savedData) : { olimpista: {} };
  formData.olimpista[field] = value;
  localStorage.setItem('participantData', JSON.stringify(formData));
}
