var models = require('../models/models.js');

// GET /ranking
exports.index = function(req,res){
	var options = {};
	options.where = {isAdmin: false};
	options.order = 'points DESC';

	models.User.findAll(options)
	.then(function(users){
		res.render('users/ranking.ejs', {users: users, errors: [] });
	}).catch(function(err){next(err)});

};