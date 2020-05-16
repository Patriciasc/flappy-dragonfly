class Rating extends Phaser.Scene {
    constructor() {
        super("ratingS");
    }

    preload() {
        this.load.image('dragonFly_rating', 'assets/images/dragonF_rating.png');
    }

    create() {
        this.cameras.main.backgroundColor.setTo(69, 179, 224);
        this.add.image(150, 250, 'dragonFly_rating');
        var text = this.add.text(270, 40, "*** Rating *** ", { fontSize: '40px', fill: '#fff' });

        var y = 130;
        var totalPoints = 0;
        for (const player in players) {
            totalPoints += players[player].points;
            this.add.text(270, y, `${player}: ${players[player].points}`, { fontSize: '25px', fill: '#fff' });
            y -=40;
        }

        if (totalPoints > 0 && level < 3) {
            level++;
            this.add.text(250, 420, "Press ENTER to level up!", { fontSize: '25px', fill: '#fff' }).setStroke('#E52828', 5);
            this.input.keyboard.on('keydown_ENTER', this.loadNextLevel, this);
        } else {
            this.add.text(200, 420, "Press SPACE to start again!", { fontSize: '25px', fill: '#fff' }).setStroke('#E52828', 5);
            this.input.keyboard.on('keydown_SPACE', this.reStartGame, this);
        }
    }

    reStartGame() {
        this.scene.stop();
        this.sys.game.destroy(true);
        game = new Phaser.Game(config);
    }

    loadNextLevel() {
        this.scene.stop();
        this.scene.start("level1S");
    }
}