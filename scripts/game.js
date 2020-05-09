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
    // Include this in loop & random generation
    t1 = trees.create(400, 350, 'tree');
    t1.body.allowGravity = false;
    t1.body.immovable = true;
    t2 = trees.create(800, 350, 'tree');
    t2.body.allowGravity = false;
    t2.body.immovable = true;
    trees.setVelocityX(-200);
    trees.checkWorldBounds = true;
    trees.outOfBoundsKill = true;

    // Collision control
    this.physics.add.collider(dragonF, trees, hitObstacle, null, this);
}

function hitObstacle(actor, obstacle) {
    this.physics.pause();
    dragonF.setTint(0xff0000);
    this.cameras.main.shake(500);
}

function update() {
    // trees
    moreTrees++
    console.log(moreTrees);
    if (moreTrees === 250) {
        console.log("next trees");
        // trees
        //trees = this.physics.add.group();
        // Include this in loop & random generation
        t1 = trees.create(400, 350, 'tree');
        t1.body.allowGravity = false;
        t1.body.immovable = true;
        t2 = trees.create(800, 350, 'tree');
        t2.body.allowGravity = false;
        t2.body.immovable = true;
        trees.setVelocityX(-200);
        trees.checkWorldBounds = true;
        trees.outOfBoundsKill = true;
        moreTrees = 0
    }

    if (cursor.up.isDown) {
        dragonF.setVelocityY(-250);
    }
}