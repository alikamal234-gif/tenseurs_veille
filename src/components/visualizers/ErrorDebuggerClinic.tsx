import React, { useState } from 'react';
import { Bug, CheckCircle2, AlertOctagon, Wrench, RefreshCw, Terminal, ArrowRight } from 'lucide-react';
import { Badge } from '../common/Badge';

export const ErrorDebuggerClinic: React.FC = () => {
  const [selectedCase, setSelectedCase] = useState<number>(0);
  const [isFixed, setIsFixed] = useState<boolean>(false);

  const errorCases = [
    {
      id: 0,
      title: '1. Oubli de la dimension de Batch (3D vs 4D)',
      category: 'Dimensions',
      errorMsg: 'ValueError: Input 0 of layer "model" is incompatible with the layer: expected min_ndim=4, found ndim=3. Full shape received: (224, 224, 3)',
      badCode: `image = tf.keras.utils.load_img("chat.jpg", target_size=(224, 224))
img_array = tf.keras.utils.img_to_array(image)

# ❌ Crash : img_array a une forme 3D (224, 224, 3)
predictions = model.predict(img_array)`,
      fixedCode: `image = tf.keras.utils.load_img("chat.jpg", target_size=(224, 224))
img_array = tf.keras.utils.img_to_array(image)

# ✅ Solution : ajouter l'axe de batch (axe 0) -> (1, 224, 224, 3)
img_batch = tf.expand_dims(img_array, axis=0)
predictions = model.predict(img_batch)`,
      explanation: 'Keras attend un lot d\'images, même pour une inférence sur une seule photo. tf.expand_dims(..., axis=0) ajoute la dimension unitaire indispensable.',
      brokenShape: '(224, 224, 3)',
      fixedShape: '(1, 224, 224, 3)',
    },
    {
      id: 1,
      title: '2. Conflit de Dtype (uint8 au lieu de float32)',
      category: 'Dtype',
      errorMsg: 'TypeError: Value passed to parameter "input" has DataType uint8 not in [float16, bfloat16, float32, float64].',
      badCode: `# Image brute décodée depuis le disque
img_uint8 = tf.io.decode_jpeg(raw_bytes) # dtype=tf.uint8

# ❌ Crash : Conv2D refuse catégoriquement les entiers uint8
output = conv_layer(img_uint8)`,
      fixedCode: `# Image brute décodée depuis le disque
img_uint8 = tf.io.decode_jpeg(raw_bytes)

# ✅ Solution : Convertir explicitement en float32
img_float32 = tf.cast(img_uint8, tf.float32)
output = conv_layer(img_float32)`,
      explanation: 'Les réseaux de neurones calculent des gradients différentiables continus. Les tenseurs entiers non signés (uint8) sont rejetés par Keras.',
      brokenShape: 'uint8 [0, 255]',
      fixedShape: 'float32 [0.0, 255.0]',
    },
    {
      id: 2,
      title: '3. Image en niveaux de gris transmise à un modèle RGB',
      category: 'Canaux',
      errorMsg: 'ValueError: Channels dimension mismatch: expected 3, but received 1 channel. Full shape received: (1, 224, 224, 1)',
      badCode: `# Image monochrome décodée avec 1 canal
img_gray = tf.io.decode_image(raw_bytes, channels=1) # (224, 224, 1)

# ❌ Crash : Le modèle MobileNetV2 a 3 filtres d'entrée
model.predict(tf.expand_dims(img_gray, 0))`,
      fixedCode: `# Image monochrome décodée avec 1 canal
img_gray = tf.io.decode_image(raw_bytes, channels=1)

# ✅ Solution : Dupliquer le canal gris sur les 3 canaux R, V, B
img_rgb = tf.image.grayscale_to_rgb(img_gray)
img_batch = tf.expand_dims(img_rgb, 0) # (1, 224, 224, 3)
model.predict(img_batch)`,
      explanation: 'Un modèle pré-entraîné sur ImageNet attend strictement 3 canaux d\'entrée. La fonction tf.image.grayscale_to_rgb copie la luminance sur R, V et B.',
      brokenShape: '(1, 224, 224, 1)',
      fixedShape: '(1, 224, 224, 3)',
    },
    {
      id: 3,
      title: '4. Saturation silencieuse en 255 (Loss = NaN)',
      category: 'Valeurs',
      errorMsg: 'Silent Failure: Le modèle tourne sans erreur système, mais loss = NaN dès l\'epoch 2 et la précision reste bloquée à 10%.',
      badCode: `# Chargement de pixels bruts
img = tf.cast(raw_img, tf.float32) # Valeurs entre 0 et 255 !

# ❌ Erreur silencieuse : Aucune normalisation appliquée
# Les poids explosent lors de la rétropropagation
model.fit(train_dataset, epochs=10)`,
      fixedCode: `# Chargement de pixels bruts
img = tf.cast(raw_img, tf.float32)

# ✅ Solution : Intégrer une couche Rescaling dans le modèle
model = tf.keras.Sequential([
    tf.keras.layers.Rescaling(1./255, input_shape=(224, 224, 3)),
    tf.keras.layers.Conv2D(32, 3, activation='relu'),
    ...
])`,
      explanation: 'C\'est le piège le plus sournois : le code s\'exécute sans lever d\'exception Python, mais le réseau ne converge jamais car les activations saturent.',
      brokenShape: 'Valeurs brutes [0, 255]',
      fixedShape: 'Valeurs normalisées [0.0, 1.0]',
    },
    {
      id: 4,
      title: '5. Inversion NCHW vs NHWC (Channels First vs Last)',
      category: 'Axes',
      errorMsg: 'ValueError: Dimensions mismatch for Conv2D: expected (None, 224, 224, 3), got (None, 3, 224, 224)',
      badCode: `# Image issue d'un format PyTorch (Channels First : C, H, W)
tensor_nchw = tf.zeros([1, 3, 224, 224])

# ❌ Crash : Keras attend les canaux en DERNIER par défaut (NHWC)
conv = tf.keras.layers.Conv2D(32, 3)(tensor_nchw)`,
      fixedCode: `# Image issue d'un format PyTorch
tensor_nchw = tf.zeros([1, 3, 224, 224])

# ✅ Solution : Transposer les axes vers NHWC (0, 2, 3, 1)
tensor_nhwc = tf.transpose(tensor_nchw, perm=[0, 2, 3, 1])
conv = tf.keras.layers.Conv2D(32, 3)(tensor_nhwc) # (1, 224, 224, 32)`,
      explanation: 'TensorFlow place les canaux en dernier (axe 3). La fonction tf.transpose(..., perm=[0, 2, 3, 1]) réorganise les axes dans l\'ordre convenu.',
      brokenShape: '(1, 3, 224, 224)',
      fixedShape: '(1, 224, 224, 3)',
    },
  ];

  const current = errorCases[selectedCase];

  return (
    <div className="academic-card border-slate-200 bg-white overflow-hidden space-y-4">
      {/* Header */}
      <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Bug className="w-4 h-4 text-amber-600" />
          <h4 className="text-xs sm:text-sm font-bold text-slate-800">
            Clinique de Diagnostic &amp; Résolution de Bugs TensorFlow
          </h4>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={isFixed ? 'emerald' : 'amber'}>
            {isFixed ? 'Bug Résolu ✅' : 'Bug Détecté ⚠️'}
          </Badge>
        </div>
      </div>

      <div className="p-4 space-y-5">
        {/* Case selector tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
          {errorCases.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setSelectedCase(c.id);
                setIsFixed(false);
              }}
              className={`p-2.5 rounded-lg border text-left text-xs font-semibold transition-all ${
                selectedCase === c.id
                  ? 'bg-amber-50 border-amber-400 text-amber-950 shadow-2xs'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="truncate">{c.title}</div>
              <span className="text-[10px] text-slate-500 font-normal">{c.category}</span>
            </button>
          ))}
        </div>

        {/* Error Terminal Log */}
        <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-1.5">
            <span className="flex items-center gap-1.5 text-red-400 font-mono font-semibold">
              <Terminal className="w-3.5 h-3.5" />
              Console Traceback (Python Exception) :
            </span>
            <span className="text-[10px] text-slate-500 font-mono">TensorFlow Runtime</span>
          </div>
          <p className="font-mono text-xs text-red-300 leading-relaxed whitespace-pre-wrap">
            {current.errorMsg}
          </p>
        </div>

        {/* Tensor State Before vs After */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 bg-red-50/50 rounded-lg border border-red-200 text-xs space-y-2">
            <span className="font-bold text-red-950 flex items-center gap-1.5">
              <AlertOctagon className="w-3.5 h-3.5 text-red-600" />
              État erroné du tenseur :
            </span>
            <div className="font-mono text-sm font-bold text-red-800 bg-white p-2 rounded border border-red-200">
              {current.brokenShape}
            </div>
            <pre className="p-2 bg-slate-900 text-red-200 rounded font-mono text-[11px] overflow-x-auto whitespace-pre-wrap">
              {current.badCode}
            </pre>
          </div>

          <div className="p-3 bg-emerald-50/50 rounded-lg border border-emerald-200 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Correctif recommandé :
              </span>
              <button
                onClick={() => setIsFixed(!isFixed)}
                className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-700 hover:bg-emerald-800 text-white shadow-2xs"
              >
                {isFixed ? 'Réinitialiser' : 'Appliquer le correctif'}
              </button>
            </div>
            <div className="font-mono text-sm font-bold text-emerald-800 bg-white p-2 rounded border border-emerald-200">
              {current.fixedShape}
            </div>
            <pre className="p-2 bg-slate-900 text-emerald-300 rounded font-mono text-[11px] overflow-x-auto whitespace-pre-wrap">
              {current.fixedCode}
            </pre>
          </div>
        </div>

        {/* Explanation */}
        <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700 leading-relaxed">
          <strong className="text-slate-900">Explication pédagogique : </strong>
          {current.explanation}
        </div>
      </div>
    </div>
  );
};
