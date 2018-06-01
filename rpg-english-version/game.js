//definir les joueurs
var joueurEnCours = joueur1;
var adversaire = joueur2;

//deplacements sur le plateau
joueurEnCours.trouverCasesDisponibles();
joueurEnCours.deplacerJoueur();

//demarrer combat
function lancerCombat() {
  //positionner les joueurs face a face pour le combat
  $('.plateau').css('display', 'none');
  $('.tableau-garde').css('margin-left', '25%');
  $('.tableau-archer').css('margin-left', '110px');

  //surligner le premier joueur qui attaque
  surlignerJoueur();
}

//personne ne defend au debut du combat
var defendre = false;

//bouton attaquer
$('.attaque').click(function () {
  joueurEnCours.attaquer();
});

//bouton defendre
$('.defense').click(function () {
  joueurEnCours.defendre();
});

//bouton soins
$('.soin').click(function () {
  joueurEnCours.soins();
});

//changer de joueur à chaque action et surligner le bon joueur
$(':button').click(function () {
  actualiserStats();
  changerTour();
  surlignerJoueur();
});

//changer de tour
function changerTour() {
  if(joueurEnCours == joueur1) {
    joueurEnCours = joueur2;
    adversaire = joueur1;
  } else if(joueurEnCours == joueur2){
    joueurEnCours = joueur1;
    adversaire = joueur2;
  }
}

function actualiserStats() {
  $('.garde-stats span:nth(0)').html(joueur1.lifePoints);
  $('.archer-stats span:nth(0)').html(joueur2.lifePoints);
  $('.garde-stats span:nth(1)').html(joueur1.attackPoints);
  $('.archer-stats span:nth(1)').html(joueur2.attackPoints);
  $('.garde-stats span:nth(2)').html(joueur1.equipment.name);
  $('.archer-stats span:nth(2)').html(joueur2.equipment.name);
}

function surlignerJoueur() {
  if (joueurEnCours == joueur2) {
    $('.tableau-garde').removeClass('hightlight');
    $('.tableau-garde button').css('display', 'none');
    $('.tableau-archer').addClass('hightlight');
    $('.tableau-archer button').css('display', 'inline-block');
  } else if (joueurEnCours == joueur1) {
    $('.tableau-archer').removeClass('hightlight');
    $('.tableau-archer button').css('display', 'none');
    $('.tableau-garde').addClass('hightlight');
    $('.tableau-garde button').css('display', 'inline-block');
  }
}

function terminerPartie() {
  if (joueur1.pointsVie <= 0) {
    $('.end').css('background', 'url(styles/images/Knight/Die/9.png) bottom no-repeat / contain');
  } else if (joueur2.pointsVie <= 0) {
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
