import React, { useState } from 'react';
import { Layers, Box, Hash, Calculator, HelpCircle } from 'lucide-react';
import { Badge } from '../common/Badge';

export const TensorRankExplorer: React.FC = () => {
  const [selectedRank, setSelectedRank] = useState<0 | 1 | 2 | 3 | 4>(3);

  // Dynamic dimension states
  const [vectorDim, setVectorDim] = useState<number>(5);
  const [matrixH, setMatrixH] = useState<number>(4);
  const [matrixW, setMatrixW] = useState<number>(4);
  const [tensorH, setTensorH] = useState<number>(4);
  const [tensorW, setTensorW] = useState<number>(4);
  const [tensorC, setTensorC] = useState<number>(3);
  const [batchN, setBatchN] = useState<number>(3);

  // Computations
  let shapeString = '()';
  let totalElements = 1;
  let formulaString = '1';
  let indexingExample = 's';

  if (selectedRank === 0) {
    shapeString = '()';
    totalElements = 1;
    formulaString = '1 (scalaire unique)';
    indexingExample = 'scalaire.numpy() -> 42';
  } else if (selectedRank === 1) {
    shapeString = `(${vectorDim},)`;
    totalElements = vectorDim;
    formulaString = `${vectorDim}`;
    indexingExample = `vecteur[2]`;
  } else if (selectedRank === 2) {
    shapeString = `(${matrixH}, ${matrixW})`;
    totalElements = matrixH * matrixW;
    formulaString = `${matrixH} × ${matrixW} = ${totalElements}`;
    indexingExample = `matrice[y, x]`;
  } else if (selectedRank === 3) {
    shapeString = `(${tensorH}, ${tensorW}, ${tensorC})`;
    totalElements = tensorH * tensorW * tensorC;
    formulaString = `${tensorH} × ${tensorW} × ${tensorC} = ${totalElements}`;
    indexingExample = `image[y, x, c]`;
  } else if (selectedRank === 4) {
    shapeString = `(${batchN}, ${tensorH}, ${tensorW}, ${tensorC})`;
    totalElements = batchN * tensorH * tensorW * tensorC;
    formulaString = `${batchN} × ${tensorH} × ${tensorW} × ${tensorC} = ${totalElements}`;
    indexingExample = `lot[b, y, x, c]`;
  }

  return (
    <div className="academic-card border-slate-200 bg-white overflow-hidden space-y-4">
      {/* Visualizer Header */}
      <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-700" />
          <h4 className="text-xs sm:text-sm font-bold text-slate-800">
            Explorateur Géométrique des Rangs Tensoriels
          </h4>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="emerald">Rang : {selectedRank}</Badge>
          <Badge variant="blue">Shape : {shapeString}</Badge>
          <Badge variant="slate">{totalElements} éléments</Badge>
        </div>
      </div>

      <div className="p-4 space-y-5">
        {/* Rank Tabs Selector */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-lg">
          {[
            { rank: 0, label: 'Rang 0 : Scalaire', icon: '•' },
            { rank: 1, label: 'Rang 1 : Vecteur', icon: '→' },
            { rank: 2, label: 'Rang 2 : Matrice', icon: '⊞' },
            { rank: 3, label: 'Rang 3 : Image (HWC)', icon: '🧊' },
            { rank: 4, label: 'Rang 4 : Batch (NHWC)', icon: '📚' },
          ].map((item) => (
            <button
              key={item.rank}
              onClick={() => setSelectedRank(item.rank as 0 | 1 | 2 | 3 | 4)}
              className={`flex-1 min-w-[130px] px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                selectedRank === item.rank
                  ? 'bg-white text-emerald-950 shadow-2xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Dimension Controls */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-md text-xs space-y-3">
          <div className="font-semibold text-slate-700 flex items-center gap-1.5">
            <Calculator className="w-3.5 h-3.5 text-emerald-700" />
            <span>Paramètres de dimension interactifs :</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {selectedRank === 1 && (
              <div>
                <label className="text-[11px] text-slate-600 block mb-1">
                  Longueur (N) : {vectorDim}
                </label>
                <input
                  type="range"
                  min="2"
                  max="10"
                  value={vectorDim}
                  onChange={(e) => setVectorDim(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>
            )}

            {selectedRank === 2 && (
              <>
                <div>
                  <label className="text-[11px] text-slate-600 block mb-1">
                    Lignes (H) : {matrixH}
                  </label>
                  <input
                    type="range"
                    min="2"
                    max="6"
                    value={matrixH}
                    onChange={(e) => setMatrixH(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-600 block mb-1">
                    Colonnes (W) : {matrixW}
                  </label>
                  <input
                    type="range"
                    min="2"
                    max="6"
                    value={matrixW}
                    onChange={(e) => setMatrixW(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                </div>
              </>
            )}

            {(selectedRank === 3 || selectedRank === 4) && (
              <>
                <div>
                  <label className="text-[11px] text-slate-600 block mb-1">
                    Hauteur (H) : {tensorH}
                  </label>
                  <input
                    type="range"
                    min="2"
                    max="5"
                    value={tensorH}
                    onChange={(e) => setTensorH(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-600 block mb-1">
                    Largeur (W) : {tensorW}
                  </label>
                  <input
                    type="range"
                    min="2"
                    max="5"
                    value={tensorW}
                    onChange={(e) => setTensorW(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-600 block mb-1">
                    Canaux (C) : {tensorC} {tensorC === 1 ? '(Gris)' : '(RGB)'}
                  </label>
                  <select
                    value={tensorC}
                    onChange={(e) => setTensorC(Number(e.target.value))}
                    className="w-full p-1 bg-white border border-slate-300 rounded text-xs"
                  >
                    <option value={1}>1 Canal (Gris)</option>
                    <option value={3}>3 Canaux (RGB)</option>
                  </select>
                </div>
              </>
            )}

            {selectedRank === 4 && (
              <div>
                <label className="text-[11px] text-slate-600 block mb-1">
                  Lot / Batch (N) : {batchN}
                </label>
                <input
                  type="range"
                  min="2"
                  max="4"
                  value={batchN}
                  onChange={(e) => setBatchN(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>
            )}
          </div>
        </div>

        {/* Visual Geometric Canvas */}
        <div className="p-6 bg-slate-950 rounded-lg border border-slate-800 flex flex-col items-center justify-center min-h-[220px]">
          {selectedRank === 0 && (
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-white font-mono font-bold text-lg shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                42
              </div>
              <div className="text-center">
                <span className="text-xs text-slate-400">Scalaire pur (0 axe)</span>
                <p className="text-[11px] text-emerald-400 font-mono mt-0.5">tf.constant(42)</p>
              </div>
            </div>
          )}

          {selectedRank === 1 && (
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center gap-1.5 p-2 bg-slate-900 rounded border border-slate-700">
                {Array.from({ length: vectorDim }, (_, i) => (
                  <div
                    key={i}
                    className="w-9 h-9 rounded bg-emerald-950 border border-emerald-500/60 flex flex-col items-center justify-center text-emerald-200 font-mono text-xs"
                  >
                    <span className="text-[9px] text-slate-500 font-sans">[{i}]</span>
                    <span>{(i * 1.5 + 1.2).toFixed(1)}</span>
                  </div>
                ))}
              </div>
              <span className="text-xs text-slate-400">1 axe horizontal • Indice [i]</span>
            </div>
          )}

          {selectedRank === 2 && (
            <div className="flex flex-col items-center gap-3">
              <div className="grid gap-1.5 p-2.5 bg-slate-900 rounded border border-slate-700">
                {Array.from({ length: matrixH }, (_, y) => (
                  <div key={y} className="flex gap-1.5">
                    {Array.from({ length: matrixW }, (_, x) => (
                      <div
                        key={x}
                        className="w-8 h-8 rounded bg-sky-950/80 border border-sky-500/50 flex flex-col items-center justify-center text-sky-200 font-mono text-[10px]"
                      >
                        <span className="text-[8px] text-slate-500">{y},{x}</span>
                        <span>{(y * matrixW + x + 1)}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              <span className="text-xs text-slate-400">2 axes : Lignes (y) × Colonnes (x)</span>
            </div>
          )}

          {selectedRank === 3 && (
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center gap-4 flex-wrap justify-center">
                {Array.from({ length: tensorC }, (_, c) => {
                  const channelNames = ['Rouge (R)', 'Vert (V)', 'Bleu (B)'];
                  const channelColors = [
                    'border-red-500/60 bg-red-950/40 text-red-200',
                    'border-green-500/60 bg-green-950/40 text-green-200',
                    'border-blue-500/60 bg-blue-950/40 text-blue-200',
                  ];
                  return (
                    <div key={c} className="flex flex-col items-center gap-1.5">
                      <span className="text-[10px] text-slate-400 font-mono">
                        Canal {c} : {tensorC === 1 ? 'Luminance' : channelNames[c]}
                      </span>
                      <div className="grid gap-1 p-2 bg-slate-900 rounded border border-slate-700">
                        {Array.from({ length: tensorH }, (_, y) => (
                          <div key={y} className="flex gap-1">
                            {Array.from({ length: tensorW }, (_, x) => (
                              <div
                                key={x}
                                className={`w-6 h-6 rounded border flex items-center justify-center font-mono text-[9px] ${
                                  tensorC === 1
                                    ? 'border-slate-500/60 bg-slate-800 text-slate-200'
                                    : channelColors[c]
                                }`}
                              >
                                {((y + x * 2 + c * 3) % 9) + 1}
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
              <span className="text-xs text-slate-400">
                3 axes : Hauteur (H) × Largeur (W) × Canaux (C)
              </span>
            </div>
          )}

          {selectedRank === 4 && (
            <div className="flex flex-col items-center gap-3 w-full">
              <div className="flex items-center gap-3 flex-wrap justify-center">
                {Array.from({ length: batchN }, (_, b) => (
                  <div
                    key={b}
                    className="p-2 rounded bg-slate-900 border border-slate-700 flex flex-col items-center gap-1.5"
                  >
                    <span className="text-[10px] text-emerald-400 font-mono font-semibold">
                      Image {b} du lot (Batch)
                    </span>
                    <div className="grid gap-0.5 p-1 bg-slate-950 rounded border border-slate-800">
                      {Array.from({ length: tensorH }, (_, y) => (
                        <div key={y} className="flex gap-0.5">
                          {Array.from({ length: tensorW }, (_, x) => (
                            <div
                              key={x}
                              className="w-4 h-4 rounded-xs bg-emerald-900/60 border border-emerald-500/40"
                              title={`b=${b}, y=${y}, x=${x}`}
                            />
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <span className="text-xs text-slate-400">
                4 axes : Batch (N) × Hauteur (H) × Largeur (W) × Canaux (C)
              </span>
            </div>
          )}
        </div>

        {/* Mathematical summary card */}
        <div className="p-3 bg-slate-50 rounded border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div>
            <span className="text-slate-500 font-medium">Formule du nombre d'éléments : </span>
            <span className="font-mono text-emerald-800 font-semibold">{formulaString}</span>
          </div>
          <div>
            <span className="text-slate-500 font-medium">Indexation Python : </span>
            <code className="font-mono bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-800">
              {indexingExample}
            </code>
          </div>
        </div>
      </div>
    </div>
  );
};
