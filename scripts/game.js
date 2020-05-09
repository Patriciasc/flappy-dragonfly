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
//var tree1, tree;
var moreTrees = 0;

function preload() {
    this.load.image('background', 'assets/images/background.png');
    this.load.image('dragonF', 'assets/images/bee.png');
    //this.load.spritesheet('dragonF', 'assets/images/dragonF.png', { frameWidth: 32, frameHeight: 48 });
    this.load.image('tree', 'assets/images/tree2_psc.png');
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
    dragonF.body.immovable = true;

    // Keys control
    cursor = this.input.keyboard.createCursorKeys();

    // trees
    trees = this.physics.add.group();
    addTree(620,350);

    // Collision control
    this.physics.add.collider(dragonF, trees, hitObstacle, null, this);
}

function addTree(x, y) {
    var tree = trees.create(x, y, 'tree');
    tree.body.allowGravity = false;
    tree.body.immovable = true;
    tree.checkWorldBounds = true;
    tree.outOfBoundsKill = true;
    return tree;
}

function hitObstacle(actor, obstacle) {
    dragonF.setTint(0xff0000);
    this.cameras.main.shake(500);
    this.physics.pause();
    trees.clear();
}

function update() {
    // trees
    moreTrees++
    if (moreTrees === 100) {
        var tree = addTree(950, 350);
        tree.setOrigin(0, 0);
        trees.setVelocityX(-200);
        moreTrees = 0;
    }

    if (cursor.up.isDown) {
        dragonF.setVelocityY(-250);
    }
}