//variables
var board = [];

//créer une nouvelle grille de game
const game = new Grid(9, 3, 2, 10);
game.createGrid();

//générer des indexes aléatoires et uniques pour les éléments du board
var items = [];

//créer les armes
const woodStick = new Weapon('woodStick', 10, undefined);
const sword = new Weapon('sword', 35, randomizeIndex());
const bow = new Weapon('bow', 25, randomizeIndex());
const axe = new Weapon('axe', 25, randomizeIndex());

//créer les armures
const shield = new Armor('shield', 60, randomizeIndex());

//créer les joueurs
const player1 = new Player('player1', 100, 10, woodStick, randomizeIndex());
const player2 = new Player('player2', 100, 10, woodStick, randomizeIndex());

//créer les obstacles
var obstacles = [];
for (var i = 0; i < game.obstacles; i++) {
  obstacles.push(randomizeIndex());
}

//créer le board de game avec les items correspondants
genererPlateau();

function randomizeIndex() {
  let nbrItems = game.joueurs + game.armes + game.obstacles;
  while (items.length < nbrItems) {
    let random = Math.floor(Math.random() * board.length);
    if (!items.includes(random)) {
      items.push(random);
      return random;
    }
  }
}

function genererPlateau() {
  //les joueurs ne doivent pas être à côté
  if (Math.abs(player1.index - player2.index) == 1 ||
  Math.abs(player1.index - player2.index) == 10) {
    location.reload();
  } else {
    board.map((element) => {
      //définir cellules
      let cell = document.createElement('div');
      cell.className = 'cellule';
      cell.setAttribute('data-rangee', element.rangee);
      cell.setAttribute('data-colonne', element.col);

      //définir si une cellule contient un obstacle
      if (obstacles.includes(board.indexOf(element))) {
        cell.classList.add('obstacle');
      }

      //définir si une cellule contient un joueur, une arme ou une armure
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

      //définir cases vides
      if (!items.includes(board.indexOf(element))) {
        cell.classList.add('vide');
      }

      //définir rangées
      let rangee = document.createElement('div');
      rangee.className = 'rangee';
      rangee.id = 'rangee' + '_' + element.rangee;

      //à chaque fois que la case a une colonne indice 0 on l'insère dans une nouvelle rangee
      if (element.col == 0) {
        $('.plateau').append(rangee);
        document.getElementById(rangee.id).appendChild(cell);
      } else {
        document.getElementById(rangee.id).appendChild(cell);
      }
    });
  }
}

//afficher les stats des joueurs
$('.garde-stats span:nth(0)').html(player1.lifePoints);
$('.archer-stats span:nth(0)').html(player2.lifePoints);
$('.garde-stats span:nth(1)').html(player1.attackPoints);
$('.archer-stats span:nth(1)').html(player2.attackPoints);
$('.garde-stats span:nth(2)').html(player1.equipment.name);
$('.archer-stats span:nth(2)').html(player2.equipment.name);
