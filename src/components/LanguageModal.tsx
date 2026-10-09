import React, { useState } from 'react';
import { LANGUAGES_50 } from '../services/i18n';
import { Search, X, Check, Globe } from 'lucide-react';

interface LanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLang: string;
  onSelectLang: (code: string) => void;
}

export const LanguageModal: React.FC<LanguageModalProps> = ({
  isOpen,
  onClose,
  selectedLang,
  onSelectLang,
}) => {
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filtered = LANGUAGES_50.filter(
    (l) =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.nativeName.toLowerCase().includes(search.toLowerCase()) ||
      l.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-[#12141c] border border-gray-800 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl shadow-red-950/20 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-800/80 bg-[#161922]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-red-600/10 text-red-500 border border-red-500/20">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Select Language <span className="text-xs px-2 py-0.5 rounded-full bg-red-900/40 text-red-300 border border-red-700/50">50 Languages</span>
              </h2>
              <p className="text-xs text-gray-400">Choose your preferred UI language for GOO TV</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-800/50 bg-[#0e1017]">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by English name or native script (e.g. हिन्दी, தமிழ், Korean)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#181a24] border border-gray-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-red-500 transition"
              autoFocus
            />
          </div>
        </div>

        {/* Language Grid */}
        <div className="p-4 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[60vh] scrollbar-thin scrollbar-thumb-gray-800">
          {filtered.map((lang) => {
            const isSelected = selectedLang === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => {
                  onSelectLang(lang.code);
                  onClose();
                }}
                className={`flex items-center justify-between p-3 rounded-xl border text-left transition cursor-pointer group ${
                  isSelected
                    ? 'bg-red-600/15 border-red-500/80 text-white shadow-sm shadow-red-900/30'
                    : 'bg-[#151720] border-gray-800 hover:border-gray-700 hover:bg-[#1c1f2b] text-gray-300'
                }`}
              >
                <div className="min-w-0 pr-2">
                  <div className="text-sm font-semibold truncate flex items-center gap-1.5">
                    {lang.flag && <span>{lang.flag}</span>}
                    <span>{lang.name}</span>
                  </div>
                  <div className="text-xs text-gray-400 truncate font-sans">{lang.nativeName}</div>
                </div>
                {isSelected ? (
                  <div className="w-5 h-5 rounded-full bg-red-600 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-white stroke-[3]" />
                  </div>
                ) : (
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-gray-800/80 text-gray-400">
                    {lang.code}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
