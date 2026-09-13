# Root-Me : App-Script, Command injection (démo)

> Ceci est un writeup de démonstration avec un contenu fictif, pour vous montrer le format. Remplacez le texte par votre vraie méthodologie.

## Contexte

Challenge de la catégorie "App-Script" sur Root-Me. Une page web exécute une commande système à partir d'une entrée utilisateur mal filtrée. Objectif : exécuter une commande arbitraire pour récupérer le flag.

## Méthodologie

1. **Reconnaissance** : exploration de la page, identification du champ qui semble déclencher une commande système côté serveur (ex. un champ "ping une IP").
2. **Test d'injection** : ajout d'un séparateur de commande pour voir si l'entrée est concaténée directement dans un appel système.

```bash
127.0.0.1; ls -la
127.0.0.1 && cat flag.txt
```

3. **Contournement des filtres** éventuels (espaces bloqués, mots-clés filtrés) en utilisant des techniques classiques :

```bash
127.0.0.1;cat$IFS flag.txt
127.0.0.1;c'a't flag.txt
```

## Résultat

Le flag est récupéré via l'injection, confirmant l'absence de validation/sanitization de l'entrée côté serveur.

## Ce que j'ai appris

- Toujours tester les séparateurs de commandes (`;`, `&&`, `|`, `` ` ``) sur un champ qui semble déclencher une action système.
- Quand les espaces sont filtrés, `$IFS` ou des guillemets vides sont des contournements courants.
- Ce type de faille correspond à **CWE-78 (OS Command Injection)**, utile à citer dans un rapport de threat intel ou de pentest.
