//Definición del modelo de Quiz

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('Quiz', 
			{ pregunta: {
							type: DataTypes.STRING, 
							validate: { notEmpty: {msg: "· Falta Pregunta"}}
						},
			  respuesta:{
			  				type: DataTypes.STRING,
			  				validate: { notEmpty: {msg: "· Falta Respuesta"}}
			  			},
			  UserId:   {
			  				type: DataTypes.INTEGER,
    						defaultValue: 1,
    						allowNull: false
					  	},
			  image:    {
			  				type: DataTypes.STRING
			  			}, 
			  isFavorite: {
			  				type: DataTypes.BOOLEAN, 
			  				defaultValue: false
			  }
			}
	);
};