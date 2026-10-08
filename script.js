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
const form = document.getElementById('request-form');
const submitButton = document.getElementById('submit-button');
let submitting = false;
form.querySelectorAll('input, textarea').forEach(field => {
  field.addEventListener('input', () => { field.setCustomValidity(''); document.getElementById('form-status').textContent = ''; });
});
form.addEventListener('submit', async event => {
  event.preventDefault();
  if (submitting) return;
  const fields = [...form.querySelectorAll('input, textarea')];
  for (const field of fields) {
    const minimum = field.id === 'description' ? 10 : field.id === 'contact-method' ? 3 : 1;
    field.setCustomValidity(field.value.trim().length < minimum ? 'Заполните поле: минимум ' + minimum + ' символов без пробелов по краям.' : '');
  }
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  fields.forEach(field => data.set(field.name, field.value.trim()));
  const status = document.getElementById('form-status');
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  submitting = true;
  submitButton.disabled = true;
  submitButton.textContent = 'Отправляем…';
  form.setAttribute('aria-busy', 'true');
  status.textContent = 'Отправляем заявку…';
  try {
    const response = await fetch(form.action, {
      method: 'POST',
      body: data,
      headers: { Accept: 'application/json' },
      signal: controller.signal
    });
    if (!response.ok) {
      status.textContent = response.status === 429
        ? 'Слишком много запросов. Подождите немного и попробуйте ещё раз или напишите по email.'
        : 'Не удалось отправить заявку. Попробуйте позже или напишите по email. Ваши данные остались в форме.';
      return;
    }
    form.reset();
    status.textContent = 'Заявка отправлена';
  } catch (error) {
    status.textContent = error.name === 'AbortError'
      ? 'Сервис не ответил вовремя. Отправка не подтверждена. Данные сохранены в форме — попробуйте позже или напишите по email.'
      : 'Не удалось подтвердить отправку. Проверьте подключение к интернету и попробуйте ещё раз. Данные остались в форме.';
  } finally {
    clearTimeout(timeout);
    submitting = false;
    submitButton.disabled = false;
    submitButton.textContent = 'Отправить заявку';
    form.removeAttribute('aria-busy');
  }
});
