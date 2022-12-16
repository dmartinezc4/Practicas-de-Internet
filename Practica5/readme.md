
Práctica - 5
Para esta quinta práctica se pide desarrollar una API en GraphQL para enviar mensajes entre usuarios
Se deberá crear un .env con los siguientes campos

    URL_MONGO = con la url al servidor de mongo
    PORT = con el puerto para que corra el servidor

NO se puede subir el .env al repositorio, en este caso se deberá subir un .env.sample
La base de datos deberá ser OBLIGATORIAMENTE con MongoDB y tendrá las siguientes colecciones:

    Usuario
    Mensaje

Tanto la Autentificacion mediante JWT como el idioma se deberá mandar mediante las cabeceras de la petición (explicación en la clase practica)
 Las funciones que se piden son las siguientes y NO SE ADMITE variaciones en los campos de entrada y de salida

    createUser(username, password): Usuario
        El campo username deberá ser único
        El campo password deberá estar cifrado
        Se deberá guardar la fecha de creación, en FORMATO UNIVERSAL
        Idioma
    login(username, password): JWT
        Errores básicos (usuario existe, campos correctos etc)
    deleteUser: Usuario
        Se obtendrá el usuario a eliminar mediante la cabecera Auth
    sendMessage(destinatario, menssage): Mensaje
        El usuario que envía el mensaje se obtendrá de la cabecera Auth
        El idioma que se envié por la cabecera Lang deberá coincidir con el guardado en bbdd
        Se deberá guardar la fecha de creación del mensaje
    getMessages(page, perPage): [Mensaje]
        el limite por pagina deberá estar incluido en 10-200
        no se pueden usar paginas negativas

IMPORTANTE TENER EN CUENTA LO SIGUIENTE

    La entrega se realizará subiendo el .zip que genera github al hacer la realese, añadiendo la URL del repositorio e indicando los integrantes del grupo
    Si el servidor se detiene por un error no controlado supondrá un suspenso
