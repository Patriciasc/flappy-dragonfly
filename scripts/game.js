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
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    render: { pixelArt: true }
};

var game = new Phaser.Game(config);
var dragonF;
var trees;
var bird;
var cursor;
var t1, t2, t3;

function preload() {
    this.load.image('background', 'assets/images/background.png');
    this.load.image('dragonF', 'assets/images/bee.png');
    //this.load.spritesheet('dragonF', 'assets/images/dragonF.png', { frameWidth: 32, frameHeight: 48 });
    this.load.image('tree', 'assets/images/tree1.png');
}

function create() {
    this.add.image(400, 250, 'background');

    // dragonFly
    //dragonF = this.physics.add.sprite(100, 450, 'dragonF');
    dragonF = this.physics.add.sprite(50, 100, 'dragonF');
    dragonF.setScale(0.05);
    dragonF.setBounce(0.4);
    dragonF.setCollideWorldBounds(true);
    dragonF.body.onWorldBounds = true;
    dragonF.body.setGravityY(100);

    // Keys control
    cursor = this.input.keyboard.createCursorKeys();

    // trees
    trees = this.physics.add.group();
    // Include this in loop & random generation
    t1 = trees.create(400, 350, 'tree');
    t1.body.allowGravity = false;
    t1.body.immovable = true;
    t2 = trees.create(550, 350, 'tree');
    t2.body.allowGravity = false;
    t2.body.immovable = true;
    t3 = trees.create(650, 350, 'tree');
    t3.body.allowGravity = false;
    t3.body.immovable = true;
    trees.scaleXY(0.5, 1);
    trees.setVelocityX(-200);
    trees.checkWorldBounds = true;
    trees.outOfBoundsKill = true;

    // Collision control
    this.physics.add.collider(dragonF, trees);
}

function update() {
    if (cursor.up.isDown) {
        dragonF.setVelocityY(-250);
    }
}