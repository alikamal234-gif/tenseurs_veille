import React, { useState } from 'react';
import { Sliders, Copy, Check, Terminal, Play, RotateCcw, Sparkles, Layers, HardDrive } from 'lucide-react';
import { Badge } from '../common/Badge';

export const EndToEndLab: React.FC = () => {
  const [sampleImage, setSampleImage] = useState<'digit' | 'sunset' | 'circle'>('sunset');
  const [resolution, setResolution] = useState<number>(224);
  const [colorMode, setColorMode] = useState<1 | 3>(3);
  const [normMode, setNormMode] = useState<'zero_one' | 'minus_one_one' | 'caffe_bgr'>('zero_one');
  const [batchSize, setBatchSize] = useState<number>(32);
  const [copied, setCopied] = useState<boolean>(false);

  // Computations
  const totalElements = batchSize * resolution * resolution * colorMode;
  const memoryMB = ((totalElements * 4) / (1024 * 1024)).toFixed(2);
  const convOutH = resolution - 2;
  const convOutW = resolution - 2;

  const pythonScript = `# ====================================================================
# PIPELINE DE TRAITEMENT D'IMAGES ET STRUCTURE DE TENSEURS AVEC KERAS
# Conçu pour exécution directe sur Google Colab / GPU
# ====================================================================
import tensorflow as tf
from tensorflow.keras import layers, models

# 1. Configuration des hyperparamètres du pipeline
BATCH_SIZE = ${batchSize}
IMG_SIZE = (${resolution}, ${resolution})
CHANNELS = ${colorMode} # ${colorMode === 3 ? 'RGB' : 'Grayscale'}

# 2. Définition de l'architecture du CNN avec couches de prétraitement intégrées
model = models.Sequential([
    # Couche d'entrée définissant le contrat de forme
    layers.Input(shape=(*IMG_SIZE, CHANNELS)),
${
  normMode === 'zero_one'
    ? '    layers.Rescaling(1./255), # Normalisation [0.0, 1.0]'
    : normMode === 'minus_one_one'
    ? '    layers.Rescaling(1./127.5, offset=-1.0), # Centrage [-1.0, 1.0]'
    : '    # Mode Caffe BGR avec soustraction de moyenne (ex: ResNet50)'
}
    # Première couche convolutive
    layers.Conv2D(32, kernel_size=(3, 3), activation='relu'),
    layers.MaxPooling2D(pool_size=(2, 2)),
    
    # Deuxième bloc convolutif
    layers.Conv2D(64, kernel_size=(3, 3), activation='relu'),
    layers.GlobalAveragePooling2D(),
    
    # Classification finale
    layers.Dense(10, activation='softmax')
])

# 3. Résumé de l'architecture et vérification des dimensions
model.summary()

# 4. Simulation d'un lot d'images injecté dans le modèle
lot_test = tf.random.uniform([BATCH_SIZE, *IMG_SIZE, CHANNELS], minval=0, maxval=256, dtype=tf.float32)
predictions = model(lot_test)

print("Forme du lot d'entrée   :", lot_test.shape) # (${batchSize}, ${resolution}, ${resolution}, ${colorMode})
print("Forme des prédictions   :", predictions.shape) # (${batchSize}, 10)
print("Empreinte mémoire brute : ~${memoryMB} Mo")
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(pythonScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="academic-card border-slate-200 bg-white overflow-hidden space-y-4">
      {/* Header */}
      <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-700" />
          <h4 className="text-xs sm:text-sm font-bold text-slate-800">
            Atelier Pratique Intégré (Lab de bout en bout)
          </h4>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="emerald">Batch Shape : ({batchSize}, {resolution}, {resolution}, {colorMode})</Badge>
          <Badge variant="slate">{memoryMB} Mo VRAM</Badge>
        </div>
      </div>

      <div className="p-4 space-y-5">
        {/* Lab Controls Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-xs">
          {/* Sample */}
          <div>
            <label className="text-slate-600 block mb-1 font-semibold">1. Image Motif :</label>
            <select
              value={sampleImage}
              onChange={(e) => setSampleImage(e.target.value as any)}
              className="w-full p-1.5 bg-white border border-slate-300 rounded text-xs"
            >
              <option value="sunset">Paysage RGB</option>
              <option value="digit">Chiffre MNIST '7'</option>
              <option value="circle">Cercle Géométrique</option>
            </select>
          </div>

          {/* Resolution */}
          <div>
            <label className="text-slate-600 block mb-1 font-semibold">2. Résolution :</label>
            <select
              value={resolution}
              onChange={(e) => setResolution(Number(e.target.value))}
              className="w-full p-1.5 bg-white border border-slate-300 rounded text-xs font-mono"
            >
              <option value={28}>28 × 28 (MNIST)</option>
              <option value={64}>64 × 64 (Petit)</option>
              <option value={128}>128 × 128 (Moyen)</option>
              <option value={224}>224 × 224 (Standard)</option>
            </select>
          </div>

          {/* Channels */}
          <div>
            <label className="text-slate-600 block mb-1 font-semibold">3. Canaux :</label>
            <select
              value={colorMode}
              onChange={(e) => setColorMode(Number(e.target.value) as 1 | 3)}
              className="w-full p-1.5 bg-white border border-slate-300 rounded text-xs font-mono"
            >
              <option value={3}>3 Canaux (RGB)</option>
              <option value={1}>1 Canal (Gris)</option>
            </select>
          </div>

          {/* Normalization */}
          <div>
            <label className="text-slate-600 block mb-1 font-semibold">4. Normalisation :</label>
            <select
              value={normMode}
              onChange={(e) => setNormMode(e.target.value as any)}
              className="w-full p-1.5 bg-white border border-slate-300 rounded text-xs"
            >
              <option value="zero_one">Rescaling [0, 1]</option>
              <option value="minus_one_one">Centrage [-1, 1]</option>
              <option value="caffe_bgr">Mode Caffe BGR</option>
            </select>
          </div>

          {/* Batch Size */}
          <div>
            <label className="text-slate-600 block mb-1 font-semibold">5. Taille de lot :</label>
            <select
              value={batchSize}
              onChange={(e) => setBatchSize(Number(e.target.value))}
              className="w-full p-1.5 bg-white border border-slate-300 rounded text-xs font-mono"
            >
              <option value={1}>Batch de 1 (Inférence)</option>
              <option value={4}>Batch de 4</option>
              <option value={16}>Batch de 16</option>
              <option value={32}>Batch de 32 (Standard)</option>
              <option value={64}>Batch de 64</option>
            </select>
          </div>
        </div>

        {/* Live Tensor Flow Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-white border border-slate-200 rounded-lg">
            <span className="text-slate-500 font-medium block mb-1">Image Unitaire</span>
            <div className="font-mono font-bold text-sm text-slate-800">
              ({resolution}, {resolution}, {colorMode})
            </div>
            <span className="text-[10px] text-slate-400">Rang 3 (H, W, C)</span>
          </div>

          <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-lg">
            <span className="text-emerald-800 font-medium block mb-1">Tenseur de Lot (NHWC)</span>
            <div className="font-mono font-bold text-sm text-emerald-950">
              ({batchSize}, {resolution}, {resolution}, {colorMode})
            </div>
            <span className="text-[10px] text-emerald-700">Rang 4 (Batch, H, W, C)</span>
          </div>

          <div className="p-3 bg-sky-50/70 border border-sky-200 rounded-lg">
            <span className="text-sky-800 font-medium block mb-1">Sortie Conv2D (32 filtres)</span>
            <div className="font-mono font-bold text-sm text-sky-950">
              ({batchSize}, {convOutH}, {convOutW}, 32)
            </div>
            <span className="text-[10px] text-sky-700">32 Cartes d'activation</span>
          </div>

          <div className="p-3 bg-purple-50/70 border border-purple-200 rounded-lg">
            <span className="text-purple-800 font-medium block mb-1">Prédictions Softmax</span>
            <div className="font-mono font-bold text-sm text-purple-950">
              ({batchSize}, 10)
            </div>
            <span className="text-[10px] text-purple-700">10 Probabilités par image</span>
          </div>
        </div>

        {/* Generated Python Script Panel */}
        <div className="academic-card overflow-hidden border-slate-800 bg-slate-950">
          <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              <span>Script Python complet généré (Prêt pour Google Colab)</span>
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-semibold transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copié dans le presse-papier !</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copier le script Python</span>
                </>
              )}
            </button>
          </div>

          <pre className="p-4 text-emerald-300 font-mono text-xs overflow-x-auto leading-relaxed max-h-80">
            {pythonScript}
          </pre>
        </div>
      </div>
    </div>
  );
};
