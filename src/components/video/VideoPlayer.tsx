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

// Real Photo Scenes
import { RealScene1Pixels } from './RealScene1Pixels';
import { RealScene2Hierarchy } from './RealScene2Hierarchy';
import { RealScene3RgbChannels } from './RealScene3RgbChannels';
import { RealScene4Slicing } from './RealScene4Slicing';
import { RealScene5Resize } from './RealScene5Resize';
import { RealScene6Normalization } from './RealScene6Normalization';
import { RealScene7Convolution } from './RealScene7Convolution';
import { RealScene8Classification } from './RealScene8Classification';
import { RealScene9Batching } from './RealScene9Batching';

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

  const chapters: VideoChapter[] = [
    {
      id: 1,
      title: "De la Photographie Réelle au Tenseur (Pixels & Grille)",
      shortTitle: "1. Pixels",
      duration: "01:10",
      subtitles: (
        <span>
          Une photo numérique est une grille matricielle de{' '}
          <Keyword id="pixel" onSelect={(id) => setSelectedKeywordId(id)}>
            pixels
          </Keyword>
          . Pour TensorFlow, cette photo de chat devient un{' '}
          <Keyword id="tenseur" onSelect={(id) => setSelectedKeywordId(id)}>
            tenseur 3D
          </Keyword>{' '}
          de nombres entiers{' '}
          <Keyword id="uint8" onSelect={(id) => setSelectedKeywordId(id)}>
            uint8
          </Keyword>{' '}
          [0 à 255] de forme [Hauteur, Largeur, 3].
        </span>
      ),
      pythonSnippet: `# 1. Chargement et conversion d'une photo réelle en tenseur
import tensorflow as tf
image_bytes = tf.io.read_file("chat.jpg")
image_tensor = tf.io.decode_jpeg(image_bytes, channels=3)

print("Forme du tenseur :", image_tensor.shape) # (512, 512, 3)
print("Type des pixels  :", image_tensor.dtype) # <dtype: 'uint8'>`,
    },
    {
      id: 2,
      title: "La Hiérarchie des Tenseurs : Du Scalaire (0D) au Lot (4D)",
      shortTitle: "2. Hiérarchie",
      duration: "02:25",
      subtitles: (
        <span>
          Un{' '}
          <Keyword id="tenseur" onSelect={(id) => setSelectedKeywordId(id)}>
            tenseur
          </Keyword>{' '}
          généralise les dimensions : le{' '}
          <Keyword id="rang" onSelect={(id) => setSelectedKeywordId(id)}>
            rang
          </Keyword>{' '}
          est son nombre d'axes, et sa{' '}
          <Keyword id="forme" onSelect={(id) => setSelectedKeywordId(id)}>
            forme (shape)
          </Keyword>{' '}
          décrit le nombre de lignes, colonnes et{' '}
          <Keyword id="canaux" onSelect={(id) => setSelectedKeywordId(id)}>
            canaux
          </Keyword>
          .
        </span>
      ),
      pythonSnippet: `# Hiérarchie des dimensions dans TensorFlow
scalar = tf.constant(215)                # 0D : ()
vector = tf.constant([210, 185, 140])    # 1D : (3,)
matrix = tf.zeros([512, 512])            # 2D : (512, 512)
image  = tf.zeros([512, 512, 3])         # 3D : (512, 512, 3)
batch  = tf.zeros([32, 512, 512, 3])     # 4D : (32, 512, 512, 3)`,
    },
    {
      id: 3,
      title: "Décomposition Spectrale des Canaux de Couleur (RGB)",
      shortTitle: "3. Canaux RGB",
      duration: "03:40",
      subtitles: (
        <span>
          Une photo couleur superpose 3{' '}
          <Keyword id="canaux" onSelect={(id) => setSelectedKeywordId(id)}>
            canaux
          </Keyword>{' '}
          <Keyword id="rgb" onSelect={(id) => setSelectedKeywordId(id)}>
            RGB (Rouge, Vert, Bleu)
          </Keyword>
          . Isoler chaque canal révèle où se concentrent les différentes énergies spectrales de la scène.
        </span>
      ),
      pythonSnippet: `# Extraction des canaux RGB sur l'axe -1 (convention NHWC)
rouge = image[:, :, 0] # Plumes rouges du perroquet
vert  = image[:, :, 1] # Végétation tropicale
bleu  = image[:, :, 2] # Ailes bleues`,
    },
    {
      id: 4,
      title: "Découpage & Slicing d'une Région d'Intérêt (ROI)",
      shortTitle: "4. Slicing (Crop)",
      duration: "04:55",
      subtitles: (
        <span>
          Le{' '}
          <Keyword id="slicing" onSelect={(id) => setSelectedKeywordId(id)}>
            slicing [y1:y2, x1:x2, :]
          </Keyword>{' '}
          extrait une région d'intérêt rectangulaire (ex: les yeux du chat) par indexation directe, sans aucune copie superflue en mémoire vive.
        </span>
      ),
      pythonSnippet: `# Recadrage ciblé sur le visage du chat sans copie mémoire
yeux_chat = image[200:330, 125:375, :]
print("Forme du sous-tenseur :", yeux_chat.shape)`,
    },
    {
      id: 5,
      title: "Redimensionnement & Interpolation (Nearest vs Bilinéaire)",
      shortTitle: "5. Redimension",
      duration: "06:10",
      subtitles: (
        <span>
          Les CNN exigent une taille d'entrée fixe (ex: 224×224). L'interpolation bilinéaire moyenne les 4 voisins pour préserver la douceur des textures et des moustaches.
        </span>
      ),
      pythonSnippet: `# Harmonisation de taille avec tf.image.resize
image_224 = tf.image.resize(
    image,
    size=[224, 224],
    method=tf.image.ResizeMethod.BILINEAR
)`,
    },
    {
      id: 6,
      title: "Normalisation des Pixels ([0, 255] → [0.0, 1.0])",
      shortTitle: "6. Normalisation",
      duration: "07:25",
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
          dans [0.0, 1.0], évitant l'explosion des gradients et la saturation des neurones.
        </span>
      ),
      pythonSnippet: `# Première couche de normalisation intégrée au modèle Keras
rescaling_layer = tf.keras.layers.Rescaling(scale=1./255)
image_normalisee = rescaling_layer(image_uint8)`,
    },
    {
      id: 7,
      title: "Convolution 2D & Filtres 3×3 (Détection des Contours)",
      shortTitle: "7. Conv2D (Filtres)",
      duration: "08:40",
      subtitles: (
        <span>
          La{' '}
          <Keyword id="convolution" onSelect={(id) => setSelectedKeywordId(id)}>
            convolution 2D
          </Keyword>{' '}
          fait glisser un filtre 3×3 sur la photo pour extraire les contours, yeux et textures dans une{' '}
          <Keyword id="carte_caracteristiques" onSelect={(id) => setSelectedKeywordId(id)}>
            carte d'activation (feature map)
          </Keyword>
          .
        </span>
      ),
      pythonSnippet: `# Extraction de caractéristiques visuelles par Conv2D
conv = tf.keras.layers.Conv2D(32, kernel_size=(3, 3), activation='relu')
feature_maps = conv(tf.expand_dims(image_224, axis=0))`,
    },
    {
      id: 8,
      title: "Inférence Finale & Probabilités Softmax (CNN)",
      shortTitle: "8. Softmax (Sortie)",
      duration: "09:50",
      subtitles: (
        <span>
          Les motifs extraits traversent la couche dense{' '}
          <Keyword id="softmax" onSelect={(id) => setSelectedKeywordId(id)}>
            Softmax
          </Keyword>{' '}
          : la probabilité maximale illumine la prédiction 'Chat domestique' avec 98% de confiance !
        </span>
      ),
      pythonSnippet: `# Prédiction finale par Softmax
output_probs = tf.keras.layers.Dense(1000, activation='softmax')(features)
predicted_id = tf.argmax(output_probs, axis=-1).numpy() # 281: tabby_cat`,
    },
    {
      id: 9,
      title: "Constitution des Lots (Batches) & Format NHWC",
      shortTitle: "9. Lots (Batches)",
      duration: "11:00",
      subtitles: (
        <span>
          Keras attend obligatoirement un{' '}
          <Keyword id="batch" onSelect={(id) => setSelectedKeywordId(id)}>
            lot 4D [Batch, H, W, C]
          </Keyword>
          . Pour une photo isolée, on ajoute l'axe de lot avec{' '}
          <Keyword id="expand_dims" onSelect={(id) => setSelectedKeywordId(id)}>
            tf.expand_dims(img, axis=0)
          </Keyword>
          .
        </span>
      ),
      pythonSnippet: `# Ajout de la dimension de batch obligatoire pour l'inférence
img_batch = tf.expand_dims(image, axis=0) # Forme : (1, 224, 224, 3)
predictions = model.predict(img_batch)`,
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
        return <RealScene3RgbChannels onSelectKeyword={setSelectedKeywordId} isPlaying={isPlaying} />;
      case 4:
        return <RealScene4Slicing onSelectKeyword={setSelectedKeywordId} isPlaying={isPlaying} />;
      case 5:
        return <RealScene5Resize onSelectKeyword={setSelectedKeywordId} isPlaying={isPlaying} />;
      case 6:
        return <RealScene6Normalization onSelectKeyword={setSelectedKeywordId} isPlaying={isPlaying} />;
      case 7:
        return <RealScene7Convolution onSelectKeyword={setSelectedKeywordId} isPlaying={isPlaying} />;
      case 8:
        return <RealScene8Classification onSelectKeyword={setSelectedKeywordId} isPlaying={isPlaying} />;
      case 9:
        return <RealScene9Batching onSelectKeyword={setSelectedKeywordId} isPlaying={isPlaying} />;
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
              Étape {currentChapter.id} / {chapters.length}
            </span>
          </div>
        </div>

        {/* In-Player Python Code Panel (Visible in Fullscreen & Regular mode right in the top empty space) */}
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
                  Étape {currentChapter.id} : {currentChapter.title}
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
                title="Étape précédente"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                onClick={() => setCurrentChapterIdx((prev) => Math.min(chapters.length - 1, prev + 1))}
                disabled={currentChapterIdx === chapters.length - 1}
                className="p-1 hover:text-slate-900 disabled:opacity-30 transition-colors"
                title="Étape suivante"
              >
                <SkipForward className="w-4 h-4" />
              </button>

              <div className="font-mono text-slate-500 text-[11px] hidden sm:block">
                <span>{currentChapter.duration}</span> / <span>11:00</span>
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

      {/* Chapters Quick Pills Bar (Below Video) */}
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
