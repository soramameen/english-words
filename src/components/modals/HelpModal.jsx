import { Check, X, RotateCcw, ArrowLeft } from 'lucide-react';

export default function HelpModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          <h2 className="text-xl font-bold text-gray-800 mb-4">アプリの使い方</h2>
          
          <div className="space-y-6 text-sm text-gray-700">
            <div>
              <h3 className="font-bold text-indigo-600 mb-2 text-base">3つの学習ステージ</h3>
              <ul className="space-y-3 pl-2">
                <li className="flex items-start">
                  <span className="w-3 h-3 rounded-full bg-blue-500 mt-1.5 mr-2 shrink-0"></span>
                  <span>
                    <span className="font-bold text-blue-600 block">Learning (学習中)</span>
                    初めて見る単語や、まだ覚えていない単語です。
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="w-3 h-3 rounded-full bg-yellow-500 mt-1.5 mr-2 shrink-0"></span>
                  <span>
                    <span className="font-bold text-yellow-600 block">Reviewing (復習中)</span>
                    一度「覚えた」としたけれど、定着させるために復習している単語です。
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="w-3 h-3 rounded-full bg-green-500 mt-1.5 mr-2 shrink-0"></span>
                  <span>
                    <span className="font-bold text-green-600 block">Mastered (習得済み)</span>
                    完全にマスターした単語です。素晴らしい！
                  </span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-indigo-600 mb-2 text-base">進め方</h3>
              <div className="space-y-4">
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 flex items-start">
                  <div className="bg-indigo-100 text-indigo-700 p-2 rounded-lg mr-3 shrink-0">
                    <Check size={20} />
                  </div>
                  <div>
                    <span className="font-bold text-gray-800 block">Got it!</span>
                    <span className="text-gray-600 text-xs">次のステージへ進みます。<br/>(Learning → Reviewing → Mastered)</span>
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 flex items-start">
                  <div className="bg-orange-100 text-orange-700 p-2 rounded-lg mr-3 shrink-0">
                    <X size={20} />
                  </div>
                  <div>
                    <span className="font-bold text-gray-800 block">Needs Work</span>
                    <span className="text-gray-600 text-xs">前のステージに戻します。<br/>(Mastered → Reviewing → Learning)</span>
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 flex items-start">
                  <div className="bg-gray-200 text-gray-600 p-2 rounded-lg mr-3 shrink-0">
                    <RotateCcw size={20} />
                  </div>
                  <div>
                    <span className="font-bold text-gray-800 block">Next / Skip</span>
                    <span className="text-gray-600 text-xs">ステータスを変えずに、次の単語へ進みます。</span>
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 flex items-start">
                  <div className="bg-gray-200 text-gray-600 p-2 rounded-lg mr-3 shrink-0">
                    <ArrowLeft size={20} />
                  </div>
                  <div>
                    <span className="font-bold text-gray-800 block">1つ戻る (Undo)</span>
                    <span className="text-gray-600 text-xs">カード左上の矢印ボタンで、直前の操作を取り消せます。</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-indigo-600 mb-2 text-base">キーボードショートカット</h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-gray-50 p-2 rounded border border-gray-100 flex items-center justify-between">
                  <span className="text-gray-600">カードをめくる</span>
                  <kbd className="px-2 py-1 bg-white border border-gray-300 rounded font-mono font-bold text-gray-700">Space</kbd>
                </div>
                <div className="bg-gray-50 p-2 rounded border border-gray-100 flex items-center justify-between">
                  <span className="text-gray-600">Got it!</span>
                  <kbd className="px-2 py-1 bg-white border border-gray-300 rounded font-mono font-bold text-gray-700">→</kbd>
                </div>
                <div className="bg-gray-50 p-2 rounded border border-gray-100 flex items-center justify-between">
                  <span className="text-gray-600">Next / Skip</span>
                  <kbd className="px-2 py-1 bg-white border border-gray-300 rounded font-mono font-bold text-gray-700">←</kbd>
                </div>
                <div className="bg-gray-50 p-2 rounded border border-gray-100 flex items-center justify-between">
                  <span className="text-gray-600">1つ戻る</span>
                  <kbd className="px-2 py-1 bg-white border border-gray-300 rounded font-mono font-bold text-gray-700 text-xs">Backspace</kbd>
                </div>
              </div>
            </div>

            <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-100 text-center">
              <p className="text-xs text-indigo-800 font-medium">
                💡 学習データは自動的に保存されます。<br/>いつでも好きな時に中断・再開できます。
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 px-6 py-4 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-gray-800 text-white rounded-lg font-bold hover:bg-gray-700 transition shadow-sm"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
}
