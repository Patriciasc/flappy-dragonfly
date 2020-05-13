class intro extends Phaser.Scene {
    constructor() {
        super("introS");

        this.timer = 0;
        this.text = "";
    }

    preload() {
        this.load.image('dragonFly_intro', 'assets/images/dragonFly_intro.png');
    }

    create() {
        this.cameras.main.backgroundColor.setTo(69, 179, 224);
        this.add.image(400, 250, 'dragonFly_intro');

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
        this.scene.start("level1S");
    }
}