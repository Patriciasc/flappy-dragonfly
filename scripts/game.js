// Game configuration
var config = {
    type: Phaser.AUTO,
    width: 850,
    height: 550,
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
var dragonF;

function preload() {
    this.load.image('background', 'assets/images/background.png');
    this.load.image('dragonF', 'assets/images/bee.png');
    //this.load.spritesheet('dragonF', 'assets/images/dragonF.png', { frameWidth: 32, frameHeight: 48 });
}

function create() {
    this.add.image(400, 300, 'background');

    // dragonFly
    //dragonF = this.physics.add.sprite(100, 450, 'dragonF');
    dragonF = this.physics.add.sprite(50, 100, 'dragonF');
    dragonF.setScale(0.1);
    dragonF.setBounce(0.2);
    dragonF.setCollideWorldBounds(true);
    dragonF.body.setGravityY(100);
}

function update() {

}