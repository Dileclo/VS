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
      const name = params.get("name");
      const nameElement = document.querySelector(".name");
      if (name) {
        nameElement.textContent = name;
      } else {
        nameElement.textContent = "гость"; // Значение по умолчанию
      }