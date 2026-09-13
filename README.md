## Structure

```
portfolio-site/
├── index.html              # page d'accueil (about, plateformes, compétences, parcours, projets, contact)
├── writeups.html           # liste des writeups (recherche + filtres par tag)
├── writeup.html            # affichage d'un writeup (rendu Markdown côté client)
├── writeups/
│   ├── manifest.json       # index de tous les writeups (métadonnées)
│   └── *.md                # contenu de chaque writeup en Markdown
├── cv/
│   └── Elijah_Calonnec_CV.pdf
└── assets/
    ├── css/style.css
    └── js/*.js
```

## Ajouter un nouveau writeup

1. Créez un fichier `writeups/mon-nouveau-writeup.md` en Markdown (titres `##`, code avec ``` ```, listes, images, etc. Tout le Markdown standard est supporté, avec coloration syntaxique automatique sur les blocs de code).
2. Ajoutez une entrée dans `writeups/manifest.json` :

```json
{
  "slug": "mon-nouveau-writeup",
  "title": "Titre du writeup",
  "summary": "Une phrase de résumé affichée dans la liste.",
  "date": "2026-03-14",
  "platform": "Root-Me",
  "tags": ["Web", "OSINT"]
}
```

   - `slug` doit correspondre exactement au nom du fichier `.md` (sans l'extension).
   - `tags` alimente les filtres de la page writeups.


## Ajouter une image dans un writeup

1. Déposez votre image dans `assets/img/` (formats acceptés : `.png`, `.jpg`, `.svg`, `.gif`...). Donnez-lui un nom clair, par exemple `assets/img/rootme-command-injection-1.png`.
2. Dans votre fichier `.md`, appelez-la avec :

```markdown
![Description de l'image](assets/img/rootme-command-injection-1.png)
```

Le texte entre crochets `[ ]` est la description (utile pour l'accessibilité, affichée seulement si l'image ne charge pas). Le chemin entre parenthèses `( )` doit toujours commencer par `assets/img/...` (pas par `../` ni par le nom du writeup) : les writeups sont affichés depuis la racine du site, donc le chemin part toujours de la racine, quel que soit le writeup.

## Aide-mémoire Markdown

Le Markdown est juste du texte avec quelques symboles qui changent la mise en forme. Voici tout ce dont vous aurez besoin pour un writeup :

| Vous écrivez | Résultat |
|---|---|
| `## Un titre` | Un titre de section (grand, gras) |
| `### Un sous-titre` | Un sous-titre (plus petit) |
| `**important**` | **important** (gras) |
| `*terme*` | *terme* (italique) |
| `- item 1`<br>`- item 2` | Liste à puces |
| `1. étape 1`<br>`2. étape 2` | Liste numérotée |
| `` `nmap -sV` `` | `nmap -sV` (code en ligne, dans le texte) |
| <pre>```bash<br>nmap -sV -p- 10.10.10.10<br>```</pre> | Bloc de code complet, coloré automatiquement |
| `[texte](https://exemple.com)` | texte (lien cliquable) |
| `![description](assets/img/photo.png)` | Insère une image |
| `> une remarque` | Bloc de citation mis en valeur (comme l'encadré d'avertissement dans le writeup de démo) |
| ligne vide entre deux paragraphes | Sépare les paragraphes |
