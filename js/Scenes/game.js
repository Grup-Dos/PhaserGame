class GameScene extends Phaser.Scene {
    constructor (){
        super('GameScene');
        this.speed=0;
        this.incrementSpeed=3;
        this.cursors=null;
        this.camera=null;
        this.metros=0;
        this.background=null;
        this.player=null;
        this.lastIncrement=0;
        this.text = null; // Variable para almacenar el texto
        this.l_partida=null;
        this.enemigos= [];
        this.normalEnemys=['enemigo1','enemigo2','enemigo3'];
        this.totalEnemys=10;
        this.puntos=0;
        this.textPoints;
    }
    preload (){
        this.cameras.main.setBackgroundColor('#FFFFFF');
        this.load.image('boat','../images/Barco.jpg');
        this.load.image('background', '../images/PLACE_HOLDER_FONDO.jpg');
        this.load.image('canya', '../images/canyaPescar.png');
        this.load.image('enemigo1', '../images/enemy_1.png');
        this.load.image('enemigo2', '../images/enemy_2.png');
        this.load.image('enemigo3', '../images/enemy_3.png');

    }
    create (){
        var Y1=210;
        var Y2=500;
		/*var json = localStorage.getItem("config") || '{"puntsInici":1,"speed:9"}';
        var game_data=JSON.parse(json);
        this.metros=game_data.puntsInici;
        this.speed=game_data.speed;*/
        { //camera settings and other settings
        this.camera=this.cameras.main;
        this.camera.setBounds(0, 0, this.scale.width, this.scale.height*3);

        this.physics.world.setBounds(0, 0, this.scale.width, this.scale.height*3);

        this.cursors=this.input.keyboard.createCursorKeys();

        }
        const firstImageWidth=370;
        const firstImageHeight=100;
        
        { //Create background image
            const image = this.add.image(firstImageWidth, firstImageHeight, 'boat');  // Colocar la imagen en la esquina superior izquierda
            image.setScale(0.5);
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
        {  //UI
            this.text = this.add.text(10, 10, "Nivell: " + this.metros, { font: '32px Arial', fill: 'black' });
            this.textPoints = this.add.text(620, 30, "Puntos: 0", { font: '32px Arial', fill: 'black' });
        }

        { //creacion enemigos y fisicas entre ellos.
            this.crearEnemigos(this.normalEnemys, this.totalEnemys,Y1,Y2);
            //Esta linea es para detectar contra quien/es hemos colisionado.
            this.physics.add.overlap(this.player, this.enemigos.map(enemigo => enemigo.sprite), this.handleCollision, null, this);
        }

    }
    
    crearEnemigos(tiposEnemigos, totalEnemigos,Y1,Y2){
        for (let i = 0; i < totalEnemigos; i++) {
            const posX = Phaser.Math.RND.between(30, this.scale.width-20);
            const posY = Phaser.Math.RND.between(Y1, Y2);

            const tipoEnemigo = Phaser.Math.RND.pick(tiposEnemigos);

            const enemigo = {
                sprite: this.physics.add.sprite(posX, posY, tipoEnemigo).setScale(0.1),
                puntos: Phaser.Math.RND.integerInRange(1, 25),
                velocidad: Phaser.Math.RND.between(1, 3), // Velocidad aleatoria
                direccion: 1, // Dirección inicial hacia la derecha (1) o izquierda (-1)
                tipo: tipoEnemigo
            };
            this.enemigos.push(enemigo);
        }
    }
    update (){
        this.movimientoEnemigos();
        this.text.destroy(); // Eliminar el texto anterior
        this.text = this.add.text(10, 10, "Nivell: " + this.metros, { font: '32px Arial', fill: 'black' });
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
        if(this.enemigos.length > 0){
            for (let i = 0; i < this.enemigos.length; i++) {
                const enemigo = this.enemigos[i];
                const velocidadX = enemigo.velocidad * enemigo.direccion;
                enemigo.sprite.x += velocidadX;

                if (enemigo.sprite.x <= 20 || enemigo.sprite.x >= this.game.config.width-20) {
                    // Cambiar la dirección y girar la imagen
                    enemigo.direccion *= -1;
                    enemigo.sprite.flipX = !enemigo.sprite.flipX;
                }
            }
        }
    }
    handleCollision(player, enemySprite) {
        // Obtener el tipo de enemigo colisionado
        const enemy = this.enemigos.find(enemigo => enemigo.sprite === enemySprite);
        const tipoEnemigo = enemy.tipo;
        // Realizar acciones según el tipo de enemigo
        switch (tipoEnemigo) {
            case 'enemigo1':
                // Realizar acciones para el enemigo1
                this.tractarColision(enemy);
                break;
            case 'enemigo2':
                // Realizar acciones para el enemigo2
                this.tractarColision(enemy);
                break;
            case 'enemigo3':
                // Realizar acciones para el enemigo2
                this.tractarColision(enemy);
                break;
        }
    }
    tractarColision(enemy) {
        // Obtener los puntos del enemigo
        const puntosEnemigo = enemy.puntos;
        this.puntos += puntosEnemigo; // Sumar los puntos del enemigo a los puntos totales
        this.textPoints.setText('Puntos: ' + this.puntos);
        enemy.destroy();
    }
}