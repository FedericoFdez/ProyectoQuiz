var models = require('../models/models.js');
var cloudinary = require('cloudinary');

// MW que permite acciones solamente si el quiz objeto
// pertenece al usuario logeado o si es cuenta admin
exports.ownershipRequired = function(req,res,next){
	var objQuizOwner 	= req.quiz.UserId;
	var logUser 		= req.session.user.id;
	var isAdmin			= req.session.user.isAdmin;

	if (isAdmin || objQuizOwner === logUser){
		next();
	} else {
		res.redirect('/');
	}
};

// Autoload - factoriza el código si ruta incluye :quizId
exports.load = function(req,res,next,quizId){
	models.Quiz.find({
						where: { id: Number(quizId) },
						include: [{model: models.Comment}]
					})
				.then(function(quiz) {
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
		{pregunta: "", respuesta: ""}
		);
	res.render('quizes/new',{quiz:quiz, errors:[]});
};

// POST /quizes/create
exports.create = function(req,res) {
	req.body.quiz.UserId = req.session.user.id;
	var quiz = models.Quiz.build( req.body.quiz );

	if (req.files.image) {
		cloudinary.uploader.upload(
			req.files.image.path, function(result) { 
				console.log(result);
				req.body.quiz.image = result.public_id;

				quiz.validate()
					.then(
						function(err){
							if(err) {
								res.render('quizes/new', {quiz: quiz, errors: err.errors});
							} else {
								quiz // guarda en DB los campos pregunta y respuesta de quiz
								.save({fields: ["pregunta", "respuesta", "UserId", "image"]})
								.then(function(){ res.redirect('/quizes')});
									// Redirección HTTP (URL relativo) a la lista de preguntas
							}
						}
					);
			}    
		);
	}else{
		quiz.validate()
		.then(
			function(err){
				if(err) {
					res.render('quizes/new', {quiz: quiz, errors: err.errors});
				} else {
					quiz // guarda en DB los campos pregunta y respuesta de quiz
					.save({fields: ["pregunta", "respuesta", "UserId", "image"]})
					.then(function(){ res.redirect('/quizes')});
						// Redirección HTTP (URL relativo) a la lista de preguntas
				}
			}
		);
	}
};

// GET /quizes/:id
exports.show = function(req, res) {
	models.Quiz.find(req.params.quizId).then(function(quiz) {
		console.log(quiz.image);
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
	if (req.files.image) {
		cloudinary.uploader.upload(
			req.files.image.path, function(result) { 
				console.log(result);
				console.log("PUBLIC_ID: "+result.public_id);
				req.quiz.image = result.public_id;

				req.quiz.pregunta = req.body.quiz.pregunta;
				req.quiz.respuesta = req.body.quiz.respuesta;
				req.quiz.validate()
				.then(
					function(err){
						if(err) {
							res.render('quizes/new', {quiz: req.quiz, errors: err.errors});
						} else {
							req.quiz // guarda en DB los campos pregunta y respuesta de quiz
							.save({fields: ["pregunta", "respuesta", "image"]})
							.then(function(){ res.redirect('/quizes')});
								// Redirección HTTP (URL relativo) a la lista de preguntas
						}
					}
				);
			}    
		);
	}else{
		req.quiz.pregunta = req.body.quiz.pregunta;
		req.quiz.respuesta = req.body.quiz.respuesta;
		req.quiz.validate()
		.then(
			function(err){
				if(err) {
					res.render('quizes/new', {quiz: req.quiz, errors: err.errors});
				} else {
					req.quiz // guarda en DB los campos pregunta y respuesta de quiz
					.save({fields: ["pregunta", "respuesta", "image"]})
					.then(function(){ res.redirect('/quizes')});
						// Redirección HTTP (URL relativo) a la lista de preguntas
				}
			}
		);
	}
};

// DELETE /quizes/:id
exports.destroy = function(req,res){
	for(index in req.quiz.Comments){
		req.quiz.Comments[index].destroy();
	}

	if(req.quiz.image)
		cloudinary.uploader.destroy(req.quiz.image, function(result) {});
	
	req.quiz.destroy().then(function() {
			res.redirect('/quizes');
	}).catch(function(error){next(error)});
};