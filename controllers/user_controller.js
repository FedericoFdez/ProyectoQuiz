var models = require('../models/models.js');

var cloudinary = require('cloudinary');

// MW que permite acciones solamente si el usuario objeto
// corresponde con el usuario logeado o si es cuenta admin
exports.ownershipRequired = function(req,res,next){
	var objUser	= req.user.id;
	var logUser = req.session.user.id;
	var isAdmin = req.session.user.isAdmin;

	if (isAdmin || objUser === logUser){
		next();
	} else {
		res.redirect('/');
	}
};

// Autoload :userId
exports.load = function(req,res,next,userId){
	models.User.find({ where: { id: Number(userId)},
					   include: [{model: models.Quiz }] })
		.then(function(user){
			if(user){
				req.user = user;
				next();
			}else{
				next(new Error('No existe userId=' + userId));
			}
		}).catch(function(error){next(error)});
};

// Comprueba si el usuario está registrado en users
// Si autenticación falta o hay errores se ejecuta callback(error).
exports.autenticar = function(login, password, callback){
	models.User.find({
		where: {
			username: login
		}
	}).then(function(user){
		if (user){
			if (user.verifyPassword(password)){
				callback(null,user);
			}
			else{
				callback(new Error('Password erróneo.'));
			}
		}
		else {
			callback(new Error('No existe user=' + login));
		}
	}).catch(function(error){
		callback(error);
	})
};

// GET /user/:id/edit
exports.edit = function(req,res){
	res.render('users/edit', { user: req.user, errors:[] });
	// req.user es la instancia de user cargada con autoload
};

// GET /user
exports.new = function(req,res){
	var user = models.User.build( // crea objeto user
		{ username: "", password: ""}
	);
	res.render('users/new', { user: user, errors: []});
};

// POST /user
exports.create = function(req,res){
	var user = models.User.build( req.body.user );

	user
	.validate()
	.then(function(err){
		if(err){
			res.render('users/new', {user: user, errors: err.errors});
		} else {
			if(req.files.image){
				cloudinary.uploader.upload(
					req.files.image.path, function(result){
						user.face = result.public_id;
						user // save: guarda en DB campos username y password y face
						.save( {fields: ["username", "password", "face"]})
						.then( function(){
							// crea la sesión con el usuario ya autenticado y redirige a /
							req.session.user = {id:user.id, username: user.username, 
								lastSeen: new Date().getTime(), face: user.face};
							res.redirect('/');
						});
					});
			} else {
				user.face = "";
				user // save: guarda en DB campos username y face
				.save( {fields: ["username", "password", "face"]})
				.then( function(){
					// crea la sesión con el usuario ya autenticado y redirige a /
					req.session.user = {id:user.id, username: user.username, 
								lastSeen: new Date().getTime()};
					res.redirect('/');
				});
			}
		}
	}).catch(function(error){next(error)});
};

// PUT /user/:id
exports.update = function(req,res,next){
	var userController = require('./user_controller');
	userController.autenticar(req.user.username, req.body.oldPassword, function(error, user) {
		if (error) { // si hay error retornamos mensajes de error de sesión
			console.log("Error en autenticación");
			req.session.errors = [{"message": 'Se ha producido un error: '+error}];
			res.render("users/edit", { user: req.user, errors:req.session.errors });
			return;
		}
		// Actualizar campos
		req.user.username = req.body.user.username;
		req.user.password = req.body.user.password;

		req.user
		.validate()
		.then(function(err){
			if(err){
				console.log("error en validación");
				res.render('users/edit', { user: req.user, errors: err.errors});
			} else {
				if(req.files.image){
					cloudinary.uploader.upload(
						req.files.image.path, function(result){
							req.user.face = result.public_id;
							req.session.user.face = result.public_id;
							req.user // save: guarda en DB campos username y password y face
							.save( {fields: ["username", "password", "face"]})
							.then( function(){
								// crea la sesión con el usuario ya autenticado y redirige a /
								res.redirect('/');
							});
						});
				} else {
					req.user.face = "";
					req.user // save: guarda en DB campos username y face
					.save( {fields: ["username", "password", "face"]})
					.then( function(){
						// crea la sesión con el usuario ya autenticado y redirige a /
						res.redirect('/');
					});
				}
			}
		}).catch(function(error){next(error)});
		});
};

// DELETE /user/:id
exports.destroy = function(req,res){
	req.user.destroy().then(function(){
		//borra la ssión y redirige a /
		delete req.session.user;
		res.redirect('/');
	}).catch(function(error){next(error);});
};