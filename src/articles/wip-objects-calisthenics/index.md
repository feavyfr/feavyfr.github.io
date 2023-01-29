---
created_time: 2022-10-15T11:29:00.000Z
last_edited_time: 2022-10-15T11:30:00.000Z
slug: wip-objects-calisthenics
title: "[WIP] Objects Calisthenics"
tags: ["Programmation"]
---
Vous connaissez peut-être les *Objects Calisthenics*, un ensemble de règle à appliquer pour écrire du code propre, c’est-à-dire facilement maintenable et réutilisable.

<TableOfContents data={props}/>

### Ne pas utiliser le mot-clé *else*

### Wrapper les primitives et strings ayant un comportement propre

### Wrapper les collections

### Un point par ligne

### Ne pas abrévier

### Pas de classe ayant plus de deux instances en variable

### Pas de Getters/Setters/Propriétés

### Les règles que j’ai supprimées

**Sommaire**

• [Seulement un niveau d’indentation par méthode](https://blog.feavy.fr/wip-mes-objects-calisthenics/#Seulement_un_niveau_dindentation_par_methode)
• [Garder les classes courtes](https://blog.feavy.fr/wip-mes-objects-calisthenics/#Garder_les_classes_courtes)

#### Seulement un niveau d’indentation par méthode

Voici la première règle des objects calisthenics et je ne la recommande pas.

Pourquoi ? Et bien regardez le code suivant :

```
while(machin) {
    if(!condition) {
        continue;
    }
    // Du code
}
```

On est ici fasse à un cas qu’on retrouve souvent en programmation : l’utilisation de *continue* si une *condition *n’est pas respectée, notamment pour respecter la règle n°3. Le fait de se limiter à un niveau d’indentation par méthode nous empêcherait purement et simplement de pouvoir écrire ce code.

#### Garder les classes courtes
