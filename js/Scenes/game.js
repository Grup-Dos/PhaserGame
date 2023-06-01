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
        this.enemigosGroup= null;
        this.normalEnemys=['enemigo1','enemigo2','enemigo3'];
        this.totalEnemys=0;
        this.puntos=0;
        this.textPoints=0;
        this.createEnemys=true;
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
        localStorage.clear();
	    var json = localStorage.getItem("config") || '{"puntsInici":0,"speed":6}';
        var game_data=JSON.parse(json);
        this.puntos=game_data.puntsInici;
        this.incrementSpeed=game_data.speed;
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
            this.textPoints = this.add.text(620, 30, "Puntos: " +this.puntos, { font: '32px Arial', fill: 'black' });
        }

        { //creacion enemigos y fisicas entre ellos.
            this.enemigosGroup = this.physics.add.group();
            this.crearEnemigos(this.normalEnemys, this.totalEnemys,Y1,Y2);
            this.agregarColisiones();
        }

    }
    agregarColisiones() {
        this.physics.add.overlap(this.player, this.enemigosGroup, this.handleCollision, null, this);
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
            enemigo.sprite.setData('enemigoData', enemigo); // Guardar enemigo como dato personalizado
            this.enemigosGroup.add(enemigo.sprite);

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
        this.textPoints.y=this.camera.scrollY;
        this.comprobar();
        if((this.player.y>660 && this.player.y<1150)&& this.createEnemys){
            this.crearEnemigos(this.normalEnemys,this.totalEnemys,400,500);
            this.crearEnemigos(this.hardEnemys,this.totalEnemys,660,1150);
            this.createEnemys=false;
        }
        console.log(this.player.y);
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

    movimientoEnemigos() {
        //por cada iteracion del forEach, calculamos en cada uno en funcion de su velocidad, la direccion donde irá y si toca las paredes, retorna en
        //sentido contrario
        this.enemigosGroup.getChildren().forEach(enemigoSprite => {
            const enemigo = enemigoSprite.getData('enemigoData');
            const velocidadX = enemigo.velocidad * enemigo.direccion;
            enemigoSprite.x += velocidadX;
            if (enemigoSprite.x <= 20 || enemigoSprite.x >= this.game.config.width - 20) {
                // Cambiar la dirección y girar la imagen
                enemigo.direccion *= -1;
                enemigo.flipX = !enemigo.flipX;
            }
        });
    }

    handleCollision(player, enemySprite) {
        // Obtener el tipo de enemigo colisionado
        const enemy = this.enemigosGroup.getChildren().find(enemigo => enemigo === enemySprite);
        const tipoEnemigo = enemy.texture.key;
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
        const enemigo = enemy.getData('enemigoData');
        this.puntos = parseInt(this.puntos, 10); // Convertir this.puntos a un número entero
        this.puntos += enemigo.puntos; // Sumar los puntos del enemigo a los puntos totales     
        // Buscar la sprite del enemigo en el mapa y destruirla
        enemy.destroy(); 
        this.enemigosGroup.remove(enemy);
        this.textPoints.destroy();
        this.textPoints = this.add.text(620, 30, "Puntos: " + this.puntos, { font: '32px Arial', fill: 'black' });   
     }
}