# Band Tour Finance Project
Énoncé 
Vous devez, en utilisant votre modèle de base de données, créer un serveur web qui permet d'exécuter des operation CRUD
 (Create, Read, Update, Delete), sur chacune des entités de votre modèle.

Les URLs pour accéder ces données doivent etre du format /nom_entité (ex: /professeur) ou /nom_entite/cle_primaire 
(ex: /professeur/37).
La création d'une entité se fera avec un POST sur l'URL d'entité (POST sur /professeur), et retournera une réponse HTTP 
201 avec URL de retour.
Les trois autres opérations effectueront les opérations standard, tel que vu en classe, et retourneront une réponse HTTP 200.
Unn demande d'objet qui n'existe pas (ex: GET /professeur/id_inexistant) retourena un code HTTP 400.
Les messages échangés auront un format JSON.

Vous devez livrer la structure suivante:
/scripts/create_db.sql (c'est le nom exact du script qui cree votre BD).
/serveur.sql (c'est le script à exécuter).
###################################################
Express docs: https://www.npmjs.com/package/express  
MySQLjs docs: https://github.com/mysqljs/mysql  
Nodejs docs : https://nodejs.org/api/  
Markdown syntax: http://daringfireball.net/projects/markdown/syntax  
Javascript Reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects  
