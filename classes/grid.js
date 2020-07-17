class Grid {
  constructor(wall, weapons, players, obstacles) {
    this.wall = wall;
    this.weapons = weapons;
    this.players = players;
    this.obstacles = obstacles;
  }

  createGrid() {
    for (var i = 0; i < this.wall; i++) {
      for (var j = 0; j < this.wall; j++) {
        board.push(new Cell(i, j));
      }
    }
  }
}
