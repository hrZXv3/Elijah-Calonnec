## Résumé

Investigation d'un kit de phishing imitant PayPal (`paypal-pay.com`), ciblant des utilisateurs germanophones. Le kit se déroule en trois étapes (identifiants → code 2FA → fausse confirmation de paiement) et exfiltre les données volées en temps réel via un webhook Discord. L'analyse révèle aussi que le domaine, ré-enregistré début septembre 2026, existe en réalité depuis au moins 2011 : resté inexploité puis abandonné pendant des années, il a été repris et armé en moins de 48 heures.

> **Avertissement** : cette investigation s'appuie uniquement sur des sources ouvertes (OpenPhish, urlscan.io, crt.sh, Wayback Machine, WHOIS) et sur la lecture passive du code source des pages. Aucun formulaire n'a été soumis et aucune interaction active n'a eu lieu avec l'infrastructure. Le jeton du webhook d'exfiltration est volontairement masqué.

## Question d'investigation

Un domaine signalé dans un flux public de phishing, `paypal-pay.com`, imite la marque PayPal. L'investigation cherche à répondre à trois questions :

1. Comment fonctionne le dispositif et quelles données dérobe-t-il ?
2. D'où vient le domaine et depuis quand est-il actif ?
3. Peut-il être rattaché à une campagne ou à un acteur ?

## Synthèse

| # | Conclusion | Confiance |
|---|---|---|
| 1 | `paypal-pay.com` est un site de phishing actif ciblant des utilisateurs PayPal germanophones | **Élevée** |
| 2 | Le kit vole en trois étapes l'identifiant, le mot de passe, un code 2FA et une empreinte de l'appareil, et transmet tout en temps réel vers un webhook Discord unique | **Élevée** |
| 3 | Le domaine existe depuis au moins 2011, est resté inexploité puis abandonné, a été ré-enregistré le 9 septembre 2026 et le kit était en ligne deux jours plus tard | **Élevée** |
| 4 | La rapidité de déploiement et une incohérence dans le code indiquent un kit préfabriqué réutilisé plutôt qu'un développement sur mesure | **Moyenne** |
| 5 | Aucun acteur ni aucune campagne n'est attribué à ce stade ; une signature potentielle du kit reste une piste ouverte | **Non attribué** |

## Méthode

La démarche suit une chaîne observation → hypothèse → vérification → conclusion, chaque conclusion recevant un niveau de confiance.

| Étape | Source / outil | Objectif |
|---|---|---|
| Sélection de l'indicateur | OpenPhish | Partir d'un signalement public récent |
| Analyse des pages | urlscan.io, code source | Comprendre le scénario et les données collectées |
| Infrastructure | WHOIS, urlscan.io | Registrar, hébergeur, ASN, date d'enregistrement |
| Historique TLS | crt.sh | Dater l'existence du domaine par ses certificats |
| Historique de contenu | Wayback Machine | Reconstituer l'usage passé du domaine |
| Rattachement | urlscan.io, GitHub | Rechercher d'autres déploiements du même kit |

**Impasse documentée** : un premier candidat, `checkouts-paypal.lat`, a été écarté. Le domaine ne résolvait plus (NXDOMAIN) et ne laissait aucune donnée historique exploitable. L'investigation a été reportée sur `paypal-pay.com`.

## Fonctionnement du kit

`signin.html` (identifiants + empreinte) → `verification.html` (faux code 2FA) → `completed.html` (fausse confirmation, puis renvoi vers paypal.com)

### Étape 1 — Vol des identifiants (`signin.html`)

La page reproduit la connexion PayPal en chargeant les véritables ressources graphiques de la marque depuis `paypalobjects.com`, ce qui renforce sa crédibilité sans avoir à les héberger. Le formulaire collecte l'email ou le téléphone, le mot de passe et une empreinte du poste : navigateur, langue, plateforme, résolution, fuseau horaire et adresse IP locale récupérée via WebRTC.

