import React, { useState } from 'react';
import { Box, Table as TableIcon, Code2, Clock, Check, Copy, Sparkles, HelpCircle } from 'lucide-react';

interface RealSceneLivrablesProps {
  onSelectKeyword: (id: string) => void;
  isPlaying?: boolean;
}

export const RealSceneLivrables: React.FC<RealSceneLivrablesProps> = () => {
  const [activeTab, setActiveTab] = useState<'schema' | 'tableau' | 'code' | 'chrono'>('schema');
  const [copied, setCopied] = useState<boolean>(false);

  const copyText = (txt: string) => {
    navigator.clipboard.writeText(txt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-3 bg-white text-slate-800 relative select-none">
      <div className="w-full flex items-center justify-between pb-2 mb-2 border-b border-slate-100 text-xs font-mono text-slate-500">
        <span className="flex items-center gap-1.5 text-emerald-800 font-semibold">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>Synthèse des Livrables de Veille &amp; Préparation Soutenance</span>
        </span>
        <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
          25 à 30 min + 2-3 min Q&amp;A
        </span>
      </div>

      <div className="w-full max-w-2xl space-y-2.5">
        {/* Sub-tabs Selector */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg text-xs font-mono">
          <button
            onClick={() => setActiveTab('schema')}
            className={`flex-1 py-1 px-2 rounded font-semibold transition-all flex items-center justify-center gap-1 ${
              activeTab === 'schema'
                ? 'bg-white text-emerald-900 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Box className="w-3.5 h-3.5 text-emerald-600" />
            <span>1. Schéma 3D/4D</span>
          </button>

          <button
            onClick={() => setActiveTab('tableau')}
            className={`flex-1 py-1 px-2 rounded font-semibold transition-all flex items-center justify-center gap-1 ${
              activeTab === 'tableau'
                ? 'bg-white text-emerald-900 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <TableIcon className="w-3.5 h-3.5 text-sky-600" />
            <span>2. Tableau Comparatif</span>
          </button>

          <button
            onClick={() => setActiveTab('code')}
            className={`flex-1 py-1 px-2 rounded font-semibold transition-all flex items-center justify-center gap-1 ${
              activeTab === 'code'
                ? 'bg-white text-emerald-900 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Code2 className="w-3.5 h-3.5 text-amber-600" />
            <span>3. Script Python</span>
          </button>

          <button
            onClick={() => setActiveTab('chrono')}
            className={`flex-1 py-1 px-2 rounded font-semibold transition-all flex items-center justify-center gap-1 ${
              activeTab === 'chrono'
                ? 'bg-white text-emerald-900 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-indigo-600" />
            <span>Timing 25-30 min</span>
          </button>
        </div>

        {/* Tab 1: Schéma 3D/4D */}
        {activeTab === 'schema' && (
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2 text-xs animate-fadeIn">
            <div className="flex items-center justify-between font-mono">
              <span className="font-bold text-slate-800">Schéma des Dimensions : Image vs Lot (Batch)</span>
              <span className="text-[11px] text-emerald-800 bg-white px-2 py-0.5 rounded border border-slate-200">
                Convention NHWC
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-center font-mono">
              <div className="p-2.5 bg-white rounded border border-slate-200 shadow-2xs space-y-1">
                <span className="text-[10px] text-slate-500 font-bold block">IMAGE ISOLÉE (3D)</span>
                <span className="text-emerald-800 font-extrabold text-sm block">(224, 224, 3)</span>
                <p className="text-[10px] text-slate-600">[Hauteur, Largeur, Canaux RGB]</p>
                <div className="text-[9px] text-slate-400">1 seul échantillon</div>
              </div>
              <div className="p-2.5 bg-white rounded border border-emerald-300 shadow-2xs space-y-1 bg-emerald-50/20">
                <span className="text-[10px] text-emerald-800 font-bold block">LOT D'IMAGES (4D BATCH)</span>
                <span className="text-emerald-950 font-extrabold text-sm block">(32, 224, 224, 3)</span>
                <p className="text-[10px] text-slate-600">[Batch N, H, W, Canaux]</p>
                <div className="text-[9px] text-emerald-700 font-bold">Vectorisation GPU (GEMM)</div>
              </div>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed font-sans">
              💡 <strong>Règle essentielle :</strong> Keras attend toujours 4 dimensions. Pour passer une seule image 3D au modèle, on ajoute l'axe de batch avec <code className="font-mono text-emerald-800 bg-white px-1 py-0.5 rounded border">tf.expand_dims(img, axis=0)</code>.
            </p>
          </div>
        )}

        {/* Tab 2: Tableau Comparatif */}
        {activeTab === 'tableau' && (
          <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg space-y-1 text-xs animate-fadeIn">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[11px] font-mono border-collapse">
                <thead>
                  <tr className="bg-slate-200/80 text-slate-700 font-bold">
                    <th className="p-1.5">Objet</th>
                    <th className="p-1.5">Rang</th>
                    <th className="p-1.5">Shape</th>
                    <th className="p-1.5">Exemple Deep Learning</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  <tr>
                    <td className="p-1.5 font-bold">Scalaire</td>
                    <td className="p-1.5">0</td>
                    <td className="p-1.5 text-emerald-800">()</td>
                    <td className="p-1.5 text-slate-600">Valeur de perte (loss), learning rate</td>
                  </tr>
                  <tr>
                    <td className="p-1.5 font-bold">Vecteur</td>
                    <td className="p-1.5">1</td>
                    <td className="p-1.5 text-emerald-800">(N,)</td>
                    <td className="p-1.5 text-slate-600">Labels (y_true), biais synaptique (b)</td>
                  </tr>
                  <tr>
                    <td className="p-1.5 font-bold">Matrice</td>
                    <td className="p-1.5">2</td>
                    <td className="p-1.5 text-emerald-800">(M, N)</td>
                    <td className="p-1.5 text-slate-600">Poids d'une couche Dense (W)</td>
                  </tr>
                  <tr>
                    <td className="p-1.5 font-bold">Tenseur 3D</td>
                    <td className="p-1.5">3</td>
                    <td className="p-1.5 text-emerald-800">(H, W, 3)</td>
                    <td className="p-1.5 text-slate-600">Photo couleur isolée RGB</td>
                  </tr>
                  <tr className="bg-emerald-50/40">
                    <td className="p-1.5 font-bold text-emerald-900">Tenseur 4D</td>
                    <td className="p-1.5 font-bold text-emerald-900">4</td>
                    <td className="p-1.5 font-bold text-emerald-900">(B, H, W, 3)</td>
                    <td className="p-1.5 text-emerald-950 font-bold">Lot d'entraînement pour CNN</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Script Python */}
        {activeTab === 'code' && (
          <div className="p-2.5 bg-slate-900 text-slate-100 rounded-lg text-xs font-mono space-y-1.5 animate-fadeIn">
            <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-1">
              <span>Pipeline complet de chargement et prétraitement</span>
              <button
                onClick={() =>
                  copyText(`import tensorflow as tf
raw = tf.io.read_file("chat.jpg")
img = tf.io.decode_jpeg(raw, channels=3)
img_224 = tf.image.resize(img, [224, 224])
img_norm = tf.cast(img_224, tf.float32) / 255.0
batch = tf.expand_dims(img_norm, axis=0)
preds = model.predict(batch)`)
                }
                className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 text-[10px]"
              >
                {copied ? 'Copié !' : 'Copier'}
              </button>
            </div>
            <pre className="text-[10.5px] leading-relaxed overflow-x-auto text-emerald-300">
{`# 1. Chargement & Décodage
raw = tf.io.read_file("image.jpg")
img = tf.io.decode_jpeg(raw, channels=3)

# 2. Redimensionnement bilinéaire & Normalisation [0, 1]
img_resized = tf.image.resize(img, [224, 224])
img_norm = tf.cast(img_resized, tf.float32) / 255.0

# 3. Ajout de l'axe de batch 4D pour Keras
batch_4d = tf.expand_dims(img_norm, axis=0) # (1, 224, 224, 3)
predictions = model.predict(batch_4d)`}
            </pre>
          </div>
        )}

        {/* Tab 4: Chronomètre Soutenance */}
        {activeTab === 'chrono' && (
          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg space-y-1 text-xs animate-fadeIn font-sans">
            <span className="font-bold text-slate-900 font-mono text-[11px] block border-b border-slate-200 pb-1">
              Minutage Recommandé pour la Présentation (28 min + 3 min Q&amp;A) :
            </span>
            <div className="grid grid-cols-2 gap-1.5 text-[11px] font-mono pt-1">
              <div className="p-1 bg-white rounded border border-slate-200">
                <span className="text-emerald-800 font-bold">Partie 1 (5 min) :</span> Pourquoi les tenseurs &amp; GPU
              </div>
              <div className="p-1 bg-white rounded border border-slate-200">
                <span className="text-emerald-800 font-bold">Partie 2 (6 min) :</span> Shape, rank, dtype &amp; Gris vs RGB
              </div>
              <div className="p-1 bg-white rounded border border-slate-200">
                <span className="text-emerald-800 font-bold">Partie 3 (6 min) :</span> Chargement, resize &amp; tf.data
              </div>
              <div className="p-1 bg-white rounded border border-slate-200">
                <span className="text-emerald-800 font-bold">Partie 4 (5 min) :</span> Normalisation &amp; preprocess_input
              </div>
              <div className="p-1 bg-white rounded border border-slate-200">
                <span className="text-emerald-800 font-bold">Partie 5 (6 min) :</span> Entrée CNN 4D &amp; Erreurs classiques
              </div>
              <div className="p-1 bg-sky-50 text-sky-950 font-bold rounded border border-sky-300">
                Q&amp;A (3 min) : Questions du jury &amp; Clôture
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
