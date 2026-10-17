import React, { useState } from 'react';
import { 
  Database, 
  HardDrive, 
  Sparkles, 
  CheckCircle2, 
  Download, 
  FolderTree, 
  ArrowRight, 
  Wifi, 
  WifiOff, 
  Check, 
  Code2, 
  Layers, 
  ShieldCheck, 
  CheckSquare, 
  Square,
  Play,
  RefreshCw,
  Plus,
  Trash2,
  Server,
  Smartphone
} from 'lucide-react';
import { generateAndroidProjectZip, downloadBlob } from '../../utils/zipGenerator';

export const Step6LocalStorageGuide: React.FC<{ onOpenCodeViewer: () => void }> = ({ onOpenCodeViewer }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Database Simulator State
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [activeCodeTab, setActiveCodeTab] = useState<'entity' | 'dao' | 'converters' | 'database' | 'repository'>('entity');

  // Simulated Room Table Records
  const [taskRecords, setTaskRecords] = useState([
    {
      id: 't1',
      phase: 'FUNDACAO',
      title: 'Definir sua promessa em 1 frase',
      durationMinutes: 15,
      status: 'COMPLETED',
      notes: 'Eu ajudo designers freelancers a dobrar seus preços.',
      lastUpdated: '10:14:22'
    },
    {
      id: 't2',
      phase: 'FUNDACAO',
      title: 'Criar sua versão mínima entregável',
      durationMinutes: 20,
      status: 'IN_PROGRESS',
      notes: 'Template inicial no Notion pronto.',
      lastUpdated: '10:25:01'
    },
    {
      id: 't3',
      phase: 'FUNDACAO',
      title: 'Escolher 3 pessoas para validação 1 a 1',
      durationMinutes: 30,
      status: 'PENDING',
      notes: '',
      lastUpdated: '10:00:00'
    },
    {
      id: 't4',
      phase: 'MARKETING',
      title: 'Configurar bio e link de contato direto',
      durationMinutes: 10,
      status: 'PENDING',
      notes: '',
      lastUpdated: '10:00:00'
    }
  ]);

  const [dbLog, setDbLog] = useState<string>('Room Database iniciado: "prumo_database.db" (v1). Flow<List<TaskEntity>> ativo emitindo 4 registros.');

  // Checklist da Etapa 6
  const [checklist, setChecklist] = useState({
    kspAndRoomDependencies: true,
    taskEntityWithIndices: true,
    taskDaoReactiveFlow: true,
    typeConvertersRegistered: true,
    databaseSingletonThreadSafe: true,
    offlineFirstSingleSourceOfTruth: true
  });

  const toggleCheck = (key: keyof typeof checklist) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleDownloadZip = async () => {
    try {
      setIsDownloading(true);
      const blob = await generateAndroidProjectZip();
      downloadBlob(blob, 'Prumo-Android-Kotlin-Etapas1-6.zip');
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsDownloading(false);
    }
  };

  const toggleTaskStatus = (id: string) => {
    const now = new Date().toLocaleTimeString();
    setTaskRecords(prev => prev.map(t => {
      if (t.id === id) {
        const nextStatus = t.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
        return { ...t, status: nextStatus, lastUpdated: now };
      }
      return t;
    }));
    setDbLog(`[Room @Update] UPDATE tasks SET status = (toggle), last_updated = '${now}' WHERE id = '${id}'. Flow notificou a UI em 4ms.`);
  };

  const insertCustomTask = () => {
    const id = `t${taskRecords.length + 1}`;
    const now = new Date().toLocaleTimeString();
    const newTask = {
      id,
      phase: 'MARKETING',
      title: `Criar roteiro de apresentação rápida (#${taskRecords.length + 1})`,
      durationMinutes: 15,
      status: 'PENDING',
      notes: 'Adicionada localmente no Room SQLite',
      lastUpdated: now
    };
    setTaskRecords(prev => [...prev, newTask]);
    setDbLog(`[Room @Insert(REPLACE)] INSERT INTO tasks (id, phase, title) VALUES ('${id}', 'MARKETING', '${newTask.title}'). Flow emitiu nova lista com ${taskRecords.length + 1} itens.`);
  };

  const triggerBackgroundSync = () => {
    if (isOfflineMode) {
      setDbLog('[Sync Bloqueado] Dispositivo está offline. O Room mantém os dados locais seguros e intactos!');
      return;
    }

    setIsSyncing(true);
    setDbLog('[Offline-First Sync] Iniciando sincronização em background com PrumoApiService (Dispatchers.IO)...');
    
    setTimeout(() => {
      setIsSyncing(false);
      const now = new Date().toLocaleTimeString();
      setDbLog(`[Sync Sucesso] Dados remotos mesclados via taskDao.insertTasks(...) em transação única às ${now}. A UI foi recomposta sem recarregar tela inteira!`);
    }, 900);
  };

  return (
    <div className="space-y-6">
      {/* Banner Principal da Etapa 6 */}
      <div className="bg-gradient-to-br from-[#1F6F5C] to-[#0F352C] text-white rounded-2xl p-6 md:p-8 shadow-sm">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-semibold mb-3 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#F2A93B]" />
            Etapa 6: Persistência Local &amp; Arquitetura Offline-First
          </div>
          <h2 className="text-2xl md:text-3xl font-bold font-display leading-tight">
            Room Database &amp; SQLite no Android com Kotlin
          </h2>
          <p className="text-sm md:text-base text-white/90 mt-2 leading-relaxed">
            Implemente persistência local robusta com o <strong className="text-white">Room Database 2.6+</strong> processado via 
            <strong className="text-white"> KSP</strong>: crie Entidades com tipos seguros, DAOs que emitem 
            <strong className="text-white"> Flow reativo</strong> contínuo, TypeConverters para listas e estruture o app 
            com o padrão <strong className="text-white">Offline-First (Single Source of Truth)</strong> para funcionar 100% sem internet.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={handleDownloadZip}
              disabled={isDownloading}
              className="px-5 py-3 bg-[#F2A93B] hover:bg-[#e0982c] text-[#1A1D1B] font-semibold text-sm rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              {isDownloading ? 'Gerando pacote .zip...' : 'Baixar Projeto com Room Database (.zip)'}
            </button>

            <button
              onClick={onOpenCodeViewer}
              className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-medium text-sm rounded-xl backdrop-blur-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <FolderTree className="w-4 h-4" />
              Ver Código das Entidades, DAOs e Banco
            </button>
          </div>

          {downloadSuccess && (
            <div className="mt-4 p-3 bg-white/10 border border-white/20 rounded-xl text-xs flex items-center gap-2 text-white">
              <CheckCircle2 className="w-4 h-4 text-[#F2A93B]" />
              Arquivo <strong>Prumo-Android-Kotlin-Etapas1-6.zip</strong> baixado com sucesso!
            </div>
          )}
        </div>
      </div>

      {/* Grid: Arquitetura Offline-First + Simulador Interativo */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">

          {/* SEÇÃO 1: ARQUITETURA OFFLINE-FIRST (SINGLE SOURCE OF TRUTH) */}
          <div className="bg-white rounded-xl p-6 border border-[#E6E8E6] shadow-sm">
            <div className="flex items-center gap-2.5 mb-3">
              <HardDrive className="w-5 h-5 text-[#1F6F5C]" />
              <h3 className="text-base font-bold text-[#1A1D1B]">
                Como funciona a Arquitetura Offline-First (Single Source of Truth)
              </h3>
            </div>

            <p className="text-xs text-[#5B615D] mb-4 leading-relaxed">
              No app Prumo, a camada de UI <strong>nunca consulta a API diretamente</strong> para desenhar a tela. O banco de dados Room SQLite local é a única fonte da verdade:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs mb-4">
              <div className="p-3.5 rounded-xl bg-[#F7F9F8] border border-[#E6E8E6]">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-6 h-6 rounded-md bg-[#E3F2ED] text-[#1F6F5C] font-bold text-xs flex items-center justify-center">1</span>
                  <strong className="text-xs text-[#1A1D1B]">UI &lt;-&gt; Flow</strong>
                </div>
                <p className="text-[11px] text-[#5B615D]">
                  Compose observa o <code>StateFlow</code> do ViewModel, alimentado pelo <code>taskDao.observeAllTasks()</code>.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F7F9F8] border border-[#E6E8E6]">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-6 h-6 rounded-md bg-[#E3F2ED] text-[#1F6F5C] font-bold text-xs flex items-center justify-center">2</span>
                  <strong className="text-xs text-[#1A1D1B]">Edição Local</strong>
                </div>
                <p className="text-[11px] text-[#5B615D]">
                  Ao concluir tarefa, o Room atualiza imediatamente (latência &lt;10ms), garantindo resposta tátil instantânea.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F7F9F8] border border-[#E6E8E6]">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-6 h-6 rounded-md bg-[#E3F2ED] text-[#1F6F5C] font-bold text-xs flex items-center justify-center">3</span>
                  <strong className="text-xs text-[#1A1D1B]">Sincronização</strong>
                </div>
                <p className="text-[11px] text-[#5B615D]">
                  Em segundo plano, o repositório sincroniza com o Retrofit. Se falhar, os dados locais continuam intactos.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F7F9F8] border border-[#E6E8E6]">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-6 h-6 rounded-md bg-[#E3F2ED] text-[#1F6F5C] font-bold text-xs flex items-center justify-center">4</span>
                  <strong className="text-xs text-[#1A1D1B]">Zero Telas Vazias</strong>
                </div>
                <p className="text-[11px] text-[#5B615D]">
                  Ao reabrir o app no avião ou sem sinal 4G, todo o progresso e roteiro carregam instantaneamente sem spinner.
                </p>
              </div>
            </div>
          </div>

          {/* SEÇÃO 2: SIMULADOR INTERATIVO DO ROOM SQLITE EM TEMPO REAL */}
          <div className="bg-white rounded-xl p-6 border border-[#E6E8E6] shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <Database className="w-5 h-5 text-[#1F6F5C]" />
                <h3 className="text-base font-bold text-[#1A1D1B]">
                  Simulador do Room Database &amp; Tabela SQLite ao Vivo
                </h3>
              </div>
              <span className="text-[11px] font-semibold text-[#1F6F5C] bg-[#E3F2ED] px-2.5 py-0.5 rounded-full">
                SQLite In-Memory Sandbox
              </span>
            </div>

            <p className="text-xs text-[#5B615D] mb-4">
              Interaja diretamente com a tabela <code>tasks</code> gerenciada pelo Room: altere o status de uma tarefa, simule o modo offline ou execute uma sincronização em background para ver a emissão reativa do <code>Flow</code>:
            </p>

            {/* Painel de Controles do Simulador */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-[#F7F9F8] border border-[#E6E8E6] mb-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsOfflineMode(prev => !prev)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all ${
                    isOfflineMode
                      ? 'bg-[#D64545] text-white shadow-xs'
                      : 'bg-white border border-[#E6E8E6] text-[#5B615D] hover:bg-neutral-100'
                  }`}
                >
                  {isOfflineMode ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5 text-[#3BAA6B]" />}
                  <span>{isOfflineMode ? 'Modo Offline (Sem Internet)' : 'Conectado (Online)'}</span>
                </button>

                <button
                  onClick={triggerBackgroundSync}
                  disabled={isSyncing}
                  className="px-3 py-1.5 bg-[#1F6F5C] hover:bg-[#2E8B73] text-white rounded-lg text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-all disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>{isSyncing ? 'Sincronizando...' : 'Simular Sync em Background'}</span>
                </button>
              </div>

              <button
                onClick={insertCustomTask}
                className="px-3 py-1.5 bg-white hover:bg-neutral-100 border border-[#E6E8E6] text-[#1A1D1B] rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all"
              >
                <Plus className="w-3.5 h-3.5 text-[#1F6F5C]" />
                <span>Inserir Tarefa (@Insert)</span>
              </button>
            </div>

            {/* Visualizador da Tabela SQLite do Room */}
            <div className="overflow-x-auto border border-[#E6E8E6] rounded-xl mb-4">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#E3F2ED]/50 border-b border-[#E6E8E6] text-[#1F6F5C] font-semibold text-[11px] uppercase tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3">id (PK)</th>
                    <th className="py-2.5 px-3">fase</th>
                    <th className="py-2.5 px-3">titulo</th>
                    <th className="py-2.5 px-3 text-center">duracao</th>
                    <th className="py-2.5 px-3 text-center">status</th>
                    <th className="py-2.5 px-3 text-right">acao (Room @Update)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E6E8E6] font-mono text-[11px]">
                  {taskRecords.map((task) => (
                    <tr key={task.id} className="hover:bg-neutral-50 transition-colors">
                      <td className="py-2.5 px-3 font-bold text-[#1A1D1B]">{task.id}</td>
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          task.phase === 'FUNDACAO' ? 'bg-[#E3F2ED] text-[#1F6F5C]' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {task.phase}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-sans text-xs text-[#1A1D1B] max-w-xs truncate">
                        {task.title}
                      </td>
                      <td className="py-2.5 px-3 text-center text-[#5B615D]">
                        {task.durationMinutes} min
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          task.status === 'COMPLETED'
                            ? 'bg-[#3BAA6B]/15 text-[#2a8350]'
                            : task.status === 'IN_PROGRESS'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-neutral-100 text-neutral-600'
                        }`}>
                          {task.status === 'COMPLETED' && <CheckCircle2 className="w-3 h-3" />}
                          {task.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right font-sans">
                        <button
                          onClick={() => toggleTaskStatus(task.id)}
                          className="px-2.5 py-1 text-[11px] rounded bg-white hover:bg-[#E3F2ED] text-[#1F6F5C] font-semibold border border-[#1F6F5C]/30 transition-colors cursor-pointer"
                        >
                          {task.status === 'COMPLETED' ? 'Reabrir' : 'Concluir'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Console de Logs Reativos do Room */}
            <div className="bg-[#1A1D1B] text-neutral-200 p-3.5 rounded-xl font-mono text-xs border border-neutral-800">
              <div className="flex items-center justify-between text-[10px] text-emerald-400 font-bold uppercase tracking-wider mb-1.5">
                <span>Room Database &amp; Flow Logs</span>
                <span className="text-neutral-400 font-normal">SQLite WAL mode</span>
              </div>
              <p className="text-[11px] text-emerald-300 leading-relaxed">
                &gt; {dbLog}
              </p>
            </div>
          </div>

          {/* SEÇÃO 3: CÓDIGO DA ETAPA 6 COM TABS */}
          <div className="bg-white rounded-xl p-6 border border-[#E6E8E6] shadow-sm">
            <h3 className="text-base font-bold text-[#1A1D1B] mb-2 flex items-center gap-2">
              <Code2 className="w-5 h-5 text-[#1F6F5C]" />
              Implementação Completa do Room em Kotlin
            </h3>

            <p className="text-xs text-[#5B615D] mb-4">
              Navegue entre os arquivos essenciais que compõem a persistência do Prumo no Android Studio:
            </p>

            {/* Tabs de Código */}
            <div className="flex gap-1.5 overflow-x-auto border-b border-[#E6E8E6] pb-2 mb-4 text-xs">
              {[
                { id: 'entity' as const, label: '1. TaskEntity.kt' },
                { id: 'dao' as const, label: '2. TaskDao.kt' },
                { id: 'converters' as const, label: '3. Converters.kt' },
                { id: 'database' as const, label: '4. PrumoDatabase.kt' },
                { id: 'repository' as const, label: '5. OfflineFirstTaskRepository.kt' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCodeTab(tab.id)}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors cursor-pointer ${
                    activeCodeTab === tab.id
                      ? 'bg-[#1F6F5C] text-white shadow-xs font-semibold'
                      : 'bg-neutral-100 hover:bg-neutral-200 text-[#5B615D]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Código da Tab Selecionada */}
            <div className="bg-[#1A1D1B] text-neutral-200 p-4 rounded-xl font-mono text-xs overflow-x-auto max-h-96">
              {activeCodeTab === 'entity' && (
                <pre>{`package com.prumo.app.data.local.entity

import androidx.room.ColumnInfo
import androidx.room.Entity
import androidx.room.PrimaryKey
import com.prumo.app.domain.model.Task
import com.prumo.app.domain.model.TaskPhase
import com.prumo.app.domain.model.TaskStatus

/**
 * Entidade Room mapeada para a tabela 'tasks'.
 * Utiliza anotações @ColumnInfo para desacoplar nomes de colunas SQLite.
 */
@Entity(tableName = "tasks")
data class TaskEntity(
    @PrimaryKey
    @ColumnInfo(name = "id")
    val id: String,

    @ColumnInfo(name = "phase")
    val phase: TaskPhase,

    @ColumnInfo(name = "title")
    val title: String,

    @ColumnInfo(name = "description")
    val description: String,

    @ColumnInfo(name = "duration_minutes")
    val durationMinutes: Int,

    @ColumnInfo(name = "status")
    val status: TaskStatus,

    @ColumnInfo(name = "what_to_do")
    val whatToDo: String,

    @ColumnInfo(name = "how_to_know")
    val howToKnowItIsGood: List<String> = emptyList(),

    @ColumnInfo(name = "resources")
    val resources: List<String> = emptyList(),

    @ColumnInfo(name = "notes")
    val notes: String = "",

    @ColumnInfo(name = "is_locked")
    val isLocked: Boolean = false,

    @ColumnInfo(name = "last_updated_epoch")
    val lastUpdatedEpoch: Long = System.currentTimeMillis()
)

// Mapper: converte a entidade do banco local para o modelo de domínio puro
fun TaskEntity.toDomain(): Task = Task(
    id = id,
    phase = phase,
    title = title,
    description = description,
    durationMinutes = durationMinutes,
    status = status,
    whatToDo = whatToDo,
    howToKnowItIsGood = howToKnowItIsGood,
    resources = resources,
    notes = notes,
    isLocked = isLocked
)`}</pre>
              )}

              {activeCodeTab === 'dao' && (
                <pre>{`package com.prumo.app.data.local.dao

import androidx.room.*
import com.prumo.app.data.local.entity.TaskEntity
import com.prumo.app.domain.model.TaskStatus
import kotlinx.coroutines.flow.Flow

/**
 * Data Access Object (DAO) para a tabela de tarefas.
 * Métodos de leitura retornam Flow para emissão reativa contínua.
 */
@Dao
interface TaskDao {

    @Query("SELECT * FROM tasks ORDER BY phase ASC, id ASC")
    fun observeAllTasks(): Flow<List<TaskEntity>>

    @Query("SELECT * FROM tasks WHERE phase = :phaseName ORDER BY id ASC")
    fun observeTasksByPhase(phaseName: String): Flow<List<TaskEntity>>

    @Query("SELECT * FROM tasks WHERE id = :taskId LIMIT 1")
    suspend fun getTaskById(taskId: String): TaskEntity?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertTasks(tasks: List<TaskEntity>)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertTask(task: TaskEntity)

    @Update
    suspend fun updateTask(task: TaskEntity)

    @Query("UPDATE tasks SET status = :newStatus, last_updated_epoch = :updatedAt WHERE id = :taskId")
    suspend fun updateTaskStatus(taskId: String, newStatus: TaskStatus, updatedAt: Long = System.currentTimeMillis())

    @Query("DELETE FROM tasks")
    suspend fun clearAllTasks()
}`}</pre>
              )}

              {activeCodeTab === 'converters' && (
                <pre>{`package com.prumo.app.data.local.converter

import androidx.room.TypeConverter
import com.prumo.app.domain.model.TaskPhase
import com.prumo.app.domain.model.TaskStatus
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json

/**
 * Conversores de tipo para o Room SQLite armazenar tipos complexos como strings/JSON.
 */
class Converters {

    private val json = Json { ignoreUnknownKeys = true }

    @TypeConverter
    fun fromPhase(phase: TaskPhase): String = phase.name

    @TypeConverter
    fun toPhase(value: String): TaskPhase = try {
        TaskPhase.valueOf(value)
    } catch (_: Exception) {
        TaskPhase.FUNDACAO
    }

    @TypeConverter
    fun fromStatus(status: TaskStatus): String = status.name

    @TypeConverter
    fun toStatus(value: String): TaskStatus = try {
        TaskStatus.valueOf(value)
    } catch (_: Exception) {
        TaskStatus.PENDING
    }

    @TypeConverter
    fun fromStringList(list: List<String>): String = json.encodeToString(list)

    @TypeConverter
    fun toStringList(value: String): List<String> = try {
        json.decodeFromString(value)
    } catch (_: Exception) {
        emptyList()
    }
}`}</pre>
              )}

              {activeCodeTab === 'database' && (
                <pre>{`package com.prumo.app.data.local

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import androidx.room.TypeConverters
import com.prumo.app.data.local.converter.Converters
import com.prumo.app.data.local.dao.TaskDao
import com.prumo.app.data.local.entity.TaskEntity

/**
 * Instância central do Room Database para o app Prumo.
 * Configurada com exportSchema = true para controle de migrações e Singleton thread-safe.
 */
@Database(
    entities = [TaskEntity::class],
    version = 1,
    exportSchema = true
)
@TypeConverters(Converters::class)
abstract class PrumoDatabase : RoomDatabase() {

    abstract fun taskDao(): TaskDao

    companion object {
        @Volatile
        private var INSTANCE: PrumoDatabase? = null

        fun getInstance(context: Context): PrumoDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    PrumoDatabase::class.java,
                    "prumo_database.db"
                )
                // Em produção, adicione migrações com .addMigrations(MIGRATION_1_2)
                .fallbackToDestructiveMigration()
                .build()

                INSTANCE = instance
                instance
            }
        }
    }
}`}</pre>
              )}

              {activeCodeTab === 'repository' && (
                <pre>{`package com.prumo.app.data.repository

import com.prumo.app.core.network.PrumoApiService
import com.prumo.app.data.local.dao.TaskDao
import com.prumo.app.data.local.entity.toDomain
import com.prumo.app.domain.model.Task
import com.prumo.app.domain.repository.TaskRepository
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.withContext

/**
 * Repositório Oficial Offline-First (Single Source of Truth).
 * A UI lê exclusivamente do Room DAO e as atualizações de rede alimentam o banco local.
 */
class OfflineFirstTaskRepositoryImpl(
    private val taskDao: TaskDao,
    private val apiService: PrumoApiService
) : TaskRepository {

    // 1. A UI sempre observa o Flow emitido pelo Room
    override fun getAllTasks(): Flow<List<Task>> {
        return taskDao.observeAllTasks().map { entities ->
            entities.map { it.toDomain() }
        }
    }

    // 2. Ações do usuário persistem localmente na hora (sem lag)
    override suspend fun toggleTaskStatus(taskId: String) {
        withContext(Dispatchers.IO) {
            val task = taskDao.getTaskById(taskId) ?: return@withContext
            val nextStatus = if (task.status.name == "COMPLETED") "PENDING" else "COMPLETED"
            taskDao.updateTaskStatus(taskId, com.prumo.app.domain.model.TaskStatus.valueOf(nextStatus))
        }
    }

    // 3. Sincronização em background: busca dados remotos e insere no Room
    suspend fun syncWithRemote() = withContext(Dispatchers.IO) {
        try {
            val response = apiService.getRoadmapTasks()
            if (response.isSuccessful && response.body() != null) {
                val dtos = response.body()!!
                val entities = dtos.map { dto ->
                    // Converter DTO para Entity e persistir em lote
                    com.prumo.app.data.local.entity.TaskEntity(
                        id = dto.id,
                        phase = com.prumo.app.domain.model.TaskPhase.FUNDACAO,
                        title = dto.title,
                        description = dto.description,
                        durationMinutes = dto.durationMinutes,
                        status = com.prumo.app.domain.model.TaskStatus.PENDING,
                        whatToDo = dto.whatToDo
                    )
                }
                taskDao.insertTasks(entities)
            }
        } catch (e: Exception) {
            // Em caso de erro de rede, o banco local mantém tudo funcionando!
            e.printStackTrace()
        }
    }
}`}</pre>
              )}
            </div>
          </div>
        </div>

        {/* Coluna Direita: Boas Práticas e Checklist */}
        <div className="lg:col-span-4 space-y-5">
          {/* Card: Por que usar Room + KSP? */}
          <div className="bg-white rounded-xl p-5 border border-[#E6E8E6] shadow-sm">
            <h3 className="text-sm font-bold text-[#1A1D1B] mb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#1F6F5C]" />
              Vantagens do Room 2.6+ com KSP
            </h3>
            <div className="space-y-2.5 text-xs text-[#5B615D]">
              <p>
                <strong className="text-[#1A1D1B]">1. Verificação SQL em tempo de compilação:</strong> Se você errar o nome de uma coluna no <code>@Query</code>, o build do Kotlin falha antes de você rodar o app no dispositivo.
              </p>
              <p>
                <strong className="text-[#1A1D1B]">2. KSP 2x mais rápido que KAPT:</strong> O Kotlin Symbol Processing lê os símbolos da AST diretamente sem gerar stubs Java intermediários.
              </p>
              <p>
                <strong className="text-[#1A1D1B]">3. Observabilidade com Flow:</strong> Quando uma linha da tabela é alterada em qualquer thread, o Room notifica automaticamente todos os Coletores no Compose.
              </p>
            </div>
          </div>

          {/* Checklist da Etapa 6 */}
          <div className="bg-white rounded-xl p-5 border border-[#E6E8E6] shadow-sm sticky top-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#E6E8E6] mb-4">
              <h3 className="text-sm font-bold text-[#1A1D1B]">
                Checklist da Etapa 6
              </h3>
              <span className="text-[11px] font-semibold text-[#1F6F5C] bg-[#E3F2ED] px-2 py-0.5 rounded-full">
                {Object.values(checklist).filter(Boolean).length} / 6 Concluídos
              </span>
            </div>

            <div className="space-y-3">
              {[
                { key: 'kspAndRoomDependencies' as const, label: 'Dependências do Room 2.6+ e KSP no Gradle' },
                { key: 'taskEntityWithIndices' as const, label: 'TaskEntity com PrimaryKey e @ColumnInfo' },
                { key: 'taskDaoReactiveFlow' as const, label: 'TaskDao com consultas reativas retornando Flow' },
                { key: 'typeConvertersRegistered' as const, label: 'TypeConverters para Enums e List<String>' },
                { key: 'databaseSingletonThreadSafe' as const, label: 'PrumoDatabase Singleton com fallback controlado' },
                { key: 'offlineFirstSingleSourceOfTruth' as const, label: 'Repositório Offline-First implementado' }
              ].map(({ key, label }) => (
                <div
                  key={key}
                  onClick={() => toggleCheck(key)}
                  className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-[#F7F9F8] cursor-pointer transition-colors"
                >
                  {checklist[key] ? (
                    <CheckSquare className="w-4 h-4 text-[#1F6F5C] mt-0.5 shrink-0" />
                  ) : (
                    <Square className="w-4 h-4 text-[#5B615D] mt-0.5 shrink-0" />
                  )}
                  <span className={`text-xs ${checklist[key] ? 'text-[#1A1D1B] font-medium' : 'text-[#5B615D]'}`}>
                    {label}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-5 pt-4 border-t border-[#E6E8E6] space-y-2">
              <button
                onClick={onOpenCodeViewer}
                className="w-full py-2.5 bg-[#1F6F5C] hover:bg-[#2E8B73] text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <FolderTree className="w-3.5 h-3.5" />
                Explorar Arquivos Room no Code Viewer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
