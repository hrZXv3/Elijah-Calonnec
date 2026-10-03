### Chall 1 — Googlint And Geoint

> **Énoncé :** Quand est sorti le timbre illustré par ce tableau ? Quel est le pont qui a inspiré ce tableau ?

**Démarche**

Le challenge fournit l'image d'un tableau. Une recherche à partir de cette image permet d'identifier l'œuvre : il s'agit de *The Bridge* (1983), un tableau représentant le Coleman Bridge à Singapour, reproduit sur un timbre.

Pour obtenir la date d'émission exacte du timbre, je me suis tourné vers Colnect, un catalogue collaboratif de timbres. La fiche du timbre « "The Bridge", 1983 », de la série *Paintings by Singapore Artists*, donne toutes les informations philatéliques, dont la date d'émission.

![Fiche Colnect du timbre "The Bridge", 1983](assets/img/oterihack/timbre.png)

**Réponse**

- Date de sortie du timbre : **11 mars 1992**
- Pont ayant inspiré le tableau : **Coleman Bridge** (Singapour)

Format attendu : `AAAA-MM-JJ_nom-du-pont` (exemple fourni : `1987-01-22_lyon-bridge`)

Flag : `1992-03-11_coleman-bridge`

**Note** — La fiche Colnect précise que le tableau est de Poh Siew Wah, alors que le timbre a été conçu par Lim Ching San. Il faut donc distinguer l'année du tableau (1983), inscrite sur le timbre, de sa date d'émission (1992). C'est probablement le piège de la question.

### Chall 2 — Archive

> **Énoncé :** Quel est le nom de l'entreprise ayant développé la version du site d'Oteria datant du 10 novembre 2021 ?

**Démarche**

La question porte sur une ancienne version du site d'Oteria : le site actuel ne suffit donc pas, il faut consulter ses archives. J'ai utilisé la Wayback Machine (Internet Archive) sur `oteria.fr` et ouvert la capture du 10 novembre 2021.

Le pied de page de cette version crédite l'agence qui a conçu le site.

