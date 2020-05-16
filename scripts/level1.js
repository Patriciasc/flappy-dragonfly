const points = 30;
const lifeCount = 3;

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
        this.initialTime = 6000;
        this.lifeY = 30;
        this.speed = 100;
        this.gameFinished = false;
        this.mainTheme = null;
    }

    init(data) {
        // Check user selection for multiplayer.
        this.multiPlayer = data.multiPlayer;
        if (this.mainTheme) this.mainTheme.stop();
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
        this.physics.add.collider(players['dragonF_fly'].obj, this.trees, this.hitObstacle, null, this);
        this.physics.add.collider(players['dragonF_fly'].obj, this.birds, this.hitObstacle, null, this);

        if (this.multiPlayer) {
            this.physics.add.collider(players['bee'].obj, this.trees, this.hitObstacle, null, this);
            this.physics.add.collider(players['bee'].obj, this.birds, this.hitObstacle, null, this);
        }

        // Timer
        this.timer = this.time.delayedCall(this.initialTime, this.timeIsOut, [], this);

        // Level
        if (level >= 3) this.speed /= 2;

        // Play game sound theme
       this.mainTheme = this.sound.add('gameTheme');
       this.mainTheme.play({
            volume: .03,
            loop: true
        });
        console.log(this.mainTheme);
    }

    addPlayer(x, y, key, scale, bounce, gravity) {
        this.player = this.physics.add.sprite(x, y, key).setScale(scale);
        this.player.setBounce(bounce);
        this.player.setCollideWorldBounds(true);
        this.player.body.onWorldBounds = true;
        this.player.body.setGravityY(gravity);
        this.player.body.immovable = true;
        this.player.setDepth(1);

        players[key] = new Player(this.player);
    }

    flyPlayer() {
        players['bee'].obj.setVelocityY(-450);
    }

    timeIsOut() {
        this.gameFinished = true;
        this.showRating();
    }

    showRating() {
        this.scene.stop();
        this.scene.start("ratingS", {gameFinished: this.gameFinished});
    }

    addObstacles(x, y) {
        var tree = this.trees.create(x, y, 'tree');
        var treeType = Math.floor(Math.random() * 5);
        switch (treeType) {
            case 0:
                tree.scaleX = .3;
                tree.y += 60;
                break;
            case 1:
                tree.scaleX = .2;
                tree.y += 100;
                if (level >= 2) this.addBird(tree);
                break;
            case 2:
                tree.scaleX = .3;
                break;
            case 3:
                tree.y += 170;
                tree.scaleX = .5;
                this.addBird(tree);
                break;
            case 4:
                tree.scaleX = .2;
                tree.y += 30;
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
        //Math.floor(Math.random()*(max-min+1)+min);
        var y = Math.floor(Math.random() * (280 - 180 + 1) + 180);
        var bird = this.physics.add.sprite(tree.x + 80, y, 'bird');
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
            volume: .05,
            loop: false
        });

        if (obstacle !== undefined) {
            obstacle.body.checkCollision.none = true;
            this.cameras.main.shake(80);
            
            var key = actor.texture.key
            var life = players[key].lifes.children.entries[players[key].lifeCount - 1];
            life.destroy();
            life = this.add.image(life.x, this.lifeY, 'heart_empty').setScale(0.05);
            players[key].lifeCount--;
            players[key].points -= 10;

            key === 'bee' ? life.setTintFill(0xffd300) : life.setTintFill(0x9000bc);

            if (players[key].lifeCount === 0) return this.gameOver(key);

        }
    }

    gameOver(key) {
        this.gameFinished= false;

        console.log(this.mainTheme);
        this.mainTheme.stop();

        this.sound.add('die').play({
            volume: .1,
            loop: false
        });

        players[key].obj.setTint(0xff0000);
        
        switch (key) {
            case 'dragonF_fly': 
                players[key].obj.play('dragonF_explode');
                this.add.text(game.config.width / 2 - 120, game.config.height / 2 - 80, 'dragonFly has lost!', { fontSize: '25px', fill: '#9000bc' }).setDepth(2);
                break;
            case 'bee':
                players['bee'].obj.play('bee_hit');
                this.add.text(game.config.width / 2 - 80, game.config.height / 2 - 80, 'bee has lost!', { fontSize: '25px', fill: '#ffd300' }).setDepth(2);
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
        this.load.atlas('bird', 'assets/images/bb_flying.png', 'assets/images/bb_flying.json');
        this.load.image('heart_full', 'assets/images/heart_full.png');
        this.load.image('heart_empty', 'assets/images/heart_empty.png');
        //if (this.multiPlayer) { this.load.image('bee', 'assets/images/bee.png') };
        if (this.multiPlayer) { 
            this.load.atlas('bee', 'assets/images/bee.png', 'assets/images/bee.json');
            this.load.atlas('bee_hit', 'assets/images/bee_hit.png', 'assets/images/bee_hit.json');
         };

    }

    loadSounds() {
        this.load.audio('fly', 'assets/sounds/fly.mp3');
        this.load.audio('hit', 'assets/sounds/hit.ogg');
        this.load.audio('die', 'assets/sounds/die.ogg');
        this.load.audio('gameTheme', 'assets/sounds/gameTheme.wav');
    }

    addActors() {
        // bee
        if (this.multiPlayer) {
            this.addPlayer(115, 100, 'bee', 0.3, 0.4, 100);
        }

        // dragonFly
        this.addPlayer(100, 100, 'dragonF_fly', 0.3, 0.4, 100);

        // load life for actors
        this.loadLife();
    }

    loadLife() {
        players['dragonF_fly'].lifes = this.add.group();

        if (this.multiPlayer) {
            players['bee'].lifes = this.add.group();
            var x2 = 150;
        }

        var x = 40;
        for (var i = 0; i < lifeCount; i++) {
            var life = players['dragonF_fly'].lifes.create(x, this.lifeY, 'heart_full');
            life.setScale(0.05);
            life.setTintFill(0x9000bc);
            x += 30;

            if (this.multiPlayer) {
                var blife = players['bee'].lifes.create(x2, this.lifeY, 'heart_full');
                blife.setScale(0.05);
                blife.setTintFill(0xffd300);
                x2 += 30;
            }
        }
    }

    addAnimations() {
        // bird
        this.birdAnims = this.anims.create({
            key: 'bird_fly',
            frames: this.anims.generateFrameNames('bird', {
                start: 1,
                end: 10,
                zeroPad: 2,
                prefix: 'bb',
                suffix: '.png'
            }),
            frameRate: 40,
            repeat: -1
        });

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
        players['dragonF_fly'].obj.play('dragonF_fly');

        // bee
        if (this.multiPlayer) {
            this.anims.create({
                key: 'bee_hit',
                frames: this.anims.generateFrameNames('bee_hit', {
                    start: 1,
                    end: 5,
                    zeroPad: 2,
                    prefix: 'bee_hit',
                    suffix: '.png'
                }),
                frameRate: 10,
                repeat: -1
            });

            this.anims.create({
                key: 'bee_fly',
                frames: this.anims.generateFrameNames('bee', {
                    start: 1,
                    end: 6,
                    zeroPad: 2,
                    prefix: 'bee',
                    suffix: '.png'
                }),
                frameRate: 10,
                repeat: -1
            });
            players['bee'].obj.play('bee_fly');
        }
    }

    update() {
        // trees
        this.moreTrees++;

        if (this.moreTrees === this.speed) {
            var tree = this.addObstacles(950, 350);
            tree.setOrigin(0, 0);
            this.trees.setVelocityX(-200);
            this.moreTrees = 0;
        }

        if (this.cursor.up.isDown) {
            this.sound.add('fly').play({
                volume: .015,
                loop: false
            });
            players['dragonF_fly'].obj.setVelocityY(-250);
        }

        this.counter.setText(((this.initialTime/1000)-this.timer.getElapsedSeconds()).toString().substr(0,2).replace('.',''));
    }

}