class Grid {
  constructor(murs, armes, joueurs, obstacles) {
    this.murs = murs;
    this.armes = armes;
    this.joueurs = joueurs;
    this.obstacles = obstacles;
  }

  createGrid() {
    for (var i = 0; i < this.murs; i++) {
      for (var j = 0; j < this.murs; j++) {
        board.push(new Cell(i, j));
      }
    }
  }
}