![Pied de page du site d'Oteria archivé le 10 novembre 2021](assets/img/oterihack/siteoteria.png)

**Réponse**

Flag : `Elias`

**Note** — Le pied de page mentionne « Elias.studio », qui est le nom de domaine du studio. Le nom de l'entreprise attendu est Elias.

### Chall 3 — Socmint

> **Énoncé :** Nous avons besoin de votre aide pour retrouver une information, voici les seuls éléments que nous avons : « Beau ciel bleu aujourd'hui ! #challenge #intro #getotterhere »

**Démarche**

Le seul élément exploitable est un message accompagné de hashtags, dont un très spécifique : `#getotterhere`. Les hashtags `#challenge` et `#intro` sont trop génériques, alors que `#getotterhere` a toutes les chances d'avoir été créé pour le challenge : c'est lui qu'il faut pivoter.

Restait à identifier le réseau social. Bluesky est régulièrement utilisé dans les CTF OSINT, et la formule « Beau ciel bleu » renvoie directement à son nom. J'ai donc cherché le hashtag `#getotterhere` dans la recherche de Bluesky.

Le premier résultat est une publication du compte `@o-tter-space.bsky.social`, avec les mêmes hashtags que l'énoncé, qui donne directement le flag.

![Recherche du hashtag #getotterhere sur Bluesky](assets/img/oterihack/blueskye.png)

**Réponse**

Flag : `Otarieee`

**Note** — Le pivot repose sur le hashtag le plus rare du message. Les jeux de mots de l'énoncé (« ciel bleu » pour Bluesky, « otter » pour Oteria) indiquaient à la fois le réseau à cibler et le lien avec l'école.

### Chall 4 — INTERPOL RED NOTICE PT. 1

> **Énoncé :** Dans cette série de challenges, vous allez enquêter sur un individu recherché par INTERPOL. Ainsi, veillez à être prudent, à utiliser des sockpuppets et n'entrez sous aucun prétexte en contact avec l'individu ou son entourage. Il est essentiel de ne pas entraver la recherche de la police. Il pourra être nécessaire d'utiliser des leaks durant cette enquête. Ne téléchargez rien, il existe plusieurs sites permettant d'effectuer des recherches dans ces brèches de données. L'individu s'appelle Wissem CHIBOUNI et est recherché pour tentative de meurtre. Quelle était son adresse (telle qu'indiquée sur maps) ?
>
> **Format :** `OTERIHACK{1 Rue du 19 Mars 1962, 92230 Gennevilliers}`

**Démarche**

L'énoncé indique explicitement la piste : rechercher l'individu dans des fuites de données, sans rien télécharger, en passant par un service de recherche en ligne dans les brèches existantes.

La recherche sur le nom complet renvoie une fiche issue d'une fuite attribuée à l'ANTS (mairies françaises). Elle contient notamment une adresse postale à Thonon-les-Bains (Haute-Savoie).

![Fiche issue de la fuite (données personnelles floutées)](assets/img/oterihack/leak.png)

L'adresse de la fuite est en majuscules et tronquée. Pour respecter le format demandé (« telle qu'indiquée sur maps »), je l'ai recherchée sur Google Maps afin de récupérer sa forme normalisée : abréviation de la voie, code postal et nom de la commune.

**Réponse**

Flag : `OTERIHACK{[adresse masquée]}`

**Note** — L'adresse n'est volontairement pas publiée : il s'agit d'une vraie personne recherchée, et les données proviennent d'une fuite. L'enquête a été menée en suivant les consignes de l'énoncé : consultation passive uniquement, aucun téléchargement de base de données, aucun contact avec l'individu ou son entourage.

### Chall 5 — INTERPOL RED NOTICE PT. 2

> **Énoncé :** À quelle date est-il devenu arbitre officiel au sein de son club de foot ?
>
> **Format :** `OTERIHACK{31/01/2000}`

**Démarche**

La question oriente vers la vie associative de l'individu : il faut identifier son club de football, puis chercher une trace publique de sa nomination comme arbitre.

Son compte Facebook personnel (« Wiss Wiss ») mentionne l'AS Thonon, ce qui permet d'identifier son club. Les clubs amateurs communiquent surtout sur Facebook : j'ai donc parcouru les publications de la page de l'AS Thonon à la recherche d'une mention de Wissem.

On y trouve une publication annonçant la remise officielle du set d'arbitre de Wissem au District Haute-Savoie – Pays de Gex. Son compte « Wiss Wiss » est identifié dans la publication, ce qui confirme qu'il s'agit bien de lui.

![Publication Facebook de l'AS Thonon sur la remise du set d'arbitre (visages floutés)](assets/img/oterihack/arbitre.png)

**Réponse**

Flag : `OTERIHACK{16/11/2018}`

**Note** — La date retenue est celle de la publication, qui correspond à la cérémonie de remise officielle du set d'arbitre (« présents ce soir »). Les visages ont été floutés : la photo montre de nombreux tiers, et l'individu était mineur à l'époque.

### Chall 6 — INTERPOL RED NOTICE PT. 3

> **Énoncé :** Quel est le nom du salon de coiffure où Wissem se rend ?
>
> **Format :** `OTERIHACK{Nom}`

**Démarche**

Le point de départ est l'adresse mail associée à l'individu dans la fuite de données identifiée lors de la partie 1.

J'ai passé cette adresse dans Epieos, un outil qui retrouve les comptes associés à une adresse mail, dont l'éventuel compte Google. Epieos a révélé un compte Google lié à cette adresse, ce qui donne accès à son profil public Google Maps : un compte « wiss », Local Guide, qui a publié plusieurs avis.

Parmi ces avis figure celui d'un salon de coiffure de Thonon-les-Bains, noté 5 étoiles en 2021 et présenté comme le meilleur de Thonon et d'Évian. Il est cohérent avec l'adresse trouvée dans la partie 1, elle aussi à Thonon-les-Bains.

![Profil Google Maps lié à l'adresse mail et avis sur le salon (informations de localisation floutées)](assets/img/oterihack/coiffeur.png)

**Réponse**

Flag : `OTERIHACK{[nom masqué]}`

**Note** — Le pivot adresse mail → compte Google → avis Google Maps est un classique du SOCMINT : les avis publics révèlent les lieux fréquentés par une personne, souvent bien plus précisément qu'un réseau social. Le nom du salon n'est pas publié pour ne pas exposer les habitudes d'une personne réelle.

### Chall 7 — Pardon Kylian

> **Énoncé :** Quel est le mail de la première personne à avoir signé solennellement pour s'excuser auprès de Kylian sur https://pardonkylian.fr ?
>
> **Format :** `OTERIHACK{mail@mail.mail}`

**Démarche**

Le site propose un formulaire de signature, mais n'affiche pas les adresses mail des signataires. Il faut donc comprendre où les signatures sont stockées.

En inspectant le code source de la page, j'ai trouvé une variable `SHEET_ID` contenant l'identifiant d'un Google Sheet : le formulaire enregistre les signatures directement dans une feuille de calcul Google.

![Identifiant du Google Sheet dans le code source du site (partiellement masqué)](assets/img/oterihack/sheetid.png)

J'ai ensuite ouvert ce document avec l'URL standard de Google Sheets, `https://docs.google.com/spreadsheets/d/<SHEET_ID>/edit`. La feuille est accessible publiquement et liste toutes les signatures avec leur horodatage, prénom, ville et adresse mail. La première ligne correspond au premier signataire.

![Première signature enregistrée dans le Google Sheet (données personnelles floutées)](assets/img/oterihack/mail.png)

**Réponse**

Flag : `OTERIHACK{[adresse masquée]}`

**Note** — Il s'agit d'une mauvaise configuration classique : l'identifiant du Sheet est exposé côté client et le document est lisible par toute personne disposant du lien. Toutes les données des signataires sont ainsi accessibles. L'identifiant et l'adresse ne sont pas publiés pour ne pas exposer ces personnes.

### Chall 8 — Pardon Kylian 2

> **Énoncé :** Quel est le nom de l'application que Fred a fondée ?
>
> **Format :** `OTERIHACK{Zoé}`

**Démarche**

Fred, le premier signataire identifié dans le challenge précédent, est aussi le créateur du site pardonkylian.fr. La question porte cette fois sur son parcours professionnel.

En recherchant le créateur du site, j'ai retrouvé son profil LinkedIn. Il y apparaît comme fondateur d'une application immobilière nommée Béa, dont on retrouve la communication publique (visuel ci-dessous, avec une campagne de publicité sur M6).

![Visuel promotionnel de l'application Béa](assets/img/oterihack/bea.png)

**Réponse**

Flag : `OTERIHACK{Béa}`

**Note** — Le format d'exemple (`Zoé`) indiquait que l'accent devait être conservé dans le flag.

### Chall 9 — Patate

> **Énoncé :** Qui est le français qui se prend une patate sur cette image ?
>
> **Indice :** c'est un personnage assez controversé, et ça se passe sur un plateau télé.
>
> **Format :** `OTERIHACK{Prénom Nom}`

**Démarche**

Le challenge fournit un extrait très recadré et pixellisé d'une image : un pan de vêtement sombre, un décor clair et le début d'un texte (« N… »). À elle seule, l'image ne permet pas de recherche inversée exploitable.

![Image fournie par le challenge](assets/img/oterihack/challenge_19_etape1.png)

L'indice oriente vers une altercation sur un plateau impliquant un personnage controversé. Combiné au décor, il m'a permis de reconnaître une scène très médiatisée à l'époque : une discussion filmée entre Alain Soral, Dieudonné et Daniel Conversano, au cours de laquelle Alain Soral a frappé Daniel Conversano.

La personne qui « se prend une patate » est donc Daniel Conversano.

**Réponse**

Flag : `OTERIHACK{Daniel Conversano}`

**Note** — L'identification repose ici sur la connaissance préalable de l'événement plutôt que sur un outil. Pour un niveau de confiance plus élevé, elle peut être confirmée en retrouvant la vidéo ou les articles de presse qui la relaient, et en comparant le décor avec l'extrait fourni.

### Chall 10 — Féru de poésie

> **Énoncé :** Quel livre lisait Daniel le 22 avril 2026 à 19h30 ?
>
> **Format :** `OTERIHACK{Titre}`

**Démarche**

Ce challenge prolonge le précédent : Daniel est Daniel Conversano, identifié dans « Patate ». La question demande une information datée à la minute près, ce qui oriente vers une publication horodatée sur un réseau ou une messagerie.

Son site personnel renvoie vers une chaîne Telegram publique. Les chaînes Telegram publiques sont consultables sans compte via leur aperçu web, et chaque message y est horodaté. J'ai donc remonté l'historique de la chaîne jusqu'au 22 avril 2026, vers 19h30.

À cette date et à cette heure, Daniel Conversano publie la photo de la première page d'un livre de Charles Bukowski, avec une légende indiquant qu'il l'a lu d'une traite dans l'après-midi : *Factotum*.

![Message de la chaîne Telegram du 22 avril 2026 (recadré sur la légende)](assets/img/oterihack/livre.png)

**Réponse**

Flag : `OTERIHACK{Factotum}`

**Note** — Telegram affiche les horaires des messages dans le fuseau horaire de l'appareil qui les consulte. Pour une question à la minute près, il faut donc vérifier que l'heure affichée correspond bien à celle attendue par l'énoncé (ici, heure française).

### Chall 11 — Ça en fait des bouquins...

> **Énoncé :** Quel est le nom de la maison d'édition notamment derrière le site du « réseau » fondé par Daniel ?
>
> **Format :** `OTERIHACK{Six Seven}`

**Démarche**

La question porte sur l'entité qui se trouve derrière le site du « réseau » fondé par Daniel Conversano. Ce type d'information figure rarement sur la version actuelle d'un site, mais on la trouve souvent dans les mentions légales ou le pied de page de versions plus anciennes.

J'ai donc consulté l'historique de son site, `danielconversano.com`, dans la Wayback Machine. Les premières captures font apparaître la maison d'édition Alba Leone comme entité derrière le site.

Pour recouper, la bibliographie de Daniel Conversano sur Wikipédia montre qu'Alba Leone a publié plusieurs de ses livres, dont *Z0Z7 : Comment faire gagner Zemmour en 2027 ?* (2023). Le lien entre l'auteur et cette maison d'édition est donc établi par deux sources indépendantes.

![Bibliographie de Daniel Conversano sur Wikipédia, mentionnant les Éditions Alba Leone](assets/img/oterihack/alba.png)

**Réponse**

Flag : `OTERIHACK{Alba Leone}`

**Note** — Le format d'exemple (`Six Seven`) indiquait une réponse en deux mots avec majuscules, ce qui correspond à « Alba Leone ».

### Chall 12 — Carrosse

> **Énoncé :** Quelle est la plaque d'immatriculation de ce magnifique bus (précisément celui-là) ?
>
> **Format :** `OTERIHACK{AA-111-AA}`

**Démarche**

Le challenge fournit une photo recadrée de l'avant d'un bus noir, dont le bandeau porte l'inscription « Dieudobus ». La plaque d'immatriculation n'est pas visible : il faut retrouver d'autres photos du même véhicule.

![Image fournie par le challenge](assets/img/oterihack/challenge_19_etape4.png)

Une recherche d'image inversée sur Google renvoie vers des photos du bus utilisé par Dieudonné pour sa tournée, dont l'une montre l'avant du véhicule avec sa plaque d'immatriculation lisible.

![Photo du bus retrouvée par recherche inversée, plaque visible](assets/img/oterihack/bus.png)

L'énoncé précise « précisément celui-là » : il fallait donc s'assurer qu'il s'agit bien du même véhicule. Le bandeau diffère entre les deux photos (« Dieudobus » avec des logos blancs d'un côté, « Dieudonné » avec des logos en couleur de l'autre), mais la carrosserie est identique : même modèle de bus, même pare-brise en deux parties, mêmes emplacements de logos de part et d'autre du bandeau. Le bandeau a donc été modifié entre les deux prises de vue, et c'est bien le même véhicule.

**Réponse**

Flag : `OTERIHACK{AF-864-AQ}`

**Note** — Une plaque d'immatriculation reste attachée au véhicule même quand sa décoration change. Identifier un véhicule par des éléments structurels (carrosserie, pare-brise, équipements) plutôt que par son habillage permet de relier des photos prises à des moments différents.

### Chall 13 — Solitude

> **Énoncé :** Je cherche une femme, Daniel saura sûrement m'aider. Quel mail contacter ?
>
> **Format :** `OTERIHACK{mail@mail.mail}`

**Démarche**

L'énoncé suggère que Daniel Conversano propose une forme d'accompagnement pour trouver une compagne, et qu'une adresse de contact dédiée existe.

Sur son site personnel, `danielconversano.com`, un article présente le projet « Bâtir un Foyer » : en septembre 2021, il propose d'accompagner pendant un mois quatre jeunes hommes célibataires pour les aider à trouver l'amour. Le bas de l'article donne une adresse mail spécifique à ce projet pour obtenir plus d'informations.

![Adresse de contact indiquée en bas de l'article « Bâtir un Foyer »](assets/img/oterihack/emailfemme.png)

**Réponse**

Flag : `OTERIHACK{trouvermafemme@tutamail.com}`

**Note** — L'article propose deux moyens de contact : cette adresse dédiée et une adresse plus générale. La question portant précisément sur la recherche d'une femme, c'est l'adresse liée au projet « Bâtir un Foyer » qui était attendue.

### Chall 14 — Trafic de barrettes 2.0

> **Énoncé :** Les marchés changent, les dealers s'adaptent. Un nouveau groupe criminel sévit en France et, visiblement, la tendance du moment c'est… le trafic de barrettes de RAM. (Oui, on vit dans une timeline étrange.) Vous avez intercepté un échantillon vidéo transmis par le groupe. Problème : nos équipes sur place ont besoin d'une localisation rapidement, avant que les « commerciaux » ne changent de spot ou ne passent en mode furtif. On nous a dit que vous étiez l'agent idéal pour ce genre de mission. Avant de remonter la filière, il nous faut une première épingle sur la carte : d'après ce que la vidéo laisse échapper, sauriez-vous trouver dans quelle commune ce petit « entrepreneur » a-t-il installé son terrain de jeu ?
>
> **Format :** `OTERIHACK{Commune}`

**Démarche**

Le challenge fournit une courte vidéo filmée dans une voiture. Aucun lieu n'y est directement identifiable, mais elle laisse échapper deux indices exploitables, visibles sur la même image : l'autoradio et un sac posé au pied de la console.

![Extrait de la vidéo : l'autoradio affiche 89.40 sur le préréglage F2, et un sac SOCAMMES est visible en bas](assets/img/oterihack/soc.png)

Le premier indice est le sac, qui porte l'inscription « SOCAMMES ». La SOCAMMES (Société de Caution Mutuelle des Moniteurs des Écoles du Ski Français) est une structure mutualiste liée aux moniteurs de l'ESF et partenaire de la Banque Populaire Auvergne-Rhône-Alpes. Cet indice oriente vers une station de ski, et plus précisément vers la région Auvergne-Rhône-Alpes.

Le second indice est sonore : l'autoradio affiche la fréquence `89.4` (sur le préréglage F2), et la station qu'on entend en fond s'identifie comme Fun Radio. Les radios FM émettent sur des fréquences qui varient selon les zones géographiques : un couple station + fréquence est donc un indice de localisation.

J'ai croisé les deux indices en consultant les listes de fréquences de Radioscope pour la région Rhône-Alpes, qui recensent pour chaque commune les stations reçues et leurs fréquences. Fun Radio y émet sur 89.4 à Courchevel, l'une des principales stations de ski de la région, ce qui est cohérent avec l'indice SOCAMMES.

![Liste des fréquences de Courchevel sur Radioscope : Fun Radio sur 89.4](assets/img/oterihack/radio.png)

**Réponse**

Flag : `OTERIHACK{Courchevel}`

**Note** — Aucun indice ne suffisait seul : le sac SOCAMMES indiquait une station de ski en Auvergne-Rhône-Alpes sans préciser laquelle, et la fréquence radio pouvait correspondre à plusieurs zones. C'est leur croisement qui permet d'épingler la commune. L'audio est souvent négligé en géolocalisation, alors qu'il peut s'avérer décisif : fréquence radio, annonces locales, bruits caractéristiques.

### Chall 15 — On va s'en mailer

> **Énoncé :** Trouve son mail.
>
> **Format :** `OTERIHACK{mail@mail.mail}`

**Démarche**

Le challenge fournit une photo de profil entourée d'un cercle de points colorés. Ce design est celui d'un Pincode Pinterest : un code scannable qui renvoie vers un profil, à la manière d'un QR code.

![Image fournie par le challenge : photo de profil avec Pincode Pinterest](assets/img/oterihack/challenge_7_1.png)

J'ai scanné ce code avec l'appareil photo intégré à l'application Pinterest. Le scan n'ayant pas fonctionné depuis un iPhone, je l'ai fait avec un téléphone Android. Il renvoie vers le profil Pinterest `jadorelepoulet36`.

Ce pseudo étant très spécifique, je l'ai recherché sur WhatsMyName, qui vérifie l'existence d'un pseudo sur des centaines de plateformes. Il remonte notamment un compte Keybase du même nom, avec la même photo de profil et une clé PGP publique associée.

![Profil Keybase jadorelepoulet36 avec l'empreinte de sa clé PGP](assets/img/oterihack/clef.png)

Une clé PGP contient des identifiants utilisateur de la forme `Nom <adresse mail>`. J'ai téléchargé la clé publique depuis Keybase et j'en ai affiché le contenu avec GnuPG, sans l'importer dans mon trousseau :

    curl -s https://keybase.io/jadorelepoulet36/pgp_keys.asc -o key.asc
    gpg --show-keys key.asc

La ligne `uid` donne l'adresse mail associée à la clé.

**Réponse**

L'identifiant utilisateur de la clé est `Maurice Pigeon <jadorelepoulet@proton.me>`.

Flag : `OTERIHACK{jadorelepoulet@proton.me}`

**Note** — Le pivot repose sur une particularité de PGP souvent oubliée : une clé publique est faite pour être diffusée, mais elle embarque l'adresse mail de son propriétaire. Publier sa clé sur Keybase revient donc à publier son adresse. À noter aussi : l'adresse mail ne reprend pas exactement le pseudo (sans le « 36 »), ce qui aurait rendu une recherche directe par pseudo moins efficace.