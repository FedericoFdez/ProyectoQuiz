var models = require('../models/models.js');

// GET /quizes/statistics
exports.index = function(req,res){

	models.Quiz.count().then(function(count){
		var numPreguntas = count;

		models.Comment.count().then(function(count){
			var numComentarios = count;

			var comentariosPorPregunta = numComentarios/numPreguntas;

			models.Quiz
			.findAll({include: [{model: models.Comment}]})
			.then(function(quizes){

				var preguntasConComentarios = 0;
				for(var i=0; i<quizes.length; i++){
					if(quizes[i].Comments.length!==0)
						preguntasConComentarios++;					
				}
				res.render('quizes/statistics.ejs', {	numPreguntas: 				numPreguntas,
														numComentarios: 			numComentarios,
														comentariosPorPregunta: 	comentariosPorPregunta,
														preguntasConComentarios: 	preguntasConComentarios,
														preguntasSinComentarios: 	numPreguntas - preguntasConComentarios,
														errors:[]
													}
				);
			});
		});
	});
};