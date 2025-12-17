# 🫧 Bulle Editor Ultimate v3.2 - CONTEXT FIX

> L'éditeur de landing pages le plus **ludique et intelligent** — avec assistant IA en **langage naturel**.

![Version](https://img.shields.io/badge/version-3.1-purple)
![React](https://img.shields.io/badge/React-18-blue)
![Vite](https://img.shields.io/badge/Vite-5-yellow)
![NEW](https://img.shields.io/badge/NEW-Natural_Language-green)

---

## ✨ NOUVEAUTÉ v3.1 - Commandes Naturelles !

### 🧠 Bulle comprend maintenant le langage naturel

**AVANT (rigide) :**
```
User: "Les couleurs"
Bulle: "Quel élément ?"
User: "Titre"  
Bulle: "Quelle couleur ?"
User: "Rose"
Bulle: "✨ OK !"
= 4 échanges 😓
```

**MAINTENANT (naturel) :**
```
User: "Met le titre en rose"
Bulle: "🎨 Titre en rose ! Tu valides ?"
= 1 échange 😊
```

---

## 💬 Exemples de commandes naturelles

| Ce que tu dis | Ce que Bulle fait |
|--------------|-------------------|
| `Met le titre en rose` | Change la couleur du titre → rose |
| `Change le sous-titre` | Ouvre l'édition du sous-titre |
| `Disposition 2 colonnes` | Change le layout en grille 2 colonnes |
| `Ajoute 3 features` | Ajoute 3 features d'un coup ! |
| `Supprime la dernière` | Supprime le dernier item |
| `Passe le bouton en violet` | Colore le bouton en violet |
| `Le badge en cyan` | Change la couleur du badge |

---

## 🔤 Synonymes compris

Bulle comprend **+50 synonymes** pour chaque action :

| Mot officiel | Synonymes acceptés |
|-------------|-------------------|
| **Layout** | disposition, mise en page, agencement, organisation, structure |
| **Titre** | title, heading, h1, accroche, headline |
| **Bouton** | button, CTA, call to action, btn, action |
| **Couleurs** | color, teinte, nuance, coloris, palette |
| **Modifier** | change, met, mets, passe, transforme, remplace, édite |
| **Ajouter** | créer, crée, add, nouveau, rajoute, insère |
| **Supprimer** | enlève, retire, efface, delete, vire, dégage |

---

## 🎨 Palette de couleurs élargie

**Français :** rose, violet, bleu, cyan, vert, jaune, orange, rouge, blanc, noir, gris, turquoise, fuchsia, lavande, indigo, émeraude, corail, saumon, doré, or, argent

**Anglais :** pink, purple, blue, green, yellow, red, white, black, gray, teal, magenta, gold, silver

**Codes hex :** `#F472B6`, `#A78BFA`, etc.

---

## 🛠️ Installation

```bash
cd ~/Downloads/bulle-editor-ultimate-03
npm install
npm run dev
```

🌐 Ouvre **http://localhost:5173**

---

## 🎮 Comment utiliser Bulle

### Mode NATUREL (nouveau ! 🆕)

Parle à Bulle comme à un humain :

```
"Met le titre en rose"
"Change la disposition en 3 colonnes"
"Ajoute 2 features"
"Supprime la dernière question"
"Le bouton en violet"
"Passe en layout timeline"
```

### Mode CLASSIQUE (toujours disponible)

```
"Le layout"      → Voir les options
"Les couleurs"   → Choisir un élément
"Le texte"       → Modifier un texte
"Le bouton"      → Éditer le CTA
```

---

## ⌨️ Raccourcis clavier

| Raccourci | Action |
|-----------|--------|
| `Cmd/Ctrl + K` | Toggle Bulle |
| `Cmd/Ctrl + Z` | Annuler |
| `Cmd/Ctrl + Shift + Z` | Refaire |
| `Cmd/Ctrl + E` | Exporter |
| `Escape` | Fermer |

---

## 📐 5 Sections personnalisables

| Section | Description |
|---------|-------------|
| 🦸 **Hero** | Titre + boutons CTA |
| ✨ **Features** | Avantages (icônes + couleurs) |
| 📋 **Étapes** | Timeline / How it works |
| 💰 **Tarifs** | Plans comparatifs |
| ❓ **FAQ** | Questions fréquentes |

---

## 📁 Structure du projet

```
bulle-editor-ultimate-03/
├── src/
│   ├── app/App.jsx           # Layout principal
│   ├── lumi/modes/           
│   │   └── localMode.js      # 🆕 NLP + Synonymes + Intentions
│   ├── ui/lumi/LumiPanel.jsx # Interface chat
│   └── ui/sections/          # Composants sections
└── README.md
```

---

## 🐛 Changelog

### v3.1 - Natural Language 🆕
- Commandes en une phrase ("met le titre en rose")
- +50 synonymes par action
- Contexte mémorisé
- Multi-actions ("ajoute 3 features")
- Palette couleurs élargie (+20 couleurs)

### v3.0
- Bug édition texte corrigé
- Header animé
- Dégradé blanc→navy

---

## 📝 License

MIT - Fais-en ce que tu veux ! 🚀

---

<p align="center">
  Made with 💜 and lots of 🫧
  <br>
  <strong>Bulle Editor Team</strong>
</p>
