class intro extends Phaser.Scene {
    constructor() {
        super("introS");
    }

    create() {
        var text = this.add.text(20, 20, "Loading game...");
        this.scene.start("level1S");

        //var keyObj = this.scene.input.keyboard.addKey('ENTER');  // Get key object
        //keyObj.on('down', function (event) { this.scene.start("level1S");});
    }
}