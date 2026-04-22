# TP4 Maëlig LAMARRE M1DEV - Docker Hub

## Introduction

Ce TP a pour objectif de mettre en pratique le déploiement d'une application microservices dans un environnement cloud. Il se décompose en deux exercices : le premier consiste à publier les images Docker de chaque service (authentification, produits, commandes, frontend) sur Docker Hub afin de les rendre accessibles depuis n'importe quel environnement. Le second exercice porte sur le déploiement de l'application complète sur Microsoft Azure, en créant un groupe et un environnement dédiés, en configurant les variables d'environnement nécessaires, puis en déployant chaque service individuellement au sein de cet environnement.

---

Exercice 1 :
Ajout des images sur docker hub (https://hub.docker.com/repository/docker/maelmr/devops-tp4/general) : 
![alt text](image-1.png)

Création de l'application web sur Azure : 
![alt text](image-2.png)

Application crée : 
![alt text](image-3.png)

Passage de la variable d'environnement à true : 
![alt text](image-4.png)

Exercice 2 : 

créer un groupe : 
![alt text](image-5.png)

créer un environnement : 
![alt text](image-6.png)

créer les différents services : 
produit : 
![alt text](image-7.png)
auth : 
![alt text](image-8.png)
commande : 
![alt text](image-9.png)
frontend : 
![alt text](image-10.png)
db : 
![alt text](image-11.png)

Les applications : 
![alt text](image-12.png)

Déploiement des applications : 
![alt text](image-13.png)

---

## Conclusion

Ce TP m'a permis de comprendre et de mettre en pratique l'ensemble du cycle de déploiement d'une application conteneurisée. J'ai appris à publier des images Docker sur Docker Hub pour centraliser et versionner les images de chaque microservice. J'ai également découvert le déploiement sur Azure, notamment la création d'un groupe et d'un environnement, la gestion des variables d'environnement dans le cloud, et le déploiement indépendant de chaque service. Ce TP m'a donné une vision concrète de ce qu'implique la mise en production d'une architecture microservices dans un contexte DevOps réel.
