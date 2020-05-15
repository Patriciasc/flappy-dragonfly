var points = 30;
var lifeCount = 3;

class Player {
    constructor(obj) {
        this.obj = obj;
        this.points = points;
        this.lifeCount = lifeCount;
        this.lifes = null;
    }
}

class Level1 extends Phaser.Scene {
    constructor() {
        super("level1S");

        this.dragonF = null;
        this.trees = null;
        this.cursor = null;
        this.moreTrees = 0;
        this.birds = null;
        this.birdAnims = null;
        this.timer = null;
        this.counter = "";
        this.initialTime = 60000;
        this.lifeY = 30;
        this.players = {};
    }

    init(data) {
        // Check user selection for multiplayer.
        this.multiPlayer = data.multiPlayer;
    }

    preload() {
        // Load necessary assets
        this.loadImages();
        this.loadSounds();
    }

    create() {
        // Add background
        this.add.image(400, 250, 'background');

        // Add counter
        this.counter = this.add.text(800, 15,"", { fontSize: '30px', fill: '#fff' });

        // Add actors
        this.addActors();

        // Add Animations
        this.addAnimations();

        // Keys control
        this.cursor = this.input.keyboard.createCursorKeys();
        if (this.multiPlayer) {this.input.keyboard.on('keydown_SPACE', this.flyPlayer, this);}

        // Add Obstacles
        // trees
        this.trees = this.physics.add.group();

        //birds
        this.birds = this.physics.add.group();

        // Add collision control
        this.physics.add.collider(this.players['dragonF_fly'].obj, this.trees, this.hitObstacle, null, this);
        this.physics.add.collider(this.players['dragonF_fly'].obj, this.birds, this.hitObstacle, null, this);

        if (this.multiPlayer) {
            this.physics.add.collider(this.players['bee'].obj, this.trees, this.hitObstacle, null, this);
            this.physics.add.collider(this.players['bee'].obj, this.birds, this.hitObstacle, null, this);
        }

        // Timer
        this.timer = this.time.delayedCall(this.initialTime, this.showRating, [], this);
    }

    addPlayer(x, y, key, scale, bounce, gravity) {
        this.player = this.physics.add.sprite(x, y, key).setScale(scale);
        this.player.setBounce(bounce);
        this.player.setCollideWorldBounds(true);
        this.player.body.onWorldBounds = true;
        this.player.body.setGravityY(gravity);
        this.player.body.immovable = true;
        this.player.setDepth(1);

        this.players[key] = new Player(this.player);
    }

    flyPlayer() {
        this.players['bee'].obj.setVelocityY(-450);
    }

    showRating() {
        this.scene.stop();
        this.scene.start("ratingS", {
            players: this.players,
            multiPlayer: this.multiPlayer
        });
    }

