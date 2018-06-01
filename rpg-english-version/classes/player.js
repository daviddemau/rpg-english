class Player {
  constructor(name, lifePoints, attackPoints, equipment, index) {
    this.name = name;
    this.lifePoints = lifePoints;
    this.attackPoints = attackPoints;
    this.equipment = equipment;
    this.index = index;
  }

  trouverCasesDisponibles () {
    //selectionner la case du joueur en cours
    var caseJoueur;
    if (joueurEnCours == joueur1) {
      caseJoueur = $('.joueur1');
    } else if (joueurEnCours == joueur2) {
      caseJoueur = $('.joueur2');
    }

    //enregistrer la rangee et colonne du joueur en cours
    var colonneJoueur = caseJoueur.attr('data-colonne');
    var rangeeJoueur = caseJoueur.attr('data-rangee');

    //trouver les cases à droite
    $('div[data-rangee=' + rangeeJoueur + ']').each(function () {
      for (var i = 1; i < 4; i++) {
        if ($(this).attr('data-colonne') == Number(colonneJoueur) + i) {
          if (!$(this).hasClass('obstacle') && !$(this).hasClass('joueur1')
           && !$(this).hasClass('joueur2')) {
            $(this).addClass('surlignee');
          } else {
            return false;
          }
        }
      }
    });

    //trouver les cases à gauche
    jQuery.fn.reverse = [].reverse;
    $('div[data-rangee='+ rangeeJoueur + ']').reverse().each(function () {
      for (var i = 1; i < 4; i++) {
        if ($(this).attr('data-colonne') == Number(colonneJoueur) - i) {
          if (!$(this).hasClass('obstacle') && !$(this).hasClass('joueur1')
           && !$(this).hasClass('joueur2')) {
            $(this).addClass('surlignee');
          } else {
            return false;
          }
        }
      }
    });

    //trouver les cases en haut
    $('div[data-colonne=' + colonneJoueur + ']').each(function () {
      for(var i = 1; i < 4; i++) {
        if ($(this).attr('data-rangee') == Number(rangeeJoueur) + i) {
          if (!$(this).hasClass('obstacle') && !$(this).hasClass('joueur1')
           && !$(this).hasClass('joueur2')) {
            $(this).addClass('surlignee');
          } else {
            return false;
          }
        }
      }
    });

    //trouver les cases en bas
    $('div[data-colonne=' + colonneJoueur + ']').reverse().each(function () {
      for (var i = 1; i < 4; i++) {
        if ($(this).attr('data-rangee') == Number(rangeeJoueur) - i) {
          if (!$(this).hasClass('obstacle') && !$(this).hasClass('joueur1')
           && !$(this).hasClass('joueur2')) {
            $(this).addClass('surlignee');
          } else {
            return false;
          }
        }
      }
    });
  }

  deplacerJoueur() {
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
      if (joueurEnCours == joueur1) {
        caseDepart = $('.joueur1');
        caseAutreJoueur = $('.joueur2');
      } else if (joueurEnCours == joueur2) {
        caseDepart = $('.joueur2');
        caseAutreJoueur = $('.joueur1');
      }

      // Faire une vérification. (une arme sur la cellule ou pas?) - si arme, faire l'échange
      switch (caseCliquee.attr('class')) {
        case 'cellule axe surlignee': joueurEnCours.echangerArme(caseCliquee, axe);
        break;
        case 'cellule sword surlignee': joueurEnCours.echangerArme(caseCliquee, sword);
        break;
        case 'cellule bow surlignee': joueurEnCours.echangerArme(caseCliquee, bow);
        break;
        case 'cellule woodStick surlignee': joueurEnCours.echangerArme(caseCliquee, woodStick);
        break;

        //si on tombe sur le bouclier
        case 'cellule shield surlignee' : joueurEnCours.lifePoints += shield.defensePoints;
          actualiserStats();
      }

      //la case cliquee prend la classe du joueurEnCours
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
        joueurEnCours.trouverCasesDisponibles();
        joueurEnCours.deplacerJoueur();
      }
    })
  }
  //fonction pour échanger son equipement contre l'arme au sol
  echangerArme(caseCliquee, weapon) {
    //on laisse l'arme en cours sur la case cliquée
    caseCliquee.attr('data-armeLaissee', joueurEnCours.equipment.name);
    joueurEnCours.equipment = weapon;
    joueurEnCours.attackPoints = weapon.attackPoints;
    actualiserStats();
  }

  attaquer() {
    //animations
    if (joueurEnCours == joueur1) {
      $('.avatar-garde').css('animation', 'garde-attaque 0.6s');
    } else {
      $('.avatar-archer').css('animation', 'archer-attaque 0.6s');
    }

    setTimeout(function () {
      $('.avatar-garde').css('animation', 'garde 1s infinite');
      $('.avatar-archer').css('animation', 'rodeur 1s infinite');
    }, 500);

    //enlever à l'adversaire les pa du joueur en cours, sauf s'il defend (2 fois moins de degats)
    if (defendre) {
      adversaire.lifePoints -= joueurEnCours.attackPoints / 2;
      defendre = false;
    } else {
      adversaire.lifePoints -= joueurEnCours.attackPoints;
    }
    if (joueur1.lifePoints <= 0 || joueur2.lifePoints <= 0) {
      terminerPartie();
    }
  }

  defendre() {
    defendre = true;
  }

  soins()   {
    joueurEnCours.lifePoints += 8;
  }
}
