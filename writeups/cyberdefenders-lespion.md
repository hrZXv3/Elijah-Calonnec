## Résumé

Writeup du lab CyberDefenders « L'espion », un scénario de menace interne résolu entièrement par OSINT. À partir d'un simple fichier texte pointant vers un compte GitHub, l'enquête pivote de plateforme en plateforme pour identifier les secrets exposés par la cible, ses outils, ses comptes liés, puis retracer ses déplacements par géolocalisation d'images.

> **Avertissement** : lab d'entraînement, cible fictive. L'investigation repose uniquement sur des sources ouvertes et une consultation passive des profils, sans aucune interaction avec les comptes.

## Point de départ

Artefacts fournis par le lab :

| Fichier | Type | Taille | Description
|---|---|---|---
| `Github.txt` | Texte | 1 Ko | Pointe vers le profil GitHub de la cible
| `office.jpg` | Image JPG | 145 Ko | Photo du bâtiment abritant un bureau de l'entreprise 
| `WebCam.png` | Image PNG | 1 031 Ko | Capture d'une caméra IP ayant filmé la cible

**Outils utilisés** : [WhatsMyName](https://whatsmyname.me/) pour l'énumération de pseudonymes, recherche d'image inversée Google pour la géolocalisation, base64decode pour le décodage.

### Q1 — File -> Github.txt: What API key did the insider add to his GitHub repositories?

**Démarche :** Le fichier `Github.txt` fourni par le lab pointe vers un profil GitHub : [EMarseille99](https://github.com/EMarseille99). En parcourant ses dépôts publics, l'un d'eux retient l'attention : [Project-Build---Custom-Login-Page](https://github.com/EMarseille99/Project-Build---Custom-Login-Page). Dès le premier fichier du dépôt, `Login Page.js`, une clé d'API apparaît en clair tout en haut du code, directement écrite dans le fichier source.

**Réponse :** `aJFRaLHjMXvYZgLPwiJkroYLGRkNBW`

![Clé d'API en clair dans Login Page.js](assets/img/lespion/apikey.png)

**Note :** Un secret codé en dur dans un dépôt public est l'une des fuites les plus fréquentes en conditions réelles : n'importe qui peut le récupérer, et il reste accessible dans l'historique des commits même après suppression du fichier.

### Q2 — What plaintext password did the insider add to his GitHub repositories?

**Démarche :** En poursuivant la lecture de `Login Page.js`, plus bas dans le code, on trouve une ligne `Password` accompagnée de la mention « Password(base64) ». La valeur `UGljYXNzb0JhZ3VldHRlOTk=` n'est donc pas le mot de passe lui-même, mais sa version encodée en Base64, ce que confirment aussi sa structure (caractères alphanumériques) et le `=` de remplissage final.

![Mot de passe encodé en Base64 dans Login Page.js](images/lespion/psswrd.png)

Un décodage Base64 via base64decode permet de retrouver le mot de passe en clair.

![Décodage de la valeur Base64](images/lespion/decode.png)

**Réponse :** `PicassoBaguette99`

**Note :** Le Base64 est un encodage, pas un chiffrement : il ne protège rien et se réverse instantanément. Stocker un mot de passe ainsi revient à le laisser en clair.

### Q3 — What cryptocurrency mining tool did the insider use?

**Démarche :** En parcourant les dépôts publics du profil [EMarseille99](https://github.com/EMarseille99), l'un d'eux s'appelle [xmrig](https://github.com/EMarseille99/xmrig). Sa description, « RandomX, CryptoNight, AstroBWT and Argon2 CPU/GPU miner », liste des algorithmes de minage de cryptomonnaie, ce qui confirme qu'il s'agit d'un outil de minage.

![Dépôt xmrig parmi les dépôts populaires du profil](images/lespion/xmrig.png)

**Réponse :** `xmrig`

**Note :** Le dépôt est un fork du projet officiel xmrig/xmrig, un mineur open source (principalement Monero) légitime en soi, mais très souvent détourné pour du cryptojacking. Il côtoie d'ailleurs sur ce profil d'autres forks orientés offensif (QuasarRAT, Empire, Metasploit, meterpreter, mimikatz), ce qui dessine une boîte à outils cohérente avec une activité malveillante.

### Q4 — On which gaming website did the insider have an account?

**Démarche :** Le pseudonyme `EMarseille99` identifié sur GitHub sert de point de pivot. Une recherche sur [WhatsMyName](https://whatsmyname.me/), qui teste la présence d'un pseudo sur des centaines de plateformes, fait ressortir un compte Steam portant ce même nom : [steamcommunity.com/id/EMarseille99](https://steamcommunity.com/id/EMarseille99/). Le rattachement à la cible ne repose pas uniquement sur le pseudo : le profil Steam utilise la même photo de profil que le compte GitHub, ce qui confirme qu'il s'agit bien de la même personne.

![Profil Steam emarseille99 avec la même photo que le GitHub](images/lespion/steam.png)

**Réponse :** `Steam`

**Note :** La réutilisation d'un même pseudo et d'une même photo sur plusieurs plateformes est une erreur d'OPSEC classique : elle permet de relier des comptes entre eux en quelques minutes.

### Q5 — What is the link to the insider Instagram profile?

**Démarche :** La même recherche [WhatsMyName](https://whatsmyname.me/) sur le pseudonyme `EMarseille99` remonte également, dans ses résultats de moteurs de recherche, deux entrées Instagram : un profil « Émilie Marseille (@emarseille99) » et une publication « Add me for some games ;) ». Le pseudo est identique à celui des comptes GitHub et Steam, et la publication fait écho au profil gaming déjà identifié sur Steam.

![Résultats Instagram remontés par WhatsMyName](images/lespion/insta.png)

**Réponse :** `https://www.instagram.com/emarseille99/`

**Note :** Ce résultat apporte un nouvel élément de pivot : un nom complet, « Émilie Marseille », qui n'apparaissait pas jusqu'ici et qui colle avec le pseudo (E. Marseille + 99).

### Q6 — Which country did the insider visit on her holiday?

**Démarche :** Sur le profil Instagram, une publication accompagnée de la légende « Once in a lifetime holiday here, love me some slings x » indique clairement une photo de vacances. L'image montre un bâtiment très reconnaissable : trois tours surmontées d'une plateforme en forme de navire. Une recherche d'image inversée sur Google identifie le Marina Bay Sands et son SkyPark, à Singapour.

![Photo de vacances publiée sur Instagram](images/lespion/vac.png)

**Réponse :** `Singapore`

**Note :** La légende corrobore la géolocalisation : les « slings » font très probablement référence au Singapore Sling, le cocktail emblématique de la ville. Deux indices indépendants, l'image et le texte, pointent donc vers le même pays.

### Q7 — Which city does the insider family live in?

**Démarche :** Sur le profil Instagram, une publication en deux photos porte la légende « Nice to meet friends & family Photo 1/2 », ce qui la relie à un moment passé avec sa famille. La seconde photo montre une avenue avec, en arrière-plan, une tour immédiatement reconnaissable : le Burj Khalifa, plus haute tour du monde, située à Dubaï. Pour confirmer l'identification plutôt que de me fier uniquement à la silhouette, une recherche d'image inversée sur Google confirme qu'il s'agit bien du Burj Khalifa.

![Photo publiée sur Instagram avec le Burj Khalifa en arrière-plan](images/lespion/dubai.png)

**Réponse :** `Dubai`

**Note :** La légende indique une rencontre avec la famille, pas explicitement son lieu de résidence : le fait que la famille vive à Dubaï reste une déduction raisonnable, cohérente avec la question du lab, mais c'est un niveau de confiance moyen plutôt qu'une certitude.

### Q8 — Which city is the company located in?

**Démarche :** Le lab fournit une photo, `office.jpg`, montrant le bâtiment dans lequel l'entreprise a un bureau. Une recherche d'image inversée sur Google identifie le lieu : il s'agit de la gare de Birmingham New Street, dont on reconnaît la façade en inox réfléchissant.

![Photo office.jpg fournie par le lab](images/lespion/office.jpg)

**Réponse :** `Birmingham`

**Note :** Plusieurs éléments visibles sur la photo recoupent l'identification sans recherche inversée : l'enseigne « Grand Central » (le centre commercial de la gare), et les panneaux piétons indiquant le Bull Ring, Moor Street et Snow Hill, trois lieux emblématiques de Birmingham.

### Q9 — Which state is this camera in?

**Démarche :** Le lab fournit une capture, `WebCam.png`, issue d'une caméra IP en direct. Une recherche d'image inversée sur Google identifie la source : il s'agit du flux en direct filmé depuis le dôme du bâtiment principal de l'[Université de Notre-Dame](https://dome.nd.edu/), située dans l'Indiana, aux États-Unis.

![Capture WebCam.png fournie par le lab](images/lespion/WebCam.png)

**Réponse :** `Indiana`

**Note :** La capture contient elle-même des indices qui recoupent l'identification : le titre « A View from the Dome » au-dessus du flux et le logo EarthCam, plateforme qui diffuse ce type de webcams publiques. Une simple recherche sur ce titre mène directement à la page de l'université.

## Conclusion

L'enquête montre qu'une seule erreur d'OPSEC suffit à dérouler tout un profil. Le compte GitHub `EMarseille99` expose à lui seul une clé d'API et un mot de passe à peine masqué en Base64, ainsi qu'une boîte à outils cohérente avec une activité malveillante (mineur xmrig, QuasarRAT, Empire, Metasploit, mimikatz). La réutilisation du même pseudonyme et de la même photo de profil permet ensuite de relier les comptes Steam et Instagram, ce dernier révélant un nom complet, « Émilie Marseille », et des publications exploitables pour la géolocalisation : vacances à Singapour, famille à Dubaï.

Les artefacts fournis par le lab complètent le tableau : le bureau de l'entreprise se situe à Birmingham, et la cible a été repérée par une webcam de l'Université de Notre-Dame, dans l'Indiana.

**Niveau de confiance** : élevé sur le rattachement des comptes GitHub, Steam et Instagram (pseudo et photo identiques). Moyen sur le lieu de résidence de la famille à Dubaï, déduit d'une légende évoquant une rencontre familiale et non d'une mention explicite.