# TP3 — Manipuler les conteneurs Docker

## Introduction

Dans ce TP, j'ai pris en main Docker afin de découvrir concrètement le fonctionnement des conteneurs. À travers trois exercices progressifs, j'ai appris à lancer un conteneur depuis une image existante, à dockeriser une application Node.js via un Dockerfile, puis à orchestrer une architecture microservices complète avec Docker Compose.

---

## Exercice 1 — Lancer un conteneur MySQL

Dans ce premier exercice, j'ai créé et démarré un conteneur basé sur l'image officielle MySQL disponible sur Docker Hub.

La commande suivante a été utilisée :

```bash
docker run --name some-mysql -e MYSQL_ROOT_PASSWORD=123 -p 3306:3309 -d mysql:latest
```

Docker n'ayant pas trouvé l'image `mysql:latest` en local, il l'a automatiquement téléchargée depuis Docker Hub. Une fois le conteneur démarré, j'ai vérifié son état avec `docker ps`, qui m'a confirmé qu'il tournait bien sur le port 3306 de la machine hôte, redirigé vers le port 3309 du conteneur.

J'ai ensuite arrêté le conteneur en récupérant son ID via `docker ps` et en exécutant :

```bash
docker stop e2d324329030
```

J'ai aussi constaté que Docker Desktop permettait de visualiser et gérer les conteneurs graphiquement, comme alternative à la ligne de commande.

---

## Exercice 2 — Dockeriser une application microservices

Dans cet exercice, j'ai dockerisé une application composée de trois services Node.js (authentification, produits, commandes) et d'une base de données MongoDB, en utilisant Docker Compose.

Chaque service dispose de son propre `Dockerfile` dans son répertoire :

```dockerfile
FROM node:lts-alpine
WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
CMD ["npm", "start"]
```

J'ai également ajouté un fichier `.dockerignore` contenant `node_modules` pour éviter de copier ce dossier volumineux dans l'image.

Toutes les variables d'environnement sont centralisées dans un fichier `.env` à la racine (exclu du dépôt git via `.gitignore`) :

```env
MONGO_URI_AUTH=mongodb://db/auth-service
MONGO_URI_PRODUIT=mongodb://db/produit-service
MONGO_URI_COMMANDE=mongodb://db/commande-service
RABBITMQ_URL=amqp://user:password@rabbitmq:5672
PORT_AUTH=4002
PORT_PRODUIT=4000
PORT_COMMANDE=4001
JWT_SECRET=secret
```

Le code de chaque service lit ces variables via `process.env.*` :

```javascript
mongoose.connect(process.env.MONGO_URI_PRODUIT);
amqp.connect(process.env.RABBITMQ_URL);
```

Le `docker-compose.yml` charge le `.env` via `env_file: .env` et orchestre les cinq conteneurs avec des healthchecks sur MongoDB et RabbitMQ :

- `db` et `rabbitmq` exposent leur état de santé
- les services applicatifs attendent `condition: service_healthy` avant de démarrer
- un `restart: on-failure` est configuré sur chaque service
- les sources sont montées en volume (`./service:/app`) pour le hot reload avec nodemon

Un point important : dans une architecture multi-conteneurs, les services communiquent via leur nom de service Docker (`db`, `rabbitmq`, `produit-service`, etc.) et non via `localhost`.

---

## Exercice 3 — Démarrage et test des conteneurs

Depuis le répertoire racine du projet, lancer l'ensemble des conteneurs avec :

```bash
docker compose up --build
```

`--build` force la reconstruction des images. Une fois les images déjà construites, `docker compose up` suffit.

Les cinq conteneurs (auth-service, produit-service, commande-service, db, rabbitmq) apparaissent comme actifs dans Docker Desktop.

Pour tester le bon fonctionnement, j'ai envoyé une requête POST via Postman sur `localhost:5002/auth/register` pour enregistrer un utilisateur :

![alt text](image.png)


Enfin, pour vérifier que les données ont été persistées dans MongoDB, j'ai ouvert le terminal du conteneur `db` depuis Docker Desktop et exécuté :

```bash
mongosh
show databases
use auth-service
db.utilisateurs.find()
```

Le résultat a bien affiché l'utilisateur "mae" enregistré dans la base de données.

---

## Conclusion

Ce TP m'a permis de lancer un conteneur depuis une image existante, à écrire un Dockerfile pour conteneuriser une application Node.js, et à utiliser Docker Compose pour orchestrer plusieurs services qui communiquent entre eux. Les points clés retenus sont :

- chaque service a son propre `Dockerfile`
- dans une architecture multi-conteneurs, les services se joignent via leurs noms définis dans le `docker-compose.yml`
