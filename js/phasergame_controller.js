var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 700,
    parent: 'game_area',
	physics: {
		default: 'arcade',
		arcade: {
			gravity: {y: 0},
			debug: false
		}
	},
    scene: [ GameScene ]
};

var game = new Phaser.Game(config);
