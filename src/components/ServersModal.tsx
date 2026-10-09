import React from 'react';
import { SERVERS_20, PlayerServerDef } from '../services/playerServers';
import { X, Server, CheckCircle2, Shield, Zap } from 'lucide-react';

interface ServersModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentServerIndex: number;
  onSelectServer: (index: number) => void;
}

export const ServersModal: React.FC<ServersModalProps> = ({
  isOpen,
  onClose,
  currentServerIndex,
  onSelectServer,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-[#11131c] border border-white/10 rounded-2xl overflow-hidden shadow-2xl p-6">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                20 Active Zero-Sandbox Servers
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  100% ONLINE
                </span>
              </h3>
              <p className="text-xs text-gray-400">
                Automatic failover network. Select any server to instantly switch video engine.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Server Grid */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-[60vh] overflow-y-auto pr-1">
          {SERVERS_20.map((server, idx) => {
            const isActive = currentServerIndex === idx;
            return (
              <button
                key={server.id}
                onClick={() => {
                  onSelectServer(idx);
                  onClose();
                }}
                className={`flex items-start justify-between p-3 rounded-xl border text-left transition cursor-pointer ${
                  isActive
                    ? 'bg-red-600/20 border-red-500 text-white shadow-lg shadow-red-950/40'
                    : 'bg-[#161826] border-white/5 hover:border-white/20 hover:bg-[#1d2030] text-gray-300'
                }`}
              >
                <div className="min-w-0 pr-2">
                  <div className="flex items-center gap-1.5 font-bold text-xs truncate">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isActive ? 'bg-red-500 animate-ping' : 'bg-emerald-400'
                      }`}
                    />
                    <span className="truncate">{server.name}</span>
                  </div>
                  <div className="text-[10px] text-gray-400 mt-1 flex items-center gap-1.5">
                    <span className="text-amber-400 font-medium">{server.quality}</span>
                    <span>•</span>
                    <span>{server.speed}</span>
                  </div>
                  <div className="text-[9px] text-gray-500 truncate mt-0.5">{server.audioInfo}</div>
                </div>

                {isActive && (
                  <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-red-600 text-white shrink-0">
                    ACTIVE
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-gray-400 flex-wrap gap-2">
          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <Shield className="w-4 h-4" />
            <span>Zero-Sandbox Protection: Blocks invasive popups & malicious redirects</span>
          </div>
          <span className="font-mono text-gray-500">Auto-Heal Active</span>
        </div>
      </div>
    </div>
  );
};
