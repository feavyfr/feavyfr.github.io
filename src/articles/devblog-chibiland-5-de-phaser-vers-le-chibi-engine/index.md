---
created_time: 2022-12-17
last_edited_time: 2022-12-17
slug: devblog-chibiland-5-de-phaser-vers-le-chibi-engine
title: "Devblog Chibiland #5 — De Phaser vers le Chibi Engine"
tags: ["Chibi Engine","Chibiland"]
icon_emoji: 🍒
---
En Mai 2021, alors que je m’intéressais beaucoup à WebAssembly, je me suis mis à chercher un moteur de jeu C++ pour le web. J’entends par là un moteur qui permette de coder son jeu de A à Z en C++, comme [Cocos2dx](https://www.cocos.com/en/cocos2dx), pour ensuite le compiler en WASM et l’exécuter sur le Web (ce que Cocos2dx ne permet pas). Je n’en ai jamais trouvé et d’ailleurs je ne connais toujours pas tel moteur à l’heure actuelle.. donc si vous en connaissez, je suis preneur 😃

Bref, ça m’a donné une idée un peu folle : créer mon propre moteur de jeu 2D pour le Web en C++ et OpenGL : le [Cherry Engine](https://cherrygameengine.github.io/).

L’objectif du moteur était d’être simple et efficace et de permettre de coder des jeux web entièrement en C++. A côté de ça le but pour moi était d’apprendre le rendu OpenGL tout en me perfectionnant en C++.

Alors j’ai commencé à apprendre OpenGL avec [cette très bonne ressource](https://learnopengl.com/) mais j’ai assez vite décroché par manque de temps et motivation.

Le Cherry Engine était un side-project fun, certes, mais je savais qu’il ne pourrait pas rivaliser avec les principaux moteurs de jeu web.

Déjà d’un point de vue performances, car il faut bien s’y connaître pour savoir optimiser le rendu OpenGL. C’est vraiment une compétence spécifique que j’aurais mis beaucoup de temps à acquérir.

Mais aussi d’un point de vue simplicité d’utilisation. J’ai fait le choix d’utiliser le langage C++, un langage par nature plus compliqué que JavaScript ou TypeScript, alors que le but et de viser les plateformes web. Je voulais faire un moteur de jeu web simple… en C++, un choix insensé.

Alors j’ai mis ce projet de côté car je savais qu’il serait peu pertinent et empiéterait sur le temps que je pourrais consacrer à Chibiland.



Mais à côté de ça…



<TableOfContents data={props}/>

## [Phaser](https://phaser.io/) commençait à me fatiguer

Phaser est le moteur que j’utilise actuellement pour Chibiland et il me déplaît pour plusieurs raisons:

### Un rythme de mise-à-jour très aléatoire

On a eu la 3.24.1 en juillet 2020, puis une bêta pour la 3.25… puis en fait non, c’est passé à la 3.50 directement. On a eu des bêtas jusqu’à la dixième en novembre puis la release 3.50 en décembre 2020. Ensuite c’était calme, 51, 52, 53, 54, 55, 60.. aie! On a encore perdu le compte !

Bon en réalité ces sauts dans les versions sont là pour signifier que la nouvelle version introduit **beaucoup** de changements dont certains qui cassent la rétrocompatibilité. Mais je pense qu’il doit y avoir un meilleur moyen pour le notifier.

Peut-être avec un format `[1-4].[major].[minor].[patch]`

Et maintenant ça fait plus d’un an qu’il n’y a pas eu de release, certes on est à la neuvième bêta de la 3.60 mais je suis un peu réticent à utiliser une version bêta en production. L’idéal aurait été de scinder cette mise-à-jour en plusieurs (voire en 5 pour garder le compte) mais on dirait que Rich (le développeur principal de Phaser) préfère les grosses mises-à-jour façon Minecraft.

### Un moteur pas suffisamment modulaire

Le point d’entrée de Phaser est le module global `Phaser`, lequel exporte tous les modules du moteur. Le problème avec cette méthode est que chaque nouvelle fonctionnalité augmente la taille du bundle même si vous ne vous ne vous en servez jamais.

Bien-sûr il y a possibilité de faire des build custom de Phaser mais ça reste assez fastidieux à faire je trouve.

### Des bugs introduits d’une version à l’autre

En passant à la version 50 j’ai eu quelques surprises :

* L’effet de lerp qui rend les mouvements de la caméra doux ne fonctionnait plus.

* Sur Android des artefacts bleus se sont mis à apparaître au niveau des sprites affichés. 

Résultat :  J’ai un magnifique dossier `fixes` avec trois fixes que je suis obligé d’appliquer comme un sale sur le moteur.

### Pas assez axé POO, dynamisme

* Pas assez axé POO.

* Pas assez axé dynamisme.

* Le chargement d’assets ne me plaît pas.

Pas pratique que tous les GameObject prennent la scène dans le constructeur. Un GameObject devrait pouvoir exister sans scène. La scène devrait seulement être nécessaire au moment de l'ajout du Noeud.

En fait le moteur ne me paraît pas être fait pour des jeux en ligne, où les ressources doivent être chargées dynamiquement.

### Une API lourde

* La syntaxe est assez lourde.
    * L’API est parfois très moche. Comment savoir si le jeu est joué sur un écran tactile ?
Avec `scene.sys.game.device.input.touch` bien sûr !

* Et ça ne s'améliore pas avec Phaser 4 qui abandonne les méthodes de classe pour passer par des espèces de procédures globales. Chose que je n’avais encore jamais vue.
Par exemple pour ajouter un élément à une scène ce n’est plus `scene.add(elmt)` mais `AddChild(scene, elmt)` Niveau autocomplétions ça va être fun.



Bref,

## Il fallait changer de moteur

Et alors je me suis dit :

Pourquoi ne pas joindre l’utile à l’agréable ?

J’ai toujours eu envie de maintenir une bibliothèque pour aider d’autres développeur, designer ma propre API, la rendre la plus intuitive, agréable à utiliser... Créer mon propre moteur est quelque chose qui me permettrait de faire tout ça en m’amusant et tout en étant utile pour Chibiland, c’est le side-project idéal !

Je me suis donc lancé dans la création du **[Chibi Engine](https://github.com/ChibiEngine/ChibiEngine)**** **!

Un moteur de jeu web basé sur [PixiJS](https://pixijs.com/) dont le développement sera orienté par Chibiland.

L’idée est de créer un simple wrapper par dessus Pixi pour rendre le développement le plus simple et efficace possible, en lui intégrant directement des fonctionnalités essentielles comme **le chargement dynamique et transparent des assets **(plus de détails dans un prochain article).

Pixi est l’idéal pour ça, c’est un moteur très modulaire, robuste, puissant et léger. Il offrira probablement un gain de performances à Chibiland tout en diminuant la taille des bundles.

Un seul moteur physique sera intégré : PlanckJS, bien mieux que MatterJS (présent de base dans Phaser). Avec une couche d’abstraction par dessus pour en faciliter l’utilisation et donner la possibilité d’utiliser une autre implémentation, comme [box2d-wasm](https://github.com/Birch-san/box2d-wasm) par exemple.

Le moteur intégrera également un système d’animation personnalisé. J’ai eu une idée de spécification pour faire des petites animations simples, quelque chose à cheval entre le frame par frame et Spine qui fonctionnera très bien pour Chibiland. Et dans l’idéal j’aimerais aussi faire un éditeur d’animation avec.

Tout ça fera beaucoup de travail 🥵

Je ne vais détailler plus les fonctionnalités ici, je ferai un autre article pour ça. Le but était plutôt d’expliquer les raisons de ce changement. D’ailleurs je pense même créer une série spéciale de devblog pour le Chibi Engine.

### Le Chibi Engine… vers un Any Engine ?

J'ai eu autre idée pendant que je réfléchissais au moteur.

Depuis le début je le voyais comme un wrapper par dessus PixiJS pour abstraire le rendu compliqué et fournir une API toute simple pour créer des jeux. Mais en y réfléchissant je me suis demandé..

Qu’est-ce-qui m’empêcherait d’utiliser un autre moteur que PixiJS en dessous ?

Rien !

Il pourrait marcher avec n'importe quoi. Pixi, Phaser.. Même [Cocos2d-x](https://github.com/cocos2d/cocos2d-x) pour faire des versions **natives pour mobiles et desktop**, ou [three.js](https://threejs.org/) pour faire de la 3D !

Cela permettrait d’améliorer les jeux beaucoup plus rapidement si les technologies évoluent.

Il serait même possibilité de créer un environnement de développement complet autour du moteur, dans le même style que Unity pour créer le jeu. Cela permettrait en quelque sorte d’unifier les petits moteurs open-source sous un même éditeur pour faciliter la création de jeux.

À voir la pertinence que ça peut avoir.


**Suite :**

Page not found 23835940-46b0-445d-8dc3-74a45065838f


