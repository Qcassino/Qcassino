const bg = document.getElementById("sound-bg");
const hover = document.getElementById("sound-hover");
const click = document.getElementById("sound-click");
const toggle = document.getElementById("soundToggle");

let ligado = false;

// LIGAR / DESLIGAR
toggle.onclick = () => {
  ligado = !ligado;

  if (ligado) {
    bg.volume = 0.3;
    bg.play();
    toggle.innerText = "🔇 Som";
  } else {
    bg.pause();
    toggle.innerText = "🔊 Som";
  }
};

// SOM AO PASSAR MOUSE
document.querySelectorAll(".game-card").forEach(card => {
  card.addEventListener("mouseenter", () => {
    if (ligado) {
      hover.currentTime = 0;
      hover.play();
    }
  });

  card.addEventListener("click", () => {
    if (ligado) {
      click.currentTime = 0;
      click.play();
    }
  });
});
