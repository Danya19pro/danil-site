'use strict';

// МЕНЯЙТЕ ЦЕНУ И КОНТАКТЫ ЗДЕСЬ. Пустые контакты не показываются.
const SETTINGS = {
  price: '3 000 ₽',
  email: 'danyasima48@gmail.com', // Адрес для заявок
  telegram: '',               // Ваш username без @
  phone: ''                   // Например: +7 (999) 123-45-67
};

document.querySelectorAll('[data-price]').forEach(el => { el.textContent = SETTINGS.price; });
document.getElementById('year').textContent = new Date().getFullYear();
const links = document.getElementById('contact-links');
const addContact = (text, href) => {
  if (links.querySelector('.contact-placeholder')) links.replaceChildren();
  const a = document.createElement('a');
  a.textContent = text;
  a.href = href;
  links.append(a);
};
if (SETTINGS.email) addContact(SETTINGS.email, 'mailto:' + SETTINGS.email);
if (SETTINGS.telegram) {
  const username = SETTINGS.telegram.trim().replace(/^@/, '');
  addContact('@' + username, 'https://t.me/' + encodeURIComponent(username));
}
if (SETTINGS.phone) addContact(SETTINGS.phone, 'tel:' + SETTINGS.phone.replace(/[^+\d]/g, ''));
if (SETTINGS.email) {
  document.getElementById('submit-button').textContent = 'Подготовить письмо';
  document.getElementById('form-note').textContent = 'Откроется ваша почтовая программа с готовой заявкой. Проверьте письмо и нажмите «Отправить» в ней.';
}
const form = document.getElementById('request-form');
form.querySelectorAll('input, textarea').forEach(field => {
  field.addEventListener('input', () => { field.setCustomValidity(''); document.getElementById('form-status').textContent = ''; });
});
form.addEventListener('submit', event => {
  event.preventDefault();
  const fields = [...form.querySelectorAll('input, textarea')];
  for (const field of fields) {
    const minimum = field.id === 'description' ? 10 : field.id === 'contact-method' ? 3 : 1;
    field.setCustomValidity(field.value.trim().length < minimum ? 'Заполните поле: минимум ' + minimum + ' символов без пробелов по краям.' : '');
  }
  if (!form.reportValidity()) return;
  const body = 'Заявка на создание сайта\n\nИмя: ' + fields[0].value.trim() + '\nСпособ связи: ' + fields[1].value.trim() + '\n\nОписание задачи:\n' + fields[2].value.trim();
  const status = document.getElementById('form-status');
  if (SETTINGS.email) {
    window.location.href = 'mailto:' + SETTINGS.email + '?subject=' + encodeURIComponent('Заявка на создание сайта') + '&body=' + encodeURIComponent(body);
    status.textContent = 'Заявка подготовлена. Для отправки подтвердите письмо в почтовой программе. Если она не открылась, напишите по контактам слева.';
  } else {
    const url = URL.createObjectURL(new Blob(['\uFEFF' + body], { type: 'text/plain;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url; a.download = 'Заявка-на-сайт.txt';
    document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    status.textContent = 'Файл заявки подготовлен для скачивания. Заявка не отправлена — передайте файл исполнителю самостоятельно.';
  }
});
