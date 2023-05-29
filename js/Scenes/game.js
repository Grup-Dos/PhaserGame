class GameScene extends Phaser.Scene {
    constructor (){
        super('GameScene');
        this.speed=10;
        this.keyS = Phaser.Input.Keyboard.KeyCodes.S;
        this.keyW = Phaser.Input.Keyboard.KeyCodes.W;
        this.camera=Phaser.Cameras.Scene2D.camera;
    }
    preload (){
        this.load.image('boat','../images/Barco.jpg');
        this.load.image('background', '../images/PLACE_HOLDER_FONDO.jpg');
    }
    create (){
        const firstImageWidth=370;
        const firstImageHeight=100;
        const width = this.scale.width;
        const height = this.scale.height;
        const image = this.add.image(firstImageWidth, firstImageHeight, 'boat');  // Colocar la imagen en la esquina superior izquierda
        image.setScale(0.5);
        this.add.image(firstImageWidth*1.1, firstImageHeight*4,'background')
            .setScale(1.1);
    }
    update (){
        if(this.keyS.isDown) {
            this.camera.scrollY+=this.speed;
            console.log('scroll');
         } else if(this.keyW.isDown) {
            this.camera.scrollY-=this.speed;
            console.log('scroll W');
         } 
    }
}