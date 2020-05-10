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
var moreTrees = 0;

function preload() {
    this.load.image('background', 'assets/images/background.png');
    this.load.spritesheet('dragonF_fly', 'assets/images/dragonF_flying.png', { frameWidth: 243, frameHeight: 195 });
    this.load.spritesheet('dragonF_explode', 'assets/images/dragonF_explode.png', { frameWidth: 378, frameHeight: 211 });
    this.load.image('tree', 'assets/images/tree2_psc.png');
}

function create() {
    this.add.image(400, 250, 'background');

    // dragonFly
    dragonF = this.physics.add.sprite(100, 100, 'dragonF_fly');
    dragonF.setScale(0.4);
    dragonF.setBounce(0.4);
    dragonF.setCollideWorldBounds(true);
    dragonF.body.onWorldBounds = true;
    dragonF.body.setGravityY(100);
    dragonF.body.immovable = true;
    this.anims.create({
        key: 'dragonF_fly',
        frames: this.anims.generateFrameNumbers('dragonF_fly'),
        frameRate: 20,
        repeat: -1
    });
    this.anims.create({
        key: 'dragonF_explode',
        frames: this.anims.generateFrameNumbers('dragonF_explode'),
        frameRate: 10,
        repeat: 0,
    });
    dragonF.play('dragonF_fly');

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
    var treeType = Math.floor(Math.random() * 5);
    console.log(treeType);
    switch (treeType) {
        case 0:
            tree.scaleX = .4;
            tree.y += 60;
            break;
        case 1:
            tree.scaleX = .2;
            tree.y += 100;
            break;
        case 2:
            tree.scaleX = .5;
            break;
        case 3:
            tree.y += 170;
            tree.scaleX = .7;
        case 4:
            tree.y += 60;
        default:
            break;
    }
    tree.body.allowGravity = false;
    tree.body.immovable = true;
    tree.checkWorldBounds = true;
    tree.outOfBoundsKill = true;
    return tree;
}

function hitObstacle(actor, obstacle) {
    dragonF.play('dragonF_explode');
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
