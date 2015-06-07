var path = require('path');

// Postgres DATABASE_URL = postgres://user:passwd@host:port/database
// SQLITE   DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name	= (url[6] || null);
var user	= (url[2] || null);
var pwd 	= (url[3] || null);
var protocol= (url[1] || null);
var dialect = (url[1] || null);
var port 	= (url[5] || null);
var host	= (url[4] || null);
var storage = process.env.DATABASE_STORAGE;

// Cargar Modelo ORM
var Sequelize = require('sequelize');

// Usar BBDD SQLite o Postgres
var sequelize = new Sequelize(DB_name, user, pwd,
					{	dialect: protocol,
						protocol: protocol,
						port: port,
						host: host,
						storage: storage, // solo SQLITE (.env)
						omitNull: true	  // solo Postgres
					}
);

// Importar la definición de la tabla Quiz en quiz.js
var quiz_path = path.join(__dirname,'quiz');
var Quiz = sequelize.import(quiz_path);

// Importar la definición de la tabla Comment en comment.js
var comment_path = path.join(__dirname,'comment');;
var Comment = sequelize.import(comment_path);

// Importar definición de la tabla User en user.js
var user_path = path.join(__dirname,'user');
var User = sequelize.import(user_path);

// los comentarios pertenecen a un quiz
Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);

// los quizes pertenecen a un usuario registrado
Quiz.belongsTo(User);
User.hasMany(Quiz);

// un usuario puede tener varios quizes favoritos
// y un quiz puede tener varios usuarios que lo hayan marcado como favorito
User.belongsToMany(Quiz, {through: 'Favourites'});
Quiz.belongsToMany(User, {through: 'Favourites'});

// exportar tablas
exports.Quiz = Quiz; 
exports.Comment = Comment;
exports.User = User;

// inicialización de DB
User.count().then(function(count){
	if(count === 0){ // la tabla se inicializa solo si está vacía
		User.bulkCreate(
			[	{username: 'admin', 		password: '1234', isAdmin: true},
				{username: 'pepe',  		password: '5678', 			points: 0}, // is Admin por defecto: 'false',
				{username: 'captain', 		password: 'captain', 		face: 'aldnmc38rm8t6lilr5yl', 		points: 17},
				{username: 'iron_man', 		password: 'iron_man', 		face: '124478-123225_rb2yhk', 		points: 10},
				{username: 'thor', 			password: 'thor', 			face: 'thor-dark-world-640_gmiytj', points: -5},
				{username: 'black_widow', 	password: 'black_widow', 	face: '12_s6kycv', 					points: 2},
				{username: 'cookie_monster',password: 'cookie_monster', face: 'zvxniaye9zmcllxnyp3m', 		points: -20},
			]
		).then(function(){
			console.log('Base de datos (tabla user) inicializada');
			Quiz.count().then(function(count){
				if(count === 0) {		// la tabla se inicializa solo si está vacía
					Quiz.bulkCreate(	// estos quizes pertenecen al usuario pepe (2)
						[	{pregunta: 'Capital de Italia',		respuesta: 'Roma',		UserId:2, image: 'cv4ztientykbiirnsorp'},
							{pregunta: 'Capital de Alemania',	respuesta: 'Berlín',	UserId:2, image: 'Berlin_efm6g'},
							{pregunta: 'Capital de España',		respuesta: 'Madrid',	UserId:2, image: 'gq6zkjseymfrjpe14vno'}
						]
					).then(function(){console.log('Base de datos (tabla quiz) inicializada')});
				};
			});
		});
	};
});