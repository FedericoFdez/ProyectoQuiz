var models = require('../models/models.js');

// Autoload - factoriza el código si ruta incluye :quizId
exports.load = function(req,res,next,quizId){
	models.Quiz.find(quizId).then(
		function(quiz) {
			if (quiz) {
				req.quiz=quiz;
				next();
			} else { next(new Error('No existe quizId='+quizId));}
		}).catch(function(error) { next(error);});
};


// GET /quizes
exports.index = function(req, res) {
	if(req.query.search){
		models.Quiz.findAll({	where: ["pregunta like ?", req.query.search.replace(/(\s)/g,'%').replace(/^/,'%').replace(/$/,'%')],
								order: 'pregunta ASC'
							}).then(function(quizes) {
			res.render('quizes/index.ejs',{quizes:quizes, busqueda:req.query.search, errors:[]});
		});
	}
	else{
		models.Quiz.findAll().then(function(quizes) {
			res.render('quizes/index.ejs', {quizes: quizes, busqueda: req.query.search, errors:[]});
		});
	}
};

// GET /quizes/new
exports.new = function(req,res) {
	var quiz = models.Quiz.build( //crea objeto quiz
		{pregunta: "Pregunta", respuesta: "Respuesta"}
		);
	res.render('quizes/new',{quiz:quiz, errors:[]});
};

// POST /quizes/create
exports.create = function(req,res) {
	var quiz = models.Quiz.build( req.body.quiz );
	quiz.validate()
	.then(
		function(err){
			if(err) {
				res.render('quizes/new', {quiz: quiz, errors: err.errors});
			} else {
				quiz // guarda en DB los campos pregunta y respuesta de quiz
				.save({fields: ["pregunta", "respuesta"]})
				.then(function(){ res.redirect('/quizes')});
					// Redirección HTTP (URL relativo) a la lista de preguntas
			}
		}
	);
};

// GET /quizes/:id
exports.show = function(req, res) {
	models.Quiz.find(req.params.quizId).then(function(quiz) {
		res.render('quizes/show', { quiz: req.quiz, errors:[]});	
	})
};

// GET /quizes/:id/answer
exports.answer = function(req, res) {
	models.Quiz.find(req.params.quizId).then(function(quiz) {
		if (req.query.respuesta === req.quiz.respuesta) {
			res.render('quizes/answer', { quiz:req.quiz, respuesta: 'Correcto', errors:[] });
		} else {
			res.render('quizes/answer', { quiz: req.quiz, respuesta: 'Incorrecto', errors:[] });
		}
	})
};

// GET /quizes/:id/edit
exports.edit = function(req,res){
	var quiz = req.quiz; // autoload da instancia de quiz
	res.render('quizes/edit',{quiz:quiz, errors:[]});
};

// PUT /quizes/:id
exports.update = function(req,res){
	req.quiz.pregunta = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;
	req.quiz.validate()
	.then(
		function(err){
			if(err) {
				res.render('quizes/new', {quiz: req.quiz, errors: err.errors});
			} else {
				req.quiz // guarda en DB los campos pregunta y respuesta de quiz
				.save({fields: ["pregunta", "respuesta"]})
				.then(function(){ res.redirect('/quizes')});
					// Redirección HTTP (URL relativo) a la lista de preguntas
			}
		}
	);
};

// DELETE /quizes/:id
exports.destroy = function(req,res){
	req.quiz.destroy().then(function() {
		res.redirect('/quizes');
	}).catch(function(error){next(error)});
};