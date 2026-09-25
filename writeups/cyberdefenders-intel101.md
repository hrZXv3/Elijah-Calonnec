## Résumé

Writeup du lab CyberDefenders « Intel101 », un challenge de la catégorie Threat Intel résolu entièrement par OSINT. Chaque question mobilise une technique différente de reconnaissance : interrogation WHOIS d'un domaine, exploitation d'une fuite d'information dans une capture d'écran publique, fouille des archives d'un site via la Wayback Machine, et géolocalisation d'une photo par recherche d'image inversée.

> **Avertissement** : lab d'entraînement. L'investigation repose uniquement sur des sources ouvertes et une consultation passive, sans aucune interaction avec les cibles.

## Point de départ

Artefact fourni par le lab :

| Fichier | Type | Description
|---|---|---|
| `UNADJUSTEDNONRAW_thumb_4859.jpg` | Image JPG | Photo à géolocaliser (Q4) |

**Outils utilisés** : WHOIS pour les informations d'enregistrement de domaine, Wayback Machine (archive.org) pour l'historique des sites web, recherche d'image inversée pour la géolocalisation, recherche web et réseaux sociaux pour les sources ouvertes.

### Q1 — Who is the Registrar for jameskainth.com?

**Démarche :** Une recherche WHOIS sur le domaine `jameskainth.com` permet d'obtenir les informations d'enregistrement publiques du domaine. La section « Registrar Information » indique le bureau d'enregistrement auprès duquel le domaine a été acheté : NameCheap, Inc., avec pour serveur WHOIS `whois.namecheap.com`.

![Résultat WHOIS pour jameskainth.com](assets/img/intel101/whois.png)

**Réponse :** `NameCheap, Inc.`

**Note :** Le registrar est la société qui gère l'enregistrement du domaine, à ne pas confondre avec le registrant, c'est-à-dire la personne ou l'entité qui en est propriétaire. Les données de contact du propriétaire étant souvent masquées, le registrar reste utile comme point de contact pour un signalement d'abus.

### Q2 — What is the Zoom meeting id of the British Prime Ministers Cabinet Meeting?

**Démarche :** Une recherche sur le Premier ministre britannique et sa réunion de cabinet sur Zoom fait remonter un article de presse expliquant que l'identifiant de la réunion avait fuité via une publication sur son compte Twitter. En remontant à [cette publication](https://x.com/BorisJohnson/status/1244985949534199808), on retrouve la capture d'écran de la visioconférence partagée publiquement : l'identifiant de la réunion Zoom y apparaît en clair, dans la barre de titre de la fenêtre.

![Capture de la réunion Zoom publiée sur Twitter, avec l'ID visible](assets/img/intel101/id.png)

**Réponse :** `539-544-323`

**Note :** C'est un cas réel, survenu en mars 2020 : Boris Johnson avait publié cette capture de son premier conseil des ministres en visioconférence, exposant l'identifiant de la réunion ainsi que les noms d'utilisateurs de plusieurs participants. Un bon exemple de fuite d'information par capture d'écran, où le détail sensible ne se trouve pas dans le sujet de la photo mais dans l'interface autour.

### Q3 — In 2019 UVM's Ichthyology Class had to name their fish for class. Can you find out what the most recently assigned fish name was?

**Démarche :** Une recherche sur le cours d'ichtyologie de l'UVM (University of Vermont) mène au site de l'école qui l'héberge : `https://www.uvm.edu/rsenr`. La version actuelle du site ne contient plus rien d'exploitable, d'où le passage par la Wayback Machine d'archive.org. La navigation par calendrier sur l'année 2019 s'est révélée peu praticable, avec un très grand nombre de sauvegardes. J'ai donc utilisé l'onglet « URLs », qui liste toutes les adresses archivées sous ce préfixe (plus de 7 000), et filtré sur le mot-clé `fishname` : un seul résultat ressort, un fichier `studentfishnames2019.xls`.

![Recherche des URLs archivées contenant « fishname » sur la Wayback Machine](assets/img/intel101/fishname.png)

Le fichier contient la liste des étudiants et du nom de poisson attribué à chacun. La dernière entrée, la 46, correspond à l'étudiant Wilkins, Dylan D., associé au nom Saccopharyngiformes.

![Dernière ligne du fichier studentfishnames2019.xls](assets/img/intel101/fishname2.png)

**Réponse :** `Saccopharyngiformes`

**Note :** L'onglet « URLs » de la Wayback Machine est souvent plus efficace que le calendrier : au lieu de parcourir les captures date par date, on cherche directement dans l'ensemble des fichiers archivés d'un site, y compris des documents qui n'y sont plus accessibles aujourd'hui.

### Q4 — Can you identify the state from which this picture was taken?

**Démarche :** Le lab fournit une photo, `UNADJUSTEDNONRAW_thumb_4859.jpg`, montrant une statue de ptérosaure perchée sur un tronc d'arbre, devant de fausses formations rocheuses et un bâtiment rouge. Une recherche d'image inversée sur cette photo identifie le lieu : il s'agit de Dinosaur Land, un parc à thème situé à White Post, en Virginie.

![Photo fournie par le lab](assets/img/intel101/UNADJUSTEDNONRAW_thumb_4859.jpg)

![Fiche Google de Dinosaur Land, à White Post, Virginie](assets/img/intel101/dino.png)

**Réponse :** `Virginia`

**Note :** Pour confirmer une géolocalisation issue d'une recherche inversée, on peut comparer la photo avec les images publiées du lieu (photos de visiteurs, Street View) : la statue, les rochers artificiels et le bâtiment rouge

## Conclusion

Intel101 illustre la diversité des sources ouvertes qu'un analyste peut mobiliser en phase de reconnaissance. Les registres WHOIS exposent les informations d'enregistrement d'un domaine, ici son registrar. Une simple capture d'écran publiée sur un réseau social peut faire fuiter une donnée sensible, comme l'identifiant de la réunion de cabinet britannique visible dans l'interface Zoom. Un fichier retiré d'un site reste souvent accessible dans les archives du web, à condition de chercher efficacement parmi les URLs capturées plutôt que date par date. Enfin, une photo sans métadonnées exploitables peut être géolocalisée à partir des seuls éléments visuels, par recherche d'image inversée.

**Niveau de confiance** : élevé sur les quatre réponses, chacune reposant sur une source directe et vérifiable (enregistrement WHOIS, publication originale, fichier archivé, identification du lieu). La seule interprétation concerne la Q3 : le nom « le plus récemment attribué » a été déduit de la dernière ligne du fichier, en supposant une liste remplie dans l'ordre chronologique.