class Intro extends Phaser.Scene {
    constructor() {
        super("introS");

        self = this;
        this.timer = 0;
        this.text1p = "";
        this.text2p = "";
        this.multiPlayer = false;
    }

    preload() {
        this.load.image('dragonFly_intro', 'assets/images/dragonFly_intro.png');
    }

    create() {
        this.cameras.main.backgroundColor.setTo(69, 179, 224);
        this.add.image(400, 250, 'dragonFly_intro');

        this.add.text(50, 50, "Welcome to flappy dragonfly!", {fontSize: '43px'});
        this.text1p = this.add.text(200, 420, "1 player", { fontSize: '20px', fill: '#fff' }).setStroke('#E52828', 5);
        this.text2p = this.add.text(this.text1p.x + 290, 420, "2 players", { fontSize: '20px', fill: '#fff' }).setStroke('#E52828', 5);
        
        this.text1p.setInteractive().on('pointerdown', function () {
            self.multiPlayer = false;
            self.startGame();
        });

        this.text2p.setInteractive().on('pointerdown', function () {
            self.multiPlayer = true;
            self.startGame();
        });

        this.timer = this.time.addEvent({
            delay: 800,
            callback: this.updateText,
            callbackScope: this,
            loop: true
        });

        // 1 player by default
        this.input.keyboard.on('keydown_ENTER', this.startGame, this);
    }

    updateText() {
        this.text1p.visible = !this.text1p.visible;
        this.text2p.visible = !this.text2p.visible;
    }

    startGame() {
        this.scene.transition({
            target: 'level1S',
            data: { multiPlayer: this.multiPlayer }
        });
    }
}