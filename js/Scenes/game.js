class GameScene extends Phaser.Scene {
    constructor (){
        super('GameScene');
        this.speed=0;
        this.speedX=3;
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
        this.obstaclesGroup=null;
        this.normalEnemys=['enemigo1','enemigo2','enemigo3'];
        this.hardEnemys=['enemigo4','enemigo5'];
        this.rareEnemys=['gnomo,bobEsponja'];
        this.obstacles=['pedra1','pedra2','pedra3'];
        this.totalEnemys=10;
        this.totalObstacles=10;
        this.puntos=0;
        this.life=250;
        this.textPoints=0;
        this.createEnemys=true;
        this.pescarseASiMismo=false;
        this.lifeText;
        this.paused=false;
        this.pButton = null; // Variable para almacenar el sprite del botón 'P'
        this.menuCanvas = null; // Variable para almacenar el canvas del menú
        this.isMenuVisible = false; // Variable para controlar la visibilidad del menú
        this.exitButton = null; // Variable para salir
        this.improveButton = null; // Variable para mejorar
    }
    preload (){
        this.cameras.main.setBackgroundColor('#FFFFFF');
        this.load.image('boat','../images/barca.png');
        this.load.image('background', '../images/PLACE_HOLDER_FONDO.jpg');
        this.load.image('canya', '../images/canyaPescar.png');
        this.load.image('enemigo1', '../images/peix1.png');
        this.load.image('enemigo2', '../images/peix2.png');
        this.load.image('enemigo3', '../images/peix3.png');
        this.load.image('enemigo4', '../images/peix4.png');
        this.load.image('enemigo5', '../images/peix5.png');
        this.load.image('bobEsponja', '../images/peixBobEsponja.png');
        this.load.image('gnomo', '../images/peixGnomo.png');
        this.load.image('pedra1', '../images/pedra1.png');
        this.load.image('pedra2', '../images/pedra2.png');
        this.load.image('pedra3', '../images/pedra3.png');
        this.load.image('escena1', '../images/escena1.png');
        this.load.image('escena2', '../images/escena2.png');
        this.load.image('escena3', '../images/escena3.png');



    }
    createPauseMenu(){
        this.pButton = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);

        // Crear el canvas del menú
        this.menuCanvas = this.add.graphics();
        this.menuCanvas.fillStyle(0x000000, 0.5); // Fondo semi-transparente
        this.menuCanvas.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);
        this.menuCanvas.setScrollFactor(0); // El canvas se mantiene fijo en la cámara
        this.menuCanvas.visible = false; // Inicialmente oculto
        

        // Crear los botones del menú
        this.improveButton = this.add.text(this.cameras.main.width / 2, 0, 'Improve', {
          font: '32px Arial',
          fill: 'white',
        }).setOrigin(0.5);
        this.improveButton.setInteractive();
        this.improveButton.visible = false; // Inicialmente oculto
        this.improveButton.on('pointerup', () => {
          //this.improvementCount += 1;
          console.log('Improvement count:', this.improvementCount);
        });
    
        this.exitButton = this.add.text(this.cameras.main.width / 2, 0, 'Exit', {
          font: '32px Arial',
          fill: 'white',
        }).setOrigin(0.5);
        this.exitButton.setInteractive();
        this.exitButton.visible = false; // Inicialmente oculto
        this.exitButton.on('pointerup', () => {
            if (this.isMenuVisible) {
                loadpage("../");
            }
        });
    
        // Asegurarse de que el menú esté siempre por encima de otros elementos
        this.children.bringToTop(this.menuCanvas);
        this.children.bringToTop(this.improveButton);
        this.children.bringToTop(this.exitButton);
    }

    create (){
        var Y1=210;
        var Y2=500;
	    var json = localStorage.getItem("config") || '{"puntsInici":0,"speed":13}';
        var game_data=JSON.parse(json);
        this.puntos=game_data.puntsInici;
        this.incrementSpeed=game_data.speed;
        localStorage.clear();
        { //camera settings and other settings
        this.camera=this.cameras.main;
        this.camera.setBounds(0, 0, this.scale.width, this.scale.height*3.7);
        console.log(this.scale.height*3.7);
        this.physics.world.setBounds(0, 0, this.scale.width, this.scale.height*3.7);

        this.cursors=this.input.keyboard.createCursorKeys();

        }
        const firstImageWidth=370;
        const firstImageHeight=100;
        { //Create background image
            let k=5.28;
            const imageNames = ['escena1', 'escena2', 'escena3'];
            for(let i=0; i<imageNames.length; i++){
                const imageName = imageNames[i];
                this.background=this.add.tileSprite(firstImageWidth*1.1, firstImageHeight*k,0,0,imageName)
                    .setScale(1.1);
                k+=12.2;
            }
            const image = this.add.image(firstImageWidth, firstImageHeight, 'boat');  // Colocar la imagen en la esquina superior izquierda
            image.setScale(0.5);
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
            this.lifeText = this.add.text(this.scale.width/2.5, 5, "Vida: " +this.life, { font: '32px Arial', fill: 'black' });
        }

        { //creacion enemigos y fisicas entre ellos.
            this.enemigosGroup = this.physics.add.group();
            this.obstaclesGroup = this.physics.add.group();

            this.crearObstaculos(this.obstacles,this.totalObstacles,Y1,Y2,0.3);
            this.agregarObstaculosColision();

            this.crearEnemigos(this.normalEnemys, this.totalEnemys,Y1,Y2+200,0.5);
            this.agregarColisiones();
        }
        this.createPauseMenu();
        this.hideMenu();
    }

    showMenu() {
        this.positionMenu();
        this.isMenuVisible = true;
        this.menuCanvas.visible = true;
        this.paused = true;
        this.exitButton.visible = true;
        this.improveButton.visible=true;
      }
    
      hideMenu() {
        this.isMenuVisible = false;
        this.menuCanvas.visible = false;
        this.paused = false;
        this.exitButton.visible = false;
        this.improveButton.visible=false;
      }

      positionMenu() {
        const cameraCenterX = this.camera.centerX;
        const cameraCenterY = this.camera.scrollY;
        this.improveButton.y = (this.camera.scrollY+this.camera.centerY)-50;
        this.exitButton.y = (this.camera.scrollY+this.camera.centerY+50)-50;
      }
      
    crearObstaculos(tiposObstaculo, totalObstaculos,Y1,Y2,escalado){
        for (let i = 0; i < totalObstaculos; i++) {
            const posX = Phaser.Math.RND.between(30, this.scale.width-20);
            const posY = Phaser.Math.RND.between(Y1, Y2);

            const tipoObstaculo = Phaser.Math.RND.pick(tiposObstaculo);
            const vidaRestante= this.comprobarObstaculo(tipoObstaculo);
            const obstaculo = {
                sprite: this.physics.add.sprite(posX, posY, tipoObstaculo).setScale(escalado),
                life: vidaRestante,
                velocidad: Phaser.Math.RND.between(1, 2), // Velocidad aleatoria
                direccion: 1, // Dirección inicial hacia la derecha (1) o izquierda (-1)
                tipo: tipoObstaculo
            };
            obstaculo.sprite.setData('obstaculoData', obstaculo); // Guardar enemigo como dato personalizado
            // Cambiar el color del sprite a rojo
            obstaculo.sprite.setTint(0xff0000);
            this.obstaclesGroup.add(obstaculo.sprite);
        }
    }
    //se agregan colisiones a todos los sprites nuevos y viejos que se generan.
    agregarColisiones() {
        this.physics.add.overlap(this.player, this.enemigosGroup, this.handleCollision, null, this);
    }
    agregarObstaculosColision(){
        this.physics.add.overlap(this.player, this.obstaclesGroup, this.handleObstacleCollision, null, this);
    }

    handleObstacleCollision(player, obstaculo){
        const obstacle = this.obstaclesGroup.getChildren().find(OBST => OBST === obstaculo);
        const tipoObstacle = obstacle.texture.key;
        // Realizar acciones según el tipo de enemigo
        switch (tipoObstacle) {
            case 'pedra1':
                // Realizar acciones para el enemigo1
                this.handleobstacle(obstacle);
                break;
            case 'pedra2':
                // Realizar acciones para el enemigo2
                this.handleobstacle(obstacle);
                break;
            case 'pedra3':
                // Realizar acciones para el enemigo2
                this.handleobstacle(obstacle);
                break;
        }
    }

    handleobstacle(obstaculo){
        // Obtener los puntos del enemigo
        const obstacle = obstaculo.getData('obstaculoData');
        this.life = parseInt(this.life, 10); // Convertir this.puntos a un número entero
        this.life -= obstacle.life; // Sumar los puntos del enemigo a los puntos totales     
        // Buscar la sprite del enemigo en el mapa y destruirla
        obstaculo.destroy(); 
        this.obstaclesGroup.remove(obstaculo);
        this.lifeText.destroy();
        this.lifeText = this.add.text(this.scale.width/2.5, 5, "Vida: " +this.life, { font: '32px Arial', fill: 'black' });
    }
    //se crean los enemigos
    crearEnemigos(tiposEnemigos, totalEnemigos,Y1,Y2,escalado){
        for (let i = 0; i < totalEnemigos; i++) {
            const posX = Phaser.Math.RND.between(30, this.scale.width-20);
            const posY = Phaser.Math.RND.between(Y1, Y2);

            const tipoEnemigo = Phaser.Math.RND.pick(tiposEnemigos);
            const puntuacio= this.comprobarEnemigo(tipoEnemigo);
            const enemigo = {
                sprite: this.physics.add.sprite(posX, posY, tipoEnemigo).setScale(escalado),
                puntos: puntuacio,
                velocidad: Phaser.Math.RND.between(1, 3), // Velocidad aleatoria
                direccion: 1, // Dirección inicial hacia la derecha (1) o izquierda (-1)
                tipo: tipoEnemigo
            };
            enemigo.sprite.setData('enemigoData', enemigo); // Guardar enemigo como dato personalizado
            this.enemigosGroup.add(enemigo.sprite);
        }
    }

    //para no tenerlo todo en una sola funcion se llama a este metodo que devuelve la puntuacion en base al tipo de enemigo que le pasamos.
    comprobarEnemigo(tipoEnemigo) {
        let puntuacio=0;
        switch (tipoEnemigo) {
            case 'enemigo1':
                puntuacio=4;
                break;
            case 'enemigo2':
                puntuacio=5;
                break;
            case 'enemigo3':
                puntuacio=8;
                break;
            case 'enemigo4':
                puntuacio=10;
                break;
            case 'enemigo5':
                puntuacio=15;
                break;
            case 'gnomo':
                puntuacio=22;
                break;
            case 'bobEsponja':
                puntuacio=22;
                break;
        }
        return puntuacio;
    }

    //comprobar que tipo de obstaculo es y devolver la vida que le quitará al jugador.
    comprobarObstaculo(tiposObstaculo) {
        let vida=0;
        switch (tiposObstaculo) {
            case 'pedra1':
                vida=30;
                break;
            case 'pedra2':
                vida=40;
                break;
            case 'pedra3':
                vida=45;
                break;
        }
        return vida;
    }

    update (){
        if (Phaser.Input.Keyboard.JustDown(this.pButton)) {
            if (this.isMenuVisible)
                this.hideMenu();
            else 
                this.showMenu();
        }
        if(!this.paused){
            this.movimientoEnemigos();
            this.movimientoObstaculos();
            this.text.destroy(); // Eliminar el texto anterior
            this.text = this.add.text(10, 10, "Nivell: " + this.metros, { font: '32px Arial', fill: 'black' });
            if(this.cursors.down.isDown) {
                this.speed=this.incrementSpeed;
            } 
            else if(this.cursors.up.isDown) {
                this.speed=-this.incrementSpeed;
            }
            else if(this.cursors.left.isDown) {
                this.speedX=-this.incrementSpeed;
            }
            else if(this.cursors.right.isDown) {
                this.speedX=+this.incrementSpeed;
            }
            else {
                this.speed=0;
                this.speedX=0;
            }
            this.player.y+=this.speed;
            this.player.x+=this.speedX;
            this.text.y=this.camera.scrollY;
            this.textPoints.y=this.camera.scrollY;
            this.comprobarPlayer();

            if((this.player.y>650 && this.player.y<1000)&& this.createEnemys){
                this.crearEnemigos(this.normalEnemys,this.totalEnemys,400,500,0.5);
                this.createEnemys=false;
            }
            /*else if((this.player.y>1100 && this.player.y<1500)&& !this.createEnemys){
                this.totalEnemys=13;
                this.crearEnemigos(this.hardEnemys,this.totalEnemys,400,500,0.5);
                this.totalEnemys=2; this.crearEnemigos(this.hardEnemys,this.totalEnemys,1100,1500,0.5);
                this.createEnemys=true;
            }*/

            if(this.player.y>=this.scale.height*3.7-30){
                this.player.y=160;
                this.pescarseASiMismo=true;
            }
            else if(this.pescarseASiMismo){
                alert("Has ganado con " + this.puntos + " points.");            
                loadpage("../");
            }
            else if(this.life<=0){
                alert("Has perdido con " + this.puntos + " points.");
                loadpage("../");
            }
           // console.log(this.player.y);
        }
    }
    
    //comprobar los metros en el que estamos mediante la posicion del player
    comprobarPlayer(){
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
    }

    //comportamiento de los peces
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

    movimientoObstaculos(){
        this.obstaclesGroup.getChildren().forEach(obstaculo => {
            const obstacule = obstaculo.getData('obstaculoData');
            const velocidadX = obstacule.velocidad * obstacule.direccion;
            obstaculo.x += velocidadX;
            if (obstaculo.x <= 20 || obstaculo.x >= this.game.config.width - 20) {
                // Cambiar la dirección y girar la imagen
                obstacule.direccion *= -1;
                obstacule.flipX = !obstacule.flipX;
            }
        });
    }

    //tratar la colision y llamar a otra funcion que se encarga de aumentar la puntuacion y eliminar el "enemy"
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