# ProyectoQuiz
*Proyecto final de la asignatura Computación en Red.*
##Enlace a la aplicación
La aplicación se ha desplegado en Heroku, y está disponible [aquí](quizz2015.herokuapp.com).
##Tecnologías empleadas
La aplicación web presenta diseño adaptativo y su funcionamiento se basa en javascript. Se ha hecho uso del framework Express.
La base de datos implementa migraciones para que la modificación del modelo sea más sencilla.
##Sobre la aplicación
Quiz es una aplicación que permite crear preguntas y resolver otras ya creadas. Tiene las siguientes funcionalidades:
* __Creación de quizes__. Debe indicarse la respuesta para poder corregirla posteriormente.
* __Introducción de comentarios__. Los usuarios pueden hacer comentarios a las preguntas ya existentes.
* __Cuentas de usuario__. Solo los usuarios registrados y con sesión iniciada pueden crear, editar y borrar preguntas, así como moderar los comentarios de las mismas.
* __Seguridad__. Los usuarios deben introducir su contraseña para gestionar cualquier cambio en su cuenta, como una modificación en su nombre o la elección de una contraseña nueva.
* __Favoritos__. Los usuarios pueden marcar preguntas como favoritas para verlas todas en una vista aparte.
* __Estadísticas__. Se pueden conocer datos relevantes sobre la aplicación, incluyendo número de preguntas, número de comentarios, número de preguntas con y sin comentarios, etc.  Las estadísticas incluyen gráficos dinámicos que facilitan la visualización de la información.
* __Imágenes__. Las preguntas pueden contar con una imagen relacionada, y los usuarios pueden subir una imagen para su foto de perfil. Las imágenes se almacenan en Cloudinary.
* __Ranking__. Los usuarios obtienen puntuación por las preguntas que aciertan y fallan. Se puede visualizar un ranking con los mismos.

##Autores
La aplicación ha sido desarrollada por __[Eva Jurado](mailto:e.jurado@alumnos.upm.es)__ y __[Federico Fernández](mailto:fa.fernandez@alumnos.upm.es)__.
