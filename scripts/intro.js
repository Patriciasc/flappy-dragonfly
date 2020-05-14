class intro extends Phaser.Scene {
    constructor() {
        super("introS");

        self = this;
        this.timer = 0;
        this.text = "";
        this.soundIcon = null;
        this.soundActive = true;
    }

    preload() {
        this.load.image('dragonFly_intro', 'assets/images/dragonFly_intro.png');
        this.load.image('sound', 'assets/images/sound.png');
        this.load.image('mute', 'assets/images/mute.png');
    }

    create() {
        this.cameras.main.backgroundColor.setTo(69, 179, 224);
        this.add.image(400, 250, 'dragonFly_intro');
        this.soundIcon = this.add.image(30, 470, 'sound').setScale(0.03);

        this.soundIcon.setInteractive().on('pointerdown', function () {
            this.soundActive = !this.soundActive;

            if (!this.soundActive) {
                this.setTexture('mute');
            } else {
                this.setTexture('sound');
            }
            console.log(this.soundActive);
        });
        
        this.add.text(50, 50, "Welcome to flappy dragonfly!", {fontSize: '43px'});
        this.text = this.add.text(game.config.width / 2 - 180, game.config.height / 2 + 170, "Press ENTER to start playing", { fontSize: '20px', fill: '#fff' });
        this.text.setStroke('#E52828', 5);
        this.timer = this.time.addEvent({
            delay: 800,
            callback: this.updateText,
            callbackScope: this,
            loop: true
        });

        this.input.keyboard.on('keydown_ENTER', this.startGame, this);
    }

    updateText() {
        this.text.visible = !this.text.visible;
    }

    startGame() {
        console.log("soundActive: "+this.soundActive);
        this.scene.start("level1S", { soundActive: this.soundActive });
    }
}