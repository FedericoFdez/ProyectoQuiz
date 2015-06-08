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
			[	{username: 'admin', 		password: '1234',			face: 'admin-lxpbeq', isAdmin: true,},

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
						[	{pregunta: '¿Cuál es la capital de Italia?',	respuesta: 'Roma',			UserId:2, image: 'cv4ztientykbiirnsorp'},
							{pregunta: '¿Cuál es la capital de Alemania?',	respuesta: 'Berlín',		UserId:2, image: 'Berlin_efm6g'},
							{pregunta: '¿Cuál es la capital de España?',	respuesta: 'Madrid',		UserId:2, image: 'gq6zkjseymfrjpe14vno'},
							{pregunta: '¿A qué país pertenece la Isla de Pascua?', 
																			respuesta: 'Chile', 		UserId:3, image: 'Isla-de-Pascua-Chile_c9gvnw'},
							{pregunta: '¿Cómo fue utilizada Alcatraz?', 	respuesta: 'Como prisión',	UserId:3, image: 'Alcatraz_jzsw33'},
							{pregunta: '¿Qué país de América del Sur es el único en tener costa en el Caribe y el Pacífico?', 
																			respuesta: 'Colombia', 		UserId:2, image: '5370398094_a67705873a_b_tqqgtk'},
							{pregunta: '¿Cuáles fueron las primeras palabras que pronunció Neil Armstrong desde la luna para la torre de control en la Tierra?',
																			respuesta: 'Houston, aquí Base Tranquilidad, el Águila ha aterrizado',
																										UserId:3, image: 'dpwy1zm5vvwpypjr1u7d_tfm4nb'},
							{pregunta: '¿Cuál era la nacionalidad de Marco Polo?',
																			respuseta: 'Italiano',		UserId:3, image: '1502_hfznat' }
						]
					).then(function(){
						Comment.bulkCreate(
							[	{ texto: 'Este comentario ya está publicado' , publicado: true, QuizId: 1},
								{ texto: 'Y este' , publicado: true, QuizId: 1},
								{ texto: 'Y este también' , publicado: true, QuizId: 1},
								{ texto: 'Este comentario todavía no está publicado' , publicado: false, QuizId: 1}
							]
						).then(function(){console.log('Base de datos (tabla quiz) inicializada')});
					});
				}
			});
		});
	};
});