//definir les joueurs
var currentPlayer = player1;
var opponent = player2;

//deplacements sur le plateau
currentPlayer.findWays();
currentPlayer.movePlayer();

//demarrer combat
function lancerCombat() {
  //positionner les joueurs face a face pour le combat
  $('.plateau').css('display', 'none');
  $('.tableau-garde').css('margin-left', '25%');
  $('.tableau-archer').css('margin-left', '40px');

  //surligner le premier joueur qui attaque
  hightlightPlayer();
}

//personne ne defend au debut du combat
var defense = false;

//bouton attaquer
$('.attaque').click(function () {
  currentPlayer.attaquer();
});

//bouton defendre
$('.defense').click(function () {
  currentPlayer.defend();
});

//bouton soins
$('.soin').click(function () {
  currentPlayer.soins();
});

//changer de joueur à chaque action et surligner le bon joueur
$(':button').click(function () {
  refreshStats();
  changeRound();
  hightlightPlayer();
});

//changer de tour
function changeRound() {
  if(currentPlayer == player1) {
    currentPlayer = player2;
    opponent = player1;
  } else if(currentPlayer == player2){
    currentPlayer = player1;
    opponent = player2;
  }
}

function refreshStats() {
  $('.garde-stats span:nth(0)').html(player1.lifePoints);
  $('.archer-stats span:nth(0)').html(player2.lifePoints);
  $('.garde-stats span:nth(1)').html(player1.attackPoints);
  $('.archer-stats span:nth(1)').html(player2.attackPoints);
  $('.garde-stats span:nth(2)').html(player1.equipment.name);
  $('.archer-stats span:nth(2)').html(player2.equipment.name);
}

function hightlightPlayer() {
  if (currentPlayer == player2) {
    $('.tableau-garde').removeClass('hightlight');
    $('.tableau-garde button').css('display', 'none');
    $('.tableau-archer').addClass('hightlight');
    $('.tableau-archer button').css('display', 'inline-block');
  } else if (currentPlayer == player1) {
    $('.tableau-archer').removeClass('hightlight');
    $('.tableau-archer button').css('display', 'none');
    $('.tableau-garde').addClass('hightlight');
    $('.tableau-garde button').css('display', 'inline-block');
  }
}

function terminerPartie() {
  if (player1.lifePoints <= 0) {
    $('.end').css('background', 'url(styles/images/Knight/Die/9.png) bottom no-repeat / contain');
  } else if (player2.lifePoints <= 0) {
    $('.end').css('background', 'url(styles/images/Archer/Die/9.png) bottom no-repeat / contain');
  }

  //ne laisser que la div gameover sur l'écran
  $('.gameOver').css('display', 'block');
  $('.tableau-garde').css('display', 'none');
  $('.tableau-archer').css('display', 'none');
}

//charger une nouvelle partie
$('.reset').click(function () {
  location.reload();
});
