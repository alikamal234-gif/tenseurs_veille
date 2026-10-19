import { QuizQuestion } from '../types/presentation';

export const FINAL_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "Dans TensorFlow, qu'indique précisément le rang (rank ou ndim) d'un tenseur ?",
    options: [
      "Le nombre total de valeurs numériques stockées dans le tenseur",
      "Le nombre d'axes ou de dimensions du tenseur",
      "La dimension maximale parmi tous les axes",
      "Le type de données (par exemple float32 ou uint8)"
    ],
    correctIndex: 1,
    explanation: "Le rang (rank ou ndim) d'un tenseur correspond au nombre de dimensions (axes). Par exemple, une matrice a un rang de 2, et un lot d'images couleur a un rang de 4.",
    category: "Fondements",
    difficulty: "Débutant"
  },
  {
    id: 2,
    question: "Combien d'éléments au total contient un tenseur de forme (16, 128, 128, 3) ?",
    options: [
      "786 432 éléments",
      "262 144 éléments",
      "16 384 éléments",
      "2 359 296 éléments"
    ],
    correctIndex: 0,
    explanation: "Le nombre total d'éléments est le produit des dimensions : 16 * 128 * 128 * 3 = 786 432 valeurs.",
    category: "Fondements",
    difficulty: "Débutant"
  },
  {
    id: 3,
    question: "Pourquoi convertit-on les images de uint8 vers float32 avant de les injecter dans un modèle ?",
    options: [
      "Parce que uint8 occupe trop de mémoire vive",
      "Parce que les opérations de gradient et de rétropropagation exigent des nombres réels continus",
      "Parce que TensorFlow ne sait pas afficher les images en uint8",
      "Pour inverser automatiquement les canaux de couleur"
    ],
    correctIndex: 1,
    explanation: "Les gradients de rétropropagation et les optimiseurs (Adam, SGD) calculent des dérivées infinitésimales continues nécessitant des nombres flottants (float32 ou float16).",
    category: "Types & Mémoire",
    difficulty: "Intermédiaire"
  },
  {
    id: 4,
    question: "Dans la convention par défaut de TensorFlow (channels_last / NHWC), quel axe correspond à la Largeur (Width) d'une image couleur isolée de forme (H, W, C) ?",
    options: [
      "L'axe 0",
      "L'axe 1",
      "L'axe 2",
      "L'axe 3"
    ],
    correctIndex: 1,
    explanation: "Pour une image isolée 3D de forme (H, W, C) : l'axe 0 est la Hauteur (Height), l'axe 1 est la Largeur (Width), et l'axe 2 est les Canaux (Channels).",
    category: "Dimensions d'image",
    difficulty: "Débutant"
  },
  {
    id: 5,
    question: "Quelle instruction Python extrait uniquement le canal Bleu d'une image RGB de forme (200, 200, 3) ?",
    options: [
      "image[:, :, 0]",
      "image[:, :, 1]",
      "image[:, :, 2]",
      "image[2, :, :]"
    ],
    correctIndex: 2,
    explanation: "Dans le triplet RGB (Rouge, Vert, Bleu) indexé à 0 : l'indice 0 correspond au Rouge, l'indice 1 au Vert, et l'indice 2 au Bleu.",
    category: "Indexation & Slicing",
    difficulty: "Débutant"
  },
  {
    id: 6,
    question: "Pourquoi utilise-t-on l'interpolation bilinéaire plutôt que le plus proche voisin pour redimensionner des photos ?",
    options: [
      "Elle produit un lissage continu en moyennant les 4 voisins, évitant les effets d'escalier ou de crénelage",
      "Elle est 10 fois plus rapide",
      "Elle supprime automatiquement le bruit",
      "Elle convertit l'image en noir et blanc"
    ],
    correctIndex: 0,
    explanation: "L'interpolation bilinéaire calcule une moyenne pondérée continue des 4 pixels voisins les plus proches, préservant des dégradés naturels et lisses.",
    category: "Redimensionnement",
    difficulty: "Intermédiaire"
  },
  {
    id: 7,
    question: "Dans un pipeline tf.data.Dataset, à quoi sert l'appel final `.prefetch(tf.data.AUTOTUNE)` ?",
    options: [
      "À supprimer les images corrompues sur le disque",
      "À préparer le prochain lot sur CPU pendant que le GPU calcule le lot actuel, éliminant les temps morts",
      "À mélanger aléatoirement les données",
      "À doubler la taille du lot"
    ],
    correctIndex: 1,
    explanation: "Le prefetching crée une mémoire tampon asynchrone qui pré-charge le lot suivant en arrière-plan pendant que le GPU effectue la propagation avant/arrière.",
    category: "Pipelines tf.data",
    difficulty: "Intermédiaire"
  },
  {
    id: 8,
    question: "Quelle transformation applique la couche `tf.keras.layers.Rescaling(1./127.5, offset=-1.0)` à un pixel noir (valeur 0) ?",
    options: [
      "0.0",
      "+1.0",
      "-1.0",
      "-127.5"
    ],
    correctIndex: 2,
    explanation: "Formule : (valeur * 1/127.5) - 1.0. Pour valeur = 0 : (0 / 127.5) - 1.0 = -1.0.",
    category: "Normalisation",
    difficulty: "Intermédiaire"
  },
  {
    id: 9,
    question: "Pourquoi est-il risqué d'utiliser la division par 255.0 avant un modèle pré-entraîné ResNet50 ?",
    options: [
      "Parce que ResNet50 attend des images en niveaux de gris",
      "Parce que ResNet50 a été entraîné avec le mode Caffe (BGR, sans division par 255, avec soustraction de la moyenne ImageNet)",
      "Parce que Keras refusera de compiler le modèle",
      "Parce que la division par 255 transforme les pixels en entiers"
    ],
    correctIndex: 1,
    explanation: "ResNet50 utilise le mode 'caffe' historique : canaux en BGR, valeurs dans [-128, +128] centrées autour de 0 avec soustraction de moyennes [103.939, 116.779, 123.68]. Il faut utiliser preprocess_input !",
    category: "Prétraitements spécifiques",
    difficulty: "Avancé"
  },
  {
    id: 10,
    question: "Si vous disposez d'une seule image couleur `img` de forme (224, 224, 3) et que `model.predict(img)` échoue, quelle opération résout le problème ?",
    options: [
      "img = tf.reshape(img, [224, 224])",
      "img = tf.expand_dims(img, axis=0)",
      "img = tf.transpose(img)",
      "img = tf.repeat(img, 3)"
    ],
    correctIndex: 1,
    explanation: "Keras attend un lot 4D (None, H, W, C). Pour une seule image, `tf.expand_dims(img, axis=0)` crée la forme (1, 224, 224, 3).",
    category: "Entrée CNN",
    difficulty: "Intermédiaire"
  }
];
