class GameScene extends Phaser.Scene {
    constructor (){
        super('GameScene');
        this.speed=0;
        this.cursors=null;
        this.camera=null;
        this.metros=0;
        this.background=null;
        this.player=null;
        this.lastIncrement=0;
    }
    preload (){
        this.load.image('boat','../images/Barco.jpg');
        this.load.image('background', '../images/PLACE_HOLDER_FONDO.jpg');
        this.load.image('canya', '../images/canyaPescar.png');
    }
    create (){
        this.camera=this.cameras.main;
        this.cameras.main.setBounds(0, 0, this.scale.width, this.scale.height*1.2);
        this.cursors=this.input.keyboard.createCursorKeys();
        const firstImageWidth=370;
        const firstImageHeight=100;
        const image = this.add.image(firstImageWidth, firstImageHeight, 'boat');  // Colocar la imagen en la esquina superior izquierda
        image.setScale(0.5);

        this.background=this.add.tileSprite(firstImageWidth*1.1, firstImageHeight*4,0,0,'background')
            .setScale(1.1)
            .setScrollFactor(0, 0);
            
        {   //Player
            this.player= this.physics.add.sprite(firstImageWidth, firstImageHeight,'canya')
                .setScale(0.1)
                .updateBounds();
            this.player.setCollideWorldBounds(true);
        }
        {   //Camera
            this.camera.startFollow(this.player);
            this.camera.setFollowOffset(0, 30);
        }
        }
    update (){
        if(this.cursors.down.isDown) {
            this.speed=3;
         } 
         else if(this.cursors.up.isDown) {
            this.speed=-3;
         }
        else 
            this.speed=0;
        this.player.y+=this.speed;
        this.background.tilePositionY = this.camera.scrollY*1.1;
        this.comprobar();
    }
    comprobar(){
        if (this.speed > 0 && this.player.y - this.lastIncrementPosition >= 10) {
            // Cada vez que la cámara se desplace 10 píxeles hacia abajo, aumenta una variable en 1
            this.metros += 1;
            this.lastIncrementPosition = this.player.y;
        }
        if(this.speed<0 && this.player.y - this.lastIncrementPosition <= -10){
            this.metros-=1;
            this.lastIncrementPosition = this.player.y;
        }
        else if(this.player.y<=200){
            this.metros=0;
            this.lastIncrementPosition = null;
        }
        console.log('Player y:'," ", this.player.y," ", 'Metros:', this.metros);
    }
}