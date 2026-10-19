import { LearningSection, SlideMetadata } from '../types/presentation';

export const LEARNING_SECTIONS: LearningSection[] = [
  {
    id: 'fondements',
    title: '1. Fondements des Tenseurs',
    slideIds: [1, 2, 3],
    description: 'Comprendre la nature mathématique et informatique des tenseurs dans TensorFlow.'
  },
  {
    id: 'representation-images',
    title: '2. Représentation & Manipulation d\'Images',
    slideIds: [4, 5, 6],
    description: 'Analyser les dimensions spatiales, les canaux de couleur et le découpage tensoriel.'
  },
  {
    id: 'pipelines-donnees',
    title: '3. Pipelines & Prétraitements',
    slideIds: [7, 8, 9],
    description: 'Maîtriser le chargement par lots, la normalisation et les spécificités des architectures.'
  },
  {
    id: 'deep-learning-pratique',
    title: '4. CNNs, Diagnostic & Atelier Pratique',
    slideIds: [10, 11, 12],
    description: 'Alimenter les réseaux convolutifs, corriger les bugs de dimensions et valider vos acquis.'
  }
];

export const SLIDES_DATA: SlideMetadata[] = [
  // SLIDE 1
  {
    id: 1,
    numberString: '01',
    sectionId: 'fondements',
    title: 'Introduction : De l\'image au tenseur',
    shortTitle: 'De l\'image au tenseur',
    objective: 'Comprendre comment une image visuelle est numérisée en une grille ordonnée de valeurs numériques exploitables par TensorFlow.',
    definitions: [
      {
        term: 'Pixel (Picture Element)',
        explanation: 'Plus petite unité d\'affichage d\'une image numérique. En niveaux de gris, il s\'agit d\'un entier entre 0 (noir absolu) et 255 (blanc pur).',
        mathNotation: 'I(y, x) \\in \\{0, 1, \\dots, 255\\}'
      },
      {
        term: 'Tenseur d\'image',
        explanation: 'Tableau multidimensionnel contenant les intensités lumineuses de chaque pixel organisé selon des coordonnées cartésiennes.'
      }
    ],
    explanationFrench: [
      'Pour un œil humain, une photographie représente des formes, des textures et des scènes signifiantes. Pour un ordinateur ou un modèle de Deep Learning, une image n\'est rien d\'autre qu\'une grille discrète de nombres entiers ou réels.',
      'Chaque pixel à la position (ligne y, colonne x) possède une valeur d\'intensité lumineuse. Dans une image en niveaux de gris de 28x28 pixels (comme dans le jeu de données classique MNIST), l\'ordinateur manipule 784 nombres organisés sous forme de matrice 2D.',
      'TensorFlow transforme ces grilles en tenseurs immuables et hautement optimisés pour être calculés en parallèle sur les cœurs vectoriels des cartes graphiques (GPU).'
    ],
    keyTakeaway: [
      'Une image numérique est une grille de coordonnées géométriques associées à des intensités numériques.',
      'Dans un système 8 bits conventionnel, les valeurs brutes oscillent de 0 (absence de lumière) à 255 (pleine saturation).',
      'TensorFlow convertit ces fichiers binaires (JPEG, PNG) en tenseurs mathématiques multidimensionnels.'
    ],
    code: {
      pythonCode: `import tensorflow as tf

# 1. Lire le fichier binaire brut depuis le disque
raw_bytes = tf.io.read_file("sample_digit.png")

# 2. Décoder les octets en un tenseur numérique
image_tensor = tf.io.decode_image(raw_bytes, channels=1)

# 3. Inspecter la forme et le type des données
print("Shape du tenseur :", image_tensor.shape)
print("Type des valeurs :", image_tensor.dtype)`,
      language: 'python',
      colabTitle: 'Lecture et Décodage d\'une image avec TensorFlow',
      lines: [
        {
          lineNumber: 1,
          code: 'import tensorflow as tf',
          explanation: 'Importe la bibliothèque TensorFlow pour le calcul tensoriel et le Deep Learning.',
          affectedVisualComponent: 'none'
        },
        {
          lineNumber: 4,
          code: 'raw_bytes = tf.io.read_file("sample_digit.png")',
          explanation: 'Lit le fichier image sous forme de chaîne d\'octets bruts (format compressé PNG/JPEG non exploitable mathématiquement).',
          affectedVisualComponent: 'file-reader'
        },
        {
          lineNumber: 7,
          code: 'image_tensor = tf.io.decode_image(raw_bytes, channels=1)',
          explanation: 'Décompresse les octets et reconstruit la grille numérique matricielle avec 1 canal (niveaux de gris). Renvoie un tf.Tensor.',
          affectedVisualComponent: 'pixel-grid',
          isKeyLine: true
        },
        {
          lineNumber: 10,
          code: 'print("Shape du tenseur :", image_tensor.shape)',
          explanation: 'Affiche la forme géométrique du tenseur, par exemple (28, 28, 1) pour une image MNIST.',
          affectedVisualComponent: 'shape-badge'
        },
        {
          lineNumber: 11,
          code: 'print("Type des valeurs :", image_tensor.dtype)',
          explanation: 'Affiche le type de données sous-jacent : tf.uint8 (entiers non signés de 0 à 255).',
          affectedVisualComponent: 'dtype-badge'
        }
      ],
      expectedOutput: `Shape du tenseur : (28, 28, 1)
Type des valeurs : <dtype: 'uint8'>`,
      whyUseful: 'Cette étape de décodage est le point de départ de tout système de vision par ordinateur en TensorFlow : convertir des fichiers binaires en tenseurs numériques calculables.',
      commonPitfall: 'Oublier de spécifier channels=1 ou channels=3 lors du décodage, ce qui peut charger une image avec un canal alpha inattendu (RGBA, 4 canaux) incompatible avec les modèles standards.'
    },
    miniQuiz: {
      question: 'Dans une image 8 bits en niveaux de gris, quelle valeur numérique correspond au pixel le plus clair (blanc pur) ?',
      options: ['0', '1', '127', '255'],
      correctIndex: 3,
      explanation: 'En codage 8 bits non signé (uint8), les valeurs vont de 0 (noir absolu) à 2^8 - 1 = 255 (blanc saturé).'
    }
  },

  // SLIDE 2
  {
    id: 2,
    numberString: '02',
    sectionId: 'fondements',
    title: 'Scalaire, Vecteur, Matrice et Tenseur',
    shortTitle: 'Hiérarchie des Tenseurs',
    objective: 'Différencier rigoureusement les ordres dimensionnels de rang 0 (scalaire) à rang 4 (lot d\'images couleur).',
    definitions: [
      {
        term: 'Scalaire (Rang 0)',
        explanation: 'Un nombre unique sans axe géométrique (ex: la température ou la valeur d\'une perte loss = 0.42).',
        mathNotation: 's \\in \\mathbb{R}, \\quad \\text{shape}=()'
      },
      {
        term: 'Vecteur (Rang 1)',
        explanation: 'Une liste 1D de nombres ordonnés selon 1 seul axe (ex: vecteur de caractéristiques ou prédictions softmax).',
        mathNotation: '\\mathbf{v} \\in \\mathbb{R}^n, \\quad \\text{shape}=(n,)'
      },
      {
        term: 'Matrice (Rang 2)',
        explanation: 'Un tableau 2D à deux axes : lignes et colonnes (ex: image monochrome sans canal explicite ou matrice de poids).',
        mathNotation: '\\mathbf{M} \\in \\mathbb{R}^{m \\times n}, \\quad \\text{shape}=(m, n)'
      },
      {
        term: 'Tenseur d\'ordre supérieur (Rang 3 & 4)',
        explanation: 'Généralisation à 3 axes (Image couleur HxWxC) et 4 axes (Lot d\'images NxHxWxC).',
        mathNotation: '\\mathcal{T} \\in \\mathbb{R}^{N \\times H \\times W \\times C}'
      }
    ],
    explanationFrench: [
      'Le terme "tenseur" n\'est pas un objet mystérieux : c\'est le terme générique qui englobe scalaires, vecteurs, matrices et tableaux multidimensionnels.',
      'Le rang d\'un tenseur correspond au nombre de crochets imbriqués nécessaires pour l\'écrire en Python, ou au nombre d\'indices nécessaires pour adresser une valeur scalaire unique.',
      'Une règle fondamentale pour compter le nombre total d\'éléments dans n\'importe quel tenseur est de calculer le produit de toutes les dimensions de sa shape : N_{total} = \\prod d_i.'
    ],
    keyTakeaway: [
      'Scalaire = 0 dimension, Vecteur = 1 dimension, Matrice = 2 dimensions.',
      'Une image couleur seule est un tenseur 3D de forme (Hauteur, Largeur, 3).',
      'Un ensemble d\'images couleur traitées en parallèle constitue un tenseur 4D de forme (Batch, Hauteur, Largeur, 3).'
    ],
    code: {
      pythonCode: `import tensorflow as tf

# Rang 0 : Scalaire
scalaire = tf.constant(42)

# Rang 1 : Vecteur
vecteur = tf.constant([1.5, 2.7, 3.9])

# Rang 2 : Matrice (ex: image N&B 28x28)
matrice = tf.zeros([28, 28])

# Rang 3 : Image couleur (Hauteur, Largeur, Canaux)
image_couleur = tf.zeros([224, 224, 3])

# Rang 4 : Lot (Batch) d'images couleur pour un CNN
lot_images = tf.zeros([32, 224, 224, 3])

print("Rang du lot :", lot_images.ndim)
print("Nombre d'éléments :", tf.size(lot_images).numpy())`,
      language: 'python',
      colabTitle: 'Création de tenseurs de différents rangs dans TensorFlow',
      lines: [
        {
          lineNumber: 4,
          code: 'scalaire = tf.constant(42)',
          explanation: 'Crée un tenseur de rang 0. Sa forme est vide () car il n\'a aucune dimension spatiale.',
          affectedVisualComponent: 'rank-0'
        },
        {
          lineNumber: 7,
          code: 'vecteur = tf.constant([1.5, 2.7, 3.9])',
          explanation: 'Crée un tenseur 1D (vecteur) de forme (3,). Il nécessite 1 seul indice pour être interrogé.',
          affectedVisualComponent: 'rank-1'
        },
        {
          lineNumber: 10,
          code: 'matrice = tf.zeros([28, 28])',
          explanation: 'Crée une matrice 2D remplie de zéros de forme (28, 28). Correspond à 784 valeurs.',
          affectedVisualComponent: 'rank-2'
        },
        {
          lineNumber: 13,
          code: 'image_couleur = tf.zeros([224, 224, 3])',
          explanation: 'Crée un tenseur 3D représentant une image couleur : 224 lignes, 224 colonnes, 3 canaux (R, V, B).',
          affectedVisualComponent: 'rank-3',
          isKeyLine: true
        },
        {
          lineNumber: 16,
          code: 'lot_images = tf.zeros([32, 224, 224, 3])',
          explanation: 'Crée un tenseur 4D contenant 32 images. C\'est le format exact injecté dans un réseau convolutif.',
          affectedVisualComponent: 'rank-4',
          isKeyLine: true
        },
        {
          lineNumber: 18,
          code: 'print("Rang du lot :", lot_images.ndim)',
          explanation: 'Renvoie 4, car il y a 4 axes (Lot, Hauteur, Largeur, Canaux).',
          affectedVisualComponent: 'rank-badge'
        }
      ],
      expectedOutput: `Rang du lot : 4
Nombre d'éléments : 4816896`,
      whyUseful: 'Comprendre ces rangs permet de configurer immédiatement les bonnes dimensions d\'entrées et de sorties dans les modèles de Deep Learning sans commettre d\'erreur d\'architecture.',
      commonPitfall: 'Confondre le rang d\'un tenseur (nombre d\'axes, ici 4) avec la taille d\'une dimension particulière (ex: 32 images).'
    },
    miniQuiz: {
      question: 'Combien d\'éléments au total contient un tenseur de forme (10, 64, 64, 3) ?',
      options: ['122 880', '13 000', '40 960', '1 228 800'],
      correctIndex: 0,
      explanation: 'Le nombre total d\'éléments est le produit des dimensions : 10 * 64 * 64 * 3 = 122 880 valeurs.'
    }
  },

  // SLIDE 3
  {
    id: 3,
    numberString: '03',
    sectionId: 'fondements',
    title: 'Shape, Rank et Dtype',
    shortTitle: 'Shape, Rank et Dtype',
    objective: 'Maîtriser les 3 piliers d\'un tenseur TensorFlow, calculer son empreinte mémoire et gérer les conversions de type.',
    definitions: [
      {
        term: 'Shape (Forme)',
        explanation: 'Tuple d\'entiers indiquant le nombre d\'éléments le long de chaque dimension.',
        mathNotation: 'S = (s_0, s_1, \\dots, s_{k-1})'
      },
      {
        term: 'Rank (ndim)',
        explanation: 'Le nombre total d\'axes du tenseur, équivalent à len(tensor.shape).',
        mathNotation: '\\text{rank} = |S|'
      },
      {
        term: 'Dtype (Data Type)',
        explanation: 'Format de stockage binaire. uint8 = 1 octet (0 à 255), float32 = 4 octets (standard Deep Learning), float64 = 8 octets.',
        mathNotation: '\\text{Taille Mémoire} = \\left( \\prod s_i \\right) \\times \\text{octets/élément}'
      }
    ],
    explanationFrench: [
      'Chaque objet tf.Tensor possède obligatoirement trois métadonnées indissociables : sa Forme (shape), son Rang (rank / ndim) et son Type de données (dtype).',
      'Le choix du dtype a un impact direct et colossal sur la mémoire vive du GPU : un lot d\'images en float32 consomme exactement 4 fois plus de mémoire RAM qu\'en uint8 !',
      'Pendant l\'entraînement, les gradients exigent la précision continue des nombres réels (tf.float32 ou tf.bfloat16). Il est donc indispensable de convertir (caster) les images uint8 issues du disque en float32 dès l\'entrée du pipeline.'
    ],
    keyTakeaway: [
      'Shape = géométrie (taille de chaque axe) ; Rank = nombre d\'axes (longueur de la shape).',
      'Dtype = format numérique (uint8 pour le stockage disque, float32 pour le calcul de gradient).',
      'La mémoire totale occupée se calcule par : Nombre d\'éléments * taille en octets du dtype.'
    ],
    code: {
      pythonCode: `import tensorflow as tf

# Tenseur simulant une image 64x64 en niveaux de gris (uint8)
img_uint8 = tf.random.uniform([64, 64, 1], minval=0, maxval=256, dtype=tf.int32)
img_uint8 = tf.cast(img_uint8, tf.uint8)

print("Forme (shape) :", img_uint8.shape)
print("Rang (ndim)    :", img_uint8.ndim)
print("Type (dtype)   :", img_uint8.dtype)

# Conversion vers float32 pour le modèle
img_float32 = tf.cast(img_uint8, tf.float32)
print("Nouveau type   :", img_float32.dtype)`,
      language: 'python',
      colabTitle: 'Inspection des métadonnées et conversion de type (cast)',
      lines: [
        {
          lineNumber: 4,
          code: 'img_uint8 = tf.cast(img_uint8, tf.uint8)',
          explanation: 'Assure que le tenseur est encodé en entiers 8 bits non signés (1 octet par pixel, valeurs de 0 à 255).',
          affectedVisualComponent: 'dtype-uint8'
        },
        {
          lineNumber: 6,
          code: 'print("Forme (shape) :", img_uint8.shape)',
          explanation: 'Affiche TensorShape([64, 64, 1]). Indique 64 lignes, 64 colonnes et 1 canal.',
          affectedVisualComponent: 'shape-display'
        },
        {
          lineNumber: 7,
          code: 'print("Rang (ndim)    :", img_uint8.ndim)',
          explanation: 'Affiche 3 car il y a 3 dimensions géométriques distinctes.',
          affectedVisualComponent: 'rank-display'
        },
        {
          lineNumber: 11,
          code: 'img_float32 = tf.cast(img_uint8, tf.float32)',
          explanation: 'Opération essentielle : convertit chaque entier en nombre flottant 32 bits nécessaire pour la différentiation automatique.',
          affectedVisualComponent: 'dtype-float32',
          isKeyLine: true
        }
      ],
      expectedOutput: `Forme (shape) : (64, 64, 1)
Rang (ndim)    : 3
Type (dtype)   : <dtype: 'uint8'>
Nouveau type   : <dtype: 'float32'>`,
      whyUseful: 'La fonction tf.cast() prévient les erreurs strictes de typage de TensorFlow, qui refuse catégoriquement d\'effectuer des opérations arithmétiques entre types hétérogènes.',
      commonPitfall: 'Tenter de multiplier directement un tenseur uint8 par un scalaire flottant (ex: img * 0.5) sans cast préalable, ce qui lève une TypeError immédiate.'
    },
    miniQuiz: {
      question: 'Combien d\'octets de mémoire RAM occupe un lot de 32 images de taille 224x224x3 encodées en tf.float32 (4 octets par valeur) ?',
      options: ['~1,2 Mo', '~4,8 Mo', '~19,3 Mo', '~77,1 Mo'],
      correctIndex: 2,
      explanation: '32 * 224 * 224 * 3 = 4 816 896 valeurs. Multiplié par 4 octets = 19 267 584 octets ≈ 19,27 Mo.'
    }
  },

  // SLIDE 4
  {
    id: 4,
    numberString: '04',
    sectionId: 'representation-images',
    title: 'Dimensions d\'une image : Hauteur, Largeur et Canaux',
    shortTitle: 'Dimensions & Canaux RGB',
    objective: 'Comprendre l\'organisation spatiale (H, W, C) et observer comment les trois canaux Rouge, Vert et Bleu se superposent pour créer les couleurs.',
    definitions: [
      {
        term: 'Convention NHWC (Channels Last)',
        explanation: 'Ordre standard dans TensorFlow : [Lot, Hauteur (lignes), Largeur (colonnes), Canaux].',
        mathNotation: '(N, H, W, C)'
      },
      {
        term: 'Canal Rouge, Vert, Bleu (RGB)',
        explanation: 'Chaque pixel couleur résulte de la synthèse additive de 3 valeurs lumineuses correspondant aux trois longueurs d\'onde fondamentales.',
        mathNotation: '\\mathbf{p}(y, x) = \\begin{bmatrix} R(y, x) \\\\ V(y, x) \\\\ B(y, x) \\end{bmatrix}'
      }
    ],
    explanationFrench: [
      'Contrairement à la notation mathématique habituelle (x, y) où l\'axe horizontal vient en premier, les images numériques sont stockées ligne par ligne (l\'axe vertical y en premier). La première dimension est donc la Hauteur (Height), et la seconde la Largeur (Width).',
      'Le troisième axe représente les Canaux (Channels). Dans une image couleur standard, il y a 3 canaux ordonnés conventionnellement en Rouge, Vert et Bleu (RGB).',
      'Chaque canal pris isolément peut être visualisé comme une simple image en niveaux de gris représentant la quantité d\'énergie de cette couleur spécifique.'
    ],
    keyTakeaway: [
      'Hauteur (Height) = axe 0 (nombre de lignes) ; Largeur (Width) = axe 1 (nombre de colonnes).',
      'Canaux (Channels) = axe 2 : 1 canal pour niveaux de gris, 3 canaux pour RGB.',
      'Dans TensorFlow, la convention par défaut est channels_last : (Hauteur, Largeur, Canaux).'
    ],
    code: {
      pythonCode: `import tensorflow as tf

# Création d'une image couleur fictive 100x100 RGB
image_rgb = tf.random.uniform([100, 100, 3], minval=0, maxval=256, dtype=tf.int32)
image_rgb = tf.cast(image_rgb, tf.uint8)

# Extraction individuelle des 3 canaux selon le dernier axe
canal_rouge = image_rgb[:, :, 0]
canal_vert  = image_rgb[:, :, 1]
canal_bleu  = image_rgb[:, :, 2]

print("Forme de l'image complète :", image_rgb.shape)
print("Forme du canal rouge seul :", canal_rouge.shape)`,
      language: 'python',
      colabTitle: 'Décomposition d\'une image couleur en canaux R, V, B',
      lines: [
        {
          lineNumber: 4,
          code: 'image_rgb = tf.cast(image_rgb, tf.uint8)',
          explanation: 'Définit une image avec 100 lignes, 100 colonnes et 3 plans spectraux.',
          affectedVisualComponent: 'rgb-preview'
        },
        {
          lineNumber: 7,
          code: 'canal_rouge = image_rgb[:, :, 0]',
          explanation: 'Extrait toutes les lignes (:), toutes les colonnes (:) et uniquement l\'indice 0 du canal (le Rouge). La forme devient (100, 100).',
          affectedVisualComponent: 'channel-red',
          isKeyLine: true
        },
        {
          lineNumber: 8,
          code: 'canal_vert  = image_rgb[:, :, 1]',
          explanation: 'Extrait le canal Vert à l\'indice 1.',
          affectedVisualComponent: 'channel-green'
        },
        {
          lineNumber: 9,
          code: 'canal_bleu  = image_rgb[:, :, 2]',
          explanation: 'Extrait le canal Bleu à l\'indice 2.',
          affectedVisualComponent: 'channel-blue'
        }
      ],
      expectedOutput: `Forme de l'image complète : (100, 100, 3)
Forme du canal rouge seul : (100, 100)`,
      whyUseful: 'La manipulation des canaux permet de modifier l\'ambiance colorimétrique, de supprimer des artefacts ou d\'adapter des données multispectrales (ex: images satellites à 4 ou 10 canaux).',
      commonPitfall: 'Confondre OpenCV (qui charge par défaut les images en BGR : Bleu, Vert, Rouge) et TensorFlow/PIL/Keras (qui chargent en RGB). Inverser ces canaux altère gravement les couleurs perçues par le modèle.'
    },
    miniQuiz: {
      question: 'Si vous extrayez le canal rouge avec `img[:, :, 0]`, quelle est la forme (shape) du résultat pour une image 128x128x3 ?',
      options: ['(128, 128, 1)', '(128, 128)', '(1, 128, 128)', '(128, 1)'],
      correctIndex: 1,
      explanation: 'L\'indexation par un entier simple (0) élimine l\'axe correspondant. La forme passe donc de (128, 128, 3) à (128, 128). Pour conserver l\'axe, on utilise `img[:, :, 0:1]`.'
    }
  },

  // SLIDE 5
  {
    id: 5,
    numberString: '05',
    sectionId: 'representation-images',
    title: 'Indexation et découpage de tenseurs (Slicing)',
    shortTitle: 'Indexation & Slicing',
    objective: 'Maîtriser la syntaxe de découpage [start:stop:step] pour extraire des régions d\'intérêt (bounding boxes) et sous-échantillonner des images.',
    definitions: [
      {
        term: 'Slicing (Découpage)',
        explanation: 'Syntaxe standard Python/NumPy/TensorFlow pour sélectionner des sous-ensembles continus ou réguliers d\'un tenseur.',
        mathNotation: 'T[y_{\\min}:y_{\\max}, \\, x_{\\min}:x_{\\max}, \\, c]'
      },
      {
        term: 'Région d\'Intérêt (ROI - Region of Interest)',
        explanation: 'Zone rectangulaire spécifique de l\'image contenant l\'objet que l\'on souhaite isoler, détecter ou classifier.'
      }
    ],
    explanationFrench: [
      'Le découpage de tenseurs (slicing) permet de manipuler les pixels sans créer de copies superflues en mémoire. La syntaxe générale pour chaque dimension est `debut : fin : pas`.',
      'L\'indice de `debut` est inclusif, tandis que l\'indice de `fin` est exclusif (comme dans les boucles range() de Python).',
      'Par exemple, pour recadrer les 50 pixels centraux d\'une image 200x200, on sélectionne les coordonnées [75:125, 75:125, :]. Le pas négatif ou supérieur à 1 permet également de retourner une image ou de la sous-échantillonner.'
    ],
    keyTakeaway: [
      'Syntaxe : tenseur[y_start:y_end, x_start:x_end, c_start:c_end].',
      'L\'indice de fin est TOUJOURS exclusif.',
      'Le pas (step) permet des transformations puissantes : img[::2, ::2, :] divise la résolution par 2.'
    ],
    code: {
      pythonCode: `import tensorflow as tf

# Image fictive 200x200 RGB
image = tf.random.uniform([200, 200, 3], minval=0, maxval=256, dtype=tf.int32)
image = tf.cast(image, tf.uint8)

# 1. Recadrage (Crop) d'une région centrale de 100x100
recadrage = image[50:150, 50:150, :]

# 2. Sous-échantillonnage par un facteur 2 (1 pixel sur 2)
sous_echantillon = image[::2, ::2, :]

# 3. Inversion horizontale (effet miroir)
miroir = image[:, ::-1, :]

print("Crop shape :", recadrage.shape)
print("Downsample :", sous_echantillon.shape)`,
      language: 'python',
      colabTitle: 'Opérations de recadrage et transformation par slicing',
      lines: [
        {
          lineNumber: 7,
          code: 'recadrage = image[50:150, 50:150, :]',
          explanation: 'Extrait les lignes 50 à 149 et les colonnes 50 à 149 sur tous les canaux. Résultat de taille 100x100x3.',
          affectedVisualComponent: 'crop-box',
          isKeyLine: true
        },
        {
          lineNumber: 10,
          code: 'sous_echantillon = image[::2, ::2, :]',
          explanation: 'Prend un pixel sur deux en hauteur et en largeur. Réduit l\'image de 200x200 à 100x100 sans interpolation.',
          affectedVisualComponent: 'step-sampling'
        },
        {
          lineNumber: 13,
          code: 'miroir = image[:, ::-1, :]',
          explanation: 'Inverse l\'ordre des colonnes avec un pas de -1, réalisant un retournement horizontal (flip horizontal).',
          affectedVisualComponent: 'flip-view'
        }
      ],
      expectedOutput: `Crop shape : (100, 100, 3)
Downsample : (100, 100, 3)`,
      whyUseful: 'Le slicing est le mécanisme de base des augmentations de données manuelles (Random Crop, Horizontal Flip) et de l\'extraction de vignettes d\'entraînement.',
      commonPitfall: 'Inverser l\'ordre des dimensions : écrire image[x1:x2, y1:y2] au lieu de image[y1:y2, x1:x2], ce qui transpose l\'image de travers.'
    },
    miniQuiz: {
      question: 'Quelle instruction extrait précisément les 50 premières lignes et les 50 premières colonnes d\'une image 100x100x3 ?',
      options: ['image[0:50, 0:50, :]', 'image[1:50, 1:50, :]', 'image[:49, :49, :]', 'image[50, 50, :]'],
      correctIndex: 0,
      explanation: 'En Python (0-indexé), de 0 à 50 (exclu) sélectionne les indices 0, 1, ..., 49, soit exactement 50 pixels.'
    }
  },

  // SLIDE 6
  {
    id: 6,
    numberString: '06',
    sectionId: 'representation-images',
    title: 'Chargement et redimensionnement d\'images',
    shortTitle: 'Chargement & Resize',
    objective: 'Comprendre pourquoi et comment harmoniser la résolution spatiale des images pour les injecter dans une architecture neuronale.',
    definitions: [
      {
        term: 'Contrainte de taille fixe des CNN',
        explanation: 'Les couches denses finales et les filtres convolutifs partagés imposent que toutes les images d\'un même lot partagent des dimensions strictement identiques.',
        mathNotation: '(H_{\\text{cible}}, W_{\\text{cible}})'
      },
      {
        term: 'Interpolation Bilinéaire',
        explanation: 'Calcul d\'un nouveau pixel en moyennant proportionnellement la couleur des 4 pixels adjacents les plus proches de la position continue.',
        mathNotation: 'I(x, y) = (1-u)(1-v)I_{00} + u(1-v)I_{10} + (1-u)v I_{01} + uv I_{11}'
      },
      {
        term: 'Interpolation au Plus Proche Voisin (Nearest)',
        explanation: 'Affecte la valeur du pixel source le plus proche sans calcul de moyenne. Très rapide mais produit des crénelages (aspect pixelisé).'
      }
    ],
    explanationFrench: [
      'Dans la vie réelle, les photos proviennent d\'appareils photo, de téléphones ou du web avec des résolutions extrêmement hétérogènes (4K, format carré, panoramique).',
      'Un réseau de neurones convolutif ne peut pas traiter simultanément dans un même tenseur des images de tailles différentes. Il est donc impératif de redimensionner (resize) chaque image vers une dimension standardisée (par exemple 224x224 pour ResNet ou 299x299 pour Inception).',
      'TensorFlow propose la fonction hautement optimisée `tf.image.resize()`, capable de fonctionner directement sur GPU avec plusieurs algorithmes d\'interpolation.'
    ],
    keyTakeaway: [
      'Toutes les images d\'un lot doivent posséder des dimensions identiques (H, W).',
      'L\'interpolation bilinéaire est le standard pour les photos naturelles car elle préserve les transitions douces.',
      'L\'interpolation au plus proche voisin (Nearest) est réservée aux masques de segmentation pour ne pas inventer de classes intermédiaires.'
    ],
    code: {
      pythonCode: `import tensorflow as tf

# 1. Chargement utilitaire haut niveau (Keras)
# img = tf.keras.utils.load_img("chat.jpg", target_size=(224, 224))
# img_array = tf.keras.utils.img_to_array(img)

# 2. Redimensionnement pur TensorFlow (compatible GPU)
image_brute = tf.random.uniform([600, 800, 3], minval=0, maxval=256, dtype=tf.float32)

# Redimensionnement vers la taille standard 224x224
image_redim = tf.image.resize(
    image_brute,
    size=[224, 224],
    method=tf.image.ResizeMethod.BILINEAR
)

print("Taille initiale :", image_brute.shape)
print("Taille finale   :", image_redim.shape)`,
      language: 'python',
      colabTitle: 'Redimensionnement d\'images avec tf.image.resize',
      lines: [
        {
          lineNumber: 8,
          code: 'image_brute = tf.random.uniform([600, 800, 3]...)',
          explanation: 'Simule une photo haute définition de 600 lignes sur 800 colonnes.',
          affectedVisualComponent: 'original-res'
        },
        {
          lineNumber: 11,
          code: 'image_redim = tf.image.resize(',
          explanation: 'Appelle la fonction de redimensionnement de TensorFlow. Renvoie automatiquement un tenseur en float32 !',
          affectedVisualComponent: 'resize-operation',
          isKeyLine: true
        },
        {
          lineNumber: 12,
          code: '    image_brute, size=[224, 224],',
          explanation: 'Spécifie la nouvelle hauteur (224) et nouvelle largeur (224) cibles.',
          affectedVisualComponent: 'target-shape'
        },
        {
          lineNumber: 14,
          code: '    method=tf.image.ResizeMethod.BILINEAR',
          explanation: 'Applique une interpolation bilinéaire pour lisser les arêtes et éviter les effets de pixelisation grossière.',
          affectedVisualComponent: 'interpolation-method'
        }
      ],
      expectedOutput: `Taille initiale : (600, 800, 3)
Taille finale   : (224, 224, 3)`,
      whyUseful: 'Permet d\'harmoniser à la volée des millions d\'images lors de l\'entraînement sans modifier définitivement les fichiers originaux sur le disque dur.',
      commonPitfall: 'Remarquez que tf.image.resize convertit automatiquement les valeurs en float32 même si l\'entrée était en uint8, tout en laissant les valeurs dans l\'échelle [0, 255].'
    },
    miniQuiz: {
      question: 'Pourquoi n\'utilise-t-on PAS l\'interpolation bilinéaire pour redimensionner des masques de segmentation sémantique (classes 0, 1, 2) ?',
      options: [
        'Parce qu\'elle est trop lente sur GPU',
        'Parce qu\'elle créerait des valeurs décimales intermédiaires (ex: 1.4) n\'appartenant à aucune classe',
        'Parce que TensorFlow refuse de compiler cette opération',
        'Parce qu\'elle inverse les canaux de couleur'
      ],
      correctIndex: 1,
      explanation: 'Une moyenne entre la classe 0 (fond) et la classe 2 (arbre) produirait 1.0 (qui pourrait signifier "voiture" !). On utilise impérativement NEAREST_NEIGHBOR pour les étiquettes catégorielles.'
    }
  },

  // SLIDE 7
  {
    id: 7,
    numberString: '07',
    sectionId: 'pipelines-donnees',
    title: 'Lots (Batches) et tf.data.Dataset',
    shortTitle: 'Batches & tf.data',
    objective: 'Comprendre l\'intérêt des lots d\'images (dimension N) et construire un pipeline de chargement ultra-rapide avec l\'API tf.data.',
    definitions: [
      {
        term: 'Mini-Batch (Lot d\'images)',
        explanation: 'Sous-ensemble d\'échantillons groupés selon un nouvel axe (dimension 0) pour être calculés en parallèle sur GPU.',
        mathNotation: '\\text{Shape: } (B, H, W, C) \\quad \\text{avec } B \\in \\{16, 32, 64, 128\\}'
      },
      {
        term: 'Prefetching (Mise en tampon anticipée)',
        explanation: 'Technique permettant au CPU de préparer le lot N+1 pendant que le GPU calcule la propagation avant/arrière sur le lot N, supprimant tout goulet d\'étranglement I/O.',
        mathNotation: '\\text{Dataset.prefetch}(tf.data.AUTOTUNE)'
      }
    ],
    explanationFrench: [
      'Entraîner un réseau image par image (taille de lot = 1) sous-exploite dramatiquement les milliers de cœurs de calcul d\'un GPU et engendre une trajectoire d\'apprentissage chaotique.',
      'À l\'inverse, charger l\'intégralité d\'un jeu de données en un seul bloc saturerait immédiatement la mémoire VRAM (Out of Memory). La solution est le compromis des mini-lots (mini-batches).',
      'L\'API `tf.data.Dataset` est le standard industriel pour assembler des flux de données : lecture sur disque, décodage, transformation, regroupement en lot (.batch(32)) et transfert asynchrone (.prefetch()).'
    ],
    keyTakeaway: [
      'La dimension 0 représente la taille de lot : (B, H, W, C).',
      'Le batching permet une accélération massive du calcul matriciel sur GPU.',
      'Le pipeline optimal utilise : .map() -> .shuffle() -> .batch() -> .prefetch(tf.data.AUTOTUNE).'
    ],
    code: {
      pythonCode: `import tensorflow as tf

# Liste simulée de 100 chemins de fichiers
fichiers = tf.constant([f"img_{i}.jpg" for i in range(100)])

# 1. Création de la source de données
dataset = tf.data.Dataset.from_tensor_slices(fichiers)

# 2. Fonction de transformation unitaire (simulée)
def charger_et_traiter(chemin):
    # Simule le décodage et redimensionnement d'une image
    image = tf.zeros([224, 224, 3], dtype=tf.float32)
    return image

# 3. Pipeline complet haute performance
dataset = dataset.map(charger_et_traiter, num_parallel_calls=tf.data.AUTOTUNE)
dataset = dataset.batch(batch_size=32)
dataset = dataset.prefetch(buffer_size=tf.data.AUTOTUNE)

# Inspection du premier lot
for premier_lot in dataset.take(1):
    print("Shape du lot généré :", premier_lot.shape)`,
      language: 'python',
      colabTitle: 'Construction d\'un pipeline de données avec tf.data.Dataset',
      lines: [
        {
          lineNumber: 7,
          code: 'dataset = tf.data.Dataset.from_tensor_slices(fichiers)',
          explanation: 'Crée un flux d\'éléments individuels à partir du tableau de chemins.',
          affectedVisualComponent: 'dataset-source'
        },
        {
          lineNumber: 16,
          code: 'dataset = dataset.map(charger_et_traiter...)',
          explanation: 'Applique la fonction de prétraitement en parallèle sur plusieurs cœurs de processeur (multi-threading).',
          affectedVisualComponent: 'pipeline-map'
        },
        {
          lineNumber: 17,
          code: 'dataset = dataset.batch(batch_size=32)',
          explanation: 'Empile 32 images consécutives de forme (224, 224, 3) le long d\'un nouvel axe 0, créant un tenseur (32, 224, 224, 3).',
          affectedVisualComponent: 'pipeline-batch',
          isKeyLine: true
        },
        {
          lineNumber: 18,
          code: 'dataset = dataset.prefetch(buffer_size=tf.data.AUTOTUNE)',
          explanation: 'Superpose l\'exécution CPU et GPU pour que le GPU ne soit jamais en attente de données.',
          affectedVisualComponent: 'pipeline-prefetch',
          isKeyLine: true
        }
      ],
      expectedOutput: `Shape du lot généré : (32, 224, 224, 3)`,
      whyUseful: 'C\'est la méthode officielle recommandée par Google pour alimenter les modèles sans bloquer l\'entraînement par les accès disque.',
      commonPitfall: 'Placer l\'opération .batch() AVANT l\'opération .map() sans fonction vectorisée, ce qui force la fonction map à devoir gérer la dimension de lot.'
    },
    miniQuiz: {
      question: 'Si vous avez 100 images au total et une taille de batch de 32, combien de lots le dataset produira-t-il par epoch ?',
      options: ['3 lots', '4 lots (3 lots de 32 et 1 lot de 4)', '32 lots', '100 lots'],
      correctIndex: 1,
      explanation: '100 = 3 * 32 + 4. Par défaut, tf.data produit 3 lots complets de 32 images et 1 dernier lot résiduel de 4 images.'
    }
  },

  // SLIDE 8
  {
    id: 8,
    numberString: '08',
    sectionId: 'pipelines-donnees',
    title: 'Normalisation des pixels',
    shortTitle: 'Normalisation des Pixels',
    objective: 'Comprendre pourquoi l\'échelle [0, 255] déstabilise l\'apprentissage et maîtriser les techniques de remise à l\'échelle [0, 1] et [-1, 1].',
    definitions: [
      {
        term: 'Mise à l\'échelle Min-Max [0, 1]',
        explanation: 'Division par 255.0. Simple, intuitive, garantit des entrées strictement positives.',
        mathNotation: 'x_{\\text{norm}} = \\frac{x}{255.0}'
      },
      {
        term: 'Centrage et mise à l\'échelle [-1, 1]',
        explanation: 'Ajustement pour que la moyenne soit centrée autour de zéro. Très bénéfique pour les fonctions d\'activation symétriques (tanh, LeakyReLU).',
        mathNotation: 'x_{\\text{norm}} = \\frac{x}{127.5} - 1.0 = \\frac{x - 127.5}{127.5}'
      },
      {
        term: 'Saturation de gradient (Vanishing/Exploding)',
        explanation: 'Des entrées brutes de 255 multipliées par les poids initiaux propulsent les neurones dans des zones à dérivée quasi nulle, bloquant l\'apprentissage.'
      }
    ],
    explanationFrench: [
      'Les réseaux de neurones sont initialisés avec de petits poids aléatoires (souvent distribués selon une loi normale centrée en 0 avec un écart-type de 0.05).',
      'Si vous injectez directement des pixels bruts compris entre 0 et 255, les produits scalaires internes deviennent énormes, ce qui sature immédiatement les couches et fait exploser les gradients de rétropropagation.',
      'Ramener les valeurs dans un intervalle réduit comme [0.0, 1.0] ou [-1.0, 1.0] stabilise les calculs numériques et accélère la convergence de l\'optimiseur Adam ou SGD.'
    ],
    keyTakeaway: [
      'Ne JAMAIS injecter de pixels bruts [0, 255] directement dans un réseau de neurones.',
      'La méthode la plus simple et universelle est la division par 255.0 (Rescaling(1./255)).',
      'La couche tf.keras.layers.Rescaling peut être directement intégrée comme première couche du modèle.'
    ],
    code: {
      pythonCode: `import tensorflow as tf
from tensorflow.keras import layers

# Lot fictif d'images brutes en uint8 [0, 255]
images_brutes = tf.constant([[[[0], [128]], [[200], [255]]]], dtype=tf.float32)

# Méthode A : Couche Keras intégrée au modèle (recommandé)
couche_normalisation = layers.Rescaling(scale=1./255)
images_normalisees_0_1 = couche_normalisation(images_brutes)

# Méthode B : Centrage dans [-1, 1]
couche_centree = layers.Rescaling(scale=1./127.5, offset=-1.0)
images_centrees = couche_centree(images_brutes)

print("Valeurs brutes  :\\n", tf.squeeze(images_brutes).numpy())
print("Normalisé [0,1] :\\n", tf.squeeze(images_normalisees_0_1).numpy())
print("Centré [-1,1]   :\\n", tf.squeeze(images_centrees).numpy())`,
      language: 'python',
      colabTitle: 'Techniques de normalisation avec la couche Rescaling de Keras',
      lines: [
        {
          lineNumber: 7,
          code: 'couche_normalisation = layers.Rescaling(scale=1./255)',
          explanation: 'Crée une couche différentiable qui multiplie chaque pixel par 1/255.0, transposant [0, 255] vers [0.0, 1.0].',
          affectedVisualComponent: 'rescaling-0-1',
          isKeyLine: true
        },
        {
          lineNumber: 11,
          code: 'couche_centree = layers.Rescaling(scale=1./127.5, offset=-1.0)',
          explanation: 'Applique la formule (x * 1/127.5) - 1.0. Le noir (0) devient -1.0, le gris moyen (127.5) devient 0.0, et le blanc (255) devient +1.0.',
          affectedVisualComponent: 'rescaling-neg1-1'
        }
      ],
      expectedOutput: `Valeurs brutes  :
 [[  0. 128.]
  [200. 255.]]
Normalisé [0,1] :
 [[0.     0.5019]
  [0.7843 1.    ]]
Centré [-1,1]   :
 [[-1.      0.0039]
  [ 0.5686  1.    ]]`,
      whyUseful: 'Intégrer la normalisation dans le modèle avec layers.Rescaling garantit que les mêmes transformations sont appliquées en entraînement ET lors du déploiement en production.',
      commonPitfall: 'Normaliser deux fois par inadvertance : diviser par 255 dans le dataset, puis appliquer une couche Rescaling(1./255) dans le modèle, réduisant les valeurs à [0, 0.0039].'
    },
    miniQuiz: {
      question: 'Que devient un pixel de valeur brute 255 après passage dans `layers.Rescaling(scale=1./127.5, offset=-1.0)` ?',
      options: ['0.0', '1.0', '-1.0', '255.0'],
      correctIndex: 1,
      explanation: '(255 / 127.5) - 1.0 = 2.0 - 1.0 = +1.0.'
    }
  },

  // SLIDE 9
  {
    id: 9,
    numberString: '09',
    sectionId: 'pipelines-donnees',
    title: 'Prétraitements spécifiques et preprocess_input',
    shortTitle: 'Modèles & preprocess_input',
    objective: 'Comprendre pourquoi chaque modèle pré-entraîné (ResNet, MobileNet, EfficientNet) exige sa propre fonction preprocess_input et comment éviter les incohérences.',
    definitions: [
      {
        term: 'preprocess_input',
        explanation: 'Fonction fournie par le module keras.applications reproduisant à l\'identique le prétraitement exact utilisé lors de l\'entraînement original sur ImageNet.',
        mathNotation: 'x_{\\text{prêt}} = \\text{preprocess\\_input}(x_{\\text{brut}})'
      },
      {
        term: 'Mode "caffe" (ex: VGG, ResNet)',
        explanation: 'Permute les canaux en BGR (au lieu de RGB) et soustrait les moyennes ImageNet par canal sans diviser par 255 : [103.939, 116.779, 123.68]. Les valeurs sont centrées sur zéro dans [-128, +128].'
      },
      {
        term: 'Mode "tf" (ex: MobileNet, Inception)',
        explanation: 'Conserve l\'ordre RGB et ramène les pixels dans l\'intervalle [-1.0, 1.0].'
      },
      {
        term: 'Mode "torch" (ex: DenseNet) / Built-in (EfficientNet)',
        explanation: 'Divise par 255 puis applique la normalisation standard (moyenne 0.485, 0.456, 0.406 et écart-type 0.229, 0.224, 0.225). EfficientNet intègre directement ce calcul.'
      }
    ],
    explanationFrench: [
      'Une des erreurs les plus fréquentes en Transfer Learning consiste à croire que tous les modèles pré-entraînés attendent des images normalisées dans [0, 1].',
      'Si vous alimentez un modèle ResNet50 avec des images [0, 1] en RGB, il traitera des valeurs qu\'il interprétera comme du noir absolu, car il a été entraîné avec des pixels BGR non divisés par 255 et soustraits de ~110 !',
      'La règle d\'or absolue : toujours importer et appliquer la fonction `preprocess_input` spécifique associée à l\'architecture choisie.'
    ],
    keyTakeaway: [
      'Il n\'existe pas de normalisation universelle pour tous les modèles.',
      'ResNet50 / VGG16 utilisent le mode "caffe" : passage en BGR et centrage avec la moyenne ImageNet.',
      'MobileNetV2 utilise le mode "tf" : mise à l\'échelle dans [-1, 1].',
      'EfficientNetB0 gère nativement le prétraitement au sein de sa première couche.'
    ],
    code: {
      pythonCode: `import tensorflow as tf
from tensorflow.keras.applications.resnet50 import preprocess_input as resnet_preprocess
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input as mobilenet_preprocess

# Image simulée RGB de 0 à 255
pixel_rgb = tf.constant([[[[200.0, 100.0, 50.0]]]]) # R=200, V=100, B=50

# Prétraitement ResNet50 (Mode Caffe : BGR + soustraction de moyenne)
pixel_resnet = resnet_preprocess(tf.identity(pixel_rgb))

# Prétraitement MobileNetV2 (Mode TF : [-1, 1])
pixel_mobilenet = mobilenet_preprocess(tf.identity(pixel_rgb))

print("Original RGB       :", pixel_rgb.numpy().flatten())
print("ResNet (BGR centré):", pixel_resnet.numpy().flatten())
print("MobileNet ([-1, 1]):", pixel_mobilenet.numpy().flatten())`,
      language: 'python',
      colabTitle: 'Comparaison des fonctions preprocess_input selon l\'architecture',
      lines: [
        {
          lineNumber: 2,
          code: 'from tensorflow.keras.applications.resnet50 import preprocess_input...',
          explanation: 'Importe le préprocesseur dédié calibré pour les poids pré-entraînés de ResNet50.',
          affectedVisualComponent: 'resnet-import'
        },
        {
          lineNumber: 8,
          code: 'pixel_resnet = resnet_preprocess(tf.identity(pixel_rgb))',
          explanation: 'Inverse les canaux (l\'ordre devient B, V, R) et soustrait les constantes ImageNet. Le premier canal (Bleu=50) devient 50 - 103.939 = -53.939.',
          affectedVisualComponent: 'resnet-transform',
          isKeyLine: true
        },
        {
          lineNumber: 11,
          code: 'pixel_mobilenet = mobilenet_preprocess(tf.identity(pixel_rgb))',
          explanation: 'Conserve l\'ordre RGB et effectue (x / 127.5) - 1.0. R=200 devient (200 / 127.5) - 1.0 ≈ +0.568.',
          affectedVisualComponent: 'mobilenet-transform',
          isKeyLine: true
        }
      ],
      expectedOutput: `Original RGB       : [200. 100.  50.]
ResNet (BGR centré): [ -53.939  -16.779   76.32 ]
MobileNet ([-1, 1]): [ 0.5686 -0.2157 -0.6078]`,
      whyUseful: 'Garantit que les caractéristiques apprises par le modèle (filtres de détection de textures, contours) réagissent avec la sensibilité attendue.',
      commonPitfall: 'Fournir des images normalisées dans [0, 1] à resnet_preprocess(), ce qui produit des valeurs d\'entrée entièrement négatives et détruit la précision.'
    },
    miniQuiz: {
      question: 'Quelle est la particularité principale du prétraitement "caffe" utilisé par ResNet50 ?',
      options: [
        'Il convertit l\'image en niveaux de gris',
        'Il permute les canaux en BGR et soustrait la moyenne ImageNet sans diviser par 255',
        'Il redimensionne obligatoirement en 512x512',
        'Il binarise les pixels en 0 et 1'
      ],
      correctIndex: 1,
      explanation: 'Le mode "caffe" historique convertit RGB en BGR puis soustrait [103.939, 116.779, 123.68] pour centrer la distribution sur zéro.'
    }
  },

  // SLIDE 10
  {
    id: 10,
    numberString: '10',
    sectionId: 'deep-learning-pratique',
    title: 'Préparation des données pour un CNN',
    shortTitle: 'Entrée d\'un CNN & 4D',
    objective: 'Comprendre pourquoi et comment transformer une image 3D individuelle en un tenseur 4D avec tf.expand_dims pour l\'inférence.',
    definitions: [
      {
        term: 'input_shape=(H, W, C)',
        explanation: 'Paramètre de la première couche Conv2D définissant la géométrie spatiale et le nombre de canaux d\'une seule image, hors dimension de batch.',
        mathNotation: '\\text{input\\_shape} = (224, 224, 3)'
      },
      {
        term: 'Tenseur 4D attendu par model.predict()',
        explanation: 'En Keras, toutes les méthodes d\'inférence et d\'entraînement attendent obligatoirement un lot d\'images, même pour une prédiction sur un seul échantillon.',
        mathNotation: '(1, H, W, C)'
      },
      {
        term: 'tf.expand_dims(tensor, axis=0)',
        explanation: 'Opération insérant une dimension unitaire à la position d\'axe spécifiée pour créer artificiellement un lot de taille 1.',
        mathNotation: '(H, W, C) \\xrightarrow{\\text{axis}=0} (1, H, W, C)'
      }
    ],
    explanationFrench: [
      'Lorsque vous concevez un réseau convolutif, vous spécifiez généralement : `layers.Conv2D(32, (3, 3), input_shape=(224, 224, 3))`. Vous ne mentionnez pas la taille de lot dans cette signature.',
      'Cependant, sous le capot, le modèle attend TOUJOURS une forme 4D : (None, 224, 224, 3), où None représente la dimension variable de batch.',
      'Si vous chargez une image individuelle et que vous tentez `model.predict(img)`, Keras lèvera une erreur `ValueError: Input 0 of layer ... expected 4 dimensions, but got array with shape (224, 224, 3)`. La solution immédiate est d\'utiliser `tf.expand_dims(img, axis=0)` ou `img[None, ...]`.'
    ],
    keyTakeaway: [
      'Une image isolée a un rang 3 : (H, W, C).',
      'Un modèle Keras exige TOUJOURS un rang 4 : (Batch_Size, H, W, C).',
      'Pour prédire une seule image, insérer la dimension de lot avec tf.expand_dims(img, axis=0).'
    ],
    code: {
      pythonCode: `import tensorflow as tf
from tensorflow.keras import layers, models

# 1. Définition d'un CNN basique
model = models.Sequential([
    layers.Input(shape=(64, 64, 3)),
    layers.Conv2D(16, kernel_size=(3, 3), activation='relu'),
    layers.GlobalAveragePooling2D(),
    layers.Dense(10, activation='softmax')
])

# 2. Simulation d'une seule image chargée (forme 3D)
image_seule = tf.random.uniform([64, 64, 3])
print("Shape de l'image isolée :", image_seule.shape)

# 3. Ajout de la dimension de batch (axe 0)
image_avec_batch = tf.expand_dims(image_seule, axis=0)
print("Shape prête pour le CNN :", image_avec_batch.shape)

# 4. Inférence réussie
predictions = model(image_avec_batch)
print("Shape de la prédiction   :", predictions.shape)`,
      language: 'python',
      colabTitle: 'Alimentation d\'un CNN Keras et utilisation de tf.expand_dims',
      lines: [
        {
          lineNumber: 5,
          code: '    layers.Input(shape=(64, 64, 3)),',
          explanation: 'Définit la forme d\'un échantillon sans spécifier le batch : (64, 64, 3).',
          affectedVisualComponent: 'cnn-input-layer'
        },
        {
          lineNumber: 13,
          code: 'print("Shape de l\'image isolée :", image_seule.shape)',
          explanation: 'Affiche (64, 64, 3) : tenseur 3D. Invalide pour model.predict() !',
          affectedVisualComponent: '3d-shape'
        },
        {
          lineNumber: 16,
          code: 'image_avec_batch = tf.expand_dims(image_seule, axis=0)',
          explanation: 'Ajoute la dimension d\'axe 0. La forme devient (1, 64, 64, 3) : tenseur 4D représentant un lot de 1 image.',
          affectedVisualComponent: 'expand-dims-op',
          isKeyLine: true
        },
        {
          lineNumber: 20,
          code: 'predictions = model(image_avec_batch)',
          explanation: 'Le modèle traite le tenseur 4D sans erreur et renvoie un tenseur de probabilités de forme (1, 10).',
          affectedVisualComponent: 'cnn-prediction'
        }
      ],
      expectedOutput: `Shape de l'image isolée : (64, 64, 3)
Shape prête pour le CNN : (1, 64, 64, 3)
Shape de la prédiction   : (1, 10)`,
      whyUseful: 'Permet d\'utiliser les mêmes modèles aussi bien pour des flux de traitement temps réel (1 image à la fois via webcam) que pour des entraînements massifs par lots de 128.',
      commonPitfall: 'Tenter de passer une image 2D (64, 64) en niveaux de gris sans canal explicite, ce qui échoue même après expand_dims car la forme devient (1, 64, 64) au lieu de (1, 64, 64, 1).'
    },
    miniQuiz: {
      question: 'Quelle est la syntaxe équivalente en NumPy / Python pour `tf.expand_dims(img, axis=0)` ?',
      options: ['img[0, :, :, :]', 'img[None, ...]', 'img.reshape(1)', 'img.append(1)'],
      correctIndex: 1,
      explanation: 'L\'indexation `img[None, ...]` ou `img[np.newaxis, ...]` insère un nouvel axe de taille 1 au début du tenseur.'
    }
  },

  // SLIDE 11
  {
    id: 11,
    numberString: '11',
    sectionId: 'deep-learning-pratique',
    title: 'Erreurs courantes et débogage',
    shortTitle: 'Erreurs & Débogage',
    objective: 'Reconnaître et résoudre instantanément les 5 erreurs les plus fréquentes en manipulation d\'images avec TensorFlow.',
    definitions: [
      {
        term: 'ValueError: Shape mismatch',
        explanation: 'Incompatibilité entre la forme fournie et celle attendue par une couche ou une fonction de perte.',
        mathNotation: '(H_1, W_1, C_1) \\neq (H_2, W_2, C_2)'
      },
      {
        term: 'TypeError: DataType mismatch',
        explanation: 'Opération arithmétique impossible entre un tenseur uint8 et un tenseur float32 sans cast explicite.'
      },
      {
        term: 'Saturation en 255',
        explanation: 'Image non normalisée transmise à un modèle, provoquant des activations saturées et des gradients nuls (NaN Loss).'
      }
    ],
    explanationFrench: [
      'Le débogage de tenseurs est l\'une des compétences les plus précieuses en Deep Learning. Contrairement aux bugs logiciels classiques, un modèle avec une mauvaise normalisation ou une inversion de canaux peut tourner sans lever d\'erreur système, mais sans jamais apprendre (silent failure).',
      'Dans cette section, nous analysons les 5 cas de pannes les plus typiques : les dimensions manquantes, les erreurs de types, l\'oubli du canal monochrome (H, W au lieu de H, W, 1), l\'inversion channels_first / channels_last, et la saturation d\'entrée.',
      'Développez le réflexe systématique d\'imprimer `.shape`, `.dtype`, `.min()` et `.max()` dès qu\'un comportement suspect apparaît.'
    ],
    keyTakeaway: [
      'Réflexe de débogage : inspecter systématiquement Shape, Dtype, Min et Max.',
      'Ne pas confondre (H, W) et (H, W, 1) : les CNN exigent impérativement l\'axe des canaux.',
      'Méfiez-vous des échecs silencieux : un modèle qui ne converge pas a souvent un problème de normalisation ou d\'ordre BGR/RGB.'
    ],
    code: {
      pythonCode: `import tensorflow as tf

# Erreur courante : image en niveaux de gris sans dimension de canal
image_grise_incorrecte = tf.zeros([28, 28]) # Forme 2D : (28, 28)

# ❌ PROVOQUERAIT UNE ERREUR dans Conv2D(..., input_shape=(28, 28, 1))
# model.predict(tf.expand_dims(image_grise_incorrecte, 0)) # Forme (1, 28, 28) -> CRASH !

# ✅ LA SOLUTION : Ajouter l'axe du canal avec tf.expand_dims(..., axis=-1)
image_avec_canal = tf.expand_dims(image_grise_incorrecte, axis=-1)
image_prete = tf.expand_dims(image_avec_canal, axis=0)

print("Forme corrigée :", image_prete.shape) # (1, 28, 28, 1)`,
      language: 'python',
      colabTitle: 'Correction du bug classique du canal manquant en niveaux de gris',
      lines: [
        {
          lineNumber: 4,
          code: 'image_grise_incorrecte = tf.zeros([28, 28])',
          explanation: 'Erreur classique : charger une image monochrome comme une matrice 2D sans le 3ème axe de canal.',
          affectedVisualComponent: 'bug-2d'
        },
        {
          lineNumber: 10,
          code: 'image_avec_canal = tf.expand_dims(image_grise_incorrecte, axis=-1)',
          explanation: 'Insère le canal à la dernière position (axis=-1). La forme passe de (28, 28) à (28, 28, 1).',
          affectedVisualComponent: 'fix-channel',
          isKeyLine: true
        },
        {
          lineNumber: 11,
          code: 'image_prete = tf.expand_dims(image_avec_canal, axis=0)',
          explanation: 'Insère le batch au début (axis=0). La forme finale devient (1, 28, 28, 1).',
          affectedVisualComponent: 'fix-batch',
          isKeyLine: true
        }
      ],
      expectedOutput: `Forme corrigée : (1, 28, 28, 1)`,
      whyUseful: 'Cette correction résout plus de 40% des questions d\'incompréhension des débutants sur StackOverflow concernant Keras.',
      commonPitfall: 'Croire qu\'une image en niveaux de gris n\'a pas de canal : pour un CNN, elle a UN canal de taille 1.'
    },
    miniQuiz: {
      question: 'Si Keras affiche : `ValueError: Expected 4D tensor, but got shape (224, 224, 3)`, quelle ligne corrige le problème ?',
      options: [
        'img = tf.cast(img, tf.float32)',
        'img = tf.expand_dims(img, axis=0)',
        'img = tf.image.resize(img, [224, 224])',
        'img = img / 255.0'
      ],
      correctIndex: 1,
      explanation: 'L\'erreur indique l\'absence de la 4ème dimension (le batch). `tf.expand_dims(img, axis=0)` transforme la forme en (1, 224, 224, 3).'
    }
  },

  // SLIDE 12
  {
    id: 12,
    numberString: '12',
    sectionId: 'deep-learning-pratique',
    title: 'Atelier pratique interactif et Quiz final',
    shortTitle: 'Atelier & Quiz Final',
    objective: 'Mettre en pratique l\'ensemble des concepts dans un bac à sable interactif de bout en bout et valider vos connaissances avec le quiz final.',
    definitions: [
      {
        term: 'Pipeline End-to-End',
        explanation: 'Enchaînement complet : Image disque -> Décodage -> Redimensionnement -> Normalisation -> Batching -> Conv2D.',
        mathNotation: '\\text{Fichier} \\to (H, W, C) \\to (H_{\\text{cible}}, W_{\\text{cible}}, C) \\to [0, 1] \\to (B, H, W, C) \\to \\mathbf{\\hat{y}}'
      }
    ],
    explanationFrench: [
      'Félicitations pour votre parcours à travers les fondements des tenseurs et du traitement d\'images avec TensorFlow !',
      'Dans ce dernier module interactif, configurez votre propre pipeline complet de vision par ordinateur à l\'aide des contrôles interactifs ci-dessous : choisissez l\'image, la résolution, le mode de couleur, l\'algorithme de normalisation et la taille de lot.',
      'Générez le script Python complet prêt à l\'emploi pour Google Colab, puis testez votre maîtrise avec le Quiz d\'évaluation final de 10 questions certifié.'
    ],
    keyTakeaway: [
      'Un pipeline d\'images propre est la clé de voûte de toute application de Deep Learning réussie.',
      'Les dimensions (N, H, W, C) et le type de données (float32) doivent être rigoureusement surveillés.',
      'Vous maîtrisez désormais les tenseurs, les canaux RGB, les batches et les subtilités de Keras !'
    ],
    code: {
      pythonCode: `import tensorflow as tf
from tensorflow.keras import layers, models

# Pipeline complet de bout en bout
def preparer_pipeline(batch_size=32, target_size=(224, 224)):
    # 1. Modèle intégrant le prétraitement
    model = models.Sequential([
        layers.Input(shape=(*target_size, 3)),
        layers.Rescaling(1./255), # Normalisation [0, 1]
        layers.Conv2D(32, 3, activation='relu'),
        layers.MaxPooling2D(),
        layers.GlobalAveragePooling2D(),
        layers.Dense(5, activation='softmax')
    ])
    return model

mon_modele = preparer_pipeline()
mon_modele.summary()`,
      language: 'python',
      colabTitle: 'Pipeline complet TensorFlow intégrant couches de prétraitement',
      lines: [
        {
          lineNumber: 8,
          code: '        layers.Rescaling(1./255),',
          explanation: 'La normalisation est intégrée au modèle : aucun risque d\'oubli en inférence.',
          affectedVisualComponent: 'pipeline-summary'
        },
        {
          lineNumber: 9,
          code: '        layers.Conv2D(32, 3, activation=\'relu\'),',
          explanation: 'Première couche convolutive apprenant 32 filtres 3x3 sur l\'image normalisée.',
          affectedVisualComponent: 'pipeline-conv'
        }
      ],
      expectedOutput: `Model: "sequential"
_________________________________________________________________
 Layer (type)                Output Shape              Param #   
=================================================================
 rescaling (Rescaling)       (None, 224, 224, 3)       0         
 conv2d (Conv2D)             (None, 222, 222, 32)      896       
...
Total params: 1,061 (4.14 KB)`,
      whyUseful: 'Ce canevas constitue la structure standard de tout projet de vision par ordinateur avec Keras moderne.',
      commonPitfall: 'Oublier d\'ajouter la couche Rescaling ou ne pas synchroniser les dimensions entre le dataset et la couche Input.'
    }
  }
];
