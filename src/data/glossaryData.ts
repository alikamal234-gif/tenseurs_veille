import { GlossaryTerm } from '../types/presentation';

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    id: 'tenseur',
    term: 'Tenseur (Tensor)',
    shortDefinition: 'Conteneur multidimensionnel de données numériques typées.',
    fullDefinition: 'Un tenseur est la structure de données fondamentale de TensorFlow. Il généralise les notions de scalaire (0D), vecteur (1D) et matrice (2D) à un nombre arbitraire de dimensions (nD). Tous les éléments d\'un tenseur partagent le même type de données (dtype) et la même forme immuable.',
    category: 'Tensor',
    mathNotation: 'T \\in \\mathbb{R}^{d_1 \\times d_2 \\times \\dots \\times d_n}',
    pythonExample: 't = tf.constant([[1, 2], [3, 4]], dtype=tf.float32)'
  },
  {
    id: 'rang',
    term: 'Rang (Rank / ndim)',
    shortDefinition: 'Nombre d\'axes ou dimensions d\'un tenseur.',
    fullDefinition: 'Le rang (ou ndim) correspond au nombre d\'indices nécessaires pour localiser un scalaire précis dans le tenseur. À ne pas confondre avec le rang d\'une matrice en algèbre linéaire (dimension de l\'image vectorielle). Exemple : une image couleur a un rang de 3 (Hauteur, Largeur, Canaux).',
    category: 'Tensor',
    mathNotation: '\\text{rank}(T) = \\dim(\\text{shape}(T))',
    pythonExample: 'print(t.ndim)  # ou tf.rank(t)'
  },
  {
    id: 'forme',
    term: 'Forme (Shape)',
    shortDefinition: 'Tuple décrivant le nombre d\'éléments le long de chaque axe.',
    fullDefinition: 'La shape décrit la géométrie spatiale du tenseur. Par exemple, une forme (32, 224, 224, 3) indique un lot de 32 images couleur, de 224 pixels de hauteur, 224 pixels de largeur et 3 canaux (R, V, B).',
    category: 'Tensor',
    mathNotation: '\\text{shape} = (d_0, d_1, \\dots, d_{k-1})',
    pythonExample: 'print(t.shape)  # Renvoie un TensorShape'
  },
  {
    id: 'dtype',
    term: 'Type de données (Dtype)',
    shortDefinition: 'Format binaire encodant chaque élément numérique du tenseur.',
    fullDefinition: 'Définit la précision et la taille en mémoire de chaque valeur. Par exemple, `tf.uint8` (entiers non signés de 0 à 255, 1 octet par pixel) est typique des images brutes sur disque, tandis que `tf.float32` (flottants 32 bits, 4 octets) est le standard impératif pour le calcul des gradients en Deep Learning.',
    category: 'Tensor',
    mathNotation: '\\text{dtype} \\in \\{\\text{uint8}, \\text{float32}, \\text{int32}, \\dots\\}',
    pythonExample: 'tf.cast(img_uint8, tf.float32)'
  },
  {
    id: 'canaux',
    term: 'Canaux (Channels)',
    shortDefinition: 'Plans de composantes spectrales ou d\'intensité d\'une image.',
    fullDefinition: 'Une image en niveaux de gris possède 1 seul canal d\'intensité lumineuse. Une image couleur possède généralement 3 canaux (Rouge, Vert, Bleu). Dans les couches intermédiaires d\'un réseau de neurones convolutif (CNN), les canaux représentent les cartes d\'activation (feature maps) détectant des motifs variés.',
    category: 'Image',
    mathNotation: 'C \\in \\{1, 3, \\dots, N_f\\}',
    pythonExample: 'r_channel = image[:, :, 0]'
  },
  {
    id: 'nhwc',
    term: 'Format NHWC vs NCHW',
    shortDefinition: 'Ordre de disposition des axes d\'un lot d\'images.',
    fullDefinition: 'NHWC (Batch, Height, Width, Channels) place les canaux en dernier (convention par défaut de TensorFlow/Keras sur CPU/GPU). NCHW (Batch, Channels, Height, Width) place les canaux en second (convention historique de PyTorch et optimisée pour certaines architectures GPU). Inverser ces conventions produit des erreurs de dimensions fatales.',
    category: 'Image',
    mathNotation: '(N, H, W, C) \\text{ vs } (N, C, H, W)',
    pythonExample: 'tf.keras.layers.Conv2D(32, 3, data_format="channels_last")'
  },
  {
    id: 'batch',
    term: 'Lot (Batch)',
    shortDefinition: 'Groupe d\'échantillons traités simultanément par le modèle.',
    fullDefinition: 'Les GPU et TPU sont massivement parallélisés. Traiter les images par lots (mini-batches, typiquement 16, 32 ou 64) permet d\'exploiter les cœurs de calcul matriciel à pleine puissance et d\'estimer de manière plus stable le gradient de la fonction de perte (Descente de Gradient Stochastique par mini-lots).',
    category: 'Pipeline',
    mathNotation: 'N \\text{ ou } B \\text{ (dimension } 0)',
    pythonExample: 'dataset = dataset.batch(32)'
  },
  {
    id: 'slicing',
    term: 'Découpage (Slicing)',
    shortDefinition: 'Extraction d\'un sous-ensemble d\'un tenseur selon des plages d\'indices.',
    fullDefinition: 'Opération utilisant la notation `start:stop:step` le long de chaque dimension pour rogner une région d\'intérêt (ROI), échantillonner un pixel sur deux, ou isoler un canal de couleur sans copier inutilement la mémoire.',
    category: 'Tensor',
    mathNotation: 'T[y_1:y_2, x_1:x_2, c]',
    pythonExample: 'crop = image[50:150, 100:200, :]'
  },
  {
    id: 'interpolation',
    term: 'Interpolation (Redimensionnement)',
    shortDefinition: 'Algorithme mathématique d\'estimation des pixels lors d\'un changement d\'échelle.',
    fullDefinition: 'Les CNN nécessitent une taille d\'entrée fixe (ex: 224x224). L\'interpolation au plus proche voisin (Nearest Neighbor) duplique les pixels les plus proches, créant un effet crénelé. L\'interpolation bilinéaire (Bilinear) calcule une moyenne pondérée des 4 pixels voisins les plus proches, produisant un rendu lisse et continu.',
    category: 'Image',
    mathNotation: 'f(x, y) \\approx a x y + b x + c y + d',
    pythonExample: 'tf.image.resize(images, [224, 224], method="bilinear")'
  },
  {
    id: 'normalisation',
    term: 'Normalisation (Scaling)',
    shortDefinition: 'Mise à l\'échelle des pixels dans un intervalle numérique standardisé.',
    fullDefinition: 'Les images brutes ont des valeurs entières entre 0 et 255. Sans normalisation, des valeurs d\'entrée aussi élevées provoquent une saturation des fonctions d\'activation (ex: sigmoid, tanh) ou des gradients gigantesques qui déstabilisent l\'apprentissage. On divise généralement par 255.0 pour obtenir des valeurs dans [0, 1].',
    category: 'Optimization',
    mathNotation: 'x_{\\text{norm}} = \\frac{x}{255.0} \\in [0, 1]',
    pythonExample: 'tf.keras.layers.Rescaling(1./255)'
  },
  {
    id: 'preprocess_input',
    term: 'preprocess_input',
    shortDefinition: 'Fonction de prétraitement dédiée propre à chaque architecture pré-entraînée.',
    fullDefinition: 'Chaque modèle entraîné sur ImageNet (ResNet, VGG, MobileNet, EfficientNet) a été entraîné avec un protocole de normalisation spécifique. ResNet50 soustrait les moyennes ImageNet et permute en BGR. MobileNet normalise entre -1 et 1. Appliquer une mauvaise normalisation dégrade dramatiquement la précision en inférence.',
    category: 'Keras/Model',
    mathNotation: 'x_{\\text{out}} = f_{\\text{model}}(x_{\\text{in}})',
    pythonExample: 'from tensorflow.keras.applications.resnet50 import preprocess_input'
  },
  {
    id: 'tf_expand_dims',
    term: 'tf.expand_dims',
    shortDefinition: 'Ajout d\'une dimension d\'axe 1 pour créer un lot unitaire.',
    fullDefinition: 'Une image unique chargée en mémoire a une forme 3D (H, W, C). Les méthodes `model.predict()` et `model(x)` attendent strictement un tenseur 4D (1, H, W, C). `tf.expand_dims(img, axis=0)` insère la dimension de batch indispensable.',
    category: 'Tensor',
    mathNotation: '(H, W, C) \\xrightarrow{\\text{axis}=0} (1, H, W, C)',
    pythonExample: 'img_batch = tf.expand_dims(img, axis=0)'
  },
  {
    id: 'tf_data',
    term: 'tf.data.Dataset',
    shortDefinition: 'API TensorFlow haute performance pour construire des pipelines de données.',
    fullDefinition: 'Permet de chaîner des transformations (chargement, décodage, redimensionnement, augmentation, normalisation, mélange, mise en lot) de façon asynchrone et multi-threadée, avec mise en mémoire tampon (`prefetch`) pour éliminer les temps morts du GPU.',
    category: 'Pipeline',
    mathNotation: '\\text{Disk} \\xrightarrow{\\text{IO}} \\text{CPU Pipeline} \\xrightarrow{\\text{prefetch}} \\text{GPU}',
    pythonExample: 'dataset.map(preprocess_fn).batch(32).prefetch(tf.data.AUTOTUNE)'
  },
  {
    id: 'conv2d',
    term: 'Couche Conv2D',
    shortDefinition: 'Couche de convolution 2D pour extraire des caractéristiques visuelles.',
    fullDefinition: 'La première couche convolutive d\'un réseau définit le paramètre `input_shape=(H, W, C)`. Elle applique des filtres (noyaux de convolution) qui glissent sur la hauteur et la largeur pour calculer des produits scalaires et détecter des bordures, textures et formes.',
    category: 'Keras/Model',
    mathNotation: '(I * K)(i, j) = \\sum_m \\sum_n I(i-m, j-n) K(m, n)',
    pythonExample: 'tf.keras.layers.Conv2D(32, kernel_size=(3, 3), input_shape=(224, 224, 3))'
  }
];
