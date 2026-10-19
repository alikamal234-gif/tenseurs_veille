import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Maximize2,
  Minimize2,
  Code2,
  Copy,
  Check,
  Sparkles,
} from 'lucide-react';
import { Keyword } from '../common/Keyword';
import { DefinitionPopup } from '../common/DefinitionPopup';

// Real Scenes
import { RealScene1Pixels } from './RealScene1Pixels';
import { RealScene2Hierarchy } from './RealScene2Hierarchy';
import { RealSceneShapeDtype } from './RealSceneShapeDtype';
import { RealScene3RgbChannels } from './RealScene3RgbChannels';
import { RealScene4Slicing } from './RealScene4Slicing';
import { RealScene5Resize } from './RealScene5Resize';
import { RealScene9Batching } from './RealScene9Batching';
import { RealScene6Normalization } from './RealScene6Normalization';
import { RealScenePreprocessing } from './RealScenePreprocessing';
import { RealScene7Convolution } from './RealScene7Convolution';
import { RealScene8Classification } from './RealScene8Classification';
import { RealSceneLivrables } from './RealSceneLivrables';

export interface VideoChapter {
  id: number;
  title: string;
  shortTitle: string;
  duration: string;
  subtitles: React.ReactNode;
  pythonSnippet: string;
}

