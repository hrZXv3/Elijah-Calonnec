# Portfolio hrZXv3

Site 100% statique (HTML/CSS/JS, aucun build, aucun backend, aucune base de données). Fait pour être hébergé sur GitHub Pages.

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

3. Commit + push. GitHub Pages redéploie automatiquement en 1–2 minutes.

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

Rien d'autre à savoir : vous écrivez comme dans un traitement de texte, ces quelques symboles suffisent à tout mettre en forme.

Supprimez `writeups/exemple-a-remplacer.md` et son entrée dans `manifest.json` quand vous avez publié votre premier vrai writeup.

## Mettre à jour le CV

Remplacez `cv/Elijah_Calonnec_CV.pdf` par la nouvelle version (même nom de fichier) et commit. Le bouton "CV" sur le site pointe toujours vers ce fichier.

## Pourquoi pas de backend / pas de login ?

Le site n'a ni base de données ni panneau d'administration en ligne. **"Être le seul à pouvoir écrire dessus" est déjà garanti par les permissions de votre repo GitHub** : seuls les comptes que vous ajoutez comme collaborateurs peuvent push du contenu. C'est plus simple à opérer et plus sûr qu'un système de login/mot de passe custom (pas de mot de passe à fuiter, pas d'API à sécuriser, pas de serveur à maintenir/patcher).

Si un jour vous voulez éditer depuis un navigateur sans toucher à un terminal : GitHub permet d'éditer/créer des fichiers directement dans l'interface web du repo (bouton "Add file" / l'icône crayon sur un fichier existant), ce qui revient exactement au même workflow sans avoir besoin de `git` en local.

## Déploiement (GitHub Pages)

1. Le contenu de `portfolio-site/` doit être à la racine du repo (ou dans `/docs` si vous préférez, à condition de configurer Pages en conséquence).
2. Dans les Settings du repo GitHub → Pages → Source : "Deploy from a branch", branche `main`, dossier `/ (root)`.
3. Le site est alors disponible sur `https://<votre-user>.github.io/<nom-du-repo>/` (ou `https://<votre-user>.github.io/` si le repo s'appelle exactement `<votre-user>.github.io`).

### Domaine personnalisé (optionnel)

Si vous achetez un nom de domaine : ajoutez un fichier `CNAME` à la racine contenant votre domaine (ex. `elijahcalonnec.fr`), puis configurez chez votre registrar un enregistrement `CNAME` (sous-domaine) ou 4 enregistrements `A` (domaine racine) pointant vers les IPs de GitHub Pages. Le tout est documenté dans Settings → Pages une fois le domaine renseigné.

## Développement local

Aucune dépendance à installer. Ouvrez `index.html` dans un navigateur, ou lancez un petit serveur local pour éviter les soucis de `fetch()` sur les fichiers locaux (`file://`) :

```bash
python -m http.server 8000
```

puis ouvrez `http://localhost:8000`.
