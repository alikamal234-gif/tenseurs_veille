import React, { useState } from 'react';
import { ArrowRight, Play, Server, Cpu, HardDrive, Zap, CheckCircle2 } from 'lucide-react';
import { Badge } from '../common/Badge';

export const DatasetPipelineVisualizer: React.FC = () => {
  const [activeStage, setActiveStage] = useState<number>(4);

  const stages = [
    {
      id: 0,
      name: '1. from_tensor_slices',
      short: 'Fichiers',
      shape: '() (scalaire)',
      dtype: 'tf.string',
      hardware: 'Disque / CPU I/O',
      description: 'Génère un flux d\'éléments scalaires représentant les chemins des images sur le disque (ex: "chat_01.jpg").',
      code: 'dataset = tf.data.Dataset.from_tensor_slices(file_paths)',
    },
    {
      id: 1,
      name: '2. map(decode_image)',
      short: 'Décodage',
      shape: '(600, 800, 3)',
      dtype: 'tf.uint8',
      hardware: 'CPU Multi-thread',
      description: 'Lit les octets bruts et décompresse le fichier en un tenseur matriciel tridimensionnel non normalisé.',
      code: 'def decode_fn(path):\n    raw = tf.io.read_file(path)\n    return tf.io.decode_jpeg(raw, channels=3)',
    },
    {
      id: 2,
      name: '3. map(resize & scale)',
      short: 'Harmonisation',
      shape: '(224, 224, 3)',
      dtype: 'tf.float32',
      hardware: 'CPU / GPU',
      description: 'Redimensionne l\'image à la résolution standard (224x224) et convertit les pixels en nombres flottants [0, 1].',
      code: 'def preprocess_fn(img):\n    img = tf.image.resize(img, [224, 224])\n    return img / 255.0',
    },
    {
      id: 3,
      name: '4. shuffle(buffer=1000)',
      short: 'Mélange',
      shape: '(224, 224, 3)',
      dtype: 'tf.float32',
      hardware: 'Mémoire RAM',
      description: 'Maintient un tampon de 1000 images et pioche aléatoirement pour casser toute corrélation d\'ordre entre classes.',
      code: 'dataset = dataset.shuffle(buffer_size=1000)',
    },
    {
      id: 4,
      name: '5. batch(32)',
      short: 'Lots (4D)',
      shape: '(32, 224, 224, 3)',
      dtype: 'tf.float32',
      hardware: 'CPU / RAM',
      description: 'Empile 32 images consécutives le long de la dimension 0, créant un tenseur de rang 4 prêt pour le calcul vectoriel.',
      code: 'dataset = dataset.batch(32)',
    },
    {
      id: 5,
      name: '6. prefetch(AUTOTUNE)',
      short: 'Prefetch',
      shape: '(32, 224, 224, 3)',
      dtype: 'tf.float32',
      hardware: 'VRAM GPU Asynchrone',
      description: 'Prépare le lot suivant en arrière-plan pendant que le GPU calcule la rétropropagation sur le lot courant.',
      code: 'dataset = dataset.prefetch(buffer_size=tf.data.AUTOTUNE)',
    },
  ];

  const current = stages[activeStage];

  return (
    <div className="academic-card border-slate-200 bg-white overflow-hidden space-y-4">
      {/* Header */}
      <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Server className="w-4 h-4 text-emerald-700" />
          <h4 className="text-xs sm:text-sm font-bold text-slate-800">
            Architecture du Pipeline tf.data.Dataset Haute Performance
          </h4>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="emerald">Étape {activeStage + 1} / {stages.length}</Badge>
        </div>
      </div>

      <div className="p-4 space-y-5">
        {/* Horizontal Pipeline Steps */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2">
          {stages.map((st, idx) => {
            const isActive = activeStage === st.id;
            return (
              <React.Fragment key={st.id}>
                <button
                  onClick={() => setActiveStage(st.id)}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex flex-col items-center min-w-[110px] border ${
                    isActive
                      ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs ring-2 ring-emerald-200'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <span className="text-[10px] opacity-80 uppercase font-mono tracking-wider">
                    Étape {idx + 1}
                  </span>
                  <span className="font-bold">{st.short}</span>
                  <span className={`text-[9px] font-mono mt-0.5 ${isActive ? 'text-emerald-200' : 'text-slate-400'}`}>
                    {st.shape}
                  </span>
                </button>

                {idx < stages.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-slate-300 shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Selected Stage Detail Panel */}
        <div className="p-4 bg-slate-900 text-slate-100 rounded-lg border border-slate-800 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
            <div>
              <span className="text-xs text-slate-400 font-mono">Fonction de pipeline :</span>
              <h3 className="text-sm font-bold text-emerald-400 font-mono">
                {current.name}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-sky-300 border border-slate-700 font-mono">
                Shape : {current.shape}
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-purple-300 border border-slate-700 font-mono">
                Dtype : {current.dtype}
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {current.description}
          </p>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
            <span>Matériel exécutant : <strong className="text-slate-200">{current.hardware}</strong></span>
          </div>

          <pre className="p-2.5 bg-slate-950 text-emerald-300 rounded font-mono text-xs overflow-x-auto border border-slate-800/80">
            {current.code}
          </pre>
        </div>

        {/* Educational takeaway on prefetching */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-600 flex items-start gap-2">
          <Zap className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <strong>Pourquoi le prefetch est-il indispensable ?</strong> Sans `.prefetch(tf.data.AUTOTUNE)`, le GPU passe jusqu'à 60% de son temps inactif à attendre que le CPU charge et décompresse les images du disque. Le prefetching élimine totalement ce goulet d'étranglement en chevauchant les calculs CPU et GPU.
          </div>
        </div>
      </div>
    </div>
  );
};
