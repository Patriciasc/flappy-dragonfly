class Rating extends Phaser.Scene {
    constructor() {
        super("ratingS");
    }

    init(data) {
        this.points = data.points;
        this.pointsBee = data.pointsBee;
    }

    preload() {
        this.load.image('dragonFly_rating', 'assets/images/dragonF_rating.png');
    }

    create() {
        this.cameras.main.backgroundColor.setTo(69, 179, 224);
        this.add.image(150, 250, 'dragonFly_rating');
        var text = this.add.text(270, 40, "*** Rating *** ", { fontSize: '40px', fill: '#fff' });
        var text = this.add.text(270, 90, "dargonFly: " + this.points, { fontSize: '25px', fill: '#fff' });
        var text = this.add.text(270, 130, "bee: " + this.pointsBee, { fontSize: '25px', fill: '#fff' });

        this.input.keyboard.on('keydown_ENTER', this.reStartGame, this);
    }

    reStartGame() {
        this.sys.game.destroy(true);
        game = new Phaser.Game(config);
    }
}