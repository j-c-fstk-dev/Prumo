import React, { useState } from 'react';
import { ANDROID_STUDIO_FILES, AndroidCodeFile } from '../../data/androidFiles';
import { Copy, Check, Download, FileCode, Folder, ChevronRight, Sparkles, Terminal } from 'lucide-react';
import { generateAndroidProjectZip, downloadBlob } from '../../utils/zipGenerator';

export const KotlinCodeViewer: React.FC = () => {
  const [activeFile, setActiveFile] = useState<AndroidCodeFile>(ANDROID_STUDIO_FILES[0]);
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(activeFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    try {
      setIsDownloading(true);
      const blob = await generateAndroidProjectZip();
      downloadBlob(blob, 'Prumo-Android-Kotlin-Etapas1-8.zip');
    } catch (e) {
      console.error(e);
    } finally {
      setIsDownloading(false);
    }
  };

  const categories = [
    { id: 'all', label: 'Todos os Arquivos' },
    { id: 'ci', label: 'CI/CD & Workflows (Etapa 8)' },
    { id: 'test', label: 'Testes JUnit & Compose (Etapa 7)' },
    { id: 'database', label: 'Room SQLite & DAOs (Etapa 6)' },
    { id: 'network', label: 'Retrofit & APIs (Etapa 5)' },
    { id: 'viewmodel', label: 'ViewModel & LiveData (Etapa 4)' },
    { id: 'theme', label: 'Design System Compose (Etapa 3)' },
    { id: 'navigation', label: 'Navegação Type-Safe (Etapa 2)' },
    { id: 'data', label: 'DataStore & Repositórios' },
    { id: 'domain', label: 'Modelos de Domínio' },
    { id: 'gradle', label: 'Gradle & Configuração' },
    { id: 'activity', label: 'MainActivity & UI' }
  ];

  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredFiles = selectedCategory === 'all'
    ? ANDROID_STUDIO_FILES
    : ANDROID_STUDIO_FILES.filter(f => f.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-2xl p-6 border border-[#E6E8E6] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E3F2ED] text-[#1F6F5C] text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Estrutura Completa de Código Kotlin &amp; Compose
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-[#1A1D1B] font-display">
            Arquivos de Código Prontos para o Android Studio
          </h2>
          <p className="text-xs md:text-sm text-[#5B615D] mt-1">
            Inspecione, copie o código de qualquer arquivo ou baixe o pacote pronto para abrir direto no Android Studio.
          </p>
        </div>

        <button
          onClick={handleDownloadZip}
          disabled={isDownloading}
          className="px-4 py-2.5 bg-[#1F6F5C] hover:bg-[#2E8B73] text-white text-xs font-semibold rounded-xl shadow-sm transition-all flex items-center gap-2 shrink-0 cursor-pointer disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          {isDownloading ? 'Gerando .zip...' : 'Baixar Todos os Arquivos (.zip)'}
        </button>
      </div>

      {/* Navegador e Editor de Código */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Painel Esquerdo: Lista de Arquivos */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-[#E6E8E6] shadow-sm overflow-hidden">
          <div className="p-4 border-b border-[#E6E8E6] bg-[#F7F9F8]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#5B615D] mb-2 flex items-center gap-1.5">
              <Folder className="w-3.5 h-3.5 text-[#1F6F5C]" />
              Explorador de Arquivos (Project View)
            </h3>
            {/* Filtro por categoria */}
            <div className="flex flex-wrap gap-1">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`text-[11px] px-2 py-1 rounded-md transition-colors ${
                    selectedCategory === cat.id
                      ? 'bg-[#1F6F5C] text-white font-medium'
                      : 'bg-white text-[#5B615D] border border-[#E6E8E6] hover:bg-neutral-50'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="divide-y divide-[#E6E8E6] max-h-[520px] overflow-y-auto">
            {filteredFiles.map(file => {
              const isActive = activeFile.path === file.path;
              return (
                <div
                  key={file.path}
                  onClick={() => setActiveFile(file)}
                  className={`p-3 text-left transition-colors cursor-pointer flex items-center justify-between gap-2 ${
                    isActive ? 'bg-[#E3F2ED]/70 border-l-4 border-[#1F6F5C]' : 'hover:bg-[#F7F9F8]'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <FileCode className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#1F6F5C]' : 'text-[#5B615D]'}`} />
                      <span className={`text-xs font-mono font-medium truncate ${isActive ? 'text-[#1F6F5C] font-semibold' : 'text-[#1A1D1B]'}`}>
                        {file.name}
                      </span>
                    </div>
                    <span className="text-[10px] text-[#5B615D] block truncate mt-0.5 font-mono">
                      {file.path}
                    </span>
                  </div>
                  <ChevronRight className={`w-3.5 h-3.5 shrink-0 transition-transform ${isActive ? 'text-[#1F6F5C] translate-x-0.5' : 'text-neutral-300'}`} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Painel Direito: Visualizador de Código */}
        <div className="lg:col-span-8 bg-[#1A1D1B] rounded-2xl shadow-lg border border-neutral-800 overflow-hidden text-neutral-100">
          {/* Header do Arquivo */}
          <div className="bg-[#242825] px-4 py-3 border-b border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              <span className="ml-2 font-mono text-xs text-neutral-300 font-medium">
                {activeFile.path}
              </span>
            </div>

            <button
              onClick={handleCopy}
              className="px-3 py-1.5 bg-neutral-700/60 hover:bg-neutral-700 text-neutral-200 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar Código</span>
                </>
              )}
            </button>
          </div>

          {/* Descrição do Arquivo */}
          <div className="bg-[#1e221f] px-4 py-2 border-b border-neutral-800 text-[11px] text-neutral-400 flex items-center gap-2">
            <span className="text-[#F2A93B] font-semibold uppercase text-[10px] px-1.5 py-0.5 rounded bg-[#F2A93B]/10">
              {activeFile.language}
            </span>
            <span>{activeFile.description}</span>
          </div>

          {/* Área de Código com Numeração de Linhas */}
          <div className="p-4 overflow-x-auto max-h-[540px] font-mono text-xs leading-relaxed">
            <pre className="text-neutral-200 whitespace-pre">
              <code>{activeFile.code}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
