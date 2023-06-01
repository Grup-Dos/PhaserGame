class GameScene extends Phaser.Scene {
    constructor (){
        super('GameScene');
        this.speed=0;
        this.incrementSpeed=9;
        this.cursors=null;
        this.camera=null;
        this.metros=0;
        this.background=null;
        this.player=null;
        this.lastIncrement=0;
        this.text = null; // Variable para almacenar el texto
        this.l_partida=null;
        this.enemigos= [];
        /*this.algo={
            vida: 100,
            velocidad: 100,
            velocidadMaxima: 100,
            velocidadMinima: 100,
            velocidadIncremento: 100,
            velocidadIncrementoMaxima: 100,
        }*/
    }
    preload (){
        this.load.image('boat','../images/Barco.jpg');
        this.load.image('background', '../images/PLACE_HOLDER_FONDO.jpg');
        this.load.image('canya', '../images/canyaPescar.png');
    }
    create (){
        /*
        var Y1=210;
        var Y2=500;
        const normalEnemys=['enemigo1','enemigo2','enemigo3'];
        const totalEnemys=10;
        this.crearEnemigos(normalEnemys, totalEnemys,Y1,Y2);
        */
		/*var json = localStorage.getItem("config") || '{"puntsInici":1,"speed:9"}';
        var game_data=JSON.parse(json);
        this.metros=game_data.puntsInici;
        this.speed=game_data.speed;*/
        this.camera=this.cameras.main;
        this.camera.setBounds(0, 0, this.scale.width, this.scale.height*3);

        this.physics.world.setBounds(0, 0, this.scale.width, this.scale.height*3);

        this.cursors=this.input.keyboard.createCursorKeys();

        const firstImageWidth=370;
        const firstImageHeight=100;

        const image = this.add.image(firstImageWidth, firstImageHeight, 'boat');  // Colocar la imagen en la esquina superior izquierda
        image.setScale(0.5);
        
        { //Create background image
            let k=4;
            for(let i=0; i<6; i++){
                this.background=this.add.tileSprite(firstImageWidth*1.1, firstImageHeight*k,0,0,'background')
                    .setScale(1.1);
                k+=4.5;
            }
        }
        {   //Player
            this.player= this.physics.add.sprite(firstImageWidth, firstImageHeight,'canya')
                .setScale(0.1);
            this.player.setCollideWorldBounds(true);
        }
        {   //Camera
            this.camera.startFollow(this.player);
            this.camera.setFollowOffset(0, 30);
        }
        //nomObjecta.destroy();
        this.text = this.add.text(10, 10, "Nivell: " + this.metros, { font: '32px Arial', fill: 'white' });
        }
    /*crearEnemigos(tiposEnemigos, totalEnemigos,Y1,Y2){
        for (let i = 0; i < totalEnemigos; i++) {
            const posX = Phaser.Math.RND.between(0, this.scale.width);
            const posY = Phaser.Math.RND.between(Y1, Y2);

            const tipoEnemigo = Phaser.Math.RND.pick(tiposEnemigos);

            const enemigo = {
                sprite: this.add.image(posX, posY, tipoEnemigo),
                puntos: Phaser.Math.RND.integerInRange(1, 100),
                velocidad: Phaser.Math.RND.between(1, 5), // Velocidad aleatoria
                direccion: 1, // Dirección inicial hacia la derecha (1) o izquierda (-1)
            };

            this.enemigos.push(enemigo);
        }
    }*/
    update (){
        while(this.enemigos.length > 0){
            this.movimientoEnemigos();
        }
        this.text.destroy(); // Eliminar el texto anterior
        this.text = this.add.text(10, 10, "Nivell: " + this.metros, { font: '32px Arial', fill: 'white' });
        if(this.cursors.down.isDown) {
            this.speed=this.incrementSpeed;
         } 
         else if(this.cursors.up.isDown) {
            this.speed=-this.incrementSpeed;
         }
        else 
            this.speed=0;
        this.player.y+=this.speed;
        //this.background.tilePositionY = this.camera.scrollY*3;
        this.text.y=this.camera.scrollY;
        this.comprobar();
    }
    comprobar(){
        if (this.speed > 0 && this.player.y - this.lastIncrementPosition >= 10) {
            // Cada vez que la cámara se desplace 10 píxeles hacia abajo, aumentamos los metros
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
        //console.log('Player y:'," ", this.player.y," ", 'Metros:', this.metros," ", this.speed);
    }

    movimientoEnemigos(){
        for (let i = 0; i < this.enemigos.length; i++) {
            const enemigo = this.enemigos[i];
            const velocidadX = enemigo.velocidad * enemigo.direccion;
            enemigo.sprite.x += velocidadX;

            if (enemigo.sprite.x <= 0 || enemigo.sprite.x >= this.game.config.width) {
                // Cambiar la dirección y girar la imagen
                enemigo.direccion *= -1;
                enemigo.sprite.flipX = !enemigo.sprite.flipX;
            }
        }
    }
}