    addObstacles(x, y) {
        var tree = this.trees.create(x, y, 'tree');
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
                this.addBird(tree);
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

    addBird(tree) {
        var bird = this.physics.add.sprite(tree.x + 200, tree.y - 200, 'bird');
        this.birds.add(bird, false);
        bird.body.allowGravity = false;
        bird.setScale(0.25);
        bird.setVelocityX(-200);
        bird.body.immovable = true;
        bird.checkWorldBounds = true;
        bird.outOfBoundsKill = true;
        bird.play('bird_fly');
    }

    hitObstacle(actor, obstacle) {
        this.sound.add('hit').play({
            volume: .1,
            loop: false
        });

        if (obstacle !== undefined) {
            obstacle.body.checkCollision.none = true;
            this.cameras.main.shake(80);
            
            var key = actor.texture.key
            var life = this.players[key].lifes.children.entries[this.players[key].lifeCount - 1];
            life.destroy();
            life = this.add.image(life.x, this.lifeY, 'heart_empty').setScale(0.05);
            this.players[key].lifeCount--;
            this.players[key].points -= 10;

            key === 'bee' ? life.setTintFill(0xffff00) : life.setTintFill(0x9000bc);

            if (this.players[key].lifeCount === 0) return this.gameOver(key);

        }
    }

    gameOver(key) {
        this.sound.add('die').play({
            volume: .1,
            loop: false
        });

        this.players[key].obj.setTint(0xff0000);
        
        switch (key) {
            case 'dragonF_fly': 
                this.players[key].obj.play('dragonF_explode');
                this.add.text(game.config.width / 2 - 120, game.config.height / 2 - 80, 'dragonFly has lost!', { fontSize: '25px', fill: '#9000bc' }).setDepth(2);
                break;
            case 'bee':
                this.add.text(game.config.width / 2 - 80, game.config.height / 2 - 80, 'bee has lost!', { fontSize: '25px', fill: '#ffff00' }).setDepth(2);
                break;
        }

        //TODO: make it fall to the floor? :D

        this.cameras.main.shake(500);
        this.physics.pause();
        this.trees.clear();

        this.birdAnims.pause();
        this.birds.clear();

        var statusText = this.add.text(game.config.width / 2 - 130, game.config.height / 2 - 50, 'GAME OVER', { fontSize: '50px', fill: '#fff' });
        statusText.setDepth(1);
        statusText.setStroke('#E52828', 20);

        this.timer.remove();

        this.time.delayedCall(4000, this.showRating, [], this);
    }

    loadImages() {
        this.load.image('background', 'assets/images/background.png');
        this.load.spritesheet('dragonF_fly', 'assets/images/dragonF_flying.png', { frameWidth: 243, frameHeight: 195 });
        this.load.spritesheet('dragonF_explode', 'assets/images/dragonF_explode.png', { frameWidth: 378, frameHeight: 211 });
        this.load.image('tree', 'assets/images/tree2_psc.png');
        this.load.atlas('bird', 'assets/images/bird_flying.png', 'assets/images/bird_flying.json');
        this.load.image('heart_full', 'assets/images/heart_full.png');
        this.load.image('heart_empty', 'assets/images/heart_empty.png');
        if (this.multiPlayer) { this.load.image('bee', 'assets/images/bee.png') };
    }

    loadSounds() {
        this.load.audio('fly', 'assets/sounds/fly.mp3');
        this.load.audio('hit', 'assets/sounds/hit.ogg');
        this.load.audio('die', 'assets/sounds/die.ogg');
    }

    addActors() {
        // bee
        if (this.multiPlayer) {
            this.addPlayer(115, 100, 'bee', 0.05, 0.4, 100);
        }

        // dragonFly
        this.addPlayer(100, 100, 'dragonF_fly', 0.30, 0.4, 100);

        // load life for actors
        this.loadLife();
    }

    loadLife() {
        this.players['dragonF_fly'].lifes = this.add.group();

        if (this.multiPlayer) {
            this.players['bee'].lifes = this.add.group();
            var x2 = 150;
        }

        var x = 40;
        for (var i = 0; i < lifeCount; i++) {
            var life = this.players['dragonF_fly'].lifes.create(x, this.lifeY, 'heart_full');
            life.setScale(0.05);
            life.setTintFill(0x9000bc);
            x += 30;

            if (this.multiPlayer) {
                var blife = this.players['bee'].lifes.create(x2, this.lifeY, 'heart_full');
                blife.setScale(0.05);
                blife.setTintFill(0xffff00);
                x2 += 30;
            }
        }
    }

    addAnimations() {
        //dragonFly
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
        this.players['dragonF_fly'].obj.play('dragonF_fly');

        // bird
        this.birdAnims = this.anims.create({
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
    }

    update() {
        // trees
        this.moreTrees++;
        if (this.moreTrees === 100) {
            var tree = this.addObstacles(950, 350);
            tree.setOrigin(0, 0);
            this.trees.setVelocityX(-200);
            this.moreTrees = 0;
        }

        if (this.cursor.up.isDown) {
            this.sound.add('fly').play({
                volume: .05,
                loop: false
            });
            this.players['dragonF_fly'].obj.setVelocityY(-250);
        }

        this.counter.setText(((this.initialTime/1000)-this.timer.getElapsedSeconds()).toString().substr(0,2).replace('.',''));
    }

}