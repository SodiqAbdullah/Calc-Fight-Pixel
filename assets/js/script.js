const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const backgroundMusic = document.getElementById("backgroundMusic");
const attackSound = document.getElementById("attackSound");
const hitSound = document.getElementById("hitSound");

const playerImage = new Image();
playerImage.src = "assets/images/player.gif";
playerImage.onload = function () {
  drawCharacter(player, playerImage);
};

const enemyImage = new Image();
enemyImage.src = "assets/images/Boss.png";
enemyImage.onload = function () {
  drawCharacter(enemy, enemyImage);
};

const player = {
  x: 130,
  y: 280,
  width: 100,
  height: 100,
  hp: 100,
};

const enemy = {
  x: 570,
  y: 290,
  width: 100,
  height: 100,
  hp: 100,
};

function drawCharacter(character, image) {
  ctx.drawImage(
    image,
    character.x,
    character.y,
    character.width,
    character.height
  );
}

function drawScene() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw ground
  // ctx.fillStyle = '#654321';
  // ctx.fillRect(0, canvas.height - 150, canvas.width, 150);

  // Draw characters
  drawCharacter(player, playerImage);
  drawCharacter(enemy, enemyImage);
}

function updateStatus() {
  document.getElementById(
    "status"
  ).textContent = `Player HP: ${player.hp} | Enemy HP: ${enemy.hp}`;
}

function animateAttack(attacker, defender, isEnemy, callback) {
  attackSound.play();
  const originalX = attacker.x;
  const attackDistance = 50;
  let progress = 0;
  const step = 5;

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawScene();

    if (progress < attackDistance) {
      attacker.x += isEnemy ? -step : step;
      progress += step;
      requestAnimationFrame(animate);
    } else {
      attacker.x = originalX;
      callback();
    }
  }

  animate();
}

function animateHit(character) {
  hitSound.play();
  const originalColor = "white";
  let blinkCount = 0;

  function blink() {
    if (blinkCount % 2 === 0) {
      ctx.globalAlpha = 0.5;
    } else {
      ctx.globalAlpha = 1;
    }
    drawScene();

    if (blinkCount < 4) {
      blinkCount++;
      setTimeout(blink, 100);
    } else {
      ctx.globalAlpha = 1;
      drawScene();
    }
  }

  blink();
}

function randomQuestion() {
  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * 10) + 1;
  const operations = ["+", "-", "*"];
  const operation = operations[Math.floor(Math.random() * operations.length)];

  let correctAnswer;

  switch (operation) {
    case "+":
      correctAnswer = num1 + num2;
      break;
    case "-":
      correctAnswer = num1 - num2;
      break;
    case "*":
      correctAnswer = num1 * num2;
      break;
  }

  return { question: `${num1} ${operation} ${num2}`, answer: correctAnswer };
}

function startTurn() {
  const { question, answer } = randomQuestion();
  const userAnswer = prompt(`Answer this to attack: ${question}`);

  // Cek jika prompt dibatalkan atau kosong
  if (userAnswer === null || userAnswer.trim() === "") {
    document.getElementById("message").textContent =
      "Action canceled! No attack occurred.";
    return; // Keluar dari fungsi tanpa menyerang
  }

  // Validasi input hanya angka
  if (isNaN(userAnswer)) {
    document.getElementById("message").textContent =
      "Invalid input! Please enter a number.";
    return; // Keluar dari fungsi tanpa menyerang
  }
  
  if (parseInt(userAnswer) === answer) {
    animateAttack(player, enemy, false, () => {
      enemy.hp -= 20;
      animateHit(enemy);
      document.getElementById("message").textContent =
        "Correct! You attacked the enemy!";
      checkGameOver();
    });
  } else {
    animateAttack(enemy, player, true, () => {
      player.hp -= 30;
      animateHit(player);
      document.getElementById("message").textContent =
        "Wrong! Enemy attacked you!";
      checkGameOver();
    });
  }
  backgroundMusic.play();
}

function checkGameOver() {
  if (enemy.hp <= 0) {
    backgroundMusic.pause();
    document.getElementById("message").textContent = "Victory! Enemy defeated!";
    alert("Victory! You defeated the enemy! Click OK to restart.");
    restartGame();
  } else if (player.hp <= 0) {
    backgroundMusic.pause();
    document.getElementById("message").textContent =
      "Defeat! You were defeated!";
    alert("Defeat! You were defeated! Click OK to restart.");
    restartGame();
  }

  updateStatus();
  drawScene();
}

function restartGame() {
  player.hp = 100;
  enemy.hp = 100;
  updateStatus();
  drawScene();
  document.getElementById("message").textContent = "";
}

updateStatus();
drawScene();
