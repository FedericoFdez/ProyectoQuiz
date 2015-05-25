var models = require('../models/models.js');

// GET /user/:userId/favourites
exports.index = function(req,res){
	req.user.getQuizzes().then(function(quizes){
		res.render('quizes/favourites.ejs', {quizes: quizes, errors:[] });
	});
};

// PUT /user/:userId/favourites/:quizId
exports.create = function(req,res){
	req.user.addQuiz(req.quiz).then(function(){
		switch(req.body.origin){
			case "own": res.redirect('/user/'+req.user.id+'/quizes'); break;
			case "all": res.redirect('/quizes'); break;
			case "one": res.redirect('/quizes/'+req.quiz.id); break;
			case "favs": res.redirect('/user/'+req.user.id+'/favourites'); break;
		}
	});
};

// DELETE /user/:userId/favourites/:quizId
exports.destroy = function(req,res){
	req.user.removeQuiz(req.quiz).then(function(){
		switch(req.body.origin){
			case "own": res.redirect('/user/'+req.user.id+'/quizes');
			case "all": res.redirect('/quizes');
			case "one": res.redirect('/quizes/'+req.quiz.id);
			case "favs": res.redirect('/user/'+req.user.id+'/favourites');
		}
	});
};