export const VideoPlayer: React.FC = () => {
  const [currentChapterIdx, setCurrentChapterIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [selectedKeywordId, setSelectedKeywordId] = useState<string | null>(null);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [showCodeDrawer, setShowCodeDrawer] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // 12 Slides aligned 100% with the official Veille Presentation Plan
  const chapters: VideoChapter[] = [
    {
      id: 1,
      title: "1. Pourquoi les Tenseurs ? Définition & Rôle dans le Deep Learning",
      shortTitle: "1. Pourquoi Tenseurs ?",
      duration: "02:15",
      subtitles: (
        <span>
          Un{' '}
          <Keyword id="tenseur" onSelect={(id) => setSelectedKeywordId(id)}>
            tenseur
          </Keyword>{' '}
          est la structure de données universelle du Deep Learning : un tableau multidimensionnel de nombres. Dans TensorFlow, il alimente les processeurs graphiques (GPU) et permet d'exécuter en parallèle des millions d'opérations matricielles vectorisées (GEMM) sur des grilles de{' '}
          <Keyword id="pixel" onSelect={(id) => setSelectedKeywordId(id)}>
            pixels
          </Keyword>
          .
        </span>
      ),
      pythonSnippet: `# 1. Définition d'un tenseur dans TensorFlow et vérification GPU
import tensorflow as tf

tenseur = tf.constant([[[1.0, 2.0], [3.0, 4.0]]])
print("Shape du tenseur :", tenseur.shape) # (1, 2, 2)
print("Type des données :", tenseur.dtype) # <dtype: 'float32'>
print("Périphériques GPU :", tf.config.list_physical_devices('GPU'))`,
    },
    {
      id: 2,
      title: "2. Différence entre Scalaire, Vecteur, Matrice et Tenseur",
      shortTitle: "2. Scalaire vs Tenseur",
      duration: "04:30",
      subtitles: (
        <span>
          La hiérarchie repose sur le{' '}
          <Keyword id="rang" onSelect={(id) => setSelectedKeywordId(id)}>
            rang (ndim)
          </Keyword>{' '}
          : un{' '}
          <Keyword id="scalaire" onSelect={(id) => setSelectedKeywordId(id)}>
            scalaire (0D)
          </Keyword>{' '}
          est une valeur unique (loss), un{' '}
          <Keyword id="vecteur" onSelect={(id) => setSelectedKeywordId(id)}>
            vecteur (1D)
          </Keyword>{' '}
          est une direction (labels), une{' '}
          <Keyword id="matrice" onSelect={(id) => setSelectedKeywordId(id)}>
            matrice (2D)
          </Keyword>{' '}
          est un tableau plan (poids W), et les tenseurs 3D/4D manipulent les images et les{' '}
          <Keyword id="batch" onSelect={(id) => setSelectedKeywordId(id)}>
            lots d'entraînement
          </Keyword>
          .
        </span>
      ),
      pythonSnippet: `# Hiérarchie des dimensions dans TensorFlow
scalar = tf.constant(0.042)             # 0D : () - ex: valeur de perte (loss)
vector = tf.constant([0, 1, 2])         # 1D : (3,) - ex: étiquettes de classes
matrix = tf.zeros([128, 64])            # 2D : (128, 64) - ex: matrice de poids synaptiques W
image  = tf.zeros([224, 224, 3])        # 3D : (224, 224, 3) - ex: image couleur RGB
batch  = tf.zeros([32, 224, 224, 3])    # 4D : (32, 224, 224, 3) - ex: lot complet`,
    },
    {
      id: 3,
      title: "3. Concepts Fondamentaux : Shape, Rank et Dtype",
      shortTitle: "3. Shape, Rank & Dtype",
      duration: "06:45",
      subtitles: (
        <span>
          Les 3 piliers : la{' '}
          <Keyword id="forme" onSelect={(id) => setSelectedKeywordId(id)}>
            forme (shape)
          </Keyword>{' '}
          décrit la géométrie des axes, le{' '}
          <Keyword id="rang" onSelect={(id) => setSelectedKeywordId(id)}>
            rang
          </Keyword>{' '}
          compte le nombre d'axes, et le type{' '}
          <Keyword id="dtype" onSelect={(id) => setSelectedKeywordId(id)}>
            dtype
          </Keyword>{' '}
          régit la mémoire. Les images sur disque en{' '}
          <Keyword id="uint8" onSelect={(id) => setSelectedKeywordId(id)}>
            uint8
          </Keyword>{' '}
          (1 octet) doivent obligatoirement être converties en{' '}
          <Keyword id="float32" onSelect={(id) => setSelectedKeywordId(id)}>
            float32
          </Keyword>{' '}
          (4 octets) pour calculer les gradients.
        </span>
      ),
      pythonSnippet: `# Shape, Rank et conversion de type (Cast)
raw_bytes = tf.io.read_file("chat.jpg")
image = tf.io.decode_jpeg(raw_bytes, channels=3)

print("Forme (shape) :", image.shape) # (512, 512, 3)
print("Rang (ndim)    :", image.ndim)  # 3 dimensions
print("Type (dtype)   :", image.dtype) # <dtype: 'uint8'> (0 à 255)

# Cast essentiel pour la différentiation automatique sur GPU
image_float = tf.cast(image, tf.float32)`,
    },
    {
      id: 4,
      title: "4. Dimensions d'une Image : Niveaux de Gris vs RGB (Hauteur, Largeur, Canaux)",
      shortTitle: "4. Gris vs RGB (HWC)",
      duration: "09:00",
      subtitles: (
        <span>
          Une image monochrome ne possède qu'un canal{' '}
          <Keyword id="canaux" onSelect={(id) => setSelectedKeywordId(id)}>
            [Hauteur, Largeur, 1]
          </Keyword>
          , alors qu'une photo couleur superpose 3 plans{' '}
          <Keyword id="rgb" onSelect={(id) => setSelectedKeywordId(id)}>
            RGB [Hauteur, Largeur, 3]
          </Keyword>{' '}
          : Rouge, Vert et Bleu. TensorFlow utilise par défaut la convention{' '}
          <Keyword id="nhwc" onSelect={(id) => setSelectedKeywordId(id)}>
            NHWC (Channels Last)
          </Keyword>
          .
        </span>
      ),
      pythonSnippet: `# Décomposition des canaux RGB sur le dernier axe (convention NHWC)
canal_rouge = image[:, :, 0] # Plumes rouges et tons chauds
canal_vert  = image[:, :, 1] # Végétation et feuillages
canal_bleu  = image[:, :, 2] # Ciel et reflets bleutés

print("Shape d'un canal extrait :", canal_rouge.shape) # (512, 512)`,
    },
    {
      id: 5,
      title: "5. Indexation et Manipulation des Tenseurs : Découpage (Slicing)",
      shortTitle: "5. Indexation & Slicing",
      duration: "11:15",
      subtitles: (
        <span>
          Le{' '}
          <Keyword id="slicing" onSelect={(id) => setSelectedKeywordId(id)}>
            slicing [y1:y2, x1:x2, :]
          </Keyword>{' '}
          permet d'extraire une région d'intérêt rectangulaire (bounding box) ou un pixel individuel [y, x, c]. Dans TensorFlow, ce découpage se fait par vue mémoire (strided slice) sans aucune copie superflue en mémoire vive.
        </span>
      ),
      pythonSnippet: `# Slicing d'une région d'intérêt (visage du chat) sans copie mémoire
visage_chat = image[200:330, 125:375, :]
print("Shape de la région découpée :", visage_chat.shape) # (130, 250, 3)

# Lecture du pixel à la coordonnée (ligne 250, colonne 250, canal Rouge)
valeur_pixel_r = image[250, 250, 0].numpy()`,
    },
    {
      id: 6,
      title: "6. Chargement et Redimensionnement d'Images (tf.image.resize)",
      shortTitle: "6. Chargement & Resize",
      duration: "13:30",
      subtitles: (
        <span>
          Les réseaux convolutifs (CNN) imposent une résolution spatiale fixe (ex: 224×224). La fonction tf.image.resize harmonise les dimensions : l'interpolation bilinéaire moyenne les 4 voisins pour préserver les textures et éviter l'effet d'escalier du plus proche voisin.
        </span>
      ),
      pythonSnippet: `# 1. Chargement et décodage du fichier binaire
raw = tf.io.read_file("chat.jpg")
img = tf.io.decode_jpeg(raw, channels=3)

# 2. Redimensionnement avec interpolation bilinéaire vers 224x224
img_224 = tf.image.resize(
    img,
    size=[224, 224],
    method=tf.image.ResizeMethod.BILINEAR
)
print("Nouvelle résolution :", img_224.shape) # (224, 224, 3)`,
    },
    {
      id: 7,
      title: "7. Représentation d'un Batch d'Images & Utilisation de tf.data.Dataset",
      shortTitle: "7. Batches & tf.data",
      duration: "15:45",
      subtitles: (
        <span>
          L'entraînement s'effectue par{' '}
          <Keyword id="batch" onSelect={(id) => setSelectedKeywordId(id)}>
            lots (batches) 4D [N, H, W, C]
          </Keyword>
          . L'API tf.data.Dataset orchestre la parallélisation en chargeant le lot suivant en mémoire tampon (
          <Keyword id="prefetch" onSelect={(id) => setSelectedKeywordId(id)}>
            prefetch
          </Keyword>
          ) pendant que le GPU calcule le lot en cours, supprimant tout goulot d'étranglement.
        </span>
      ),
      pythonSnippet: `# Pipeline haute performance avec tf.data.Dataset
dataset = tf.data.Dataset.from_tensor_slices(image_paths)
dataset = dataset.map(load_and_preprocess, num_parallel_calls=tf.data.AUTOTUNE)
dataset = dataset.cache()
dataset = dataset.shuffle(buffer_size=1000)
dataset = dataset.batch(32) # Tenseur 4D : (32, 224, 224, 3)
dataset = dataset.prefetch(buffer_size=tf.data.AUTOTUNE) # Optimisation GPU`,
    },
    {
      id: 8,
      title: "8. Prétraitement : Normalisation des Pixels ([0, 255] → [0.0, 1.0])",
      shortTitle: "8. Normalisation",
      duration: "18:00",
      subtitles: (
        <span>
          La{' '}
          <Keyword id="normalisation" onSelect={(id) => setSelectedKeywordId(id)}>
            normalisation
          </Keyword>{' '}
          divise les pixels bruts par 255.0 pour les convertir en{' '}
          <Keyword id="float32" onSelect={(id) => setSelectedKeywordId(id)}>
            float32
          </Keyword>{' '}
          dans [0.0, 1.0]. Cela empêche la saturation précoce des fonctions d'activation (ReLU, Sigmoïde) et évite l'explosion des gradients (NaN Loss).
        </span>
      ),
      pythonSnippet: `# Normalisation élémentaire : division par 255.0
img_normalisee = tf.cast(img_uint8, tf.float32) / 255.0

# Ou via la couche Keras Rescaling intégrée directement au modèle
rescaling_layer = tf.keras.layers.Rescaling(scale=1./255)
img_normalisee = rescaling_layer(img_uint8)
print(f"Plage des valeurs : [{tf.reduce_min(img_normalisee)}, {tf.reduce_max(img_normalisee)}]")`,
    },
    {
      id: 9,
      title: "9. Normalisation vs Prétraitement Spécifique (preprocess_input) & Cohérence",
      shortTitle: "9. preprocess_input",
      duration: "20:15",
      subtitles: (
        <span>
          Les architectures pré-entraînées exigent leur propre{' '}
          <Keyword id="preprocess_input" onSelect={(id) => setSelectedKeywordId(id)}>
            preprocess_input
          </Keyword>{' '}
          : ResNet permute en BGR et soustrait la moyenne ImageNet, tandis que MobileNet normalise dans [-1, 1]. Une incohérence entre entraînement et prédiction détruit complètement la précision !
        </span>
      ),
      pythonSnippet: `from tensorflow.keras.applications.resnet50 import preprocess_input as resnet_prep
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input as mobilenet_prep

# ResNet50 (Mode Caffe : inversion en BGR et soustraction moyenne ImageNet)
x_resnet = resnet_prep(tf.identity(img_rgb))

# MobileNetV2 (Mode TF : mise à l'échelle continue dans [-1, 1])
x_mobilenet = mobilenet_prep(tf.identity(img_rgb))`,
    },
    {
      id: 10,
      title: "10. Préparation des Images pour un CNN & Correspondance input_shape",
      shortTitle: "10. Entrée CNN 4D",
      duration: "22:30",
      subtitles: (
        <span>
          La couche{' '}
          <Keyword id="convolution" onSelect={(id) => setSelectedKeywordId(id)}>
            Conv2D
          </Keyword>{' '}
          extrait les contours et textures via des filtres 3×3. Keras attend obligatoirement une forme 4D{' '}
          <Keyword id="batch" onSelect={(id) => setSelectedKeywordId(id)}>
            [Batch, H, W, C]
          </Keyword>{' '}
          : pour une seule image, on ajoute l'axe de lot avec{' '}
          <Keyword id="expand_dims" onSelect={(id) => setSelectedKeywordId(id)}>
            tf.expand_dims(img, axis=0)
          </Keyword>
          .
        </span>
      ),
      pythonSnippet: `# Définition d'un CNN avec input_shape
model = tf.keras.Sequential([
    tf.keras.layers.Input(shape=(224, 224, 3)),
    tf.keras.layers.Conv2D(32, kernel_size=(3, 3), activation='relu')
])

# Ajout obligatoire de la dimension de lot pour 1 photo isolée
image_4d = tf.expand_dims(img_224, axis=0) # (1, 224, 224, 3)
feature_map = model(image_4d) # Forme : (1, 222, 222, 32)`,
    },
    {
      id: 11,
      title: "11. Inférence Softmax, Correspondance des Formes & Erreurs Courantes",
      shortTitle: "11. Softmax & Débogage",
      duration: "25:00",
      subtitles: (
        <span>
          La couche{' '}
          <Keyword id="softmax" onSelect={(id) => setSelectedKeywordId(id)}>
            Softmax
          </Keyword>{' '}
          finale produit les probabilités de classes. Les erreurs classiques à éviter : dimension de lot manquante (ValueError: expected 4D), type uint8 au lieu de float32, omission du canal monochrome [H, W], et inversion NCHW / NHWC.
        </span>
      ),
      pythonSnippet: `# Débogage et inférence Softmax
assert len(image_4d.shape) == 4, "Erreur: Batch 4D attendu !"
assert image_4d.dtype == tf.float32, "Erreur: Dtype doit être float32 !"

output_probs = tf.keras.layers.Dense(1000, activation='softmax')(features)
predicted_class = tf.argmax(output_probs, axis=-1).numpy()[0]
print("Classe prédite :", predicted_class) # 281: tabby_cat (98.4%)`,
    },
    {
      id: 12,
      title: "12. Livrables Attendus & Consignes de Soutenance (25-30 min + 2-3 min Q&A)",
      shortTitle: "12. Livrables & Soutenance",
      duration: "28:00",
      subtitles: (
        <span>
          Synthèse des 3 livrables : Schéma interactif des dimensions d'une image et d'un batch 4D, Tableau comparatif hiérarchique, et Script Python commenté. Structurez votre soutenance en 28 minutes réparties sur les 5 parties avec 2 à 3 minutes réservées aux questions du jury.
        </span>
      ),
      pythonSnippet: `# ==============================================================================
# PIPELINE COMPLET DE RÉFÉRENCE - TENSORFLOW / KERAS
# ==============================================================================
raw = tf.io.read_file("chat.jpg")
img = tf.io.decode_jpeg(raw, channels=3)
img_224 = tf.image.resize(img, [224, 224])
img_norm = tf.cast(img_224, tf.float32) / 255.0
batch_4d = tf.expand_dims(img_norm, axis=0) # Forme: (1, 224, 224, 3)
predictions = model.predict(batch_4d)`,
    },
  ];

  const currentChapter = chapters[currentChapterIdx];

  // Auto-play timer
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentChapterIdx((prev) => (prev + 1) % chapters.length);
    }, 8000 / playbackSpeed);
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, chapters.length]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentChapter.pythonSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const renderActiveScene = () => {
    switch (currentChapter.id) {
      case 1:
        return <RealScene1Pixels onSelectKeyword={setSelectedKeywordId} isPlaying={isPlaying} />;
      case 2:
        return <RealScene2Hierarchy onSelectKeyword={setSelectedKeywordId} isPlaying={isPlaying} />;
      case 3:
        return <RealSceneShapeDtype onSelectKeyword={setSelectedKeywordId} isPlaying={isPlaying} />;
      case 4:
        return <RealScene3RgbChannels onSelectKeyword={setSelectedKeywordId} isPlaying={isPlaying} />;
      case 5:
        return <RealScene4Slicing onSelectKeyword={setSelectedKeywordId} isPlaying={isPlaying} />;
      case 6:
        return <RealScene5Resize onSelectKeyword={setSelectedKeywordId} isPlaying={isPlaying} />;
      case 7:
        return <RealScene9Batching onSelectKeyword={setSelectedKeywordId} isPlaying={isPlaying} />;
      case 8:
        return <RealScene6Normalization onSelectKeyword={setSelectedKeywordId} isPlaying={isPlaying} />;
      case 9:
        return <RealScenePreprocessing onSelectKeyword={setSelectedKeywordId} isPlaying={isPlaying} />;
      case 10:
        return <RealScene7Convolution onSelectKeyword={setSelectedKeywordId} isPlaying={isPlaying} />;
      case 11:
        return <RealScene8Classification onSelectKeyword={setSelectedKeywordId} isPlaying={isPlaying} />;
      case 12:
        return <RealSceneLivrables onSelectKeyword={setSelectedKeywordId} isPlaying={isPlaying} />;
      default:
        return <RealScene1Pixels onSelectKeyword={setSelectedKeywordId} isPlaying={isPlaying} />;
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-2 sm:px-4 py-3 flex flex-col items-center">
      {/* Video Player Card Frame (White Background, Clean Modern Aesthetic) */}
      <div
        className={`w-full bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xl flex flex-col transition-all duration-300 ${
          isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'relative min-h-[580px] sm:min-h-[620px]'
        }`}
      >
        {/* Top Header Bar of the Video Player */}
        <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between z-20 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse"></span>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700">
              TensorFlow Visual Lab
            </span>
            <span className="text-slate-300">•</span>
            <h2 className="text-xs sm:text-sm font-semibold text-slate-900 truncate max-w-xs sm:max-w-md">
              {currentChapter.title}
            </h2>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
            <span className="bg-white border border-slate-200 px-2.5 py-0.5 rounded text-[11px] font-bold text-emerald-800 shadow-2xs">
              Slide {currentChapter.id} / {chapters.length}
            </span>
          </div>
        </div>

        {/* In-Player Python Code Panel (Visible right in the player) */}
        {showCodeDrawer && (
          <div className="w-full px-4 sm:px-6 py-2.5 bg-slate-50 border-b border-slate-200 shadow-inner animate-fadeIn z-30 shrink-0">
            <div className="flex items-center justify-between text-xs font-mono pb-2 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 text-emerald-800 font-bold">
                  <Code2 className="w-4 h-4 text-emerald-600" />
                  <span>Code Python TensorFlow / Keras</span>
                </span>
                <span className="text-slate-300 hidden sm:inline">•</span>
                <span className="text-slate-500 text-[11px] hidden sm:inline">
                  Slide {currentChapter.id} : {currentChapter.title}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-800 rounded text-xs font-medium border border-slate-200 transition-colors shadow-2xs"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Copié !' : 'Copier'}</span>
                </button>
                <button
                  onClick={() => setShowCodeDrawer(false)}
                  className="w-6 h-6 rounded flex items-center justify-center hover:bg-slate-200 text-slate-500 hover:text-slate-800 text-xs font-bold transition-colors"
                  title="Fermer le code"
                >
                  ✕
                </button>
              </div>
            </div>
            <pre className="text-xs font-mono text-slate-800 overflow-x-auto p-3 mt-2 bg-white rounded-lg border border-slate-200 leading-relaxed max-h-36 sm:max-h-48 shadow-2xs">
              {currentChapter.pythonSnippet}
            </pre>
          </div>
        )}

        {/* The Main Interactive Visual Stage */}
        <div className="flex-1 w-full min-h-[380px] sm:min-h-[420px] relative overflow-hidden bg-white flex items-center justify-center">
          {renderActiveScene()}
        </div>

        {/* Subtitles Bar (White Background, Clear Text with Clickable Keywords) */}
        <div className="px-4 py-2.5 sm:py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-center text-center z-20 shrink-0">
          <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-sans max-w-3xl">
            {currentChapter.subtitles}
          </p>
        </div>

        {/* Player Controls & Scrubber Timeline */}
        <div className="px-4 py-2.5 bg-white border-t border-slate-200 flex flex-col gap-2 z-20 select-none shrink-0">
          {/* Segmented Timeline Scrub Bar */}
          <div className="w-full flex items-center gap-1.5 cursor-pointer">
            {chapters.map((ch, idx) => {
              const isPast = idx < currentChapterIdx;
              const isCurrent = idx === currentChapterIdx;
              return (
                <div
                  key={ch.id}
                  onClick={() => setCurrentChapterIdx(idx)}
                  className={`flex-1 h-2 rounded-full transition-all duration-200 relative group ${
                    isCurrent
                      ? 'bg-emerald-600 ring-2 ring-emerald-300'
                      : isPast
                      ? 'bg-emerald-300 hover:bg-emerald-400'
                      : 'bg-slate-200 hover:bg-slate-300'
                  }`}
                  title={ch.title}
                />
              );
            })}
          </div>

          {/* Controls Row */}
          <div className="flex items-center justify-between text-slate-700 text-xs">
            {/* Left Controls: Play/Pause, Skip, Timecode */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-8 h-8 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white flex items-center justify-center transition-all shadow-sm"
                title={isPlaying ? 'Pause' : 'Lecture automatique'}
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
              </button>

              <button
                onClick={() => setCurrentChapterIdx((prev) => Math.max(0, prev - 1))}
                disabled={currentChapterIdx === 0}
                className="p-1 hover:text-slate-900 disabled:opacity-30 transition-colors"
                title="Slide précédente"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                onClick={() => setCurrentChapterIdx((prev) => Math.min(chapters.length - 1, prev + 1))}
                disabled={currentChapterIdx === chapters.length - 1}
                className="p-1 hover:text-slate-900 disabled:opacity-30 transition-colors"
                title="Slide suivante"
              >
                <SkipForward className="w-4 h-4" />
              </button>

              <div className="font-mono text-slate-500 text-[11px] hidden sm:block">
                <span>{currentChapter.duration}</span> / <span>28:00 (Soutenance)</span>
              </div>
            </div>

            {/* Right Controls: Speed, Code drawer, Fullscreen */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPlaybackSpeed(playbackSpeed === 1 ? 1.5 : playbackSpeed === 1.5 ? 0.5 : 1)}
                className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-[11px] font-mono text-slate-700 font-medium"
              >
                {playbackSpeed}x
              </button>

              <button
                onClick={() => setShowCodeDrawer(!showCodeDrawer)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                  showCodeDrawer
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
                title="Afficher l'extrait de code Python"
              >
                <Code2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Code Python</span>
              </button>

              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-1.5 text-slate-500 hover:text-slate-900 transition-colors"
                title="Plein écran"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Chapters Quick Pills Bar (Below Video - Exact same shape) */}
      <div className="w-full mt-3 flex items-center justify-start sm:justify-center gap-1.5 overflow-x-auto sm:flex-wrap pb-1.5 select-none">
        {chapters.map((ch, idx) => (
          <button
            key={ch.id}
            onClick={() => setCurrentChapterIdx(idx)}
            className={`px-3 py-1.5 rounded-full text-xs font-mono whitespace-nowrap transition-all border ${
              idx === currentChapterIdx
                ? 'bg-emerald-700 text-white border-emerald-700 font-bold shadow-sm ring-2 ring-emerald-200'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50 hover:border-slate-400'
            }`}
          >
            {ch.shortTitle}
          </button>
        ))}
      </div>

      {/* Floating Definition Popup */}
      <DefinitionPopup
        keywordId={selectedKeywordId}
        onClose={() => setSelectedKeywordId(null)}
      />
    </div>
  );
};
