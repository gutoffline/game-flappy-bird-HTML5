// Inicializa o Phaser, e cria uma áre de 400x490px para o jogo
var game = new Phaser.Game(400, 490, Phaser.AUTO, 'gameDiv');

// Cria estado PRINCIPAL do jogo com o conteúdo do jogo
var mainState = {

    preload: function() { 
        // Esta função é executada no início
        // Aqui são carregados os recursos(imagens, fundo, som,) para o jogo

        // Altera a cor de fundo do jogo(da div gameDiv)
        game.stage.backgroundColor = '#71c5cf';

        // Carrega o sprite do personagem
        game.load.image('personagem', 'assets/personagem-bob.png'); 
        // Carrega o sprite do bloco
        game.load.image('bloco', 'assets/bloco-caveira.png'); 
        // Carrega o som utilizado para o pulo
        game.load.audio('jump', 'assets/jump.wav');  
    },

    create: function() { 
        // esta função é chamada após a execução da função PRELOAD    
        // Aqui é feita a configuração do jogo(personagem, blocos, som, etc)

        // Adiciona o sistema de físicas ao jogo
        game.physics.startSystem(Phaser.Physics.ARCADE);

        // Exibe o personagem na tela
        this.personagem = this.game.add.sprite(100, 245, 'personagem');

        // adicionar gravidade ao personagem para fazer ele cair
        game.physics.arcade.enable(this.personagem);
        this.personagem.body.gravity.y = 1000;  

        // faz a chamada para a função JUMP a cada vez que a barra de esoaço é pressionada
        var spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.jump, this);     


        this.blocos = game.add.group(); // Cria um grupo
        this.blocos.enableBody = true;  // Adiciona
        this.blocos.createMultiple(20, 'bloco'); // Cria 20 blocos  

        this.timer = game.time.events.loop(1500, this.addRowOfblocos, this); 

        this.score = 0;  
        this.labelScore = game.add.text(20, 20, "0", { font: "30px Arial", fill: "#ffffff" });  

        this.jumpSound = game.add.audio('jump');  

        this.personagem.anchor.setTo(-0.2, 0.5);  


    },

    update: function() {
        // Esta função é chamada 60 vezes por segundo  
        // Ela contém a lógica do jogo

        // Se o personagem estiver fora do mundo, a função 'restarGame' é chamada
        if (this.personagem.inWorld == false)
            this.restartGame();

        game.physics.arcade.overlap(this.personagem, this.blocos, this.hitbloco, null, this); 

        if (this.personagem.angle < 20)  
            this.personagem.angle += 1; 
    },


    // faz o  personagem pular
    jump: function() {  

        if (this.personagem.alive == false)  
            return; 

        // Adiciona velocidade vertical para o personagem
        this.personagem.body.velocity.y = -350;

        this.jumpSound.play();  


        // Cria uma animação no personagem
        var animation = game.add.tween(this.personagem);

        // Configura a animação para alterar o ângulo da imagem do personagem em -20° em 100 milliseconds
        animation.to({angle: -20}, 100);

        // Inicia a animação
        animation.start();  
    },

    // Função de reinício de jogo
    restartGame: function() {  
        // Inicia o estado principal do jogo, o que reinicia o jogo
        game.state.start('main');
    },


    addOnebloco: function(x, y) {  
        // Pega o primeiro bloco morto do nosso grupo
        var bloco = this.blocos.getFirstDead();

        // Configura a nova posição para o bloco
        bloco.reset(x, y);

        // Adiciona velocidade para o bloco para fazer o movimento para a esquerda
        bloco.body.velocity.x = -200; 

        // Mata o bloco quando não estiver mais visível
        bloco.checkWorldBounds = true;
        bloco.outOfBoundsKill = true;
    },

    addRowOfblocos: function() {  
        // Escolhe onde o buraco será
        var hole = Math.floor(Math.random() * 5) + 1;

        // Adiciona os 6 blocos 
        for (var i = 0; i < 8; i++)
            if (i != hole && i != hole + 1) 
                this.addOnebloco(400, i * 60 + 10);   


        this.score += 1;  
        this.labelScore.text = this.score;  

    },


    hitbloco: function() {  
        // Se o personagem tiver batido no bloco, não fazemos nada
        if (this.personagem.alive == false)
            return;

        // Configuramos a propriedade de 'vivo' do personagem para falso
        this.personagem.alive = false;

        // Prevê novos blocos para aparecerem
        game.time.events.remove(this.timer);

        // Ao passar por todos os blocos, seus movimentos são parados
        this.blocos.forEachAlive(function(p){
            p.body.velocity.x = 0;
        }, this);
    },



};

// Adiciona e inicia o estado principal para iniciar o jogo
game.state.add('main', mainState);  
game.state.start('main');  