```js
function gatherDeviceInfo() {
    const deviceInfo = {
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform,
        screen: `${window.screen.width}x${window.screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        ...
    };
    // + fuite de l'IP locale via WebRTC ICE candidate
}
```

Toutes les données collectées sont envoyées en POST vers un **webhook Discord** :

```js
const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1547269048566292661/[REDACTED]";
```

### Étape 2 — Vol du code 2FA (`verification.html`)

La victime est redirigée vers une page demandant un code à six chiffres. Trois événements sont transmis au **même webhook Discord** : le chargement de la page, le clic sur « renvoyer le code » et la saisie du code. L'attaquant suit ainsi la progression de la victime en direct.

L'identité du webhook entre les étapes 1 et 2 établit qu'il s'agit d'un seul et même déploiement, et non de deux campagnes distinctes.

### Étape 3 — Clôture du scénario (`completed.html`)

Une fausse confirmation de paiement s'affiche (transfert fictif de 5,00 € vers un bénéficiaire nommé « Lena Lauerbach »), avec un identifiant de transaction généré côté client et un son de validation. Après dix secondes, la victime est renvoyée vers le vrai `paypal.com`, ce qui retarde la prise de conscience du vol.

Le message transmis à Discord lors du clic sur « Retour à PayPal » indique un montant différent de celui affiché à l'écran. Cette incohérence trahit un modèle réutilisé et mal adapté plutôt qu'un développement sur mesure pour cette cible.

## Infrastructure

| Élément | Valeur |
|---|---|
| Domaine | `paypal-pay.com` |
| IP | `216.198.79.65` |
| ASN | AS16509 — AMAZON-02 (Amazon.com, Inc.) |
| Registrar | Name.com, Inc. |
| (Ré)enregistrement WHOIS | 2026-09-09 |
| Certificat TLS actuel | Émis le 2026-09-09, valide 3 mois |
| Verdict urlscan.io | *Potentially Malicious* — marque ciblée : PayPal (Financial) |

L'hébergement repose sur une infrastructure cloud mutualisée (AWS). Un pivot par adresse IP aurait donc peu de valeur : l'adresse n'est probablement pas dédiée à l'acteur.

## Chronologie du domaine

Les sources se contredisaient au départ : le WHOIS indique une création en septembre 2026, alors que crt.sh recense des certificats dès 2017. Le recoupement avec la Wayback Machine permet de reconstituer la chronologie réelle :

| Date | Événement |
|---|---|
| 2011 | Première capture Wayback : simple page de test (« hello »), aucun usage réel |
| 2017 | Premiers certificats TLS recensés sur crt.sh |
| ~2024–2025 | Erreur HTTP 521 (Cloudflare) : domaine proxifié dont le serveur d'origine ne répond plus, signe d'abandon |
| 2026-09-09 | Ré-enregistrement par un nouveau titulaire et nouveau certificat |
| 2026-09-11 | Le kit de phishing est en ligne, deux jours après la reprise du domaine |

**Lecture** : l'acteur a repris un domaine ancien, au nom évocateur et sans historique malveillant, puis l'a armé en moins de 48 heures. Un domaine ancien peut bénéficier d'une meilleure réputation auprès de certains filtres qu'un domaine fraîchement créé.

## Rattachement à une campagne

Le nom « Lena Lauerbach », codé en dur dans la page de confirmation, est probablement fictif et constitue une signature potentielle du kit. Il n'est pas traité comme une piste vers une personne réelle. Avec l'identifiant du webhook et certaines chaînes distinctives du code, il permet de rechercher d'autres déploiements du même modèle. Cette piste n'a pas encore été recoupée et reste ouverte.

## Constats et niveaux de confiance

| Statut | Constat | Fondement |
|---|---|---|
| **Établi** | Le site collecte identifiants, codes 2FA et empreinte d'appareil et les exfiltre vers Discord | Lecture directe du code source ; verdicts urlscan.io et Google Safe Browsing |
| **Établi** | Les trois pages forment un seul déploiement | Même webhook sur les étapes 1 et 2, enchaînement des redirections |
| **Établi** | Domaine ancien, abandonné, ré-enregistré le 2026-09-09 et armé en 48 h | Recoupement WHOIS, crt.sh et Wayback Machine |
| **Probable** | Kit préfabriqué réutilisé plutôt que développement sur mesure | Incohérence de montant ; rapidité de déploiement |
| **Probable** | Cible germanophone | Langue des pages du kit |
| **Non vérifié** | Lien avec d'autres déploiements ou un acteur identifié | Signature du kit non encore recoupée |

## Risques et recommandations

**Risques**

- **Pour les victimes** : la notification en temps réel permet à l'attaquant d'utiliser le code 2FA pendant sa durée de validité et de prendre le contrôle du compte, qui donne accès à des moyens de paiement.
- **Pour la marque** : l'usage de ses vraies ressources graphiques et la redirection finale vers le site officiel rendent la fraude difficile à percevoir. La confiance des clients est atteinte même lorsque le service n'est pas compromis.
- **Plus largement** : la réutilisation de domaines expirés au nom évocateur contourne une partie des filtres fondés sur l'âge des domaines.

**Recommandations**

- Signaler le domaine au registrar (Name.com), à l'hébergeur (AWS) et à l'équipe anti-fraude de la marque pour obtenir sa suspension.
- Signaler le webhook à Discord afin de couper le canal d'exfiltration.
- Ajouter le domaine, les URL et l'IP aux listes de blocage, en tenant compte du caractère mutualisé de l'adresse IP.
- Pour une marque : surveiller les domaines contenant son nom, y compris les domaines expirés remis en vente, et pas seulement les nouvelles créations.

## Limites

- L'analyse s'arrête au code visible côté client : le fonctionnement du canal Discord et l'usage fait des données ne sont pas observables.
- Le nouveau titulaire du domaine n'est pas identifiable via le WHOIS public.
- Le volume de victimes est inconnu.
- Le site étant susceptible d'être suspendu, certaines constatations ne pourront plus être reproduites en direct ; elles reposent sur les scans et archives cités.

## IOCs

| Type | Valeur | Contexte |
|---|---|---|
| Domain | `paypal-pay.com` | Domaine principal du kit |
| URL | `paypal-pay.com/signin.html` | Étape 1 — vol des identifiants |
| URL | `paypal-pay.com/verification.html` | Étape 2 — vol du code 2FA |
| URL | `paypal-pay.com/completed.html` | Étape 3 — clôture du scénario |
| IP | `216.198.79.65` | Hébergement AWS mutualisé |
| Webhook ID | `1547269048566292661` | Canal d'exfiltration Discord (token non publié) |

## Sources

| Source | Usage |
|---|---|
| OpenPhish | Signalement initial de l'URL |
| urlscan.io | Scan des pages, ressources chargées, verdict, infrastructure |
| WHOIS (Name.com) | Registrar et date de ré-enregistrement |
| crt.sh | Historique des certificats TLS |
| Wayback Machine | Historique de contenu du domaine |
| Google Safe Browsing | Confirmation du statut malveillant |

## Conclusion

`paypal-pay.com` est un kit de phishing PayPal en trois étapes, exfiltrant identifiants, codes 2FA et empreintes d'appareil vers Discord en temps réel. Son domaine, ancien et abandonné, a été repris puis armé en moins de 48 heures, ce qui, avec l'incohérence relevée dans le code, oriente vers un kit préfabriqué réutilisé.

**Niveau de confiance** : élevé sur la nature et le fonctionnement du dispositif ainsi que sur la chronologie du domaine ; aucune attribution d'acteur ou de campagne à ce stade, la signature potentielle du kit restant à recouper.
