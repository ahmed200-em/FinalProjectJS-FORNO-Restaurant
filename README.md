# FORNO Restaurant

Site de démonstration d’une pizzeria artisanale, réalisé en HTML, CSS et JavaScript.

## Lancer le site

Depuis le dossier du projet, démarrez un serveur local avec Python 3.

```sh
python -m http.server 8000
```

Ouvrez ensuite [FORNO en local](http://localhost:8000). Le site ne nécessite aucune installation de dépendances.

## Parcours disponibles

- Rechercher les pizzas par nom ou ingrédient et filtrer par catégorie.
- Gérer le panier, retrouver son contenu en changeant de page et préparer une commande à emporter, sur place ou en livraison.
- Choisir une maison FORNO, préparer un message et vérifier son aperçu.

Le panier est enregistré dans le navigateur. Le formulaire de commande affiche un récapitulatif local et attribue un numéro de table de démonstration pour les commandes sur place. En livraison, le tarif de démonstration dépend de la zone choisie après la saisie de l’adresse, avec 15 MAD pour Casablanca centre et 25 MAD pour la périphérie. Les coordonnées de commande ne sont ni envoyées ni enregistrées. Le formulaire de contact affiche un aperçu local sans envoyer de message.
