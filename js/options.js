var options = function(){
	// Aquí dins hi ha la part privada de l'objecte
	var options_data = {
		puntsInici:2, speed:3
	};
	var load = function(){
		var json = localStorage.getItem("config") || '{"puntsInici":1,"speed":3}';
        console.log(json);
		options_data = JSON.parse(json);
	};
	var save = function(){
		localStorage.setItem("config", JSON.stringify(options_data));
	};
	load();
	var vue_instance = new Vue({
		el: "#options_id",
		data: {
			num: 2,
			velocity:1
		},
		created: function(){
			this.num = options_data.puntsInici;
			this.velocity = options_data.speed;
		},
		watch: {
			num: function(value){
				if (value < 0)
					this.num = 0;
				else if (value > 100)
					this.num = 100;
			},
			velocity: function(val){
				if(val >=15)
					this.velocity=15;
				else if (val < 1)
					this.velocity=1;
			}
		},
		methods: { 
			discard: function(){
				this.num = options_data.puntsInici;
				this.velocity = options_data.speed;
			},
			save: function(){
				options_data.puntsInici = this.num;
				options_data.nivell=this.velocity;
				save();
				loadpage("../");
			}
		}
	});
	return {
		// Aquí dins hi ha la part pública de l'objecte
		getOptionsString: function (){
			return JSON.stringify(options_data);
		},
		getNumOfCards: function (){
			return options_data.puntsInici;
		},
		getNivell: function (){
			return options_data.speed;
		}
	}; 
}();