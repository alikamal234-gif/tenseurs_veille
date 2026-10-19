export interface KeywordDefinition {
  id: string;
  term: string;
  shortDef: string;
  mathNotation?: string;
  pythonExample?: string;
  category: 'Tenseur' | 'Image' | 'Modèle' | 'Optimisation';
}

export const KEYWORD_DEFINITIONS: Record<string, KeywordDefinition> = {
  pixel: {
    id: 'pixel',
    term: 'Pixel (Picture Element)',
    shortDef: 'Plus petite cellule d\'une image numérique. En niveaux de gris, sa valeur oscille entre 0 (noir) et 255 (blanc).',
    mathNotation: 'I(y, x) \\in \\{0, 1, \\dots, 255\\}',
    pythonExample: 'pixel_val = image[y, x].numpy()',
    category: 'Image',
  },
  tenseur: {
    id: 'tenseur',
    term: 'Tenseur (Tensor)',
    shortDef: 'Tableau multidimensionnel de nombres. Généralise le scalaire (0D), le vecteur (1D) et la matrice (2D) à N dimensions.',
    mathNotation: 'T \\in \\mathbb{R}^{d_1 \\times d_2 \\times \\dots \\times d_n}',
    pythonExample: 't = tf.constant([[1, 2], [3, 4]])',
    category: 'Tenseur',
  },
  rang: {
    id: 'rang',
    term: 'Rang (Rank / ndim)',
    shortDef: 'Nombre d\'axes ou de dimensions d\'un tenseur. Une image couleur a un rang de 3 (Hauteur, Largeur, Canaux).',
    mathNotation: '\\text{rank} = \\text{len}(\\text{shape})',
    pythonExample: 'tensor.ndim  # ou tf.rank(tensor)',
    category: 'Tenseur',
  },
  forme: {
    id: 'forme',
    term: 'Forme (Shape)',
    shortDef: 'Tuple décrivant le nombre d\'éléments sur chaque axe (ex: [28, 28, 1] pour une image MNIST).',
    mathNotation: '\\text{shape} = (d_0, d_1, \\dots, d_{k-1})',
    pythonExample: 'tensor.shape  # TensorShape([28, 28, 1])',
    category: 'Tenseur',
  },
  uint8: {
    id: 'uint8',
    term: 'uint8 (Entier non signé 8 bits)',
    shortDef: 'Format binaire stockant un entier entre 0 et 255 sur 1 octet. C\'est le format standard des fichiers images bruts (PNG, JPEG).',
    mathNotation: 'x \\in [0, 255] \\quad (1 \\text{ octet})',
    pythonExample: 'tf.cast(img, tf.uint8)',
    category: 'Tenseur',
  },
  float32: {
    id: 'float32',
    term: 'float32 (Flottant 32 bits)',
    shortDef: 'Nombres réels continus sur 4 octets. Indispensable pour calculer les gradients et entraîner les réseaux de neurones.',
    mathNotation: 'x \\in \\mathbb{R} \\quad (4 \\text{ octets})',
    pythonExample: 'tf.cast(img, tf.float32)',
    category: 'Tenseur',
  },
  canaux: {
    id: 'canaux',
    term: 'Canaux (Channels)',
    shortDef: 'Plans spectraux d\'une image : 1 canal pour le gris (Luminance), 3 canaux pour RGB (Rouge, Vert, Bleu).',
    mathNotation: 'C \\in \\{1, 3\\}',
    pythonExample: 'rouge = image[:, :, 0]',
    category: 'Image',
  },
  rgb: {
    id: 'rgb',
    term: 'RGB (Rouge, Vert, Bleu)',
    shortDef: 'Synthèse additive des trois composantes de couleur fondamentales constituant chaque pixel d\'une photo couleur.',
    mathNotation: '\\mathbf{p} = [R, V, B]^T',
    pythonExample: 'image_rgb = tf.io.decode_jpeg(raw, channels=3)',
    category: 'Image',
  },
  slicing: {
    id: 'slicing',
    term: 'Slicing (Découpage)',
    shortDef: 'Extraction d\'une sous-région d\'un tenseur par plages d\'indices [start:stop:step] sans duplication en mémoire.',
    mathNotation: 'T[y_1:y_2, x_1:x_2, :]',
    pythonExample: 'crop = image[5:20, 5:20, :]',
    category: 'Tenseur',
  },
  normalisation: {
    id: 'normalisation',
    term: 'Normalisation (Scaling)',
    shortDef: 'Division des pixels [0, 255] par 255.0 pour ramener les valeurs dans [0.0, 1.0]. Prévient la saturation des gradients.',
    mathNotation: 'x_{\\text{norm}} = \\frac{x}{255.0} \\in [0, 1]',
    pythonExample: 'tf.keras.layers.Rescaling(1./255)',
    category: 'Optimisation',
  },
  convolution: {
    id: 'convolution',
    term: 'Convolution 2D & Filtre',
    shortDef: 'Un petit filtre (ex: 3x3) glisse sur l\'image, multiplie les pixels locaux par ses poids et fait la somme pour détecter des motifs.',
    mathNotation: '(I * K)(i, j) = \\sum_m \\sum_n I(i-m, j-n) K(m, n) + b',
    pythonExample: 'layers.Conv2D(32, kernel_size=(3, 3))',
    category: 'Modèle',
  },
  carte_caracteristiques: {
    id: 'carte_caracteristiques',
    term: 'Carte d\'activation (Feature Map)',
    shortDef: 'Image transformée produite par la convolution, révélant où le filtre a détecté des arêtes, coins ou textures clés.',
    mathNotation: 'F \\in \\mathbb{R}^{H_{out} \\times W_{out}}',
    pythonExample: 'features = conv_layer(input_tensor)',
    category: 'Modèle',
  },
  softmax: {
    id: 'softmax',
    term: 'Fonction Softmax',
    shortDef: 'Convertit les scores finaux du réseau en probabilités sommant à 1. La classe la plus probable (ex: chiffre 7) s\'illumine.',
    mathNotation: 'P(y=k) = \\frac{e^{z_k}}{\\sum_j e^{z_j}}',
    pythonExample: 'layers.Dense(10, activation="softmax")',
    category: 'Modèle',
  },
  batch: {
    id: 'batch',
    term: 'Lot (Batch / Mini-batch)',
    shortDef: 'Regroupement de plusieurs images traitées en parallèle sur GPU selon l\'axe 0 : forme NHWC (Batch, Hauteur, Largeur, Canaux).',
    mathNotation: '(N, H, W, C) \\quad N \\in \\{16, 32, 64\\}',
    pythonExample: 'dataset = dataset.batch(32)',
    category: 'Tenseur',
  },
  expand_dims: {
    id: 'expand_dims',
    term: 'tf.expand_dims',
    shortDef: 'Ajoute une dimension de batch (axe 0) pour transformer une image 3D (H, W, C) en lot unitaire 4D (1, H, W, C) accepté par model.predict().',
    mathNotation: '(H, W, C) \\to (1, H, W, C)',
    pythonExample: 'img_batch = tf.expand_dims(img, axis=0)',
    category: 'Tenseur',
  },
  tf_data: {
    id: 'tf_data',
    term: 'tf.data.Dataset',
    shortDef: 'API haute performance pour construire des flux de données avec chargement, batching et prefetching asynchrone GPU.',
    mathNotation: '\\text{CPU (map)} \\xrightarrow{\\text{prefetch}} \\text{GPU (calcul)}',
    pythonExample: 'dataset.batch(32).prefetch(tf.data.AUTOTUNE)',
    category: 'Optimisation',
  },
};
