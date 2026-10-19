import React, { useState, useEffect } from 'react';
import {
  Layers,
  Table as TableIcon,
  Code2,
  Clock,
  Copy,
  Check,
  Maximize2,
  Box,
  Eye,
  Sparkles,
  HelpCircle,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Info
} from 'lucide-react';
import { Badge } from '../common/Badge';

export const LivrablesView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'schema' | 'tableau' | 'code' | 'chrono'>('schema');
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [copiedTable, setCopiedTable] = useState<boolean>(false);

  // Interactive Schema State
  const [batchSize, setBatchSize] = useState<number>(16);
  const [imgH, setImgH] = useState<number>(224);
  const [imgW, setImgW] = useState<number>(224);
  const [channels, setChannels] = useState<1 | 3>(3);
  const [selectedFormat, setSelectedFormat] = useState<'nhwc' | 'nchw'>('nhwc');

  // Chronometer State (25-30 min + 2-3 min Q&A)
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning]);

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerPhase = () => {
    const mins = timerSeconds / 60;
    if (mins < 25) {
      return { label: 'Présentation principale (Parties 1 à 5)', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    } else if (mins <= 30) {
      return { label: 'Conclusion & Clôture de veille (Idéal 25-30 min)', color: 'text-amber-700 bg-amber-50 border-amber-200' };
    } else if (mins <= 33) {
      return { label: 'Session Questions / Réponses (2 à 3 min Q&A)', color: 'text-sky-700 bg-sky-50 border-sky-200' };
    } else {
      return { label: 'Temps dépassé (> 33 min)', color: 'text-rose-700 bg-rose-50 border-rose-200' };
    }
  };

  // Computations for Schema
  const totalElementsSingle = imgH * imgW * channels;
  const totalElementsBatch = batchSize * totalElementsSingle;
  const memBatchFloat32MB = ((totalElementsBatch * 4) / (1024 * 1024)).toFixed(2);
  const memBatchUint8MB = ((totalElementsBatch * 1) / (1024 * 1024)).toFixed(2);

  const pythonScript = `# ==============================================================================
# PIPELINE OFFICIEL DE CHARGEMENT ET PRÉTRAITEMENT D'IMAGES - TENSORFLOW / KERAS
# Veille Technologique : Structure des Tenseurs et Manipulation d'Images
# ==============================================================================

import tensorflow as tf
from tensorflow.keras import layers, models
from tensorflow.keras.applications.resnet50 import preprocess_input as resnet_preprocess

print(f"TensorFlow Version: {tf.__version__}")
print("Périphériques GPU détectés:", tf.config.list_physical_devices('GPU'))

# ------------------------------------------------------------------------------
# 1. CHARGEMENT ET DÉCODAGE D'UNE IMAGE BRUTE
# ------------------------------------------------------------------------------
def load_and_decode_image(filepath: str, channels: int = 3) -> tf.Tensor:
    """
    Lit le flux binaire brut depuis le stockage et le décompresse en un tenseur 3D.
    Renvoie: un tf.Tensor de forme (Hauteur, Largeur, Canaux) en type uint8 [0, 255].
    """
    # Étape 1a: Lecture des octets bruts (I/O non bloquant)
    raw_bytes = tf.io.read_file(filepath)
    
    # Étape 1b: Décodage selon le format compressé (JPEG / PNG / BMP)
    # channels=3 force l'expansion en 3 canaux RGB même si l'image est monochrome.
    image_tensor = tf.io.decode_image(raw_bytes, channels=channels, expand_animations=False)
    
    return image_tensor

# ------------------------------------------------------------------------------
# 2. REDIMENSIONNEMENT SPATIAL & NORMALISATION (CONVENTION [0.0, 1.0])
# ------------------------------------------------------------------------------
def preprocess_standard(image: tf.Tensor, target_size=(224, 224)) -> tf.Tensor:
    """
    Harmonise la résolution spatiale et ramène les pixels dans l'intervalle [0.0, 1.0].
    """
    # Étape 2a: Redimensionnement avec interpolation bilinéaire (préserve les textures)
    resized = tf.image.resize(
        image,
        size=target_size,
        method=tf.image.ResizeMethod.BILINEAR
    )
    
    # Étape 2b: Conversion de type explicite vers float32 (essentiel pour les gradients)
    # puis division par 255.0 pour éviter l'explosion des poids dans les neurones.
    normalized = tf.cast(resized, tf.float32) / 255.0
    
    return normalized

# ------------------------------------------------------------------------------
# 3. CRÉATION D'UN PIPELINE HAUTE PERFORMANCE AVEC tf.data.Dataset
# ------------------------------------------------------------------------------
def build_dataset_pipeline(image_paths, labels, batch_size=32, target_size=(224, 224)):
    """
    Construit un flux tf.data optimisé avec mise en mémoire tampon et préchargement asynchrone.
    """
    dataset = tf.data.Dataset.from_tensor_slices((image_paths, labels))
    
    def _parse_function(path, label):
        img = load_and_decode_image(path, channels=3)
        img = preprocess_standard(img, target_size=target_size)
        return img, label

    # Chaînage des optimisations
    dataset = dataset.map(_parse_function, num_parallel_calls=tf.data.AUTOTUNE)
    dataset = dataset.cache()                          # Conserve en RAM après le 1er passage
    dataset = dataset.shuffle(buffer_size=1000)        # Évite les biais d'ordonnancement
    dataset = dataset.batch(batch_size)                # Empilement en tenseurs 4D (B, H, W, C)
    dataset = dataset.prefetch(buffer_size=tf.data.AUTOTUNE) # Prépare le lot N+1 sur CPU pendant le calcul GPU du lot N
    
    return dataset

# ------------------------------------------------------------------------------
# 4. INFÉRENCE SUR UNE IMAGE UNIQUE : AJOUT DE L'AXE DE BATCH
# ------------------------------------------------------------------------------
def predict_single_image(model: tf.keras.Model, single_image_3d: tf.Tensor):
    """
    Les modèles Keras exigent obligatoirement un tenseur 4D de forme (Batch, H, W, C).
    On utilise tf.expand_dims pour créer un lot virtuel de 1 image.
    """
    # Vérification: (H, W, C) -> (1, H, W, C)
    if len(single_image_3d.shape) == 3:
        image_batch_4d = tf.expand_dims(single_image_3d, axis=0)
    else:
        image_batch_4d = single_image_3d

    # Inférence
    predictions = model.predict(image_batch_4d)
    return predictions

# ------------------------------------------------------------------------------
# 5. DÉMONSTRATION COMPLÈTE & VÉRIFICATION DU input_shape
# ------------------------------------------------------------------------------
if __name__ == "__main__":
    # Simulation d'un tenseur d'image brute chargée (512x512x3 uint8)
    simulated_raw = tf.random.uniform([512, 512, 3], minval=0, maxval=256, dtype=tf.int32)
    simulated_raw = tf.cast(simulated_raw, tf.uint8)
    
    print("\\n[1] Image Brute:")
    print("    Shape :", simulated_raw.shape)  # (512, 512, 3)
    print("    Dtype :", simulated_raw.dtype)  # uint8
    
    # Prétraitement standard
    processed_img = preprocess_standard(simulated_raw, target_size=(224, 224))
    print("\\n[2] Après Prétraitement:")
    print("    Shape :", processed_img.shape)  # (224, 224, 3)
    print("    Dtype :", processed_img.dtype)  # float32
    print(f"    Min/Max: [{tf.reduce_min(processed_img):.2f}, {tf.reduce_max(processed_img):.2f}]")
    
    # Passage en 4D pour le modèle
    batch_4d = tf.expand_dims(processed_img, axis=0)
    print("\\n[3] Tenseur 4D prêt pour CNN:")
    print("    Shape :", batch_4d.shape)        # (1, 224, 224, 3)
    
    # Création d'un CNN basique
    model = models.Sequential([
        layers.Input(shape=(224, 224, 3)),
        layers.Conv2D(32, (3, 3), activation='relu'),
        layers.GlobalAveragePooling2D(),
        layers.Dense(3, activation='softmax')
    ])
    
    preds = model(batch_4d)
    print("\\n[4] Inférence réussie !")
    print("    Shape Sortie:", preds.shape)    # (1, 3)
    print("    Probabilités :", preds.numpy())
`;

  const copyToClipboard = (text: string, type: 'code' | 'table') => {
    navigator.clipboard.writeText(text);
    if (type === 'code') {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } else {
      setCopiedTable(true);
      setTimeout(() => setCopiedTable(false), 2000);
    }
  };

  const markdownTable = `| Objet | Rang (ndim) | Forme (Shape) | Dimensions | Exemple Réel / Physique | Exemple en Deep Learning | Instanciation TensorFlow |
|---|---|---|---|---|---|---|
| **Scalaire** | 0 | \`()\` | 0D (point) | Température (24°C), Prix (50€) | Valeur de perte (\`loss\`), Taux d'apprentissage (\`lr=0.001\`) | \`tf.constant(0.001)\` |
| **Vecteur** | 1 | \`(N,)\` | 1D (ligne) | Vitesse 3D \`[vx, vy, vz]\`, Liste de notes | Étiquettes (\`labels\`), Biais synaptique (\`b\`), Embeddings | \`tf.constant([0, 2, 1])\` |
| **Matrice** | 2 | \`(M, N)\` | 2D (surface) | Feuille Excel, Échiquier 8x8 | Poids synaptiques (\`W\`), Image monochrome sans canal | \`tf.zeros([128, 64])\` |
| **Tenseur 3D** | 3 | \`(H, W, C)\` | 3D (volume) | Scanner médical 3D, Cube Rubik | Image couleur RGB isolée \`(224, 224, 3)\`, Séquence NLP | \`tf.zeros([224, 224, 3])\` |
| **Tenseur 4D** | 4 | \`(B, H, W, C)\` | 4D (hyper-volume) | Vidéo monochrome \`(T, H, W, 1)\` | Lot (Batch) d'images couleur envoyé aux cœurs GPU | \`tf.zeros([32, 224, 224, 3])\` |
`;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Title & Introduction Banner */}
      <div className="space-y-2 pb-4 border-b border-slate-200">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Badge variant="emerald" size="md">
            Livrables Officiels de la Veille
          </Badge>
          <span className="text-xs text-slate-500 font-medium">
            Conforme aux exigences d'évaluation (25-30 min + 2-3 min Q&A)
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Synthèse des Livrables &amp; Outils de Soutenance
        </h2>
        <p className="text-xs sm:text-sm text-slate-600">
          Retrouvez les trois livrables contractuels demandés par le plan de veille, ainsi que la fiche chronométrée pour réussir votre soutenance orale.
        </p>
      </div>

      {/* Tabs Selector */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100 rounded-xl border border-slate-200">
        <button
          onClick={() => setActiveTab('schema')}
          className={`flex-1 min-w-[200px] px-4 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'schema'
              ? 'bg-white text-emerald-800 shadow-sm border border-slate-200/80'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <Box className="w-4 h-4 text-emerald-600" />
          <span>Livrable 1 : Schéma Image &amp; Batch 4D</span>
        </button>

        <button
          onClick={() => setActiveTab('tableau')}
          className={`flex-1 min-w-[200px] px-4 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'tableau'
              ? 'bg-white text-emerald-800 shadow-sm border border-slate-200/80'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <TableIcon className="w-4 h-4 text-sky-600" />
          <span>Livrable 2 : Tableau Comparatif Tenseurs</span>
        </button>

        <button
          onClick={() => setActiveTab('code')}
          className={`flex-1 min-w-[200px] px-4 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'code'
              ? 'bg-white text-emerald-800 shadow-sm border border-slate-200/80'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <Code2 className="w-4 h-4 text-amber-600" />
          <span>Livrable 3 : Script Python Commenté</span>
        </button>

        <button
          onClick={() => setActiveTab('chrono')}
          className={`flex-1 min-w-[200px] px-4 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'chrono'
              ? 'bg-white text-emerald-800 shadow-sm border border-slate-200/80'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <Clock className="w-4 h-4 text-indigo-600" />
          <span>Guide d'Orateur &amp; Chrono (25-30 min)</span>
        </button>
      </div>

      {/* TAB 1: SCHÉMA DES DIMENSIONS D'UNE IMAGE ET D'UN BATCH */}
      {activeTab === 'schema' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Header Controls */}
          <div className="academic-card p-5 bg-white border-slate-200 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                  <Box className="w-4 h-4 text-emerald-700" />
                  <span>Modélisation Géométrique des Dimensions : Image vs Lot (Batch 4D)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Visualisez comment les axes spatiaux, les canaux et les lots s'ordonnent en mémoire vive GPU.
                </p>
              </div>

              {/* Format Convention Selector */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500 font-medium">Convention :</span>
                <button
                  onClick={() => setSelectedFormat('nhwc')}
                  className={`px-2.5 py-1 rounded font-mono font-semibold border transition-all ${
                    selectedFormat === 'nhwc'
                      ? 'bg-emerald-700 text-white border-emerald-700 shadow-2xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  NHWC (TensorFlow standard)
                </button>
                <button
                  onClick={() => setSelectedFormat('nchw')}
                  className={`px-2.5 py-1 rounded font-mono font-semibold border transition-all ${
                    selectedFormat === 'nchw'
                      ? 'bg-emerald-700 text-white border-emerald-700 shadow-2xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  NCHW (PyTorch / GPU cuDNN)
                </button>
              </div>
            </div>

            {/* Presets and Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-3.5 rounded-lg border border-slate-200">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Taille de lot (Batch B) : <strong className="text-emerald-800">{batchSize}</strong>
                </label>
                <div className="flex gap-1">
                  {[1, 4, 16, 32, 64].map((b) => (
                    <button
                      key={b}
                      onClick={() => setBatchSize(b)}
                      className={`flex-1 py-1 rounded font-mono font-semibold text-xs border ${
                        batchSize === b
                          ? 'bg-emerald-700 text-white border-emerald-700'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Résolution (H × W) : <strong className="text-emerald-800">{imgH}×{imgW}</strong>
                </label>
                <div className="flex gap-1">
                  {[
                    { h: 28, w: 28, label: 'MNIST' },
                    { h: 32, w: 32, label: 'CIFAR' },
                    { h: 224, w: 224, label: 'ResNet' },
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      onClick={() => {
                        setImgH(preset.h);
                        setImgW(preset.w);
                      }}
                      className={`flex-1 py-1 rounded font-semibold text-[11px] border ${
                        imgH === preset.h && imgW === preset.w
                          ? 'bg-emerald-700 text-white border-emerald-700'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Canaux (C) : <strong className="text-emerald-800">{channels === 1 ? '1 (Gris)' : '3 (RGB)'}</strong>
                </label>
                <div className="flex gap-1">
                  <button
                    onClick={() => setChannels(1)}
                    className={`flex-1 py-1 rounded font-semibold text-xs border ${
                      channels === 1
                        ? 'bg-emerald-700 text-white border-emerald-700'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    1 (Gris)
                  </button>
                  <button
                    onClick={() => setChannels(3)}
                    className={`flex-1 py-1 rounded font-semibold text-xs border ${
                      channels === 3
                        ? 'bg-emerald-700 text-white border-emerald-700'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    3 (RGB)
                  </button>
                </div>
              </div>

              <div className="flex flex-col justify-center bg-white p-2.5 rounded border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                  Mémoire du Lot (float32) :
                </span>
                <span className="font-mono text-sm font-bold text-emerald-800">
                  {memBatchFloat32MB} Mo
                </span>
                <span className="text-[10px] text-slate-400">
                  {totalElementsBatch.toLocaleString()} éléments flottants
                </span>
              </div>
            </div>

            {/* Interactive Schema Graphic */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
              {/* Left Box: Single Image 3D Architecture */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-emerald-600"></span>
                    1. Image Isolée : Tenseur 3D [H, W, C]
                  </span>
                  <span className="font-mono text-xs font-bold bg-white px-2 py-0.5 rounded border border-slate-200 text-emerald-800">
                    Shape : ({imgH}, {imgW}, {channels})
                  </span>
                </div>

                {/* 3D Visual Planes Representation */}
                <div className="h-60 relative flex items-center justify-center overflow-hidden bg-white rounded-lg border border-slate-200 shadow-2xs p-4">
                  {channels === 1 ? (
                    // Grayscale Plane
                    <div className="w-40 h-40 bg-gradient-to-br from-slate-200 to-slate-400 rounded-lg border-2 border-slate-700 flex flex-col items-center justify-center shadow-lg relative group">
                      <span className="text-xs font-bold text-slate-900 bg-white/90 px-2 py-0.5 rounded shadow-2xs font-mono">
                        Canal Unique [:, :, 0]
                      </span>
                      <span className="text-[11px] text-slate-700 mt-1">
                        Intensité [0..255]
                      </span>
                      {/* Spatial Dimension Arrows */}
                      <span className="absolute -left-7 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] font-mono text-slate-600 font-bold">
                        Hauteur {imgH} px
                      </span>
                      <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] font-mono text-slate-600 font-bold">
                        Largeur {imgW} px
                      </span>
                    </div>
                  ) : (
                    // RGB 3 Stacked Planes
                    <div className="relative w-56 h-48 flex items-center justify-center">
                      {/* Blue Channel Plane */}
                      <div
                        className="absolute w-36 h-36 rounded-lg border-2 border-blue-600 bg-blue-500/25 backdrop-blur-2xs shadow-md flex items-start justify-end p-2 transition-all duration-300"
                        style={{ transform: 'translate(28px, -24px)' }}
                      >
                        <span className="text-[10px] font-mono font-bold text-blue-800 bg-blue-100 px-1.5 py-0.5 rounded border border-blue-300">
                          Canal Bleu (c=2)
                        </span>
                      </div>

                      {/* Green Channel Plane */}
                      <div
                        className="absolute w-36 h-36 rounded-lg border-2 border-emerald-600 bg-emerald-500/25 backdrop-blur-2xs shadow-md flex items-start justify-end p-2 transition-all duration-300"
                        style={{ transform: 'translate(14px, -12px)' }}
                      >
                        <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-300">
                          Canal Vert (c=1)
                        </span>
                      </div>

                      {/* Red Channel Plane */}
                      <div
                        className="absolute w-36 h-36 rounded-lg border-2 border-red-600 bg-red-500/25 backdrop-blur-2xs shadow-md flex items-start justify-end p-2 transition-all duration-300"
                        style={{ transform: 'translate(0px, 0px)' }}
                      >
                        <span className="text-[10px] font-mono font-bold text-red-800 bg-red-100 px-1.5 py-0.5 rounded border border-red-300">
                          Canal Rouge (c=0)
                        </span>
                      </div>

                      {/* Dimensions Indicators */}
                      <div className="absolute -bottom-2 left-6 text-[10px] font-mono font-bold text-slate-700 bg-white/90 px-1.5 py-0.5 rounded border border-slate-200">
                        {imgH} lignes × {imgW} colonnes × 3 canaux
                      </div>
                    </div>
                  )}
                </div>

                <div className="text-xs text-slate-600 space-y-1 bg-white p-3 rounded-lg border border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Axe 0 (Hauteur H) :</span>
                    <span className="font-mono font-semibold text-slate-800">{imgH} coordonnées y</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Axe 1 (Largeur W) :</span>
                    <span className="font-mono font-semibold text-slate-800">{imgW} coordonnées x</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Axe 2 (Canaux C) :</span>
                    <span className="font-mono font-semibold text-slate-800">
                      {channels} ({channels === 1 ? 'Niveaux de gris' : 'Rouge, Vert, Bleu'})
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Box: Batch 4D Hyper-Volume Representation */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-sky-600"></span>
                    2. Lot d'Images (Batch) : Tenseur 4D [{selectedFormat.toUpperCase()}]
                  </span>
                  <span className="font-mono text-xs font-bold bg-white px-2 py-0.5 rounded border border-slate-200 text-sky-800">
                    Shape : ({selectedFormat === 'nhwc' ? `${batchSize}, ${imgH}, ${imgW}, ${channels}` : `${batchSize}, ${channels}, ${imgH}, ${imgW}`})
                  </span>
                </div>

                {/* Batch Stack Graphic */}
                <div className="h-60 relative flex items-center justify-center overflow-hidden bg-white rounded-lg border border-slate-200 shadow-2xs p-4">
                  <div className="relative w-64 h-48 flex items-center justify-center">
                    {/* Simulated 4D Stack of Images */}
                    {Array.from({ length: Math.min(6, batchSize) }).map((_, i) => {
                      const offset = (5 - i) * 10;
                      return (
                        <div
                          key={i}
                          className="absolute w-36 h-36 rounded-lg border-2 border-slate-700 bg-gradient-to-br from-slate-100 to-emerald-100/60 shadow-md flex items-center justify-center transition-all duration-300"
                          style={{
                            transform: `translate(${-offset}px, ${-offset}px)`,
                            zIndex: 10 + i,
                          }}
                        >
                          <span className="text-[10px] font-mono font-bold text-slate-700 bg-white/90 px-1.5 py-0.5 rounded border border-slate-200 shadow-2xs">
                            Image {batchSize - i}
                          </span>
                        </div>
                      );
                    })}

                    {/* Batch Size Indicator Arrow */}
                    <div className="absolute right-2 top-4 bg-sky-50 text-sky-800 border border-sky-300 px-2 py-1 rounded text-[11px] font-mono font-bold shadow-xs">
                      Axe 0 : Lot de {batchSize} images
                    </div>
                  </div>
                </div>

                <div className="text-xs text-slate-600 space-y-1 bg-white p-3 rounded-lg border border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Axe 0 (Batch N) :</span>
                    <span className="font-mono font-semibold text-sky-800">{batchSize} échantillons indépendants</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Parallélisme GPU :</span>
                    <span className="font-mono font-semibold text-emerald-700">Calcul simultané via GEMM (cuBLAS)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Pour 1 image isolée :</span>
                    <span className="font-mono font-semibold text-slate-800">tf.expand_dims(img, axis=0)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TABLEAU COMPARATIF COMPLET */}
      {activeTab === 'tableau' && (
        <div className="academic-card p-5 bg-white border-slate-200 space-y-4 animate-fadeIn">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                <TableIcon className="w-4 h-4 text-sky-700" />
                <span>Tableau Comparatif : Scalaire, Vecteur, Matrice et Tenseurs</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Vue synoptique complète de la hiérarchie tensorielle, des rangs et de leurs applications directes en Deep Learning.
              </p>
            </div>

            <button
              onClick={() => copyToClipboard(markdownTable, 'table')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 transition-colors shadow-2xs"
            >
              {copiedTable ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Tableau copié !</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-600" />
                  <span>Copier en Markdown</span>
                </>
              )}
            </button>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
                  <th className="p-3">Objet Mathématique</th>
                  <th className="p-3">Rang (ndim)</th>
                  <th className="p-3">Forme (Shape)</th>
                  <th className="p-3">Dimension Géométrique</th>
                  <th className="p-3">Exemple Concret</th>
                  <th className="p-3">Rôle en Deep Learning</th>
                  <th className="p-3">Exemple Code TensorFlow</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="p-3 font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-500 inline-block"></span>
                    Scalaire
                  </td>
                  <td className="p-3 font-mono font-bold text-slate-700">0</td>
                  <td className="p-3 font-mono text-emerald-800 font-bold">()</td>
                  <td className="p-3 text-slate-600">0D (un point unique)</td>
                  <td className="p-3 text-slate-600">Température (21.5°C), Prix (42€)</td>
                  <td className="p-3 text-slate-800 font-medium">
                    Valeur de perte (<code className="text-emerald-700">loss</code>), Taux d'apprentissage (<code className="text-emerald-700">lr</code>), Métrique d'accuracy
                  </td>
                  <td className="p-3 font-mono text-[11px] text-slate-700 bg-slate-50 rounded">
                    tf.constant(0.001)
                  </td>
                </tr>

                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="p-3 font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span>
                    Vecteur
                  </td>
                  <td className="p-3 font-mono font-bold text-slate-700">1</td>
                  <td className="p-3 font-mono text-emerald-800 font-bold">(N,)</td>
                  <td className="p-3 text-slate-600">1D (une ligne / direction)</td>
                  <td className="p-3 text-slate-600">Vitesse 3D [vx, vy, vz], Liste d'achats</td>
                  <td className="p-3 text-slate-800 font-medium">
                    Étiquettes (<code className="text-blue-700">y_true</code>), Biais synaptique (<code className="text-blue-700">b</code>), Vecteur d'embedding
                  </td>
                  <td className="p-3 font-mono text-[11px] text-slate-700 bg-slate-50 rounded">
                    tf.constant([0, 2, 1])
                  </td>
                </tr>

                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="p-3 font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
                    Matrice
                  </td>
                  <td className="p-3 font-mono font-bold text-slate-700">2</td>
                  <td className="p-3 font-mono text-emerald-800 font-bold">(M, N)</td>
                  <td className="p-3 text-slate-600">2D (un tableau plan / grille)</td>
                  <td className="p-3 text-slate-600">Feuille de calcul Excel, Échiquier 8x8</td>
                  <td className="p-3 text-slate-800 font-medium">
                    Matrice de poids synaptiques (<code className="text-amber-700">W</code>), Image niveaux de gris sans canal explicite
                  </td>
                  <td className="p-3 font-mono text-[11px] text-slate-700 bg-slate-50 rounded">
                    tf.zeros([128, 64])
                  </td>
                </tr>

                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="p-3 font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                    Tenseur 3D
                  </td>
                  <td className="p-3 font-mono font-bold text-slate-700">3</td>
                  <td className="p-3 font-mono text-emerald-800 font-bold">(H, W, C)</td>
                  <td className="p-3 text-slate-600">3D (un volume géométrique)</td>
                  <td className="p-3 text-slate-600">Cube Rubik, Scanner médical IRM 3D</td>
                  <td className="p-3 text-slate-800 font-medium">
                    Une photographie couleur isolée RGB (<code className="text-emerald-700">224, 224, 3</code>), Séquence temporelle NLP
                  </td>
                  <td className="p-3 font-mono text-[11px] text-slate-700 bg-slate-50 rounded">
                    tf.zeros([224, 224, 3])
                  </td>
                </tr>

                <tr className="hover:bg-slate-50 transition-colors bg-emerald-50/20">
                  <td className="p-3 font-bold text-emerald-950 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-700 inline-block"></span>
                    Tenseur 4D
                  </td>
                  <td className="p-3 font-mono font-bold text-emerald-800">4</td>
                  <td className="p-3 font-mono text-emerald-900 font-bold">(B, H, W, C)</td>
                  <td className="p-3 text-slate-600">4D (hyper-volume / pile de volumes)</td>
                  <td className="p-3 text-slate-600">Vidéo monochrome (Temps, H, W, 1)</td>
                  <td className="p-3 text-slate-900 font-semibold">
                    Lot d'images (Batch) fourni en entrée de <code className="text-emerald-800">model.fit()</code> ou <code className="text-emerald-800">model.predict()</code>
                  </td>
                  <td className="p-3 font-mono text-[11px] text-slate-700 bg-slate-50 rounded">
                    tf.zeros([32, 224, 224, 3])
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="academic-card p-4 bg-emerald-50/40 border-emerald-200 text-xs text-emerald-950 space-y-1.5">
            <h4 className="font-bold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-700" />
              <span>Règle d'or pour la soutenance orale :</span>
            </h4>
            <p>
              "Un tenseur n'est pas un objet mathématique mystérieux : c'est simplement la <strong>généralisation multidimensionnelle</strong> des tableaux de nombres. Le rang correspond au nombre d'indices nécessaires pour repérer une valeur unique (0 pour un scalaire, 1 pour un vecteur, 2 pour une matrice, 3 pour une image RGB, et 4 pour un lot complet d'images)."
            </p>
          </div>
        </div>
      )}

      {/* TAB 3: CODE PYTHON COMMENTÉ ET COMPLET */}
      {activeTab === 'code' && (
        <div className="academic-card p-5 bg-white border-slate-200 space-y-4 animate-fadeIn">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                <Code2 className="w-4 h-4 text-amber-700" />
                <span>Script Python Complet &amp; Commenté : Chargement &amp; Prétraitement d'Images</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Implémentation de référence prête à l'exécution sur Google Colab ou environnement local avec TensorFlow 2.x.
              </p>
            </div>

            <button
              onClick={() => copyToClipboard(pythonScript, 'code')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs transition-colors"
            >
              {copiedCode ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Script copié dans le presse-papier !</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copier le script complet (.py)</span>
                </>
              )}
            </button>
          </div>

          {/* Key Pipeline Steps Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
            <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
              <span className="font-bold text-emerald-800 block">1. tf.io.decode_image</span>
              <span className="text-[11px] text-slate-500">Décodage brut uint8 [0, 255]</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
              <span className="font-bold text-emerald-800 block">2. tf.image.resize</span>
              <span className="text-[11px] text-slate-500">Interpolation bilinéaire 224x224</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
              <span className="font-bold text-emerald-800 block">3. Normalisation</span>
              <span className="text-[11px] text-slate-500">Cast float32 + division 255.0</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
              <span className="font-bold text-emerald-800 block">4. tf.expand_dims</span>
              <span className="text-[11px] text-slate-500">Transformation 3D -&gt; 4D (1, H, W, C)</span>
            </div>
          </div>

          {/* Syntax Highlighted Code Viewer */}
          <div className="relative rounded-lg overflow-hidden border border-slate-800 bg-slate-950 text-slate-200 font-mono text-xs shadow-inner">
            <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span>pipeline_tenseurs_tf.py</span>
              <span>Python 3 • TensorFlow 2.x</span>
            </div>
            <pre className="p-4 overflow-x-auto max-h-[500px] leading-relaxed">
              <code>{pythonScript}</code>
            </pre>
          </div>
        </div>
      )}

      {/* TAB 4: CHRONOMÈTRE & GUIDE D'ORATEUR (25-30 MIN) */}
      {activeTab === 'chrono' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Interactive Timer Banner */}
          <div className="academic-card p-5 bg-white border-slate-200 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="text-3xl sm:text-4xl font-extrabold font-mono text-slate-900">
                {formatTimer(timerSeconds)}
              </div>
              <div>
                <span className={`text-xs px-2.5 py-1 rounded-md font-semibold border ${getTimerPhase().color}`}>
                  {getTimerPhase().label}
                </span>
                <p className="text-[11px] text-slate-500 mt-1">
                  Objectif de durée : <strong>25 à 30 minutes</strong> (+ 2 à 3 min de questions/réponses).
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-colors shadow-xs ${
                  isTimerRunning
                    ? 'bg-amber-600 hover:bg-amber-700 text-white'
                    : 'bg-emerald-700 hover:bg-emerald-800 text-white'
                }`}
              >
                {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isTimerRunning ? 'Mettre en pause' : 'Démarrer la répétition'}</span>
              </button>

              <button
                onClick={() => {
                  setIsTimerRunning(false);
                  setTimerSeconds(0);
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Remise à zéro</span>
              </button>
            </div>
          </div>

          {/* Minute by Minute Breakdown */}
          <div className="academic-card p-5 bg-white border-slate-200 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 uppercase tracking-wider">
              <Clock className="w-4 h-4 text-emerald-700" />
              <span>Planning Minuté Recommandé pour la Présentation (Total : 28 min + 3 min Q&amp;A)</span>
            </h3>

            <div className="space-y-3">
              {[
                {
                  part: 'Partie 1 : Pourquoi les tenseurs ?',
                  duration: '00:00 - 05:00 (5 min)',
                  topics: 'Définition d\'un tenseur, comparaison tableau (scalaire, vecteur, matrice, tenseur), rôle de parallélisation sur GPU.',
                  keyMessage: 'Un tenseur est un conteneur n-dimensionnel optimisé pour le calcul massivement parallèle des réseaux de neurones.',
                },
                {
                  part: 'Partie 2 : Concepts fondamentaux',
                  duration: '05:00 - 11:00 (6 min)',
                  topics: 'Shape, rank, dtype, image niveaux de gris vs RGB, représentation d\'un lot (batch) et opérations de slicing.',
                  keyMessage: 'Une image couleur est un tenseur 3D (H, W, 3). Le dtype uint8 doit impérativement devenir float32 pour le calcul de gradient.',
                },
                {
                  part: 'Partie 3 : Manipulation des images avec TF/Keras',
                  duration: '11:00 - 17:00 (6 min)',
                  topics: 'Chargement tf.io, redimensionnement bilinéaire vs nearest, création de batches avec tf.data.Dataset (prefetch, cache).',
                  keyMessage: 'Le pipeline tf.data prépare le lot N+1 sur CPU pendant que le GPU calcule le lot N, supprimant tout goulot d\'étranglement.',
                },
                {
                  part: 'Partie 4 : Prétraitement des images',
                  duration: '17:00 - 22:00 (5 min)',
                  topics: 'Normalisation [0, 1] vs [-1, 1], preprocess_input spécifique par modèle, piège de l\'incohérence entre entraînement et test.',
                  keyMessage: 'ResNet attend du BGR centré, MobileNet attend [-1, 1]. Toujours utiliser la fonction preprocess_input de l\'architecture choisie.',
                },
                {
                  part: 'Partie 5 : Application au Deep Learning & Diagnostic',
                  duration: '22:00 - 28:00 (6 min)',
                  topics: 'Entrée dans un CNN, input_shape=(H,W,C), tf.expand_dims pour 1 image, erreurs classiques (dimensions manquantes, types).',
                  keyMessage: 'Keras attend TOUJOURS un lot 4D. Pour prédire une seule photo, ajouter l\'axe batch avec tf.expand_dims(img, axis=0).',
                },
                {
                  part: 'Clôture & Questions / Réponses (Q&A)',
                  duration: '28:00 - 31:00 (3 min)',
                  topics: 'Échanges avec le jury et réponses précises aux questions techniques.',
                  keyMessage: 'Être concis, s\'appuyer sur les démonstrateurs interactifs et le tableau comparatif.',
                },
              ].map((item, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 space-y-1">
                  <div className="flex flex-wrap items-center justify-between gap-1">
                    <span className="text-xs font-bold text-slate-900">{item.part}</span>
                    <span className="font-mono text-[11px] font-semibold text-emerald-800 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {item.duration}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">{item.topics}</p>
                  <p className="text-[11px] text-emerald-900 font-medium italic">
                    💡 Message clé à transmettre : {item.keyMessage}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Anticipated Q&A (Top 5 Questions from Jury) */}
          <div className="academic-card p-5 bg-white border-slate-200 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 uppercase tracking-wider">
              <HelpCircle className="w-4 h-4 text-sky-700" />
              <span>Questions Fréquentes du Jury &amp; Réponses Types (Pour les 2-3 min de Q&amp;A)</span>
            </h3>

            <div className="space-y-3">
              {[
                {
                  q: "Pourquoi TensorFlow utilise par défaut le format NHWC au lieu de NCHW ?",
                  a: "NHWC place les canaux consécutivement en mémoire pour chaque pixel, ce qui est très efficace sur processeurs CPU et correspond à la structure binaire native des fichiers JPEG/PNG (pixels RGB contigus). En revanche, les puces graphiques NVIDIA avec cuDNN fonctionnent souvent plus vite en NCHW.",
                },
                {
                  q: "Que se passe-t-il si j'oublie de normaliser les pixels entre [0, 1] et que je laisse [0, 255] ?",
                  a: "Les neurones des premières couches vont recevoir des valeurs très élevées. En les multipliant par les poids initiaux, la fonction d'activation va saturer immédiatement, les gradients vont s'effondrer vers 0 (vanishing gradient) ou exploser vers l'infini (NaN Loss).",
                },
                {
                  q: "Pourquoi tf.expand_dims(img, axis=0) est-il obligatoire pour une seule image lors de model.predict() ?",
                  a: "Les couches convolutives et denses de Keras sont vectorisées pour traiter des lots (batches). La forme attendue est obligatoirement (None, H, W, C). Même pour 1 image, le modèle doit recevoir la dimension de lot (1, H, W, C).",
                },
                {
                  q: "Quelle est la différence entre normaliser par x/255 et utiliser preprocess_input de ResNet ?",
                  a: "x/255 ramène les pixels dans [0.0, 1.0] en ordre RGB. ResNet50 a été entraîné avec Caffe en inversant l'ordre en BGR et en soustrayant la moyenne ImageNet (~110). Si vous lui donnez du [0, 1], il verra une image quasi noire et échouera.",
                },
                {
                  q: "Pourquoi utiliser tf.data.Dataset plutôt qu'une boucle for classique en Python ?",
                  a: "Une boucle Python bloque le GPU pendant que le CPU charge les images du disque (GPU sous-utilisé à 10%). tf.data avec prefetch(AUTOTUNE) charge et prépare le lot suivant en arrière-plan pendant que le GPU calcule le lot actuel, maintenant l'utilisation du GPU proche de 100%.",
                },
              ].map((faq, i) => (
                <div key={i} className="p-3 bg-sky-50/40 rounded-lg border border-sky-200/80 space-y-1">
                  <div className="text-xs font-bold text-sky-950 flex items-start gap-1.5">
                    <span className="font-mono text-sky-700">Q{i + 1} :</span>
                    <span>{faq.q}</span>
                  </div>
                  <p className="text-xs text-slate-700 pl-6 leading-relaxed">
                    <strong className="text-emerald-800 font-semibold">Réponse : </strong>
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
