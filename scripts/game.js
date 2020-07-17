//define players
var currentPlayer = player1;
var opponent = player2;

//moves on main board
currentPlayer.findWays();
currentPlayer.movePlayer();

//start fight sequence
function lancerCombat() {
  //positionner les joueurs face a face pour le combat
  $('.plateau').css('display', 'none');
  $('.tableau-garde').css('margin-left', '25%');
  $('.tableau-archer').css('margin-left', '40px');

  //show which player is attacking now
  hightlightPlayer();
}

//nobody is defending when fight is starting
var defense = false;

//actions when 'attack' button is pressed
$('.attaque').click(function () {
  currentPlayer.attack();
});

//actions when 'defend' button is pressed
$('.defense').click(function () {
  currentPlayer.defend();
});

//actions when 'heal' button is pressed
$('.soin').click(function () {
  currentPlayer.soins();
});

//change round
$(':button').click(function () {
  refreshStats();
  changeRound();
  hightlightPlayer();
});

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

function endGame() {
  if (player1.lifePoints <= 0) {
    $('.end').css('background', 'url(styles/images/Knight/Die/9.png) bottom no-repeat / contain');
  } else if (player2.lifePoints <= 0) {
    $('.end').css('background', 'url(styles/images/Archer/Die/9.png) bottom no-repeat / contain');
  }

  //final div on screen -- restart button available
  $('.gameOver').css('display', 'block');
  $('.tableau-garde').css('display', 'none');
  $('.tableau-archer').css('display', 'none');
}

//reload game
$('.reset').click(function () {
  location.reload();
});
