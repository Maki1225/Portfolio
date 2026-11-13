
const suits = ["♠", "♥", "♦", "♣"];
const ranks = ["A", "2", "3", "4", "5", "6", "7",
  "8", "9", "10", "J", "Q", "K"];

let deck = [];
let player = [];
let dealer = [];
let level = "中級";
let gameCount = 0;

let wins = 0;
let losses = 0;
let draws = 0;
let streak = 0;

const $ = id => document.getElementById(id);

function createDeck() {
  deck = [];

  for (const suit of suits) {
    for (const rank of ranks) {
      deck.push({ suit, rank });
    }
  }

  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

function getScore(hand) {
  let total = 0;
  let aces = 0;

  for (const card of hand) {
    if (["J", "Q", "K"].includes(card.rank)) {
      total += 10;
    } else if (card.rank === "A") {
      total += 11;
      aces++;
    } else {
      total += Number(card.rank);
    }
  }

  while (total > 21 && aces > 0) {
    total -= 10;
    aces--;
  }

  return total;
}

function cardText(card) {
  return card.suit + card.rank;
}

function showCards(element, hand, hideSecond = false) {
  element.innerHTML = "";

  hand.forEach((card, index) => {
    const div = document.createElement("div");
    div.className = "card";

    if (hideSecond && index === 1) {
      div.classList.add("hidden-card");
      div.textContent = "？";
    } else {
      div.textContent = cardText(card);

      if (card.suit === "♥" || card.suit === "♦") {
        div.classList.add("red");
      }
    }

    element.appendChild(div);
  });
}

function updateDisplay(revealDealer = false) {
  showCards($("playerCards"), player);
  showCards($("dealerCards"), dealer, !revealDealer && dealer.length > 1);

  $("playerScore").textContent =
    "合計：" + getScore(player);

  $("dealerScore").textContent = revealDealer
    ? "合計：" + getScore(dealer)
    : "合計：" + getScore([dealer[0]]) + " + ？";
}

function updateStats() {
  const total = wins + losses + draws;
  const rate = total === 0 ? 0 : wins / total * 100;

  $("wins").textContent = wins;
  $("losses").textContent = losses;
  $("draws").textContent = draws;
  $("streak").textContent = streak;
  $("winRate").textContent = rate.toFixed(1) + "%";
}

function startGame() {
  gameCount++;
  createDeck();

  player = [deck.pop(), deck.pop()];
  dealer = [deck.pop(), deck.pop()];

  $("startScreen").hidden = true;
  $("gameScreen").hidden = false;
  $("gameButtons").hidden = false;
  $("resultButtons").hidden = true;

  $("levelLabel").textContent = "難易度：" + level;
  $("gameCount").textContent = "第" + gameCount + "ゲーム";
  $("message").textContent = "ヒットまたはスタンドを選んでください";

  updateDisplay();
  updateStats();

  const playerNatural = getScore(player) === 21;
  const dealerNatural = getScore(dealer) === 21;

  if (playerNatural || dealerNatural) {
    finishGame();
  }
}

function hit() {
  if ($("gameButtons").hidden) return;

  player.push(deck.pop());
  updateDisplay();

  if (getScore(player) > 21) {
    $("message").textContent = "バースト！21点を超えました。";
    finishGame();
  } else if (getScore(player) === 21) {
    stand();
  }
}

function stand() {
  if ($("gameButtons").hidden) return;

  while (getScore(dealer) < 17) {
    dealer.push(deck.pop());
  }

  finishGame();
}

function finishGame() {
  $("gameButtons").hidden = true;
  $("resultButtons").hidden = false;

  updateDisplay(true);

  const playerScore = getScore(player);
  const dealerScore = getScore(dealer);

  const playerNatural =
    playerScore === 21 && player.length === 2;

  const dealerNatural =
    dealerScore === 21 && dealer.length === 2;

  let result = "";

  if (playerScore > 21) {
    result = "あなたの負けです。";
  } else if (dealerScore > 21) {
    result = "ディーラーがバースト！あなたの勝ちです！";
  } else if (playerNatural && !dealerNatural) {
    result = "ブラックジャック！あなたの勝ちです！";
  } else if (dealerNatural && !playerNatural) {
    result = "ディーラーのブラックジャック！あなたの負けです。";
  } else if (playerScore > dealerScore) {
    result = "あなたの勝ちです！";
  } else if (playerScore < dealerScore) {
    result = "あなたの負けです。";
  } else {
    result = "引き分けです！";
  }

  if (result.includes("勝ち")) {
    wins++;
    streak++;
  } else if (result.includes("負け")) {
    losses++;
    streak = 0;
  } else {
    draws++;
    streak = 0;
  }

  if (streak >= 2) {
    result += " " + streak + "連勝中！";
  }

  $("message").textContent = result;
  updateStats();
}

function goHome() {
  $("gameScreen").hidden = true;
  $("startScreen").hidden = false;

  wins = 0;
  losses = 0;
  draws = 0;
  streak = 0;
  updateStats();
}

document.querySelectorAll("[data-level]").forEach(button => {
  button.addEventListener("click", () => {
    level = button.dataset.level;
    startGame();
  });
});

$("hitButton").addEventListener("click", hit);
$("standButton").addEventListener("click", stand);
$("againButton").addEventListener("click", startGame);
$("homeButton").addEventListener("click", goHome);
