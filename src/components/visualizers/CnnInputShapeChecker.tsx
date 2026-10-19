import React, { useState } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Layers, Play, ArrowRight, ShieldCheck } from 'lucide-react';
import { Badge } from '../common/Badge';

export const CnnInputShapeChecker: React.FC = () => {
  // Model expected shape
  const [modelH, setModelH] = useState<number>(224);
  const [modelW, setModelW] = useState<number>(224);
  const [modelC, setModelC] = useState<1 | 3>(3);

  // User input image shape
  const [imageH, setImageH] = useState<number>(224);
  const [imageW, setImageW] = useState<number>(224);
  const [imageC, setImageC] = useState<1 | 3>(3);
  const [hasExpandDims, setHasExpandDims] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{
    status: 'idle' | 'success' | 'error';
    message: string;
    outputShape?: string;
  }>({
    status: 'idle',
    message: 'Cliquez sur "Valider l\'entrée dans Conv2D" pour tester.',
  });

  const runCheck = () => {
    // Current input shape
    const ndim = hasExpandDims ? 4 : 3;
    const currentShape = hasExpandDims ? `(1, ${imageH}, ${imageW}, ${imageC})` : `(${imageH}, ${imageW}, ${imageC})`;

    // Check 1: Must be 4D
    if (!hasExpandDims) {
      setTestResult({
        status: 'error',
        message: `ValueError: Input 0 of layer "conv2d" is incompatible with the layer: expected min_ndim=4, found ndim=3. Full shape received: ${currentShape}. Une image isolée (3D) doit être convertie en lot (4D) avec tf.expand_dims(img, axis=0).`,
      });
      return;
    }

    // Check 2: Spatial dimensions check
    if (imageH !== modelH || imageW !== modelW) {
      setTestResult({
        status: 'error',
        message: `ValueError: Incompatibilité de résolution spatiale. Le modèle attend (${modelH}, ${modelW}) mais l'image a une résolution de (${imageH}, ${imageW}). Redimensionnez avec tf.image.resize() !`,
      });
      return;
    }

    // Check 3: Channels check
    if (imageC !== modelC) {
      setTestResult({
        status: 'error',
        message: `ValueError: Incompatibilité du nombre de canaux. Le modèle attend ${modelC} canal/canaux mais le tenseur en fournit ${imageC}.`,
      });
      return;
    }

    // Success
    // Conv2D with 3x3 kernel and 'valid' padding produces (H-2, W-2, 32)
    const outH = imageH - 2;
    const outW = imageW - 2;
    setTestResult({
      status: 'success',
      message: `Succès ! Le tenseur 4D de forme ${currentShape} respecte parfaitement le contrat d'entrée du CNN.`,
      outputShape: `(1, ${outH}, ${outW}, 32)`,
    });
  };

  return (
    <div className="academic-card border-slate-200 bg-white overflow-hidden space-y-4">
      {/* Header */}
      <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <h4 className="text-xs sm:text-sm font-bold text-slate-800">
            Vérificateur de Contrat d'Entrée CNN (Conv2D Input Shape)
          </h4>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="blue">
            input_shape=({modelH}, {modelW}, {modelC})
          </Badge>
        </div>
      </div>

      <div className="p-4 space-y-5">
        {/* Model Spec and User Tensor Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left: Model Definition */}
          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-2 text-xs">
            <div className="flex items-center justify-between font-bold text-slate-800 pb-1 border-b border-slate-200">
              <span>Couche Conv2D définie dans Keras :</span>
              <span className="font-mono text-emerald-700">Modèle Cible</span>
            </div>
            <pre className="p-2 bg-slate-900 text-emerald-300 rounded font-mono text-xs overflow-x-auto">
{`model = tf.keras.Sequential([
    layers.Input(shape=(${modelH}, ${modelW}, ${modelC})),
    layers.Conv2D(32, kernel_size=(3, 3))
])`}
            </pre>
            <span className="text-[11px] text-slate-500 block">
              Forme interne attendue par Keras : <strong className="text-slate-800 font-mono">(None, {modelH}, {modelW}, {modelC})</strong>
            </span>
          </div>

          {/* Right: Input Image Tensor Simulation */}
          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-3 text-xs">
            <div className="flex items-center justify-between font-bold text-slate-800 pb-1 border-b border-slate-200">
              <span>Tenseur d'image fourni :</span>
              <span className="font-mono text-slate-600">
                {hasExpandDims ? `(1, ${imageH}, ${imageW}, ${imageC})` : `(${imageH}, ${imageW}, ${imageC})`}
              </span>
            </div>

            {/* Checkbox for expand dims */}
            <label className="flex items-center gap-2 p-2 bg-white rounded border border-emerald-300 cursor-pointer text-slate-800 font-semibold shadow-2xs">
              <input
                type="checkbox"
                checked={hasExpandDims}
                onChange={(e) => {
                  setHasExpandDims(e.target.checked);
                  setTestResult({ status: 'idle', message: 'Paramètre modifié. Cliquez sur "Tester".' });
                }}
                className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
              />
              <span className="text-xs">
                Appliquer <code className="font-mono text-emerald-800 bg-emerald-50 px-1 py-0.5 rounded">tf.expand_dims(img, axis=0)</code>
              </span>
            </label>

            {/* Resolution and channels selection */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] text-slate-600 block mb-0.5">Résolution image :</label>
                <select
                  value={imageH}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    setImageH(v);
                    setImageW(v);
                  }}
                  className="w-full p-1 bg-white border border-slate-300 rounded text-xs font-mono"
                >
                  <option value={224}>224x224 (Standard)</option>
                  <option value={128}>128x128 (Différent)</option>
                  <option value={28}>28x28 (MNIST)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-600 block mb-0.5">Canaux :</label>
                <select
                  value={imageC}
                  onChange={(e) => setImageC(Number(e.target.value) as 1 | 3)}
                  className="w-full p-1 bg-white border border-slate-300 rounded text-xs font-mono"
                >
                  <option value={3}>3 (RGB)</option>
                  <option value={1}>1 (Niveaux de gris)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Validation Button */}
        <div className="flex justify-center">
          <button
            onClick={runCheck}
            className="flex items-center gap-2 px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-md text-xs font-bold shadow-xs transition-colors"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Valider l'entrée dans le modèle Conv2D</span>
          </button>
        </div>

        {/* Result Diagnostic Panel */}
        {testResult.status !== 'idle' && (
          <div
            className={`p-4 rounded-lg border text-xs space-y-2 animate-fadeIn ${
              testResult.status === 'success'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                : 'bg-red-50 border-red-300 text-red-950'
            }`}
          >
            <div className="flex items-center gap-2 font-bold text-sm">
              {testResult.status === 'success' ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Validation Réussie !</span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-red-600 shrink-0" />
                  <span>Erreur Keras Détectée !</span>
                </>
              )}
            </div>

            <p className="font-mono text-xs leading-relaxed">
              {testResult.message}
            </p>

            {testResult.outputShape && (
              <div className="pt-2 border-t border-emerald-200 flex items-center justify-between text-emerald-900">
                <span className="font-sans font-semibold">
                  Tenseur de sortie de la première convolution :
                </span>
                <span className="font-mono font-bold bg-white px-2 py-0.5 rounded border border-emerald-200">
                  {testResult.outputShape} (32 cartes d'activation)
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
