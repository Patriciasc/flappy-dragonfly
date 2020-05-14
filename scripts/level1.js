class level1 extends Phaser.Scene {
    constructor() {
        super("level1S");

        self = this;
        this.dragonF = null;
        this.trees = null;
        this.cursor = null;
        this.moreTrees = 0;
        this.birds = null;
        this.birdAnims = null;
        this.timer = null;
        this.lifesNum = 3;
        this.lifesNumBee = 3; //TODO: refactor in player object or similar
        this.lifes = null;
        this.counter = "";
        this.initialTime = 60000;
        this.lifeY = 30;
        this.points = 30;
        this.multiPlayer = true;
        this.bee = null;
    }

    preload() {
        this.load.image('background', 'assets/images/background.png');
        this.load.spritesheet('dragonF_fly', 'assets/images/dragonF_flying.png', { frameWidth: 243, frameHeight: 195 });
        this.load.spritesheet('dragonF_explode', 'assets/images/dragonF_explode.png', { frameWidth: 378, frameHeight: 211 });
        this.load.image('tree', 'assets/images/tree2_psc.png');
        this.load.atlas('bird', 'assets/images/bird_flying.png', 'assets/images/bird_flying.json');
        this.load.image('heart_full', 'assets/images/heart_full.png');
        this.load.image('heart_empty', 'assets/images/heart_empty.png');
        this.load.image('bee', 'assets/images/bee.png');

        this.load.audio('fly', 'assets/sounds/fly.mp3');
        this.load.audio('hit', 'assets/sounds/hit.ogg');
        this.load.audio('die', 'assets/sounds/die.ogg');
    }

    create() {
        this.add.image(400, 250, 'background');

        this.counter = this.add.text(800, 15,"", { fontSize: '30px', fill: '#fff' });

        // lifes
        this.lifes = this.add.group();
        var x = 40;

        for (var i = 0; i < this.lifesNum; i++) {
            var life = this.lifes.create(x, this.lifeY, 'heart_full');
            life.setScale(0.05);
            life.tint = 0x9000bc;
            life.setTintFill(0x9000bc);
            x += 30;
        }

        for (var i = 0; i < this.lifesNumBee; i++) {
            var life = this.lifes.create(x, this.lifeY, 'heart_full');
            life.setScale(0.05);
            life.tint = 0x9000bc;
            life.setTintFill(0x9000bc);
            x += 30;
        }

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

        // dragonFly
        this.dragonF = this.physics.add.sprite(100, 100, 'dragonF_fly');
        this.dragonF.setScale(0.30);
        this.dragonF.setBounce(0.4);
        this.dragonF.setCollideWorldBounds(true);
        this.dragonF.body.onWorldBounds = true;
        this.dragonF.body.setGravityY(100);
        this.dragonF.body.immovable = true;
        this.dragonF.setDepth(1);
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
        this.dragonF.play('dragonF_fly');

        //bee
        this.bee = this.physics.add.sprite(100, 100, 'bee').setScale(0.05);
        this.bee.setBounce(0.4);
        this.bee.setCollideWorldBounds(true);
        this.bee.body.onWorldBounds = true;
        this.bee.body.setGravityY(100);
        this.bee.body.immovable = true;
        this.bee.setDepth(1);

        // Keys control
        this.cursor = this.input.keyboard.createCursorKeys();
        this.input.keyboard.on('keydown_SPACE', this.flyBee, this);

        // Obstacles:
        // trees
        this.trees = this.physics.add.group();

        //birds
        this.birds = this.physics.add.group();

        // Collision control
        this.physics.add.collider(this.dragonF, this.trees, this.hitObstacle, null, this);
        this.physics.add.collider(this.dragonF, this.birds, this.hitObstacle, null, self);

        this.physics.add.collider(this.bee, this.trees, this.hitObstacle, null, this);
        this.physics.add.collider(this.bee, this.birds, this.hitObstacle, null, self);

        // Timer
        this.timer = this.time.delayedCall(this.initialTime, this.loadNextLevel, [], this);
    }

    flyBee() {
        this.bee.setVelocityY(-450);
    }

    loadNextLevel() {
        // Load next level
        this.scene.start("ratingS", {points: this.points});
        // Maybe helpful
        //self.scene.restart();
        //this.anims.pauseAll();
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
        var bird = self.physics.add.sprite(tree.x + 200, tree.y - 200, 'bird');
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
            //Remove obstacle collisions once is hit
            obstacle.body.checkCollision.none = true;
            this.cameras.main.shake(80);
            var life = this.lifes.children.entries[this.lifesNum - 1];
            life.destroy();
            life = this.add.image(life.x, this.lifeY, 'heart_empty').setScale(0.05);
            life.setTintFill(0x9000bc);
            this.lifesNum--;
            this.points -= 10;
            if (this.lifesNum === 0) return this.gameOver();
        }
    }

    gameOver() {
        this.sound.add('die').play({
            volume: .1,
            loop: false
        });

        this.dragonF.play('dragonF_explode');
        this.dragonF.setTint(0xff0000);
        //TODO: make it fall to the floor? :D

        self.cameras.main.shake(500);
        self.physics.pause();
        this.trees.clear();

        this.birdAnims.pause();
        this.birds.clear();

        var statusText = self.add.text(game.config.width / 2 - 120, game.config.height / 2 - 50, 'GAME OVER', { fontSize: '50px', fill: '#fff' });
        statusText.setDepth(1);
        statusText.setStroke('#E52828', 20);

        self.timer.remove();
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
            this.dragonF.setVelocityY(-250);
        }

        this.counter.setText(((this.initialTime/1000)-this.timer.getElapsedSeconds()).toString().substr(0,2).replace('.',''));
    }

}