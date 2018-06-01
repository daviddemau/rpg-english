class Player {
  constructor(name, lifePoints, attackPoints, equipment, index) {
    this.name = name;
    this.lifePoints = lifePoints;
    this.attackPoints = attackPoints;
    this.equipment = equipment;
    this.index = index;
  }

  findWays () {
    //select currentPlayer cell
    var playerCell;
    if (currentPlayer == player1) {
      playerCell = $('.player1');
    } else if (currentPlayer == player2) {
      playerCell = $('.player2');
    }

    //save currentPlayer raw and column
    var playerColumn = playerCell.attr('data-colonne');
    var playerRow = playerCell.attr('data-rangee');

    //find ways on the right
    $('div[data-rangee=' + playerRow + ']').each(function () {
      for (var i = 1; i < 4; i++) {
        if ($(this).attr('data-colonne') == Number(playerColumn) + i) {
          if (!$(this).hasClass('obstacle') && !$(this).hasClass('player1')
           && !$(this).hasClass('player2')) {
            $(this).addClass('highlighted');
          } else {
            return false;
          }
        }
      }
    });

    //find ways on the left
    jQuery.fn.reverse = [].reverse;
    $('div[data-rangee='+ playerRow + ']').reverse().each(function () {
      for (var i = 1; i < 4; i++) {
        if ($(this).attr('data-colonne') == Number(playerColumn) - i) {
          if (!$(this).hasClass('obstacle') && !$(this).hasClass('player1')
           && !$(this).hasClass('player2')) {
            $(this).addClass('highlighted');
          } else {
            return false;
          }
        }
      }
    });

    //find ways going up
    $('div[data-colonne=' + playerColumn + ']').each(function () {
      for(var i = 1; i < 4; i++) {
        if ($(this).attr('data-rangee') == Number(playerRow) + i) {
          if (!$(this).hasClass('obstacle') && !$(this).hasClass('player1')
           && !$(this).hasClass('player2')) {
            $(this).addClass('highlighted');
          } else {
            return false;
          }
        }
      }
    });

    //find ways going down
    $('div[data-colonne=' + playerColumn + ']').reverse().each(function () {
      for (var i = 1; i < 4; i++) {
        if ($(this).attr('data-rangee') == Number(playerRow) - i) {
          if (!$(this).hasClass('obstacle') && !$(this).hasClass('player1')
           && !$(this).hasClass('player2')) {
            $(this).addClass('highlighted');
          } else {
            return false;
          }
        }
      }
    });
  }

  movePlayer() {
    var ways = $('.highlighted');
    ways.click(function () {
      ways.off('click');

      var startCell;
      var opponentCell;
      var targetedCell = $(this);

      //start and opponent cells change every round
      if (currentPlayer == player1) {
        startCell = $('.player1');
        opponentCell = $('.player2');
      } else if (currentPlayer == player2) {
        startCell = $('.player2');
        opponentCell = $('.player1');
      }

      // check if items on target cell, if YES, make exchange, if NO, change round
      switch (targetedCell.attr('class')) {
        case 'cellule axe highlighted': currentPlayer.exchangeWeapon(targetedCell, axe);
        break;
        case 'cellule sword highlighted': currentPlayer.exchangeWeapon(targetedCell, sword);
        break;
        case 'cellule bow highlighted': currentPlayer.exchangeWeapon(targetedCell, bow);
        break;
        case 'cellule woodStick highlighted': currentPlayer.exchangeWeapon(targetedCell, woodStick);
        break;

        //case if target cell is an armor
        case 'cellule shield highlighted' : currentPlayer.lifePoints += shield.defensePoints;
          refreshStats();
      }

      //targetedCell takes startCell class
      targetedCell.attr('class', startCell.attr('class'));

      //startCell takes dropped weapon class if any
      if (startCell.attr('data-armeLaissee') !== undefined) {
        startCell.attr('class', 'cellule' + ' ' + startCell.attr('data-armeLaissee'));
      } else {
        startCell.attr('class', 'cellule empty');
      }

      ways.removeClass('highlighted');

      //Adjacent cells? Opponent? YES: launchFight, or, changeRound et findWays
      if (opponentCell.attr('data-rangee') == targetedCell.attr('data-rangee') &&
       Math.abs(opponentCell.attr('data-colonne') - targetedCell.attr('data-colonne')) == 1 ||
        opponentCell.attr('data-colonne') == targetedCell.attr('data-colonne') &&
        Math.abs(opponentCell.attr('data-rangee') - targetedCell.attr('data-rangee')) == 1) {
        lancerCombat();
      } else {
        changeRound();
        currentPlayer.findWays();
        currentPlayer.movePlayer();
      }
    })
  }

  exchangeWeapon(targetedCell, weapon) {
    //on laisse l'arme en cours sur la case cliquée
    targetedCell.attr('data-armeLaissee', currentPlayer.equipment.name);
    currentPlayer.equipment = weapon;
    currentPlayer.attackPoints = weapon.attackPoints;
    refreshStats();
  }

  attaquer() {
    //css animations
    if (currentPlayer == player1) {
      $('.avatar-garde').css('animation', 'garde-attaque 0.6s');
    } else {
      $('.avatar-archer').css('animation', 'archer-attaque 0.6s');
    }

    setTimeout(function () {
      $('.avatar-garde').css('animation', 'garde 1s infinite');
      $('.avatar-archer').css('animation', 'rodeur 1s infinite');
    }, 500);

    if (defense) {
      opponent.lifePoints -= currentPlayer.attackPoints / 2;
      defense = false;
    } else {
      opponent.lifePoints -= currentPlayer.attackPoints;
    }
    if (player1.lifePoints <= 0 || player2.lifePoints <= 0) {
      terminerPartie();
    }
  }

  defend() {
    defense = true;
  }

  soins()   {
    currentPlayer.lifePoints += 8;
  }
}
