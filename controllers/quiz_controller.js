var models = require('../models/models.js');

var Promise = require('bluebird');

var cloudinary = require('cloudinary');
var Sequelize = require('sequelize');

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
						include: [{model: models.Comment},
								  {model: models.User}]
					})
				.then(function(quiz) {
						if (quiz) {
							req.quiz=quiz;
							next();
						} else { next(new Error('No existe quizId='+quizId));}
				}).catch(function(error) { next(error);});
};

// GET /quizes
// GET /user/:userId/quizes
// async queries inspired by https://gist.github.com/jagged3dge/1ae038cf050662986121
exports.index = function(req, res) {
	var options = {};
	var propios = false;
	var user = undefined;

	if (req.session.user){ // usuario conectado
		models.User.find({ where: { id: Number(req.session.user.id)},
					   include: [{model: models.Quiz }] })
		.then(function(user){
			
			if (req.user){ // misPreguntas (req.user es creado por autoload de usuario si la ruta lleva el parámetro :userId)
				propios = true;

				if(req.query.search){ // ha buscado
					options.where = Sequelize.and(
										{UserId: req.user.id},
										["pregunta like ?", req.query.search.replace(/(\s)/g,'%').replace(/^/,'%').replace(/$/,'%')]
									);
					options.order = 'pregunta ASC';
					options.include = { model: models.User };
				} else { // no ha buscado
					options.where = {UserId: req.user.id};
					options.include = { model: models.User };
				}

			} else { // no misPreguntas
				if(req.query.search){ 
					options.where = ["pregunta like ?", req.query.search.replace(/(\s)/g,'%').replace(/^/,'%').replace(/$/,'%')];
					options.order = 'pregunta ASC';
				}
			}

			models.Quiz.findAll(options).then(function(quizes) {
				var promises = [];
				var quiz;

				quizes.forEach(function(q){
					promises.push(
						Promise.all([
							q.hasUser(user)])
						.spread(function(result){
							quiz = q.toJSON();
							quiz.isFavourite = result;
							return quiz;
						})
					);
				})
				return Promise.all(promises);
			}).then(function(quizes){
				res.render('quizes/index.ejs', {quizes: quizes, busqueda: req.query.search, propios: propios, errors: []});
			}).catch(function(error){next(error)});

		}).catch(function(error){next(error)});
	} else {
		if(req.query.search){
			options.where = ["pregunta like ?", req.query.search.replace(/(\s)/g,'%').replace(/^/,'%').replace(/$/,'%')];
			options.order = 'pregunta ASC';
		}

		models.Quiz.findAll(options).then(function(quizes) {
			res.render('quizes/index.ejs', {quizes: quizes, busqueda: req.query.search, propios:propios, errors: []});
		}).catch(function(error){next(error)});
	}

};

// GET /quizes/new
exports.new = function(req,res) {
	var quiz = models.Quiz.build( //crea objeto quiz
		{pregunta: " ", respuesta: " "}
		);
	res.render('quizes/new',{quiz:quiz, errors:[]});
};

// POST /quizes/create
exports.create = function(req,res) {
	req.body.quiz.UserId = req.session.user.id;
	var quiz = models.Quiz.build( req.body.quiz );

	quiz.validate()
	.then(
		function(err){
			if(err) {
				res.render('quizes/new', {quiz: quiz, errors: err.errors});;
			} else {
				if(req.files.image){
					cloudinary.uploader.upload(
						req.files.image.path, function(result){
							quiz.image = result.public_id;
							quiz // guarda en DB los campos pregunta y respuesta de quiz
							.save({fields: ["pregunta", "respuesta", "UserId", "image"]})
							.then(function(){ res.redirect('/quizes')});
								// Redirección HTTP (URL relativo) a la lista de preguntas
					});
				} else {
					quiz.image = "";
					quiz // guarda en DB los campos pregunta y respuesta de quiz
					.save({fields: ["pregunta", "respuesta", "UserId", "image"]})
					.then(function(){ res.redirect('/quizes')});
						// Redirección HTTP (URL relativo) a la lista de preguntas
				}
			}
		}).catch(function(err){next(err)});
};

// GET /quizes/:id
exports.show = function(req, res) {
	if (req.session.user){ // usuario conectado
		models.User.find({ where: { id: Number(req.session.user.id)},
					   include: [{model: models.Quiz }] })
		.then(function(user){
			req.quiz.hasUser(user).then(function(result){
				req.quiz.isFavourite = result;
				res.render('quizes/show', { quiz: req.quiz, errors:[]});
			}).catch(function(error){next(error)});
		});
	} else {
		res.render('quizes/show', {quiz: req.quiz, errors:[]});
	}	
};

// GET /quizes/:id/answer
exports.answer = function(req, res) {
	if(req.session.user){
		models.User.find({ where: { id: Number(req.session.user.id)},
					   include: [{model: models.Quiz }] })
		.then(function(user){
			if(user){
				if (req.query.respuesta === req.quiz.respuesta) {
					user.points++;
					req.session.user.points++;
					res.render('quizes/answer', { quiz:req.quiz, respuesta: 'Correcto', errors:[] });
				} else {
					user.points--;
					req.session.user.points--;
					res.render('quizes/answer', { quiz: req.quiz, respuesta: 'Incorrecto', errors:[] });
				}
			}else{
				next(new Error('No existe userId=' + userId));
			}
		}).catch(function(error){next(error)});
	} else {
		if (req.query.respuesta === req.quiz.respuesta) {
			res.render('quizes/answer', { quiz:req.quiz, respuesta: 'Correcto', errors:[] });
		} else {
			res.render('quizes/answer', { quiz: req.quiz, respuesta: 'Incorrecto', errors:[] });
		}
	}
};

// GET /quizes/:id/edit
exports.edit = function(req,res){
	res.render('quizes/edit',{quiz:req.quiz, errors:[]}); // autoload da instancia de quiz
};

// PUT /quizes/:id
exports.update = function(req,res){
	if (req.files.image) {
		cloudinary.uploader.upload(
			req.files.image.path, function(result) { 
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