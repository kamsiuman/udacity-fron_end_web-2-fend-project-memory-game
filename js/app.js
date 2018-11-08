/*
 * Create a list that holds all of your cards
 */
var Cards = [
  "fa-diamond",
  "fa-paper-plane",
  "fa-anchor",
  "fa-bolt",
  "fa-cube",
  "fa-leaf",
  "fa-bicycle",
  "fa-bomb",
  "fa-diamond",
  "fa-paper-plane",
  "fa-anchor",
  "fa-bolt",
  "fa-cube",
  "fa-leaf",
  "fa-bicycle",
  "fa-bomb"
];

function GenerateCard(card) {
  //   return '<li class="card"><i class="fa ${card}"></i></li>'; why the templeate-liternal is not supported
  return (
    '<li class="card" data-card="' +
    card +
    '"><i class="fa ' +
    card +
    '"></i></li>'
  );
}

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
var moveCount = 0;
var moveCounter = document.querySelector(".moves");
var matchCount = 0;
var matchCounter = document.querySelector(".matches");
var starCount = 0;
var starList = document.querySelector(".stars");

// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the button that reset the clock
var h2 = document.getElementsByTagName("h2")[0];
var seconds = 0;
var minutes = 0;
var hours = 0;
var t;

var btnRestart = document.getElementById("restart");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

var openCards = []; //stack Data Structure to store all the "open" card items; logically, it should be at most 2 items
var matchCards = []; //as a reference for reset... need to reset them

function initDesk() {
  var deck = document.querySelector(".deck");
  var cardHTML = shuffle(Cards).map(function(card) {
    return GenerateCard(card);
  });
  deck.innerHTML = cardHTML.join("");
}

function initGame() {
  initDesk();
  moveCounter.innerHTML = moveCount;
  matchCounter.innerHTML = matchCount;
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
};

initGame();

function add() {
  seconds++;
  if (seconds >= 60) {
    seconds = 0;
    minutes++;
    if (minutes >= 60) {
      minutes = 0;
      hours++;
    }
  }

  h2.textContent =
    (hours ? (hours > 9 ? hours : "0" + hours) : "00") +
    ":" +
    (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") +
    ":" +
    (seconds > 9 ? seconds : "0" + seconds);

  StartTimer();
}

function StartTimer() {
  t = setTimeout(add, 1000);
}

function ResetStars() {
  let starCount = document.querySelectorAll(".stars li");
  for (var star of starCount) {
    star.style.display = "inline-block";
  }
}

//Removes stars based on the number of moves.
function starRating() {
  if (moveCount == 16 || moveCount == 24) {
    removeStar();
  }
}

function removeStar() {
  let starCount = document.querySelectorAll(".stars li");
  for (let star of starCount) {
    if (star.style.display !== "none") {
      star.style.display = "none";
      break;
    }
  }
}

function resetStars() {
  let starCount = document.querySelectorAll(".stars li");
  for (var star of starCount) {
    star.style.display = "inline-block";
  }
}

var allCards = document.querySelectorAll(".card");

AddDefaultOpeningCards();

btnRestart.addEventListener("click", function(e) {
  RestartTimer();
});

//display timer
function RestartTimer() {
  h2.textContent = "00:00:00";
  seconds = 0;
  minutes = 0;
  hours = 0;
  clearTimeout(t);
  moveCount = 0;
  matchCount = 0;
  moveCounter.innerHTML = moveCount;
  matchCounter.innerHTML = matchCount;
  HideAllOpenCards();
  HideAllMatchCards();
  resetStars();
}

allCards.forEach(function(card) {
  card.addEventListener("click", function(e) {
    if (IsValidCardForOpen(card)) {
      StartTimer();
      DisplayCardSymbol(card);
      moveCounter.innerHTML = ++moveCount;
      starRating();

      //to prevent people clicking more than 2 (i.e. cannot allow to open more than 2)
      if (openCards.length == 2) {
        // check if they match
        if (openCards[0].dataset.card == openCards[1].dataset.card) {
          DisplayMatchSymbol(openCards[0]);
          DisplayMatchSymbol(openCards[1]);
          openCards = [];
          matchCounter.innerHTML = ++matchCount;

          if (matchCount == 8) {
            DisplayWinningMessage();
            RestartTimer();
          }
        } else {
          HideAllOpenCards();
        }
      }
    }
  });
});

//is the card a valid one to open : it means the selected is not yet open
// AND there is at most one card had already opened
function IsValidCardForOpen(card) {
  if (
    (!card.classList.contains("open") || !card.classList.contains("show")) &&
    openCards.length <= 1
  ) {
    return true;
  } else {
    return false;
  }
}

//  hide all opening cards and reset the openCards to empty
function HideAllOpenCards() {
  setTimeout(function() {
    openCards.forEach(function(card) {
      card.classList.remove("open", "show");
    });
    openCards = [];
  }, 1000);
}

//  hide all opening cards and reset the openCards to empty
function HideAllMatchCards() {
  setTimeout(function() {
    matchCards.forEach(function(card) {
      card.classList.remove("open", "show", "match");
    });
    matchCards = [];
  }, 1000);
}

// 1) display the card by manipluate the css and 2) add the card to the opencards data structure
function DisplayCardSymbol(card) {
  console.log("click - openCards", openCards.length);
  card.classList.add("open", "show");
  openCards.push(card);
}

function DisplayMatchSymbol(card) {
  console.log("click - openCards", openCards.length);
  card.classList.add("open", "show", "match");
  matchCards.push(card);
}

function DisplayWinningMessage() {
  modal.style.display = "block";
  document.getElementById("myModelText").innerHTML =
    "Congratulations!! you win!! with " +
    moveCount +
    "moves with time [" +
    h2.textContent +
    "] second";
}

//- display the card's symbol (put this functionality in another function that you call from this one)
function AddDefaultOpeningCards() {
  allCards.forEach(function(card) {
    if (card.classList.contains("open")) {
      openCards.push(card);
      console.log("default - openCards.push", openCards.length);
    }
  });
}
