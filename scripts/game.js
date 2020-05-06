// Game configuration
var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    render: { pixelArt: true }
};

var game = new Phaser.Game(config);

function preload() {
    this.load.image('background', 'assets/images/background.png');
}

function create() {
    this.add.image(400, 300, 'background');
}

function update() {

}