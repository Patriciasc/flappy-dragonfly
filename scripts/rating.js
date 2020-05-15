class rating extends Phaser.Scene {
    constructor() {
        super("ratingS");
    }

    init(data) {
        this.points = data.points;
    }

    preload() {
        this.load.image('dragonFly_rating', 'assets/images/dragonF_rating.png');
    }

    create() {
        this.cameras.main.backgroundColor.setTo(69, 179, 224);
        this.add.image(150, 250, 'dragonFly_rating');
        var text = this.add.text(270, 40, "*** Rating *** ", { fontSize: '40px', fill: '#fff' });
        var text = this.add.text(270, 90, "You: " + this.points, { fontSize: '25px', fill: '#fff' });

        this.input.keyboard.on('keydown_ENTER', this.startGame, this);
    }

    startGame() {
        this.scene.stop();
        this.scene.start("introS");
    }
}