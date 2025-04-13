const parallaxBg = document.getElementById("parallax-bg");

// Обновляем позицию фона при прокрутке
window.addEventListener("scroll", () => {
  const offset = window.pageYOffset;
  parallaxBg.style.transform = `translateY(${offset * 0.5}px)`; // Коэффициент 0.3 настраивает скорость параллакса
});

var end = new Date("08/22/2025 4:0 PM");
var _second = 1000;
var _minute = _second * 60;
var _hour = _minute * 60;
var _day = _hour * 24;
var timer;

function showRemaining() {
  var now = new Date();
  var distance = end - now;

  var days = Math.floor(distance / _day);
  var hours = Math.floor((distance % _day) / _hour);
  var minutes = Math.floor((distance % _hour) / _minute);
  var seconds = Math.floor((distance % _minute) / _second);
  document.getElementById("days").innerHTML = days;
  document.getElementById("hours").innerHTML = hours;
  document.getElementById("minutes").innerHTML = minutes;
  document.getElementById("seconds").innerHTML = seconds;
}

timer = setInterval(showRemaining, 1000);
AOS.init({
  duration: 1000,
  once: true,
});

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

const params = new URLSearchParams(window.location.search);

// Общая фамилия (если есть)
const fm_name = params.get("fm_name");

// Элемент для отдельного отображения фамилии
const fmNameElement = document.querySelector(".fm_name");
if (fmNameElement && fm_name) {
  fmNameElement.textContent = fm_name;
}

// Получаем имена и (возможно) индивидуальные фамилии
const guests = [
  {
    name: params.get("f_name"),
    surname: params.get("f_surname"),
  },
  {
    name: params.get("s_name"),
    surname: params.get("s_surname"),
  },
  {
    name: params.get("t_name"),
    surname: params.get("t_surname"),
  },
  {
    name: params.get("fe_name"),
    surname: params.get("fe_surname"),
  },
].filter((g) => g.name); // Убираем тех, у кого нет имени

// Определим текст "Родная и любимая" или "Родные и любимые"
const prevent = document.querySelector(".prevent");
prevent.textContent =
  guests.length === 1 ? "Родная и Любимая" : "Родные и Любимые";

// Формируем имена с фамилиями
const formattedNames = guests.map((g) => {
  if (g.surname) {
    return `${g.name} ${g.surname}`;
  } else {
    return g.name;
  }
});

// Форматируем финальную строку с "и"
function formatNames(names) {
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} и ${names[1]}`;
  const last = names.pop();
  return `${names.join(", ")} и ${last}`;
}

const finalText = formatNames(formattedNames);

// Показываем на странице
const nameElement = document.querySelector(".guest-names");
if (nameElement) {
  nameElement.textContent = finalText;
}

function formatGuestList(guests) {
  if (guests.length === 1) {
    const g = guests[0];
    return g.surname ? `${g.name} ${g.surname}` : g.name;
  }

  const surnames = guests.map((g) => g.surname).filter(Boolean);
  const uniqueSurnames = [...new Set(surnames)];

  if (uniqueSurnames.length === 1 && uniqueSurnames[0]) {
    // Все с одной фамилией
    const names = guests.map((g) => g.name);
    return `${uniqueSurnames[0]} ${formatNames(names)}`;
  } else if (guests.length === 2 && guests.every((g) => g.surname)) {
    // Два человека с разными фамилиями
    return `${guests[0].name} ${guests[0].surname} и ${guests[1].name} ${guests[1].surname}`;
  } else {
    // Разные фамилии
    return formatNames(
      guests.map((g) => (g.surname ? `${g.name} ${g.surname}` : g.name))
    );
  }
}

function formatNames(names) {
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} и ${names[1]}`;
  const last = names.pop();
  return `${names.join(", ")} и ${last}`;
}

// Функция отправки данных в Telegram
function sendDataToTelegram(formData) {
  const botToken = "7961086542:AAHloHy2cruYJomIDBFdbct7rHOJKuDWS2Q";
  const chatId = "628229833";
  const apiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

  // Формируем строку с именами и фамилиями
  const guestsList = formatGuestList(formData.guests);
  const message = `
  📩 Новая анкета гостя:
  <b>Гости:</b> ${guestsList}
  <b>Присутствие:</b> ${formData.prisutstvie}
  <b>Трансфер:</b> ${formData.transfer}
  `;

  const params = {
    chat_id: chatId,
    text: message,
    parse_mode: "HTML",
  };

  return fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  }).then((response) => response.json());
}

// Обработка формы
document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault();

  const params = new URLSearchParams(window.location.search);
  const guests = [
    {
      name: params.get("f_name"),
      surname: params.get("f_surname"),
    },
    {
      name: params.get("s_name"),
      surname: params.get("s_surname"),
    },
    {
      name: params.get("t_name"),
      surname: params.get("t_surname"),
    },
    {
      name: params.get("fe_name"),
      surname: params.get("fe_surname"),
    },
  ].filter((g) => g.name); // Убираем гостей без имени

  const prisutstvie = document.querySelector(
    "input[name='prisutstvie']:checked"
  )?.value;
  const transfer = document.querySelector(
    "input[name='transfer']:checked"
  )?.value;

  const formData = {
    guests,
    prisutstvie,
    transfer,
  };

  sendDataToTelegram(formData).then((data) => {
    if (data.ok) {
      alert("Спасибо! Анкета отправлена 💌");
    } else {
      alert("Ошибка при отправке 😢");
    }
  });
});
