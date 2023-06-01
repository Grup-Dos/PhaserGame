var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 900,
    parent: 'game_area',
	physics: {
		default: 'arcade',
		arcade: {
			gravity: {y: 0},
			debug: false
		}
	},
	render: {
        antialias: false //esto elimina una linea entre imagenes que aparece, prueba a quitar esto y veras a lo que me refiero
    },
    scene: [ GameScene]
};
var game = new Phaser.Game(config);