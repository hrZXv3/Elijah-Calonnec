## Résumé

Investigation d'un kit de phishing imitant PayPal (`paypal-pay.com`), ciblant des victimes germanophones. Le kit se déroule en trois étapes (identifiants → code 2FA → fausse confirmation de paiement) et exfiltre les données volées en temps réel via un webhook Discord. L'analyse a également révélé que le domaine, bien que ré-enregistré début septembre 2026, existe en réalité depuis 2010 laissé à l'abandon pendant des années avant sa réutilisation.

> **Avertissement** : cette investigation s'appuie uniquement sur des sources publiques (urlscan.io, crt.sh, Wayback Machine, WHOIS) et sur la lecture passive du code source de la page. Aucune interaction active avec le site (aucune soumission de formulaire) n'a été effectuée.

## Point de départ

- Indicateur découvert via le feed public **OpenPhish**
- URL initiale : `https://www.paypal-pay.com/signin.html`
- Un premier candidat (`checkouts-paypal.lat`) avait été envisagé mais s'est révélé être un domaine mort (NXDOMAIN) sans données historiques exploitables documenté comme dead-end avant de basculer sur ce cas.

## Étape 1 — Page de connexion (`signin.html`)

Le site imite fidèlement la page de connexion PayPal, y compris en chargeant les vrais assets visuels (`paypalobjects.com`) pour renforcer la crédibilité visuelle sans avoir à les héberger.

Le formulaire capture email/téléphone + mot de passe, ainsi qu'un fingerprint du poste de la victime :

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

Après soumission, la victime est redirigée vers `verification.html`.

## Étape 2 — Faux code de vérification (`verification.html`)

Deuxième étage du kit : une page réclamant un code à 6 chiffres, simulant une demande de 2FA/OTP. Trois événements distincts sont envoyés au **même webhook Discord** (chargement de page, clic sur "renvoyer le code", soumission du code) l'attaquant est notifié en temps réel de la progression de la victime dans le scénario.

Le fait que ce soit exactement le même webhook que sur `signin.html` confirme qu'il s'agit d'un seul et même déploiement, pas de deux campagnes distinctes.

## Étape 3 — Fausse confirmation de paiement (`completed.html`)

Dernière étape : une page imitant une confirmation de paiement PayPal réussi (transfert fictif de 5,00 € à "Lena Lauerbach"), avec ID de transaction générée aléatoirement côté client, son de succès, et redirection automatique après 10 secondes vers le vrai `paypal.com` — une clôture soignée pour éviter d'éveiller les soupçons immédiatement après le vol.

Un détail trahit la nature "kit" du site : le message envoyé à Discord au clic sur "Retour à PayPal" indique un montant différent de celui affiché à l'écran :

Cette incohérence suggère fortement un template réutilisé et mal nettoyé plutôt qu'un développement sur mesure pour cette cible précise.

## Infrastructure

| Élément | Valeur |
|---|---|
| Domaine | `paypal-pay.com` |
| IP | `216.198.79.65` |
| ASN | AS16509 — AMAZON-02 (Amazon.com, Inc.) |
| Registrar | Name.com, Inc. |
| Date de (ré)enregistrement WHOIS | 2026-09-09 |
| Certificat TLS | Émis 2026-09-09, valide 3 mois |
| Verdict urlscan.io | *Potentially Malicious* — marque ciblée : PayPal (Financial) |

L'hébergement est sur de l'infrastructure cloud partagée (AWS), ce qui limite l'intérêt d'un pivot par IP ce n'est probablement pas une infrastructure dédiée à l'acteur.

## Un domaine plus ancien qu'il n'y paraît

Une recherche sur **crt.sh** a d'abord semblé contredire le WHOIS : des certificats existent sur `paypal-pay.com` dès **2017**, alors que le WHOIS actuel indique une création en septembre 2026. Une vérification sur la **Wayback Machine** a permis de reconstituer la véritable timeline :

- **2011** : simple page de test ("hello"), le domaine n'a jamais eu de réel usage
- **~2024–2025** : erreur HTTP 521 (Cloudflare) — le domaine était proxifié mais son serveur d'origine ne répondait plus, signe d'un domaine à l'abandon
- **2026-09-09** : ré-enregistrement du domaine (nouveau propriétaire)
- **2026-09-11** : le kit de phishing est déjà en ligne — soit 2 jours seulement après la reprise du domaine

**Conclusion** : `paypal-pay.com` est un domaine ancien, jamais réellement exploité, laissé à l'abandon pendant des années, puis repris et armé avec un kit de phishing prêt à l'emploi en moins de 48h. Cette rapidité de déploiement est cohérente avec l'utilisation d'un kit préfabriqué plutôt qu'un développement sur mesure.

## IOCs

| Type | Valeur | Contexte |
|---|---|---|
| Domain | `paypal-pay.com` | Domaine principal du kit |
| URL | `paypal-pay.com/signin.html` | Étape 1 — vol credentials |
| URL | `paypal-pay.com/verification.html` | Étape 2 — vol 2FA |
| URL | `paypal-pay.com/completed.html` | Étape 3 — clôture du scénario |
| IP | `216.198.79.65` | Hébergement AWS |
| Webhook ID | `1547269048566292661` | Canal d'exfiltration Discord (token non publié) |

## Niveau de confiance

**Élevé** sur la nature phishing du site — confirmé par le verdict urlscan.io, Google Safe Browsing, et la lecture directe du code source exfiltrant des identifiants réels vers un canal externe.

**Aucune attribution** d'acteur ou de campagne à ce stade : un seul indicateur textuel ("Lena Lauerbach", nom fictif codé en dur) a été identifié comme signature potentielle du kit, mais n'a pas encore été recoupé avec d'autres déploiements. Cette piste reste ouverte.
