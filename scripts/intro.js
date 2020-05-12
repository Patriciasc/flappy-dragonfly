class intro extends Phaser.Scene {
    constructor() {
        super("introS");
    }

    create() {
        var text = this.add.text(20, 20, "Loading game...");
        this.input.keyboard.on('keydown_ENTER', this.startGame, this);
    }

    startGame() {
        this.scene.start("level1S");
    }
}