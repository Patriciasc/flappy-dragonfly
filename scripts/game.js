// Game configuration
var config = {
    type: Phaser.AUTO,
    width: 850,
    height: 500,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: [Intro, Level1, Rating],
    render: { pixelArt: true }
};

var game = new Phaser.Game(config);