# Structure des Tenseurs et Manipulation des Images avec TensorFlow & Keras

Application web pédagogique interactive au **format vidéo explicatif animé** (style 3Blue1Brown / YouTube Educational) avec **fond blanc**, photographies réelles haute définition et **mots-clés cliquables** avec définitions instantanées.

---

## 🎯 Nouvelle Approche Pédagogique

1. **Format Vidéo Explicatif & Processus Étape par Étape** :
   - Interface inspirée d'un lecteur vidéo interactif (lecture/pause, barre de progression segmentée, vitesse 0.5x / 1x / 1.5x, plein écran).
   - Déroulement animé des transformations de vision par ordinateur.

2. **Images Réelles & Claires (Photos HD)** :
   - Utilisation de photos réelles haute définition (chat et perroquet aux couleurs vives) pour observer concrètement les tenseurs, au lieu de simples schémas abstraits.
   - Zoom microscopique et inspection des composantes exactes $[R, V, B]$.
   - Décomposition réelle des 3 canaux Rouge, Vert, Bleu.
   - Recadrage (Slicing) ciblé sur les yeux du chat sans duplication mémoire.
   - Redimensionnement $224 \times 224$ comparant Bilinéaire vs Plus Proche Voisin.
   - Normalisation $[0, 255] \to [0.0, 1.0]$.
   - Détection de contours et extraction de motifs via convolution 2D 3×3.
   - Inférence CNN complète vers les probabilités Softmax.
   - Empilement de photos réelles en lots 4D $[B, H, W, C]$.

3. **Zéro Texte Lourd & Mots-Clés avec Popups** :
   - Aucune surcharge textuelle : seulement 1 ou 2 phrases concises par étape.
   - Chaque terme technique essentiel est mis en valeur avec un **soulignement en pointillés verts** (`mot clé`).
   - Un simple clic sur le mot ouvre une **fenêtre contextuelle (popup)** contenant la définition claire, le formalisme mathématique et la commande Python associée.

4. **Design Épuré sur Fond Blanc** :
   - Fond blanc lumineux (`bg-white` et `bg-slate-50`), bordures douces, accents vert émeraude académique.

---

## 🚀 Lancement Local

```bash
# 1. Se positionner dans le répertoire
cd c:\Users\Youcode\Desktop\tenseurs_veille

# 2. Installer les dépendances
npm install

# 3. Lancer le serveur de développement
npm run dev

# 4. Vérification de la compilation
npm run build
```
L'application est accessible à l'adresse locale : **`http://localhost:5173/`**
