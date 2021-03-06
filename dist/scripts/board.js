//setup players data
var playersHP = 100;
var baseAP = 10;

//variables
var board = [];
var items = [];

//create a new grid for the game
const game = new Grid(9, 3, 2, 10);
game.createGrid();

//create weapons
const woodStick = new Weapon('woodStick', baseAP, undefined);
const sword = new Weapon('sword', 35, randomizeIndex());
const bow = new Weapon('bow', 25, randomizeIndex());
const axe = new Weapon('axe', 25, randomizeIndex());

//create armors
const shield = new Armor('shield', 60, randomizeIndex());

//create players
const player1 = new Player('player1', playersHP, baseAP, woodStick, randomizeIndex());
const player2 = new Player('player2', playersHP, baseAP, woodStick, randomizeIndex());

//create obstacles
var obstacles = [];
for (var i = 0; i < game.obstacles; i++) {
  obstacles.push(randomizeIndex());
}

//create the board including game elements
loadBoard();

//get random indexes for all board items
function randomizeIndex() {
  let nbrItems = game.players + game.weapons + game.obstacles;
  while (items.length < nbrItems) {
    let random = Math.floor(Math.random() * board.length);
    if (!items.includes(random)) {
      items.push(random);
      return random;
    }
  }
}

function loadBoard() {
  //players shouldn't start next to each other
  if (Math.abs(player1.index - player2.index) == 1 ||
  Math.abs(player1.index - player2.index) == 10) {
    location.reload();
  } else {
    board.map((element) => {
      //define what is a cell
      let cell = document.createElement('div');
      cell.className = 'cell';
      cell.setAttribute('data-raw', element.raw);
      cell.setAttribute('data-colonne', element.col);

      //define if a cell contains a rock
      if (obstacles.includes(board.indexOf(element))) {
        cell.classList.add('obstacle');
      }

      //define if a cell contains a weapon, armor or player
      switch (board.indexOf(element)) {
        case player1.index: cell.classList.add('player1');
        break;
        case player2.index: cell.classList.add('player2');
        break;
        case shield.index: cell.classList.add('shield');
        break;
        case sword.index: cell.classList.add('sword');
        break;
        case bow.index: cell.classList.add('bow');
        break;
        case axe.index: cell.classList.add('axe');
      }

      //define if a cell is empty
      if (!items.includes(board.indexOf(element))) {
        cell.classList.add('empty');
      }

      //define raws
      let raw = document.createElement('div');
      raw.className = 'raw';
      raw.id = 'raw' + '_' + element.raw;

      //each time a well has a column with index 0, create new raw
      if (element.col == 0) {
        $('.plateau').append(raw);
        document.getElementById(raw.id).appendChild(cell);
      } else {
        document.getElementById(raw.id).appendChild(cell);
      }
    });
  }
}

//load players stats
$('.garde-stats span:nth(0)').html(player1.lifePoints);
$('.archer-stats span:nth(0)').html(player2.lifePoints);
$('.garde-stats span:nth(1)').html(player1.attackPoints);
$('.archer-stats span:nth(1)').html(player2.attackPoints);
$('.garde-stats span:nth(2)').html(player1.equipment.name);
$('.archer-stats span:nth(2)').html(player2.equipment.name);
