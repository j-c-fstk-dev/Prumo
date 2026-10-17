export interface RoadmapStep {
  id: number;
  title: string;
  tagline: string;
  phase: string;
  status: 'completed' | 'in_progress' | 'pending';
  focus: string;
  objectives: string[];
  deliverables: string[];
  androidTech: string[];
  estimatedHours: string;
}

export const PRUMO_ROADMAP: RoadmapStep[] = [
  {
    id: 1,
    title: 'Etapa 1: Configuração do Ambiente & Foundation no Android Studio',
    tagline: 'Setup do projeto Kotlin, Gradle Version Catalog, Jetpack Compose, Design System e Tema.',
    phase: 'Fundação Técnica',
    status: 'completed',
    focus: 'Configuração do Ambiente no Android Studio',
    objectives: [
      'Configurar o Android Studio (versão Ladybug 2024.2+ ou Koala) com JDK 17/21 e Android SDK 35 (Android 15 / UpsideDownCake).',
      'Criar o projeto base nativo em Kotlin com suporte oficial a Jetpack Compose e Material 3.',
      'Estruturar o Version Catalog moderno (gradle/libs.versions.toml) com todas as dependências recomendadas.',
      'Configurar arquitetura modular de pacotes (Clean Architecture + MVVM/MVI: core, data, domain, presentation).',
      'Implementar o Design System do Prumo em Compose (Color.kt, Theme.kt, Type.kt com Inter & Fraunces, dimensões 8pt, tema claro/escuro).',
      'Configurar MainActivity e validar compilação limpa no emulador/físico com Android Compose Preview.'
    ],
    deliverables: [
      'gradle/libs.versions.toml com Kotlin 2.0+, Compose Compiler e bibliotecas',
      'build.gradle.kts (root) e app/build.gradle.kts com plugins oficiais',
      'settings.gradle.kts e AndroidManifest.xml com permissões e tema',
      'com.prumo.app.core.designsystem.theme com tokens de cor e tipografia exatos do PRD',
      'Componentes atômicos básicos (PrumoButton, PrumoCard, PrumoBadge)',
      'Pacote pronto para download ZIP e abertura direta no Android Studio'
    ],
    androidTech: [
      'Android Studio Ladybug/Koala',
      'Kotlin 2.0.21',
      'Jetpack Compose BOM 2024.10+',
      'Material 3',
      'Gradle 8.7+ (Kotlin DSL)',
      'Version Catalogs (libs.versions.toml)'
    ],
    estimatedHours: '4h - 6h'
  },
  {
    id: 2,
    title: 'Etapa 2: Arquitetura Base, Injeção de Dependências & Navegação',
    tagline: 'Configuração de Navigation Compose, rotas com Safe Args, Hilt/Koin e DataStore/Room local.',
    phase: 'Arquitetura e Dados',
    status: 'completed',
    focus: 'Fluxos de Navegação e Persistência Local',
    objectives: [
      'Configurar Navigation Compose com destinos declarativos tipados (Type-Safe Navigation com Kotlin Serialization).',
      'Configurar Hilt (ou Koin) para injeção de dependências limpa em ViewModels e Repositórios.',
      'Configurar DataStore Preferences para salvar preferências do usuário, estado de onboarding e autenticação leve.',
      'Definir a BottomNavigation (Início, Roteiro, Coach, Você) visível apenas nas telas principais.'
    ],
    deliverables: [
      'PrumoNavHost.kt com rotas de Onboarding, Anamnese, Resultado e Bottom Tabs',
      'PrumoDataStore.kt para persistência de sessão e flags',
      'Scaffold principal com PrumoBottomBar animada',
      'Módulo de injeção de dependências (AppModule.kt)'
    ],
    androidTech: [
      'Navigation Compose (Type-Safe)',
      'Hilt / Koin',
      'DataStore Preferences',
      'Kotlinx Serialization'
    ],
    estimatedHours: '6h - 8h'
  },
  {
    id: 3,
    title: 'Etapa 3: Onboarding & Anamnese Adaptativa em 6 Blocos',
    tagline: 'Telas A1 a A4 e B1 a B7: questionário interativo tátil com auto-save e storytelling de loading.',
    phase: 'Jornada do Usuário',
    status: 'pending',
    focus: 'Entrada de Dados Sem Fricção',
    objectives: [
      'Implementar Splash A1 e Cadastro Leve A2 (nome, email, objetivo macro em 3 cards).',
      'Construir o carrossel explicativo do método A3 (3 slides interativos e puláveis).',
      'Implementar as 6 seções da Anamnese (Habilidades, Interesses, Disponibilidade, Objetivos, Perfil, Experiência Digital) com cards táteis, sliders e auto-save.',
      'Desenvolver a tela de storytelling B7 com animação de bússola girando e checklist dinâmico em cascata.'
    ],
    deliverables: [
      'AnamneseViewModel.kt com StateFlow reativo de respostas',
      'Componentes reutilizáveis: SelectableCard, QuestionHeader, ProgressBar',
      'AnamneseScreen.kt com transições horizontais suaves (AnimatedContent)',
      'CalculatingScreen.kt com animação de bússola e passos progressivos'
    ],
    androidTech: [
      'Compose Animation (AnimatedContent, InfiniteTransition)',
      'ViewModel & StateFlow',
      'Custom Canvas para desenho da Bússola'
    ],
    estimatedHours: '8h - 10h'
  },
  {
    id: 4,
    title: 'Etapa 4: Gerenciamento de Estado com ViewModel, LiveData & StateFlow',
    tagline: 'Separação de lógica e interface com Unidirectional Data Flow (UDF), State Hoisting, StateFlow e LiveData.',
    phase: 'Arquitetura e Estado',
    status: 'completed',
    focus: 'Separação de Lógica de Negócio e Camada de UI',
    objectives: [
      'Separar estritamente a lógica de negócio da camada de UI usando ViewModels do AndroidX.',
      'Implementar o padrão Unidirectional Data Flow (UDF: Events -> ViewModel -> StateFlow/LiveData -> Stateless UI).',
      'Configurar State Hoisting tornando os Composables 100% Stateless, testáveis e com suporte total a @Preview.',
      'Demonstrar a integração do LiveData clássico com o operador observeAsState() e a abordagem moderna com StateFlow.',
      'Gerenciar efeitos colaterais únicos (navegação, toasts, confetes) de forma desacoplada com Channel e LaunchedEffect.'
    ],
    deliverables: [
      'RoadmapUiState.kt com data class imutável e contratos de eventos (UiEvent/UiEffect)',
      'RoadmapViewModel.kt com StateFlow e atualização reativa assíncrona',
      'RoadmapViewModelLiveData.kt com MutableLiveData e observeAsState()',
      'RoadmapScreen.kt com Composable Stateless desacoplado'
    ],
    androidTech: [
      'AndroidX ViewModel',
      'StateFlow & SharedFlow (Coroutines)',
      'LiveData & runtime-livedata',
      'State Hoisting & UDF'
    ],
    estimatedHours: '6h - 8h'
  },
  {
    id: 5,
    title: 'Etapa 5: Consumo de APIs com Retrofit e Kotlin Serialization',
    tagline: 'Configuração da camada de rede, conversor JSON, DTOs, mappers e chamadas assíncronas com Coroutines.',
    phase: 'Rede e Integração',
    status: 'completed',
    focus: 'Consumo de APIs REST e Camada de Rede Assíncrona',
    objectives: [
      'Configurar o cliente HTTP OkHttpClient com timeouts adequados (15s/30s) e HttpLoggingInterceptor.',
      'Instanciar o Retrofit 2 com o conversor oficial kotlinx-serialization-converter.',
      'Criar a interface PrumoApiService com métodos assíncronos (suspend functions) para diagnóstico e tarefas.',
      'Implementar DTOs anotados com @Serializable e @SerialName, além de mappers para Domain Models puros.',
      'Criar o wrapper genérico NetworkResult<T> para tratamento robusto de sucesso, erro de API e falha de conexão.',
      'Integrar chamadas com Dispatchers.IO nos repositórios para garantir fluidez na thread principal da UI.'
    ],
    deliverables: [
      'PrumoNetworkModule.kt com instâncias Singleton de OkHttpClient e Retrofit',
      'PrumoApiService.kt com rotas para obter tarefas, diagnóstico e chat do Coach',
      'TaskDto.kt e CoachMessageDto.kt com serializadores e funções mapper toDomain()',
      'NetworkResult.kt sealed class para tratamento seguro de respostas HTTP'
    ],
    androidTech: [
      'Retrofit 2.11+',
      'OkHttp 4.12+ (Logging Interceptor)',
      'Kotlinx Serialization (Converter oficial)',
      'Kotlin Coroutines (Dispatchers.IO)'
    ],
    estimatedHours: '6h - 8h'
  },
  {
    id: 6,
    title: 'Etapa 6: Persistência de Dados Offline com Room Database',
    tagline: 'Configuração do SQLite e Room 2.6+ com KSP: Entidades, DAOs reativos com Flow, TypeConverters e arquitetura Offline-First.',
    phase: 'Persistência e Armazenamento Local',
    status: 'completed',
    focus: 'Persistência Offline e Single Source of Truth',
    objectives: [
      'Adicionar dependências do Room Runtime, Room KTX e processador KSP no Version Catalog do Gradle.',
      'Criar TaskEntity com anotações @Entity, @PrimaryKey, @ColumnInfo e mapper toDomain() para o modelo puro.',
      'Implementar TaskDao com consultas reativas retornando Flow<List<TaskEntity>> para recomposição em tempo real no Compose.',
      'Configurar TypeConverters para serialização de Enums tipados e listas de strings complexas no SQLite.',
      'Construir a classe abstrata PrumoDatabase com exportSchema e Singleton thread-safe com Room.databaseBuilder.',
      'Desenvolver o OfflineFirstTaskRepositoryImpl unificando Room local e Retrofit remoto com padrão Single Source of Truth.'
    ],
    deliverables: [
      'TaskEntity.kt com anotações @Entity e mapper de domínio toDomain()',
      'TaskDao.kt com consultas @Query, @Insert(onConflict = REPLACE) e retorno Flow',
      'Converters.kt com TypeConverters para tipos complexos e enums',
      'PrumoDatabase.kt com versão e instanciação Singleton thread-safe',
      'OfflineFirstTaskRepositoryImpl.kt com arquitetura Offline-First'
    ],
    androidTech: [
      'AndroidX Room Database (2.6+)',
      'Kotlin Symbol Processing (KSP)',
      'SQLite (WAL Mode)',
      'Kotlin Coroutines & Flow',
      'Offline-First Single Source of Truth'
    ],
    estimatedHours: '6h - 8h'
  },
  {
    id: 7,
    title: 'Etapa 7: Testes Automatizados & TDD (JUnit, Coroutines Test & Espresso)',
    tagline: 'Garantia de qualidade contínua: Test-Driven Development (TDD), testes de Use Cases, ViewModels com Turbine, Room em memória e testes de UI no Compose.',
    phase: 'Qualidade & Testes',
    status: 'completed',
    focus: 'Confiabilidade, Cobertura e Prevenção de Regressões',
    objectives: [
      'Configurar o ambiente de testes com JUnit 4/5, MockK, Coroutines Test e Turbine no Gradle.',
      'Aplicar o ciclo TDD (Red -> Green -> Refactor) na regra de negócio da Anamnese e Diagnóstico.',
      'Testar ViewModels de forma isolada com TestDispatcher e StateFlow test assertions.',
      'Criar testes de integração de persistência com Room Database usando in-memory database.',
      'Implementar testes de UI declarativos no Jetpack Compose com createComposeRule e semântica acessível.'
    ],
    deliverables: [
      'CalculateDiagnosisUseCaseTest.kt com validação de regras de perfil (TDD)',
      'RoadmapViewModelTest.kt com StandardTestDispatcher e Turbine',
      'TaskDaoTest.kt com Room.inMemoryDatabaseBuilder',
      'RoadmapScreenComposeTest.kt com ComposeTestRule e performClick',
      'FakeTaskRepository.kt como Test Double para testes rápidos e desacoplados'
    ],
    androidTech: [
      'JUnit 4 / 5',
      'Kotlinx Coroutines Test & Turbine',
      'MockK & Fakes (Test Doubles)',
      'Room In-Memory Database',
      'Jetpack Compose UI Test & Espresso'
    ],
    estimatedHours: '6h - 8h'
  },
  {
    id: 8,
    title: 'Etapa 8: CI/CD com GitHub Actions, Build AAB e Deploy no Google Play',
    tagline: 'Automação de ponta a ponta: workflows de Lint e testes em PRs, geração de AAB assinado e publicação direta no Play Store.',
    phase: 'Automação & Lançamento',
    status: 'completed',
    focus: 'DevOps Android, Integração Contínua e Distribuição Automatizada',
    objectives: [
      'Configurar workflow de CI no GitHub Actions executando Lint, Detekt e suíte de testes unitários.',
      'Gerar e armazenar Keystore de release com criptografia Base64 no GitHub Secrets.',
      'Automatizar a compilação do Android App Bundle (.aab) com minificação R8 e ofuscação ProGuard.',
      'Configurar Service Account do Google Cloud com permissão para deploy automático no Google Play Console.',
      'Estabelecer estratégia de Staged Rollout (10% -> 25% -> 50% -> 100%) monitorando Android Vitals.'
    ],
    deliverables: [
      '.github/workflows/android-ci.yml para validação em Pull Requests',
      '.github/workflows/android-release.yml para geração de AAB e deploy na Play Store',
      'signingConfigs configurado com variáveis de ambiente no build.gradle.kts',
      'proguard-rules.pro com regras para Compose, Kotlin Serialization e Room',
      'Guia de Secrets e Service Account para publicação automática'
    ],
    androidTech: [
      'GitHub Actions (ubuntu-latest)',
      'Android App Bundle (AAB)',
      'R8 / ProGuard Minification',
      'Google Play Developer API',
      'Gradle Play Publisher'
    ],
    estimatedHours: '6h - 8h'
  },
  {
    id: 9,
    title: 'Etapa 9: Onboarding Narrativo, Ritual de Compromisso & Gestos Hápticos',
    tagline: 'Conexão profunda inspirada no Fabulous: micro-telas de valor, campos de reflexão livre, gesto de pressão contínua (Hold to Sign) e Carta do Eu Futuro.',
    phase: 'Conexão & Experiência Narrativa',
    status: 'completed',
    focus: 'UX Emocional com Disciplina de Calma e Gestos Avançados no Compose',
    objectives: [
      'Implementar micro-telas de valor entre seções da anamnese (Value Signals) explicando o impacto de cada resposta antes de perguntar.',
      'Adicionar campos de reflexão aberta com texto livre na anamnese com Jetpack Compose (OutlinedTextField com debounce).',
      'Construir o componente Compose CommitmentContractScreen com gesture de pressão contínua (pointerInput + detectTapGestures(onPress = ...)) e anel animado (Animatable).',
      'Integrar disparo de feedback háptico sutil com LocalHapticFeedback e HapticFeedbackType.LongPress.',
      'Gerar e persistir no Room Database a Carta do Eu Futuro em 90 dias (FutureLetterEntity).'
    ],
    deliverables: [
      'CommitmentContractScreen.kt com detecção de pressão contínua e anel animado de 3s',
      'FutureLetterScreen.kt com estética editorial pergaminho e selo de compromisso',
      'FutureLetterEntity.kt e AnamneseReflectionEntity.kt para Room Database',
      'ValueSignalComposable.kt para prelúdios de valor antes de formulários',
      'HapticManager.kt utilitário para micro-vibrações suaves no Android'
    ],
    androidTech: [
      'Jetpack Compose Animatable',
      'PointerInputModifier & detectTapGestures',
      'LocalHapticFeedback (Android Vibrator)',
      'Room Database 2.6+',
      'Canvas Graphics (Radial Progress)'
    ],
    estimatedHours: '5h - 7h'
  },
  {
    id: 10,
    title: 'Etapa 10: Presença em Áudio com Media3/ExoPlayer, Ondas Sonoras & Roteiro em Capítulos',
    tagline: 'Coaching de presença: micro-áudios serenos de 60-90s, visualização de formas de onda em Canvas Compose e reframe do roteiro em Capítulos.',
    phase: 'Presença Sonora & Storytelling',
    status: 'completed',
    focus: 'Media3 ExoPlayer, Visualização de Áudio e Storytelling no Roteiro',
    objectives: [
      'Configurar Media3 / ExoPlayer com controle de playback de micro-áudios em segundo plano.',
      'Desenvolver componente de ondas sonoras dinâmicas em Canvas Jetpack Compose reagindo ao estado de áudio com animações senoidais.',
      'Reestruturar a UI da tela de tarefas (RoadmapScreen.kt) em Capítulos Narrativos com ilustrações-âncora temáticas e âncora fixa do Eu Futuro.',
      'Implementar expansão de transcrição editorial acessível para usuários em ambientes silenciosos.',
      'Injetar o contexto emocional (nome, nicho, promessa do Eu Futuro) no Coach e notificações diárias do WorkManager.'
    ],
    deliverables: [
      'AudioCoachPlayer.kt com integração Media3 ExoPlayer e controle de playback',
      'WaveformVisualizer.kt com Canvas customizado de barras dinâmicas',
      'ChapterRoadmapScreen.kt agrupando tarefas por Capítulos Narrativos',
      'AnchorIllustrationCard.kt com totens visuais estilizados',
      'AudioCoachNotificationWorker.kt integrado ao WorkManager'
    ],
    androidTech: [
      'AndroidX Media3 (ExoPlayer 1.4+)',
      'Jetpack Compose Canvas (DrawScope)',
      'WorkManager 2.9+',
      'Kotlin Coroutines & Flow',
      'Material 3 Expressive Shapes'
    ],
    estimatedHours: '6h - 8h'
  }
];
