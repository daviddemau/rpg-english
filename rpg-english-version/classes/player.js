class Player {
  constructor(name, lifePoints, attackPoints, equipment, index) {
    this.name = name;
    this.lifePoints = lifePoints;
    this.attackPoints = attackPoints;
    this.equipment = equipment;
    this.index = index;
  }

  findWays () {
    //selectionner la case du joueur en cours
    var playerCell;
    if (currentPlayer == player1) {
      playerCell = $('.player1');
    } else if (currentPlayer == player2) {
      playerCell = $('.player2');
    }

    //enregistrer la rangee et colonne du joueur en cours
    var playerColumn = playerCell.attr('data-colonne');
    var playerRow = playerCell.attr('data-rangee');

    //trouver les cases à droite
    $('div[data-rangee=' + playerRow + ']').each(function () {
      for (var i = 1; i < 4; i++) {
        if ($(this).attr('data-colonne') == Number(playerColumn) + i) {
          if (!$(this).hasClass('obstacle') && !$(this).hasClass('player1')
           && !$(this).hasClass('player2')) {
            $(this).addClass('surlignee');
          } else {
            return false;
          }
        }
      }
    });

    //trouver les cases à gauche
    jQuery.fn.reverse = [].reverse;
    $('div[data-rangee='+ playerRow + ']').reverse().each(function () {
      for (var i = 1; i < 4; i++) {
        if ($(this).attr('data-colonne') == Number(playerColumn) - i) {
          if (!$(this).hasClass('obstacle') && !$(this).hasClass('player1')
           && !$(this).hasClass('player2')) {
            $(this).addClass('surlignee');
          } else {
            return false;
          }
        }
      }
    });

    //trouver les cases en haut
    $('div[data-colonne=' + playerColumn + ']').each(function () {
      for(var i = 1; i < 4; i++) {
        if ($(this).attr('data-rangee') == Number(playerRow) + i) {
          if (!$(this).hasClass('obstacle') && !$(this).hasClass('player1')
           && !$(this).hasClass('player2')) {
            $(this).addClass('surlignee');
          } else {
            return false;
          }
        }
      }
    });

    //trouver les cases en bas
    $('div[data-colonne=' + playerColumn + ']').reverse().each(function () {
      for (var i = 1; i < 4; i++) {
        if ($(this).attr('data-rangee') == Number(playerRow) - i) {
          if (!$(this).hasClass('obstacle') && !$(this).hasClass('player1')
           && !$(this).hasClass('player2')) {
            $(this).addClass('surlignee');
          } else {
            return false;
          }
        }
      }
    });
  }

  movePlayer() {
    //selectionner toutes les cases de déplacement potentielles
    var chemins = $('.surlignee');

    //ajouter des listeners sur les cases des chemins
    chemins.click(function () {

      //supprimer les listeners sur toutes les cases chemins
      chemins.off('click');

      //création des variables case départ, case cliquée et case autre joueur
      var caseDepart;
      var caseAutreJoueur;
      var caseCliquee = $(this);

      //attribution des cases à chaque tour
      if (currentPlayer == player1) {
        caseDepart = $('.player1');
        caseAutreJoueur = $('.player2');
      } else if (currentPlayer == player2) {
        caseDepart = $('.player2');
        caseAutreJoueur = $('.player1');
      }

      // Faire une vérification. (une arme sur la cellule ou pas?) - si arme, faire l'échange
      switch (caseCliquee.attr('class')) {
        case 'cellule axe surlignee': currentPlayer.echangerArme(caseCliquee, axe);
        break;
        case 'cellule sword surlignee': currentPlayer.echangerArme(caseCliquee, sword);
        break;
        case 'cellule bow surlignee': currentPlayer.echangerArme(caseCliquee, bow);
        break;
        case 'cellule woodStick surlignee': currentPlayer.echangerArme(caseCliquee, woodStick);
        break;

        //si on tombe sur le bouclier
        case 'cellule shield surlignee' : currentPlayer.lifePoints += shield.defensePoints;
          actualiserStats();
      }

      //la case cliquee prend la classe du currentPlayer
      caseCliquee.attr('class', caseDepart.attr('class'));

      //la case de depart prend la classe de l'arme laissee avant
      if (caseDepart.attr('data-armeLaissee') !== undefined) {
        caseDepart.attr('class', 'cellule' + ' ' + caseDepart.attr('data-armeLaissee'));
      } else {
        //la case de départ devient vide
        caseDepart.attr('class', 'cellule vide');
      }

      chemins.removeClass('surlignee');

      //Dans les 4 cellules autours de moi? Un autre joueur? Oui: lancerCombat, sinon, changerTour et re-generer chemins
      if (caseAutreJoueur.attr('data-rangee') == caseCliquee.attr('data-rangee') &&
       Math.abs(caseAutreJoueur.attr('data-colonne') - caseCliquee.attr('data-colonne')) == 1 ||
        caseAutreJoueur.attr('data-colonne') == caseCliquee.attr('data-colonne') &&
        Math.abs(caseAutreJoueur.attr('data-rangee') - caseCliquee.attr('data-rangee')) == 1) {
        lancerCombat();
      } else {
        changerTour();
        currentPlayer.findWays();
        currentPlayer.movePlayer();
      }
    })
  }
  //fonction pour échanger son equipement contre l'arme au sol
  echangerArme(caseCliquee, weapon) {
    //on laisse l'arme en cours sur la case cliquée
    caseCliquee.attr('data-armeLaissee', currentPlayer.equipment.name);
    currentPlayer.equipment = weapon;
    currentPlayer.attackPoints = weapon.attackPoints;
    actualiserStats();
  }

  attaquer() {
    //animations
    if (currentPlayer == player1) {
      $('.avatar-garde').css('animation', 'garde-attaque 0.6s');
    } else {
      $('.avatar-archer').css('animation', 'archer-attaque 0.6s');
    }

    setTimeout(function () {
      $('.avatar-garde').css('animation', 'garde 1s infinite');
      $('.avatar-archer').css('animation', 'rodeur 1s infinite');
    }, 500);

    //enlever à l'opponent les pa du joueur en cours, sauf s'il defend (2 fois moins de degats)
    if (defendre) {
      opponent.lifePoints -= currentPlayer.attackPoints / 2;
      defendre = false;
    } else {
      opponent.lifePoints -= currentPlayer.attackPoints;
    }
    if (player1.lifePoints <= 0 || player2.lifePoints <= 0) {
      terminerPartie();
    }
  }

  defendre() {
    defendre = true;
  }

  soins()   {
    currentPlayer.lifePoints += 8;
  }
}
