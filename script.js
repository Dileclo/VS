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
const fm_name = params.get("fm_name");

// Показываем фамилию отдельно
const fmNameElement = document.querySelector(".fm_name");
const prevent = document.querySelector(".prevent");
if (fmNameElement && fm_name) {
  fmNameElement.textContent = fm_name;
}
const names = [
  params.get("f_name"),
  params.get("s_name"),
  params.get("t_name"),
  params.get("fe_name"),
].filter(Boolean); // убираем пустые значения
if (names.length === 1){
  prevent.textContent = "Родная и Любимая";
}else{
  prevent.textContent = "Родные и Любимые";
}
function formatNames(names) {
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} и ${names[1]}`;
  const last = names.pop();
  return `${names.join(", ")} и ${last}`;
}

const formattedNames = formatNames(names);

// Вставим в элемент
const nameElement = document.querySelector(".guest-names");
if (nameElement) {
  nameElement.textContent = formattedNames;
}

function sendDataToTelegram(formData) {
  const botToken = "7961086542:AAHloHy2cruYJomIDBFdbct7rHOJKuDWS2Q";
  const chatId = "628229833";
  const apiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

  const message = `
📩 Новая анкета гостя:
<b>Имя:</b> ${formData.name}
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

document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault();

  const params = new URLSearchParams(window.location.search);
  const name = params.get("name");
  const prisutstvie = document.querySelector(
    "input[name='prisutstvie']:checked"
  )?.value;
  const transfer = document.querySelector(
    "input[name='transfer']:checked"
  )?.value;

  const formData = {
    name,
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
