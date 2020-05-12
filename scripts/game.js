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

var self = null;
var game = new Phaser.Game(config);
var dragonF = null;
var trees = null;
var cursor = null;
var moreTrees = 0;
var birds = null;
var birdAnims = null;
var timer = null;
var statusText = null;
var lifesNum = 3;
var lifes = null;

function preload() {
    this.load.image('background', 'assets/images/background.png');
    this.load.spritesheet('dragonF_fly', 'assets/images/dragonF_flying.png', { frameWidth: 243, frameHeight: 195 });
    this.load.spritesheet('dragonF_explode', 'assets/images/dragonF_explode.png', { frameWidth: 378, frameHeight: 211 });
    this.load.image('tree', 'assets/images/tree2_psc.png');
    this.load.atlas('bird', 'assets/images/bird_flying.png', 'assets/images/bird_flying.json');
    this.load.image('heart_full', 'assets/images/heart_full.png');
    this.load.image('heart_empty', 'assets/images/heart_empty.png');
}

function create() {

    self = this;

    this.add.image(400, 250, 'background');

    // lifes
    lifes = this.add.group();
    var x = 40; 
    var y = 40;

    for (var i = 0; i < lifesNum; i++) {
        var life = lifes.create(x, y,'heart_full');
        life.setScale(0.05);
        x += 30;
    }

    // bird
    birdAnims =this.anims.create({
        key: 'bird_fly',
        frames: this.anims.generateFrameNames('bird', {
            start: 1,
            end: 10,
            zeroPad: 4,
            prefix: 'Blue_Bird_Flying',
            suffix: '.png'
        }),
        frameRate: 60,
        repeat: -1
    });

    // dragonFly
    dragonF = this.physics.add.sprite(100, 100, 'dragonF_fly');
    dragonF.setScale(0.30);
    dragonF.setBounce(0.4);
    dragonF.setCollideWorldBounds(true);
    dragonF.body.onWorldBounds = true;
    dragonF.body.setGravityY(100);
    dragonF.body.immovable = true;
    dragonF.setDepth(1);
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

    // Obstacles:
    // trees
    trees = this.physics.add.group();

    //birds
    birds = this.physics.add.group();

    // Collision control
    this.physics.add.collider(dragonF, trees, hitObstacle, null, this);

    // Timer
    timer = this.time.delayedCall(20000, loadNextLevel, [], this);
}

function loadNextLevel() {
    // Show current puntuaction
    // Load next level
    // Maybe helpful
    //self.scene.restart();
    //this.anims.pauseAll();
    console.log("time is gone");
}

function addObstacles(x, y) {
    var tree = trees.create(x, y, 'tree');
    var treeType = Math.floor(Math.random() * 5);
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
            addBird(tree);
            break;
        case 4:
            tree.y += 60;
            break;
        default:
            break;
    }
    tree.body.allowGravity = false;
    tree.body.immovable = true;
    tree.checkWorldBounds = true;
    tree.outOfBoundsKill = true;
    return tree;
}

function addBird(tree){
    var bird = self.physics.add.sprite(tree.x + 200, tree.y - 200, 'bird');
    birds.add(bird, false);
    bird.body.allowGravity = false;
    bird.setScale(0.25);
    bird.setVelocityX(-200);
    bird.body.immovable = true;
    bird.checkWorldBounds = true;
    bird.outOfBoundsKill = true;
    bird.play('bird_fly');
    self.physics.add.collider(dragonF, bird, hitObstacle, null, self);
}

function hitObstacle(actor, obstacle) {
    if (obstacle !== undefined) {
        //Remove obstacle collisions once is hit
        obstacle.body.checkCollision.none = true;
        this.cameras.main.shake(80);
        var life = lifes.children.entries[lifesNum-1];
        life.destroy();
        life = this.add.image(life.x, 40, 'heart_empty').setScale(0.05);
        lifesNum--;
        if (lifesNum === 0) return gameOver();
    }
}

function gameOver() {
    dragonF.play('dragonF_explode');
    dragonF.setTint(0xff0000);

    self.cameras.main.shake(500);
    self.physics.pause();
    trees.clear();

    birdAnims.pause();
    birds.clear();

    statusText = self.add.text(game.config.width / 2 - 120, game.config.height / 2 - 50, 'GAME OVER', { fontSize: '50px', fill: '#fff' });
    statusText.setDepth(1);
    statusText.setStroke('#E52828', 20);
}

function update() {
    // trees
    moreTrees++
    if (moreTrees === 100) {
        var tree = addObstacles(950, 350);
        tree.setOrigin(0, 0);
        trees.setVelocityX(-200);
        moreTrees = 0;
    }

    if (cursor.up.isDown) {
        dragonF.setVelocityY(-250);
    }
}
