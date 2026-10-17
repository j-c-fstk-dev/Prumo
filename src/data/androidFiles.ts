export interface AndroidCodeFile {
  path: string;
  name: string;
  language: 'kotlin' | 'groovy' | 'xml' | 'toml' | 'markdown';
  category: 'gradle' | 'manifest' | 'theme' | 'component' | 'navigation' | 'data' | 'domain' | 'activity' | 'doc' | 'network' | 'viewmodel' | 'database' | 'test' | 'ci';
  description: string;
  code: string;
}

export const ANDROID_STUDIO_FILES: AndroidCodeFile[] = [
  // ==========================================
  // CONFIGURAÇÃO GRADLE & LIBS
  // ==========================================
  {
    path: 'gradle/libs.versions.toml',
    name: 'libs.versions.toml',
    language: 'toml',
    category: 'gradle',
    description: 'Version Catalog oficial com dependências de Navigation Type-Safe, Kotlin Serialization e DataStore.',
    code: `[versions]
agp = "8.7.2"
kotlin = "2.0.21"
coreKtx = "1.15.0"
lifecycleRuntimeKtx = "2.8.7"
activityCompose = "1.9.3"
composeBom = "2024.10.01"
navigationCompose = "2.8.4"
serialization = "1.7.3"
material3 = "1.3.1"
coroutines = "1.9.0"
datastore = "1.1.1"
room = "2.6.1"
ksp = "2.0.21-1.0.27"
generativeAi = "0.9.0"
retrofit = "2.11.0"
okhttp = "4.12.0"
junit = "4.13.2"
androidxJunit = "1.2.1"
espressoCore = "3.6.1"

[libraries]
androidx-core-ktx = { group = "androidx.core", name = "core-ktx", version.ref = "coreKtx" }
androidx-lifecycle-runtime-ktx = { group = "androidx.lifecycle", name = "lifecycle-runtime-ktx", version.ref = "lifecycleRuntimeKtx" }
androidx-lifecycle-viewmodel-compose = { group = "androidx.lifecycle", name = "lifecycle-viewmodel-compose", version.ref = "lifecycleRuntimeKtx" }
androidx-activity-compose = { group = "androidx.activity", name = "activity-compose", version.ref = "activityCompose" }
androidx-compose-bom = { group = "androidx.compose", name = "compose-bom", version.ref = "composeBom" }
androidx-ui = { group = "androidx.compose.ui", name = "ui" }
androidx-ui-graphics = { group = "androidx.compose.ui", name = "ui-graphics" }
androidx-ui-tooling = { group = "androidx.compose.ui", name = "ui-tooling" }
androidx-ui-tooling-preview = { group = "androidx.compose.ui", name = "ui-tooling-preview" }
androidx-material3 = { group = "androidx.compose.material3", name = "material3", version.ref = "material3" }
androidx-material-icons-extended = { group = "androidx.compose.material", name = "material-icons-extended" }
androidx-navigation-compose = { group = "androidx.navigation", name = "navigation-compose", version.ref = "navigationCompose" }
androidx-lifecycle-runtime-compose = { group = "androidx.lifecycle", name = "lifecycle-runtime-compose", version.ref = "lifecycleRuntimeKtx" }
androidx-compose-runtime-livedata = { group = "androidx.compose.runtime", name = "runtime-livedata" }
kotlinx-serialization-json = { group = "org.jetbrains.kotlinx", name = "kotlinx-serialization-json", version.ref = "serialization" }
androidx-datastore-preferences = { group = "androidx.datastore", name = "datastore-preferences", version.ref = "datastore" }
kotlinx-coroutines-android = { group = "org.jetbrains.kotlinx", name = "kotlinx-coroutines-android", version.ref = "coroutines" }
androidx-room-runtime = { group = "androidx.room", name = "room-runtime", version.ref = "room" }
androidx-room-ktx = { group = "androidx.room", name = "room-ktx", version.ref = "room" }
androidx-room-compiler = { group = "androidx.room", name = "room-compiler", version.ref = "room" }
retrofit-core = { group = "com.squareup.retrofit2", name = "retrofit", version.ref = "retrofit" }
retrofit-kotlinx-serialization = { group = "com.squareup.retrofit2", name = "converter-kotlinx-serialization", version.ref = "retrofit" }
okhttp-core = { group = "com.squareup.okhttp3", name = "okhttp", version.ref = "okhttp" }
okhttp-logging = { group = "com.squareup.okhttp3", name = "logging-interceptor", version.ref = "okhttp" }
google-generativeai = { group = "com.google.ai.client.generativeai", name = "generativeai", version.ref = "generativeAi" }

# Testing
junit = { group = "junit", name = "junit", version.ref = "junit" }
androidx-junit = { group = "androidx.test.ext", name = "junit", version.ref = "androidxJunit" }
androidx-espresso-core = { group = "androidx.test.espresso", name = "espresso-core", version.ref = "espressoCore" }
androidx-ui-test-manifest = { group = "androidx.compose.ui", name = "ui-test-manifest" }
androidx-ui-test-junit4 = { group = "androidx.compose.ui", name = "ui-test-junit4" }

[plugins]
android-application = { id = "com.android.application", version.ref = "agp" }
kotlin-android = { id = "org.jetbrains.kotlin.android", version.ref = "kotlin" }
kotlin-compose = { id = "org.jetbrains.kotlin.plugin.compose", version.ref = "kotlin" }
kotlin-serialization = { id = "org.jetbrains.kotlin.plugin.serialization", version.ref = "kotlin" }
ksp = { id = "com.google.devtools.ksp", version.ref = "ksp" }
`
  },
  {
    path: 'build.gradle.kts',
    name: 'build.gradle.kts (Raiz)',
    language: 'kotlin',
    category: 'gradle',
    description: 'Configuração raiz do projeto incluindo plugin de serialização e Compose.',
    code: `// Top-level build file where you can add configuration options common to all sub-projects/modules.
plugins {
    alias(libs.plugins.android.application) apply false
    alias(libs.plugins.kotlin.android) apply false
    alias(libs.plugins.kotlin.compose) apply false
    alias(libs.plugins.kotlin.serialization) apply false
    alias(libs.plugins.ksp) apply false
}
`
  },
  {
    path: 'settings.gradle.kts',
    name: 'settings.gradle.kts',
    language: 'kotlin',
    category: 'gradle',
    description: 'Configuração de repositórios Maven e inclusão do módulo :app.',
    code: `pluginManagement {
    repositories {
        google {
            content {
                includeGroupByRegex("com\\\\.android.*")
                includeGroupByRegex("com\\\\.google.*")
                includeGroupByRegex("androidx.*")
            }
        }
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = "Prumo"
include(":app")
`
  },
  {
    path: 'app/build.gradle.kts',
    name: 'app/build.gradle.kts (Módulo)',
    language: 'kotlin',
    category: 'gradle',
    description: 'Configuração do app com Kotlin Serialization, Navigation Compose e DataStore Preferences.',
    code: `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
    alias(libs.plugins.kotlin.serialization)
    alias(libs.plugins.ksp)
}

android {
    namespace = "com.prumo.app"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.prumo.app"
        minSdk = 24
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
        vectorDrawables {
            useSupportLibrary = true
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
        debug {
            applicationIdSuffix = ".debug"
            isDebuggable = true
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = "17"
    }

    buildFeatures {
        compose = true
        buildConfig = true
    }

    packaging {
        resources {
            excludes += "/META-INF/{AL2.0,LGPL2.1}"
        }
    }
}

dependencies {
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.lifecycle.runtime.ktx)
    implementation(libs.androidx.lifecycle.viewmodel.compose)
    implementation(libs.androidx.activity.compose)

    // Compose BOM e UI Material 3
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.ui)
    implementation(libs.androidx.ui.graphics)
    implementation(libs.androidx.ui.tooling.preview)
    implementation(libs.androidx.material3)
    implementation(libs.androidx.material.icons.extended)

    // Navegação Type-Safe e Serialização
    implementation(libs.androidx.navigation.compose)
    implementation(libs.kotlinx.serialization.json)
    implementation(libs.androidx.lifecycle.runtime.compose)
    implementation(libs.androidx.compose.runtime.livedata)

    // Persistência com DataStore e Coroutines
    implementation(libs.androidx.datastore.preferences)
    implementation(libs.kotlinx.coroutines.android)

    // Banco de Dados Local: Room Database com KSP
    implementation(libs.androidx.room.runtime)
    implementation(libs.androidx.room.ktx)
    ksp(libs.androidx.room.compiler)

    // Rede: Retrofit e OkHttp com Kotlin Serialization
    implementation(libs.retrofit.core)
    implementation(libs.retrofit.kotlinx.serialization)
    implementation(libs.okhttp.core)
    implementation(libs.okhttp.logging)

    // IA Coach (Google Generative AI)
    implementation(libs.google.generativeai)

    // Debug e Testes
    debugImplementation(libs.androidx.ui.tooling)
    debugImplementation(libs.androidx.ui.test.manifest)
    testImplementation(libs.junit)
    androidTestImplementation(libs.androidx.junit)
    androidTestImplementation(libs.androidx.espresso.core)
    androidTestImplementation(platform(libs.androidx.compose.bom))
    androidTestImplementation(libs.androidx.ui.test.junit4)
}
`
  },

  // ==========================================
  // NAVEGAÇÃO & ROTAS TYPE-SAFE (ETAPA 2)
  // ==========================================
  {
    path: 'app/src/main/java/com/prumo/app/navigation/PrumoDestinations.kt',
    name: 'PrumoDestinations.kt',
    language: 'kotlin',
    category: 'navigation',
    description: 'Rotas tipadas (@Serializable) do Navigation Compose para navegação Type-Safe sem strings soltas.',
    code: `package com.prumo.app.navigation

import kotlinx.serialization.Serializable

/**
 * Destinos e rotas Type-Safe do aplicativo Prumo.
 * Utiliza Kotlin Serialization integrado nativamente ao Navigation Compose 2.8+.
 */
sealed interface PrumoRoute {
    // Fluxo de Onboarding e Anamnese
    @Serializable
    data object Splash : PrumoRoute

    @Serializable
    data object Register : PrumoRoute

    @Serializable
    data object Carousel : PrumoRoute

    @Serializable
    data object Anamnese : PrumoRoute

    @Serializable
    data object Calculating : PrumoRoute

    @Serializable
    data object Diagnosis : PrumoRoute

    // Rotas das Abas Principais (Bottom Tabs)
    @Serializable
    data object Home : PrumoRoute

    @Serializable
    data object Roadmap : PrumoRoute

    @Serializable
    data class Coach(val taskId: String? = null) : PrumoRoute

    @Serializable
    data object Profile : PrumoRoute

    // Rotas Secundárias com Parâmetros
    @Serializable
    data class TaskDetail(val taskId: String) : PrumoRoute

    @Serializable
    data object Paywall : PrumoRoute
}
`
  },
  {
    path: 'app/src/main/java/com/prumo/app/navigation/PrumoBottomBar.kt',
    name: 'PrumoBottomBar.kt',
    language: 'kotlin',
    category: 'navigation',
    description: 'Barra de navegação inferior Material 3 com as 4 abas principais e visibilidade condicional.',
    code: `package com.prumo.app.navigation

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.slideInVertically
import androidx.compose.animation.slideOutVertically
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material.icons.filled.Checklist
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.outlined.AutoAwesome
import androidx.compose.material.icons.outlined.Checklist
import androidx.compose.material.icons.outlined.Home
import androidx.compose.material.icons.outlined.Person
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.unit.dp
import com.prumo.app.core.designsystem.theme.PrumoNeutral50
import com.prumo.app.core.designsystem.theme.PrumoNeutral600
import com.prumo.app.core.designsystem.theme.PrumoPrimary100
import com.prumo.app.core.designsystem.theme.PrumoPrimary600

enum class TopLevelDestination(
    val selectedIcon: ImageVector,
    val unselectedIcon: ImageVector,
    val label: String,
    val route: PrumoRoute
) {
    HOME(
        selectedIcon = Icons.Filled.Home,
        unselectedIcon = Icons.Outlined.Home,
        label = "Início",
        route = PrumoRoute.Home
    ),
    ROADMAP(
        selectedIcon = Icons.Filled.Checklist,
        unselectedIcon = Icons.Outlined.Checklist,
        label = "Roteiro",
        route = PrumoRoute.Roadmap
    ),
    COACH(
        selectedIcon = Icons.Filled.AutoAwesome,
        unselectedIcon = Icons.Outlined.AutoAwesome,
        label = "Coach",
        route = PrumoRoute.Coach()
    ),
    PROFILE(
        selectedIcon = Icons.Filled.Person,
        unselectedIcon = Icons.Outlined.Person,
        label = "Você",
        route = PrumoRoute.Profile
    )
}

@Composable
fun PrumoBottomBar(
    currentRoute: String?,
    isVisible: Boolean,
    onNavigateToDestination: (TopLevelDestination) -> Unit,
    modifier: Modifier = Modifier
) {
    AnimatedVisibility(
        visible = isVisible,
        enter = slideInVertically(initialOffsetY = { it }),
        exit = slideOutVertically(targetOffsetY = { it }),
        modifier = modifier
    ) {
        NavigationBar(
            containerColor = PrumoNeutral50,
            tonalElevation = 4.dp
        ) {
            TopLevelDestination.entries.forEach { destination ->
                val selected = currentRoute?.contains(destination.name, ignoreCase = true) == true ||
                        (destination == TopLevelDestination.HOME && currentRoute?.contains("Home") == true)

                NavigationBarItem(
                    selected = selected,
                    onClick = { onNavigateToDestination(destination) },
                    icon = {
                        Icon(
                            imageVector = if (selected) destination.selectedIcon else destination.unselectedIcon,
                            contentDescription = destination.label
                        )
                    },
                    label = { Text(destination.label) },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = PrumoPrimary600,
                        selectedTextColor = PrumoPrimary600,
                        indicatorColor = PrumoPrimary100,
                        unselectedIconColor = PrumoNeutral600,
                        unselectedTextColor = PrumoNeutral600
                    )
                )
            }
        }
    }
}
`
  },
  {
    path: 'app/src/main/java/com/prumo/app/navigation/PrumoNavHost.kt',
    name: 'PrumoNavHost.kt',
    language: 'kotlin',
    category: 'navigation',
    description: 'Grafo de navegação completo com transições suaves (slide/fade) conectando todas as telas do PRD.',
    code: `package com.prumo.app.navigation

import androidx.compose.animation.AnimatedContentTransitionScope
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.navigation.NavDestination.Companion.hierarchy
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import androidx.navigation.toRoute
import com.prumo.app.presentation.home.HomeScreenPreview

@Composable
fun PrumoNavHost(
    startDestination: PrumoRoute = PrumoRoute.Home,
    navController: NavHostController = rememberNavController()
) {
    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentDestination = navBackStackEntry?.destination

    // Determina se a BottomBar deve ficar visível (apenas nas 4 abas principais)
    val isBottomBarVisible = currentDestination?.hierarchy?.any { destination ->
        TopLevelDestination.entries.any { topLevel ->
            destination.route?.contains(topLevel.name, ignoreCase = true) == true ||
            destination.route?.contains("Home") == true ||
            destination.route?.contains("Roadmap") == true ||
            destination.route?.contains("Coach") == true ||
            destination.route?.contains("Profile") == true
        }
    } == true

    Scaffold(
        bottomBar = {
            PrumoBottomBar(
                currentRoute = currentDestination?.route,
                isVisible = isBottomBarVisible,
                onNavigateToDestination = { topLevel ->
                    navController.navigate(topLevel.route) {
                        popUpTo(navController.graph.findStartDestination().id) {
                            saveState = true
                        }
                        launchSingleTop = true
                        restoreState = true
                    }
                }
            )
        }
    ) { innerPadding ->
        NavHost(
            navController = navController,
            startDestination = startDestination,
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding),
            enterTransition = {
                fadeIn(animationSpec = tween(250)) +
                        slideIntoContainer(
                            towards = AnimatedContentTransitionScope.SlideDirection.Start,
                            animationSpec = tween(250)
                        )
            },
            exitTransition = {
                fadeOut(animationSpec = tween(200)) +
                        slideOutOfContainer(
                            towards = AnimatedContentTransitionScope.SlideDirection.Start,
                            animationSpec = tween(200)
                        )
            },
            popEnterTransition = {
                fadeIn(animationSpec = tween(250)) +
                        slideIntoContainer(
                            towards = AnimatedContentTransitionScope.SlideDirection.End,
                            animationSpec = tween(250)
                        )
            },
            popExitTransition = {
                fadeOut(animationSpec = tween(200)) +
                        slideOutOfContainer(
                            towards = AnimatedContentTransitionScope.SlideDirection.End,
                            animationSpec = tween(200)
                        )
            }
        ) {
            // Rotas de Onboarding & Anamnese
            composable<PrumoRoute.Splash> {
                // Splash / Boas-vindas
            }
            composable<PrumoRoute.Register> {
                // Cadastro leve
            }
            composable<PrumoRoute.Carousel> {
                // Carrossel explicativo
            }
            composable<PrumoRoute.Anamnese> {
                // Anamnese em 6 seções
            }
            composable<PrumoRoute.Calculating> {
                // Tela de storytelling calculando
            }
            composable<PrumoRoute.Diagnosis> {
                // Revelação de resultado
            }

            // Abas Principais
            composable<PrumoRoute.Home> {
                HomeScreenPreview()
            }
            composable<PrumoRoute.Roadmap> {
                // Roteiro / Todo list
            }
            composable<PrumoRoute.Coach> {
                // Chat com Coach de IA
            }
            composable<PrumoRoute.Profile> {
                // Perfil do usuário
            }

            // Rotas com Argumentos
            composable<PrumoRoute.TaskDetail> { backStackEntry ->
                val taskDetail = backStackEntry.toRoute<PrumoRoute.TaskDetail>()
                // Detalhe da tarefa selecionada (taskDetail.taskId)
            }
            composable<PrumoRoute.Paywall> {
                // Bottom sheet / Tela de assinatura
            }
        }
    }
}
`
  },

  // ==========================================
  // PERSISTÊNCIA DATASTORE & SESSÃO (ETAPA 2)
  // ==========================================
  {
    path: 'app/src/main/java/com/prumo/app/core/datastore/PrumoPreferencesDataSource.kt',
    name: 'PrumoPreferencesDataSource.kt',
    language: 'kotlin',
    category: 'data',
    description: 'Gerenciamento local via DataStore Preferences para persistir onboarding, perfil e limites de uso.',
    code: `package com.prumo.app.core.datastore

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.*
import androidx.datastore.preferences.preferencesDataStore
import com.prumo.app.domain.model.UserSession
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.catch
import kotlinx.coroutines.flow.map
import java.io.IOException

val Context.prumoDataStore: DataStore<Preferences> by preferencesDataStore(name = "prumo_preferences")

class PrumoPreferencesDataSource(private val context: Context) {

    private object PreferencesKeys {
        val IS_ONBOARDING_COMPLETED = booleanPreferencesKey("is_onboarding_completed")
        val USER_NAME = stringPreferencesKey("user_name")
        val USER_EMAIL = stringPreferencesKey("user_email")
        val MACRO_GOAL = stringPreferencesKey("macro_goal")
        val IS_PREMIUM = booleanPreferencesKey("is_premium")
        val COACH_MSGS_USED = intPreferencesKey("coach_msgs_used")
        val CURRENT_TASK_ID = stringPreferencesKey("current_task_id")
    }

    val userSession: Flow<UserSession> = context.prumoDataStore.data
        .catch { exception ->
            if (exception is IOException) {
                emit(emptyPreferences())
            } else {
                throw exception
            }
        }
        .map { preferences ->
            UserSession(
                isOnboardingCompleted = preferences[PreferencesKeys.IS_ONBOARDING_COMPLETED] ?: false,
                userName = preferences[PreferencesKeys.USER_NAME] ?: "",
                userEmail = preferences[PreferencesKeys.USER_EMAIL] ?: "",
                macroGoal = preferences[PreferencesKeys.MACRO_GOAL] ?: "renda_extra",
                isPremium = preferences[PreferencesKeys.IS_PREMIUM] ?: false,
                coachMessagesUsed = preferences[PreferencesKeys.COACH_MSGS_USED] ?: 0,
                currentTaskId = preferences[PreferencesKeys.CURRENT_TASK_ID] ?: "t1"
            )
        }

    suspend fun saveUserRegistration(name: String, email: String, macroGoal: String) {
        context.prumoDataStore.edit { preferences ->
            preferences[PreferencesKeys.USER_NAME] = name
            preferences[PreferencesKeys.USER_EMAIL] = email
            preferences[PreferencesKeys.MACRO_GOAL] = macroGoal
        }
    }

    suspend fun setOnboardingCompleted(completed: Boolean) {
        context.prumoDataStore.edit { preferences ->
            preferences[PreferencesKeys.IS_ONBOARDING_COMPLETED] = completed
        }
    }

    suspend fun incrementCoachUsage() {
        context.prumoDataStore.edit { preferences ->
            val current = preferences[PreferencesKeys.COACH_MSGS_USED] ?: 0
            preferences[PreferencesKeys.COACH_MSGS_USED] = current + 1
        }
    }

    suspend fun setCurrentTaskId(taskId: String) {
        context.prumoDataStore.edit { preferences ->
            preferences[PreferencesKeys.CURRENT_TASK_ID] = taskId
        }
    }
}
`
  },

  // ==========================================
  // DOMÍNIO & MODELOS LIMPOS (CLEAN ARCHITECTURE)
  // ==========================================
  {
    path: 'app/src/main/java/com/prumo/app/domain/model/UserSession.kt',
    name: 'UserSession.kt',
    language: 'kotlin',
    category: 'domain',
    description: 'Entidade pura de domínio para representar a sessão ativa e permissões do usuário.',
    code: `package com.prumo.app.domain.model

data class UserSession(
    val isOnboardingCompleted: Boolean = false,
    val userName: String = "",
    val userEmail: String = "",
    val macroGoal: String = "renda_extra",
    val isPremium: Boolean = false,
    val coachMessagesUsed: Int = 0,
    val currentTaskId: String = "t1"
) {
    val canSendMessageToCoach: Boolean
        get() = isPremium || coachMessagesUsed < 3
}
`
  },
  {
    path: 'app/src/main/java/com/prumo/app/domain/model/Task.kt',
    name: 'Task.kt',
    language: 'kotlin',
    category: 'domain',
    description: 'Modelo de domínio de tarefa com fases (Fundação, Marketing, Lançamento) e status.',
    code: `package com.prumo.app.domain.model

enum class TaskPhase(val displayName: String, val colorHex: String) {
    FUNDACAO("Fundação", "#1F6F5C"),
    MARKETING("Marketing", "#F2A93B"),
    LANCAMENTO("Lançamento", "#7A5AF8")
}

enum class TaskStatus {
    PENDING,
    IN_PROGRESS,
    COMPLETED
}

data class Task(
    val id: String,
    val phase: TaskPhase,
    val title: String,
    val description: String,
    val durationMinutes: Int,
    val status: TaskStatus = TaskStatus.PENDING,
    val whatToDo: String,
    val howToKnowItIsGood: List<String>,
    val resources: List<String> = emptyList(),
    val notes: String = "",
    val isLocked: Boolean = false
)
`
  },
  {
    path: 'app/src/main/java/com/prumo/app/domain/repository/UserRepository.kt',
    name: 'UserRepository.kt',
    language: 'kotlin',
    category: 'domain',
    description: 'Interface de repositório de domínio para desacoplar a camada de dados.',
    code: `package com.prumo.app.domain.repository

import com.prumo.app.domain.model.UserSession
import kotlinx.coroutines.flow.Flow

interface UserRepository {
    fun getUserSession(): Flow<UserSession>
    suspend fun saveUser(name: String, email: String, macroGoal: String)
    suspend fun completeOnboarding()
    suspend fun recordCoachMessage()
    suspend fun updateCurrentTask(taskId: String)
}
`
  },
  {
    path: 'app/src/main/java/com/prumo/app/domain/repository/TaskRepository.kt',
    name: 'TaskRepository.kt',
    language: 'kotlin',
    category: 'domain',
    description: 'Interface de repositório para acesso e atualização de tarefas com Flow reativo.',
    code: `package com.prumo.app.domain.repository

import com.prumo.app.domain.model.Task
import com.prumo.app.domain.model.TaskPhase
import kotlinx.coroutines.flow.Flow

interface TaskRepository {
    fun getAllTasks(): Flow<List<Task>>
    fun getTasksByPhase(phase: TaskPhase): Flow<List<Task>>
    suspend fun getTaskById(taskId: String): Task?
    suspend fun toggleTaskStatus(taskId: String)
    suspend fun updateTaskNotes(taskId: String, notes: String)
}
`
  },

  // ==========================================
  // IMPLEMENTAÇÃO DOS REPOSITÓRIOS (DATA LAYER)
  // ==========================================
  {
    path: 'app/src/main/java/com/prumo/app/data/repository/UserRepositoryImpl.kt',
    name: 'UserRepositoryImpl.kt',
    language: 'kotlin',
    category: 'data',
    description: 'Implementação concreta do UserRepository conectada ao DataStore Preferences.',
    code: `package com.prumo.app.data.repository

import com.prumo.app.core.datastore.PrumoPreferencesDataSource
import com.prumo.app.domain.model.UserSession
import com.prumo.app.domain.repository.UserRepository
import kotlinx.coroutines.flow.Flow

class UserRepositoryImpl(
    private val preferencesDataSource: PrumoPreferencesDataSource
) : UserRepository {

    override fun getUserSession(): Flow<UserSession> {
        return preferencesDataSource.userSession
    }

    override suspend fun saveUser(name: String, email: String, macroGoal: String) {
        preferencesDataSource.saveUserRegistration(name, email, macroGoal)
    }

    override suspend fun completeOnboarding() {
        preferencesDataSource.setOnboardingCompleted(true)
    }

    override suspend fun recordCoachMessage() {
        preferencesDataSource.incrementCoachUsage()
    }

    override suspend fun updateCurrentTask(taskId: String) {
        preferencesDataSource.setCurrentTaskId(taskId)
    }
}
`
  },
  {
    path: 'app/src/main/java/com/prumo/app/data/repository/TaskRepositoryImpl.kt',
    name: 'TaskRepositoryImpl.kt',
    language: 'kotlin',
    category: 'data',
    description: 'Implementação com StateFlow inicializado com as tarefas da Fase Fundação do PRD.',
    code: `package com.prumo.app.data.repository

import com.prumo.app.domain.model.Task
import com.prumo.app.domain.model.TaskPhase
import com.prumo.app.domain.model.TaskStatus
import com.prumo.app.domain.repository.TaskRepository
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.map

class TaskRepositoryImpl : TaskRepository {

    private val initialTasks = listOf(
        Task(
            id = "t1",
            phase = TaskPhase.FUNDACAO,
            title = "Definir sua promessa em 1 frase",
            description = "Escreva o que você ajuda a pessoa a resolver de forma clara.",
            durationMinutes = 15,
            status = TaskStatus.COMPLETED,
            whatToDo = "Complete a fórmula: 'Eu ajudo [Público] a alcançar [Resultado] mesmo que [Objeção]'.",
            howToKnowItIsGood = listOf(
                "Qualquer pessoa da família entende ao ouvir",
                "Resolve exatamente 1 dor central",
                "Não promete dinheiro fácil"
            )
        ),
        Task(
            id = "t2",
            phase = TaskPhase.FUNDACAO,
            title = "Criar sua versão mínima entregável",
            description = "O menor entregável possível para testar com uma pessoa real.",
            durationMinutes = 20,
            status = TaskStatus.PENDING,
            whatToDo = "Monte um PDF, checklist no Notion ou vídeo curto de 10 minutos.",
            howToKnowItIsGood = listOf(
                "Dá para aplicar em menos de 1 dia",
                "Resolve 1 problema de ponta a ponta",
                "Você entregaria de graça para testar"
            )
        ),
        Task(
            id = "t3",
            phase = TaskPhase.FUNDACAO,
            title = "Validar com 3 pessoas reais",
            description = "Receber feedback honesto de quem vive a dor.",
            durationMinutes = 30,
            status = TaskStatus.PENDING,
            whatToDo = "Envie para 3 pessoas e pergunte: 'O que ficou confuso?' e 'Isso te poupou tempo?'.",
            howToKnowItIsGood = listOf(
                "Pelo menos 2 confirmaram que aplicaram o conselho"
            )
        )
    )

    private val _tasks = MutableStateFlow(initialTasks)

    override fun getAllTasks(): Flow<List<Task>> = _tasks.asStateFlow()

    override fun getTasksByPhase(phase: TaskPhase): Flow<List<Task>> =
        _tasks.map { list -> list.filter { it.phase == phase } }

    override suspend fun getTaskById(taskId: String): Task? =
        _tasks.value.find { it.id == taskId }

    override suspend fun toggleTaskStatus(taskId: String) {
        _tasks.value = _tasks.value.map { task ->
            if (task.id == taskId) {
                val next = if (task.status == TaskStatus.COMPLETED) TaskStatus.PENDING else TaskStatus.COMPLETED
                task.copy(status = next)
            } else {
                task
            }
        }
    }

    override suspend fun updateTaskNotes(taskId: String, notes: String) {
        _tasks.value = _tasks.value.map { task ->
            if (task.id == taskId) task.copy(notes = notes) else task
        }
    }
}
`
  },

  // ==========================================
  // INJEÇÃO DE DEPENDÊNCIAS & SERVICE LOCATOR
  // ==========================================
  {
    path: 'app/src/main/java/com/prumo/app/di/ServiceLocator.kt',
    name: 'ServiceLocator.kt',
    language: 'kotlin',
    category: 'data',
    description: 'Injeção de dependências limpa fornecendo instâncias de DataStore e Repositórios.',
    code: `package com.prumo.app.di

import android.content.Context
import com.prumo.app.core.datastore.PrumoPreferencesDataSource
import com.prumo.app.data.repository.TaskRepositoryImpl
import com.prumo.app.data.repository.UserRepositoryImpl
import com.prumo.app.domain.repository.TaskRepository
import com.prumo.app.domain.repository.UserRepository

/**
 * Service Locator desacoplado para injeção de dependências.
 * Facilita testes e pode ser substituído por Hilt ou Koin de forma transparente.
 */
object ServiceLocator {

    private var preferencesDataSource: PrumoPreferencesDataSource? = null
    private var userRepository: UserRepository? = null
    private var taskRepository: TaskRepository? = null

    fun provideUserRepository(context: Context): UserRepository {
        return userRepository ?: synchronized(this) {
            val ds = preferencesDataSource ?: PrumoPreferencesDataSource(context.applicationContext).also {
                preferencesDataSource = it
            }
            UserRepositoryImpl(ds).also { userRepository = it }
        }
    }

    fun provideTaskRepository(): TaskRepository {
        return taskRepository ?: synchronized(this) {
            TaskRepositoryImpl().also { taskRepository = it }
        }
    }
}
`
  },

  // ==========================================
  // VIEWMODEL PRINCIPAL (PRESENTATION LAYER)
  // ==========================================
  {
    path: 'app/src/main/java/com/prumo/app/presentation/main/MainViewModel.kt',
    name: 'MainViewModel.kt',
    language: 'kotlin',
    category: 'activity',
    description: 'MainViewModel que decide o destino inicial (Splash vs Home) sem flicker de carregamento.',
    code: `package com.prumo.app.presentation.main

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.prumo.app.domain.model.UserSession
import com.prumo.app.domain.repository.UserRepository
import com.prumo.app.navigation.PrumoRoute
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.stateIn

sealed interface MainUiState {
    data object Loading : MainUiState
    data class Success(
        val session: UserSession,
        val initialRoute: PrumoRoute
    ) : MainUiState
}

class MainViewModel(
    userRepository: UserRepository
) : ViewModel() {

    val uiState: StateFlow<MainUiState> = userRepository.getUserSession()
        .map { session ->
            val route = if (session.isOnboardingCompleted) {
                PrumoRoute.Home
            } else {
                PrumoRoute.Splash
            }
            MainUiState.Success(session, route)
        }
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5_000),
            initialValue = MainUiState.Loading
        )
}
`
  },

  // ==========================================
  // MAIN ACTIVITY ATUALIZADA
  // ==========================================
  {
    path: 'app/src/main/java/com/prumo/app/MainActivity.kt',
    name: 'MainActivity.kt',
    language: 'kotlin',
    category: 'activity',
    description: 'MainActivity orquestrando o tema, NavHost Type-Safe e carregamento de estado inicial.',
    code: `package com.prumo.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Surface
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.lifecycle.viewmodel.compose.viewModel
import com.prumo.app.core.designsystem.theme.PrumoNeutral50
import com.prumo.app.core.designsystem.theme.PrumoPrimary600
import com.prumo.app.core.designsystem.theme.PrumoTheme
import com.prumo.app.di.ServiceLocator
import com.prumo.app.navigation.PrumoNavHost
import com.prumo.app.presentation.main.MainUiState
import com.prumo.app.presentation.main.MainViewModel

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        val userRepository = ServiceLocator.provideUserRepository(applicationContext)

        setContent {
            PrumoTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = PrumoNeutral50
                ) {
                    val viewModel: MainViewModel = viewModel {
                        MainViewModel(userRepository)
                    }
                    val state by viewModel.uiState.collectAsState()

                    when (val current = state) {
                        is MainUiState.Loading -> {
                            Box(
                                modifier = Modifier.fillMaxSize(),
                                contentAlignment = Alignment.Center
                            ) {
                                CircularProgressIndicator(color = PrumoPrimary600)
                            }
                        }
                        is MainUiState.Success -> {
                            PrumoNavHost(startDestination = current.initialRoute)
                        }
                    }
                }
            }
        }
    }
}
`
  },

  // ==========================================
  // DESIGN SYSTEM (ETAPA 1 & REUTILIZÁVEIS)
  // ==========================================
  {
    path: 'app/src/main/java/com/prumo/app/core/designsystem/theme/Color.kt',
    name: 'Color.kt',
    language: 'kotlin',
    category: 'theme',
    description: 'Paleta oficial do Prumo: Verde-prumo, Âmbar, Roxo de Lançamento e tons neutros.',
    code: `package com.prumo.app.core.designsystem.theme

import androidx.compose.ui.graphics.Color

val PrumoPrimary600 = Color(0xFF1F6F5C) // Ações primárias e marca
val PrumoPrimary500 = Color(0xFF2E8B73) // Hover e links
val PrumoPrimary100 = Color(0xFFE3F2ED) // Fundos de destaque suave
val PrumoAccent500  = Color(0xFFF2A93B) // Destaques e Fase Marketing
val PrumoPhaseLaunch = Color(0xFF7A5AF8) // Fase Lançamento

val PrumoNeutral900 = Color(0xFF1A1D1B) // Texto principal
val PrumoNeutral600 = Color(0xFF5B615D) // Texto secundário
val PrumoNeutral200 = Color(0xFFE6E8E6) // Bordas
val PrumoNeutral50  = Color(0xFFF7F9F8) // Fundo da aplicação
val PrumoSurfaceWhite = Color(0xFFFFFFFF)

val PrumoSuccess = Color(0xFF3BAA6B)
val PrumoWarning = Color(0xFFE0A800)
val PrumoDanger  = Color(0xFFD64545)
`
  },
  {
    path: 'app/src/main/java/com/prumo/app/core/designsystem/theme/Type.kt',
    name: 'Type.kt',
    language: 'kotlin',
    category: 'theme',
    description: 'Escala tipográfica com suporte a Inter e títulos com fonte de celebração.',
    code: `package com.prumo.app.core.designsystem.theme

import androidx.compose.material3.Typography
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp

val PrumoTypography = Typography(
    displayLarge = TextStyle(
        fontFamily = FontFamily.Serif,
        fontWeight = FontWeight.SemiBold,
        fontSize = 32.sp,
        lineHeight = 40.sp,
        color = PrumoNeutral900
    ),
    headlineMedium = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.SemiBold,
        fontSize = 24.sp,
        lineHeight = 32.sp,
        color = PrumoNeutral900
    ),
    titleLarge = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Medium,
        fontSize = 20.sp,
        lineHeight = 28.sp,
        color = PrumoNeutral900
    ),
    titleMedium = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.SemiBold,
        fontSize = 16.sp,
        lineHeight = 24.sp,
        color = PrumoNeutral900
    ),
    bodyLarge = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Normal,
        fontSize = 16.sp,
        lineHeight = 24.sp,
        color = PrumoNeutral900
    ),
    bodyMedium = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Normal,
        fontSize = 14.sp,
        lineHeight = 20.sp,
        color = PrumoNeutral600
    ),
    labelMedium = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Medium,
        fontSize = 13.sp,
        lineHeight = 18.sp,
        color = PrumoNeutral600
    )
)
`
  },
  {
    path: 'app/src/main/java/com/prumo/app/core/designsystem/theme/Theme.kt',
    name: 'Theme.kt',
    language: 'kotlin',
    category: 'theme',
    description: 'Tema Jetpack Compose Material 3 integrando esquema de cores claras e escuras.',
    code: `package com.prumo.app.core.designsystem.theme

import android.app.Activity
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.SideEffect
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalView
import androidx.core.view.WindowCompat

private val LightColorScheme = lightColorScheme(
    primary = PrumoPrimary600,
    onPrimary = PrumoSurfaceWhite,
    primaryContainer = PrumoPrimary100,
    onPrimaryContainer = PrumoPrimary600,
    secondary = PrumoAccent500,
    background = PrumoNeutral50,
    surface = PrumoSurfaceWhite,
    onSurface = PrumoNeutral900
)

@Composable
fun PrumoTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colorScheme = LightColorScheme
    val view = LocalView.current

    if (!view.isInEditMode) {
        SideEffect {
            val window = (view.context as? Activity)?.window ?: return@SideEffect
            window.statusBarColor = colorScheme.primary.toArgb()
            WindowCompat.getInsetsController(window, view).isAppearanceLightStatusBars = false
        }
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = PrumoTypography,
        content = content
    )
}
`
  },
  {
    path: 'app/src/main/java/com/prumo/app/core/designsystem/component/PrumoButton.kt',
    name: 'PrumoButton.kt',
    language: 'kotlin',
    category: 'component',
    description: 'Botões primário e secundário de 52dp com raio 12dp conforme design system.',
    code: `package com.prumo.app.core.designsystem.component

import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.prumo.app.core.designsystem.theme.PrumoPrimary600
import com.prumo.app.core.designsystem.theme.PrumoSurfaceWhite
import com.prumo.app.core.designsystem.theme.PrumoTypography

@Composable
fun PrumoPrimaryButton(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true
) {
    Button(
        onClick = onClick,
        enabled = enabled,
        shape = RoundedCornerShape(12.dp),
        colors = ButtonDefaults.buttonColors(
            containerColor = PrumoPrimary600,
            contentColor = PrumoSurfaceWhite
        ),
        modifier = modifier
            .fillMaxWidth()
            .height(52.dp)
    ) {
        Text(text = text, style = PrumoTypography.titleMedium)
    }
}
`
  },
  {
    path: 'app/src/main/java/com/prumo/app/presentation/home/HomeScreenPreview.kt',
    name: 'HomeScreenPreview.kt',
    language: 'kotlin',
    category: 'activity',
    description: 'Composables da Home D1: Próximo Passo, Barra de Progresso e Fases.',
    code: `package com.prumo.app.presentation.home

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Explore
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.prumo.app.core.designsystem.component.PrumoPrimaryButton
import com.prumo.app.core.designsystem.theme.*

@Composable
fun HomeScreenPreview() {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(PrumoNeutral50)
            .padding(20.dp)
            .verticalScroll(rememberScrollState())
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text(text = "Olá, Ana 👋", style = PrumoTypography.headlineMedium)
                Text(text = "Vamos dar mais um passo hoje?", style = PrumoTypography.bodyMedium)
            }
            Box(
                modifier = Modifier
                    .size(44.dp)
                    .clip(CircleShape)
                    .background(PrumoPrimary100),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = Icons.Default.Explore,
                    contentDescription = "Bússola",
                    tint = PrumoPrimary600
                )
            }
        }

        Spacer(modifier = Modifier.height(20.dp))

        Card(
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = PrumoPrimary100),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text(
                    text = "PRÓXIMO PASSO • 15 min",
                    style = PrumoTypography.labelSmall.copy(fontWeight = FontWeight.Bold),
                    color = PrumoPrimary600
                )
                Spacer(modifier = Modifier.height(6.dp))
                Text(
                    text = "Definir sua promessa",
                    style = PrumoTypography.titleLarge.copy(fontWeight = FontWeight.SemiBold)
                )
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = "Escreva em uma frase clara o que você ajuda a pessoa a resolver.",
                    style = PrumoTypography.bodyMedium
                )
                Spacer(modifier = Modifier.height(16.dp))
                PrumoPrimaryButton(text = "Fazer agora", onClick = {})
            }
        }
    }
}
`
  },
  {
    path: 'app/src/main/java/com/prumo/app/core/designsystem/theme/Shape.kt',
    name: 'Shape.kt',
    language: 'kotlin',
    category: 'theme',
    description: 'Raios e formas padronizadas (Cards 16dp, Botões 12dp, Inputs 10dp, Chips pílula 999dp).',
    code: `package com.prumo.app.core.designsystem.theme

import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Shapes
import androidx.compose.ui.unit.dp

val PrumoShapes = Shapes(
    // Chips e badges em pílula
    extraSmall = RoundedCornerShape(999.dp),
    // Inputs e seletores menores
    small = RoundedCornerShape(10.dp),
    // Botões padrão do Prumo (12dp)
    medium = RoundedCornerShape(12.dp),
    // Cartões e superfícies principais (16dp)
    large = RoundedCornerShape(16.dp),
    // Bottom sheets e modais de destaque (24dp)
    extraLarge = RoundedCornerShape(24.dp)
)
`
  },
  {
    path: 'app/src/main/java/com/prumo/app/core/designsystem/theme/Dimens.kt',
    name: 'Dimens.kt',
    language: 'kotlin',
    category: 'theme',
    description: 'Grid base de 8pt (4, 8, 12, 16, 24, 32, 48dp) e margens laterais mobile de 20dp.',
    code: `package com.prumo.app.core.designsystem.theme

import androidx.compose.ui.unit.dp

object PrumoDimens {
    // Grid base de 8pt
    val SpaceExtraSmall = 4.dp
    val SpaceSmall = 8.dp
    val SpaceMediumSmall = 12.dp
    val SpaceMedium = 16.dp
    val SpaceLarge = 24.dp
    val SpaceExtraLarge = 32.dp
    val SpaceHuge = 48.dp

    // Margem lateral mobile conforme PRD
    val ScreenHorizontalPadding = 20.dp

    // Altura mínima para alvos de toque (Acessibilidade WCAG AA)
    val MinTouchTarget = 48.dp
    val ButtonHeight = 52.dp
    val InputHeight = 50.dp
}
`
  },
  {
    path: 'app/src/main/java/com/prumo/app/core/designsystem/component/PrumoBadge.kt',
    name: 'PrumoBadge.kt',
    language: 'kotlin',
    category: 'component',
    description: 'Chips e badges em formato de pílula para fases (Fundação, Marketing, Lançamento) e status.',
    code: `package com.prumo.app.core.designsystem.component

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.prumo.app.core.designsystem.theme.*

@Composable
fun PrumoPhaseBadge(
    phaseName: String,
    modifier: Modifier = Modifier
) {
    val (bg, textColor) = when (phaseName.lowercase()) {
        "fundação", "fundacao" -> PrumoPrimary100 to PrumoPrimary600
        "marketing" -> Color(0xFFFEF3EB) to PrumoAccent500
        "lançamento", "lancamento" -> Color(0xFFF3F0FF) to PrumoPhaseLaunch
        else -> PrumoNeutral50 to PrumoNeutral600
    }

    Box(
        modifier = modifier
            .background(color = bg, shape = RoundedCornerShape(999.dp))
            .border(width = 1.dp, color = textColor.copy(alpha = 0.2f), shape = RoundedCornerShape(999.dp))
            .padding(horizontal = 10.dp, vertical = 4.dp),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = phaseName,
            color = textColor,
            fontSize = 11.sp,
            fontWeight = FontWeight.SemiBold
        )
    }
}

@Composable
fun PrumoStatusBadge(
    text: String,
    isSuccess: Boolean,
    modifier: Modifier = Modifier
) {
    val bg = if (isSuccess) Color(0xFFE8F7EE) else Color(0xFFFDF6E2)
    val color = if (isSuccess) PrumoSuccess else PrumoWarning

    Box(
        modifier = modifier
            .background(color = bg, shape = RoundedCornerShape(999.dp))
            .padding(horizontal = 8.dp, vertical = 3.dp)
    ) {
        Text(
            text = text,
            color = color,
            fontSize = 10.sp,
            fontWeight = FontWeight.Medium
        )
    }
}
`
  },
  {
    path: 'app/src/main/java/com/prumo/app/core/designsystem/component/PrumoProgressBar.kt',
    name: 'PrumoProgressBar.kt',
    language: 'kotlin',
    category: 'component',
    description: 'Indicadores de progresso linear e agregados por fase com animação suave.',
    code: `package com.prumo.app.core.designsystem.component

import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.prumo.app.core.designsystem.theme.*

@Composable
fun PrumoLinearProgressBar(
    progress: Float,
    modifier: Modifier = Modifier,
    color: Color = PrumoPrimary600,
    trackColor: Color = PrumoNeutral200
) {
    val animatedProgress by animateFloatAsState(
        targetValue = progress.coerceIn(0f, 1f),
        animationSpec = tween(durationMillis = 400),
        label = "ProgressBarAnimation"
    )

    Box(
        modifier = modifier
            .fillMaxWidth()
            .height(8.dp)
            .clip(RoundedCornerShape(4.dp))
            .background(trackColor)
    ) {
        Box(
            modifier = Modifier
                .fillMaxWidth(animatedProgress)
                .fillMaxHeight()
                .background(color)
        )
    }
}

@Composable
fun PrumoPhaseProgressRow(
    phaseName: String,
    progress: Float,
    color: Color,
    modifier: Modifier = Modifier
) {
    Row(
        modifier = modifier.fillMaxWidth(),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(
            text = phaseName,
            style = PrumoTypography.labelMedium,
            modifier = Modifier.width(90.dp)
        )
        PrumoLinearProgressBar(
            progress = progress,
            color = color,
            modifier = Modifier.weight(1f)
        )
        Text(
            text = "\${(progress * 100).toInt()}%",
            style = PrumoTypography.labelSmall,
            modifier = Modifier.width(42.dp),
            textAlign = TextAlign.End
        )
    }
}
`
  },
  {
    path: 'app/src/main/java/com/prumo/app/presentation/roadmap/RoadmapUiState.kt',
    name: 'RoadmapUiState.kt',
    language: 'kotlin',
    category: 'viewmodel',
    description: 'Contratos UDF: UiState imutável, UiEvent (ações do usuário) e UiEffect (efeitos colaterais únicos).',
    code: `package com.prumo.app.presentation.roadmap

import com.prumo.app.domain.model.Task
import com.prumo.app.domain.model.TaskPhase

/**
 * Estado imutável da tela de Roteiro (Single Source of Truth).
 * A UI apenas renderiza este estado e nunca o modifica diretamente.
 */
data class RoadmapUiState(
    val isLoading: Boolean = false,
    val tasks: List<Task> = emptyList(),
    val filteredTasks: List<Task> = emptyList(),
    val selectedPhase: TaskPhase? = null,
    val completedCount: Int = 0,
    val totalCount: Int = 0,
    val progressPercent: Int = 0,
    val errorMessage: String? = null
)

/**
 * Eventos e intenções da UI (Unidirectional Data Flow).
 * Disparados pela View (Compose) e consumidos exclusivamente pelo ViewModel.
 */
sealed interface RoadmapUiEvent {
    data class OnToggleTask(val taskId: String) : RoadmapUiEvent
    data class OnFilterPhase(val phase: TaskPhase?) : RoadmapUiEvent
    data class OnSelectTask(val taskId: String) : RoadmapUiEvent
    data object OnRefresh : RoadmapUiEvent
}

/**
 * Efeitos colaterais únicos (navegação, toasts, confetes).
 * Consumidos apenas uma vez pela UI via LaunchedEffect.
 */
sealed interface RoadmapUiEffect {
    data object ShowCelebrationConfetti : RoadmapUiEffect
    data class NavigateToTaskDetail(val taskId: String) : RoadmapUiEffect
    data class ShowToast(val message: String) : RoadmapUiEffect
}
`
  },
  {
    path: 'app/src/main/java/com/prumo/app/presentation/roadmap/RoadmapViewModel.kt',
    name: 'RoadmapViewModel.kt (StateFlow UDF)',
    language: 'kotlin',
    category: 'viewmodel',
    description: 'Implementação oficial com StateFlow e Unidirectional Data Flow (UDF) para o Jetpack Compose.',
    code: `package com.prumo.app.presentation.roadmap

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.prumo.app.domain.model.TaskPhase
import com.prumo.app.domain.model.TaskStatus
import com.prumo.app.domain.repository.TaskRepository
import kotlinx.coroutines.channels.Channel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch

/**
 * ViewModel desacoplado da UI: processa regras de negócio e emite estados imutáveis.
 * Utiliza StateFlow com State Hoisting para recomposição cirúrgica no Compose.
 */
class RoadmapViewModel(
    private val taskRepository: TaskRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(RoadmapUiState(isLoading = true))
    val uiState: StateFlow<RoadmapUiState> = _uiState.asStateFlow()

    // Canal para efeitos colaterais únicos (navegação, confetes)
    private val _uiEffect = Channel<RoadmapUiEffect>(Channel.BUFFERED)
    val uiEffect: Flow<RoadmapUiEffect> = _uiEffect.receiveAsFlow()

    init {
        observeTasks()
    }

    private fun observeTasks() {
        viewModelScope.launch {
            taskRepository.getAllTasks()
                .catch { error ->
                    _uiState.update { it.copy(isLoading = false, errorMessage = error.message) }
                }
                .collect { allTasks ->
                    val selectedPhase = _uiState.value.selectedPhase
                    val filtered = if (selectedPhase == null) allTasks else allTasks.filter { it.phase == selectedPhase }
                    val completed = allTasks.count { it.status == TaskStatus.COMPLETED }
                    val total = allTasks.size
                    val percent = if (total > 0) ((completed.toFloat() / total) * 100).toInt() else 0

                    _uiState.update {
                        it.copy(
                            isLoading = false,
                            tasks = allTasks,
                            filteredTasks = filtered,
                            completedCount = completed,
                            totalCount = total,
                            progressPercent = percent
                        )
                    }
                }
        }
    }

    // Ponto único de entrada para eventos disparados pela UI (UDF)
    fun onEvent(event: RoadmapUiEvent) {
        when (event) {
            is RoadmapUiEvent.OnToggleTask -> toggleTask(event.taskId)
            is RoadmapUiEvent.OnFilterPhase -> filterPhase(event.phase)
            is RoadmapUiEvent.OnSelectTask -> selectTask(event.taskId)
            is RoadmapUiEvent.OnRefresh -> observeTasks()
        }
    }

    private fun toggleTask(taskId: String) {
        viewModelScope.launch {
            val task = _uiState.value.tasks.find { it.id == taskId }
            taskRepository.toggleTaskStatus(taskId)

            // Se acabou de concluir, dispara efeito de confete
            if (task != null && task.status != TaskStatus.COMPLETED) {
                _uiEffect.send(RoadmapUiEffect.ShowCelebrationConfetti)
            }
        }
    }

    private fun filterPhase(phase: TaskPhase?) {
        _uiState.update { current ->
            val all = current.tasks
            val filtered = if (phase == null) all else all.filter { it.phase == phase }
            current.copy(selectedPhase = phase, filteredTasks = filtered)
        }
    }

    private fun selectTask(taskId: String) {
        viewModelScope.launch {
            _uiEffect.send(RoadmapUiEffect.NavigateToTaskDetail(taskId))
        }
    }
}
`
  },
  {
    path: 'app/src/main/java/com/prumo/app/presentation/roadmap/RoadmapViewModelLiveData.kt',
    name: 'RoadmapViewModelLiveData.kt (LiveData)',
    language: 'kotlin',
    category: 'viewmodel',
    description: 'Abordagem alternativa demonstrando o uso de LiveData com o operador observeAsState() no Compose.',
    code: `package com.prumo.app.presentation.roadmap

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.prumo.app.domain.model.TaskPhase
import com.prumo.app.domain.model.TaskStatus
import com.prumo.app.domain.repository.TaskRepository
import kotlinx.coroutines.launch

/**
 * Exemplo didático utilizando LiveData clássico no Android.
 * No Jetpack Compose, o LiveData é consumido com:
 * val state by viewModel.uiState.observeAsState(RoadmapUiState())
 */
class RoadmapViewModelLiveData(
    private val taskRepository: TaskRepository
) : ViewModel() {

    private val _uiState = MutableLiveData<RoadmapUiState>(RoadmapUiState(isLoading = true))
    val uiState: LiveData<RoadmapUiState> = _uiState

    init {
        loadTasks()
    }

    private fun loadTasks() {
        viewModelScope.launch {
            taskRepository.getAllTasks().collect { allTasks ->
                val completed = allTasks.count { it.status == TaskStatus.COMPLETED }
                val total = allTasks.size
                val percent = if (total > 0) ((completed.toFloat() / total) * 100).toInt() else 0

                _uiState.value = RoadmapUiState(
                    isLoading = false,
                    tasks = allTasks,
                    filteredTasks = allTasks,
                    completedCount = completed,
                    totalCount = total,
                    progressPercent = percent
                )
            }
        }
    }

    fun onToggleTask(taskId: String) {
        viewModelScope.launch {
            taskRepository.toggleTaskStatus(taskId)
        }
    }

    fun onFilterPhase(phase: TaskPhase?) {
        val current = _uiState.value ?: return
        val filtered = if (phase == null) current.tasks else current.tasks.filter { it.phase == phase }
        _uiState.value = current.copy(selectedPhase = phase, filteredTasks = filtered)
    }
}
`
  },
  {
    path: 'app/src/main/java/com/prumo/app/presentation/roadmap/RoadmapScreen.kt',
    name: 'RoadmapScreen.kt (Stateless UI)',
    language: 'kotlin',
    category: 'viewmodel',
    description: 'Tela Compose 100% Stateless com State Hoisting: recebe estado e despacha eventos sem acoplamento.',
    code: `package com.prumo.app.presentation.roadmap

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.outlined.Circle
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.prumo.app.core.designsystem.component.PrumoLinearProgressBar
import com.prumo.app.core.designsystem.component.PrumoPhaseBadge
import com.prumo.app.core.designsystem.theme.*
import com.prumo.app.domain.model.Task
import com.prumo.app.domain.model.TaskPhase
import com.prumo.app.domain.model.TaskStatus
import kotlinx.coroutines.flow.Flow

/**
 * Screen Stateful que conecta o ViewModel ao Composable Stateless.
 */
@Composable
fun RoadmapRoute(
    viewModel: RoadmapViewModel,
    onNavigateToDetail: (String) -> Unit
) {
    val uiState = viewModel.uiState.value

    LaunchedEffect(viewModel.uiEffect) {
        viewModel.uiEffect.collect { effect ->
            when (effect) {
                is RoadmapUiEffect.ShowCelebrationConfetti -> {
                    // Disparar animação de confete nativa
                }
                is RoadmapUiEffect.NavigateToTaskDetail -> {
                    onNavigateToDetail(effect.taskId)
                }
                is RoadmapUiEffect.ShowToast -> {}
            }
        }
    }

    RoadmapStatelessScreen(
        uiState = uiState,
        onEvent = viewModel::onEvent
    )
}

/**
 * Screen 100% Stateless com State Hoisting.
 * Fácil de testar, sem dependência do ViewModel, perfeita para Compose @Preview!
 */
@Composable
fun RoadmapStatelessScreen(
    uiState: RoadmapUiState,
    onEvent: (RoadmapUiEvent) -> Unit,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier
            .fillMaxSize()
            .background(PrumoNeutral50)
            .padding(horizontal = 20.dp, vertical = 16.dp)
    ) {
        // Cabeçalho de Progresso
        Card(
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = PrumoSurfaceWhite),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Text(
                        text = "Progresso do Roteiro",
                        style = PrumoTypography.titleMedium
                    )
                    Text(
                        text = "\${uiState.progressPercent}%",
                        style = PrumoTypography.titleMedium,
                        color = PrumoPrimary600
                    )
                }
                Spacer(modifier = Modifier.height(8.dp))
                PrumoLinearProgressBar(progress = uiState.progressPercent / 100f)
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = "\${uiState.completedCount} de \${uiState.totalCount} tarefas concluídas",
                    style = PrumoTypography.labelSmall
                )
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Filtros por Fase
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            FilterChip(
                selected = uiState.selectedPhase == null,
                onClick = { onEvent(RoadmapUiEvent.OnFilterPhase(null)) },
                label = { Text("Todas") }
            )
            TaskPhase.entries.forEach { phase ->
                FilterChip(
                    selected = uiState.selectedPhase == phase,
                    onClick = { onEvent(RoadmapUiEvent.OnFilterPhase(phase)) },
                    label = { Text(phase.displayName) }
                )
            }
        }

        Spacer(modifier = Modifier.height(12.dp))

        // Lista de Tarefas
        LazyColumn(
            verticalArrangement = Arrangement.spacedBy(10.dp),
            modifier = Modifier.fillMaxSize()
        ) {
            items(uiState.filteredTasks, key = { it.id }) { task ->
                TaskItemCard(
                    task = task,
                    onToggle = { onEvent(RoadmapUiEvent.OnToggleTask(task.id)) },
                    onClick = { onEvent(RoadmapUiEvent.OnSelectTask(task.id)) }
                )
            }
        }
    }
}

@Composable
fun TaskItemCard(
    task: Task,
    onToggle: () -> Unit,
    onClick: () -> Unit
) {
    val isCompleted = task.status == TaskStatus.COMPLETED

    Card(
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(
            containerColor = if (isCompleted) PrumoPrimary100.copy(alpha = 0.4f) else PrumoSurfaceWhite
        ),
        onClick = onClick,
        modifier = Modifier.fillMaxWidth()
    ) {
        Row(
            modifier = Modifier.padding(14.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            IconButton(onClick = onToggle) {
                Icon(
                    imageVector = if (isCompleted) Icons.Default.CheckCircle else Icons.Outlined.Circle,
                    contentDescription = "Concluir",
                    tint = if (isCompleted) PrumoSuccess else PrumoNeutral600
                )
            }
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = task.title,
                    style = PrumoTypography.titleMedium.copy(fontWeight = FontWeight.SemiBold),
                    color = if (isCompleted) PrumoNeutral600 else PrumoNeutral900
                )
                Text(
                    text = "\${task.durationMinutes} min • \${task.phase.displayName}",
                    style = PrumoTypography.labelSmall
                )
            }
            PrumoPhaseBadge(phaseName = task.phase.displayName)
        }
    }
}
`
  },
  {
    path: 'app/src/main/java/com/prumo/app/core/network/NetworkResult.kt',
    name: 'NetworkResult.kt',
    language: 'kotlin',
    category: 'network',
    description: 'Wrapper sealed class genérico para tratamento robusto de sucesso, erro de API e exceções de conexão.',
    code: `package com.prumo.app.core.network

/**
 * Representa o resultado de uma operação de rede assíncrona.
 * Elimina o lançamento de exceções soltas na camada de UI.
 */
sealed interface NetworkResult<out T> {
    data class Success<T>(val data: T) : NetworkResult<T>
    data class Error(val code: Int, val message: String) : NetworkResult<Nothing>
    data class Exception(val throwable: Throwable) : NetworkResult<Nothing>
}

inline fun <T> NetworkResult<T>.onSuccess(action: (value: T) -> Unit): NetworkResult<T> {
    if (this is NetworkResult.Success) action(data)
    return this
}

inline fun <T> NetworkResult<T>.onError(action: (code: Int, message: String) -> Unit): NetworkResult<T> {
    if (this is NetworkResult.Error) action(code, message)
    return this
}

inline fun <T> NetworkResult<T>.onException(action: (throwable: Throwable) -> Unit): NetworkResult<T> {
    if (this is NetworkResult.Exception) action(throwable)
    return this
}
`
  },
  {
    path: 'app/src/main/java/com/prumo/app/core/network/PrumoNetworkModule.kt',
    name: 'PrumoNetworkModule.kt',
    language: 'kotlin',
    category: 'network',
    description: 'Instanciação e configuração do OkHttpClient (timeouts, logging) e Retrofit 2 com Kotlin Serialization Converter.',
    code: `package com.prumo.app.core.network

import kotlinx.serialization.json.Json
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.kotlinx.serialization.asConverterFactory
import java.util.concurrent.TimeUnit

object PrumoNetworkModule {

    private const val BASE_URL = "https://api.prumo.app/v1/"

    // Configuração oficial do Kotlinx Serialization
    private val json = Json {
        ignoreUnknownKeys = true // Evita quebra de contrato se a API adicionar campos novos
        isLenient = true
        coerceInputValues = true
        encodeDefaults = true
    }

    private val okHttpClient: OkHttpClient by lazy {
        val logging = HttpLoggingInterceptor().apply {
            level = HttpLoggingInterceptor.Level.BODY
        }

        OkHttpClient.Builder()
            .addInterceptor(logging)
            .addInterceptor { chain ->
                val request = chain.request().newBuilder()
                    .addHeader("Accept", "application/json")
                    .addHeader("User-Agent", "Prumo-Android-App/1.0")
                    .build()
                chain.proceed(request)
            }
            .connectTimeout(15, TimeUnit.SECONDS)
            .readTimeout(20, TimeUnit.SECONDS)
            .writeTimeout(20, TimeUnit.SECONDS)
            .retryOnConnectionFailure(true)
            .build()
    }

    val retrofit: Retrofit by lazy {
        val contentType = "application/json".toMediaType()

        Retrofit.Builder()
            .baseUrl(BASE_URL)
            .client(okHttpClient)
            .addConverterFactory(json.asConverterFactory(contentType))
            .build()
    }

    val apiService: PrumoApiService by lazy {
        retrofit.create(PrumoApiService::class.java)
    }
}
`
  },
  {
    path: 'app/src/main/java/com/prumo/app/core/network/PrumoApiService.kt',
    name: 'PrumoApiService.kt',
    language: 'kotlin',
    category: 'network',
    description: 'Interface de serviço REST com suspend functions para chamadas assíncronas não bloqueantes.',
    code: `package com.prumo.app.core.network

import com.prumo.app.core.network.model.*
import retrofit2.Response
import retrofit2.http.*

/**
 * Endpoints REST da API do Prumo consumidos pelo Retrofit.
 * Todas as funções são 'suspend', executadas dentro de Coroutines.
 */
interface PrumoApiService {

    // Buscar tarefas do roteiro por perfil
    @GET("roadmap/tasks")
    suspend fun getRoadmapTasks(
        @Query("phase") phase: String? = null
    ): Response<List<TaskDto>>

    // Calcular diagnóstico baseado nas respostas da Anamnese
    @POST("diagnosis/calculate")
    suspend fun calculateDiagnosis(
        @Body request: DiagnosisRequestDto
    ): Response<DiagnosisResponseDto>

    // Enviar mensagem para o Coach de IA (com contexto da tarefa)
    @POST("coach/message")
    suspend fun sendCoachMessage(
        @Body request: CoachRequestDto
    ): Response<CoachResponseDto>
}
`
  },
  {
    path: 'app/src/main/java/com/prumo/app/core/network/model/TaskDto.kt',
    name: 'TaskDto.kt',
    language: 'kotlin',
    category: 'network',
    description: 'Data Transfer Object (DTO) anotado com @Serializable e mapper toDomain() para o modelo de domínio puro.',
    code: `package com.prumo.app.core.network.model

import com.prumo.app.domain.model.Task
import com.prumo.app.domain.model.TaskPhase
import com.prumo.app.domain.model.TaskStatus
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class TaskDto(
    @SerialName("id") val id: String,
    @SerialName("phase") val phaseName: String,
    @SerialName("title") val title: String,
    @SerialName("description") val description: String,
    @SerialName("duration_min") val durationMinutes: Int,
    @SerialName("status") val statusStr: String = "pending",
    @SerialName("what_to_do") val whatToDo: String,
    @SerialName("how_to_know") val howToKnowItIsGood: List<String> = emptyList(),
    @SerialName("resources") val resources: List<String> = emptyList(),
    @SerialName("notes") val notes: String = "",
    @SerialName("is_locked") val isLocked: Boolean = false
)

/**
 * Mapper: converte o DTO de rede para o modelo limpo de Domínio.
 * Protege a UI de qualquer mudança de contrato no backend.
 */
fun TaskDto.toDomain(): Task {
    val phase = when (phaseName.lowercase()) {
        "marketing" -> TaskPhase.MARKETING
        "lancamento", "lançamento" -> TaskPhase.LANCAMENTO
        else -> TaskPhase.FUNDACAO
    }

    val status = when (statusStr.lowercase()) {
        "concluida", "completed" -> TaskStatus.COMPLETED
        "em_andamento", "in_progress" -> TaskStatus.IN_PROGRESS
        else -> TaskStatus.PENDING
    }

    return Task(
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
    )
}
`
  },
  {
    path: 'app/src/main/java/com/prumo/app/core/network/model/CoachMessageDto.kt',
    name: 'CoachMessageDto.kt',
    language: 'kotlin',
    category: 'network',
    description: 'DTOs de requisição e resposta para interação assíncrona com o Coach de IA.',
    code: `package com.prumo.app.core.network.model

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class CoachRequestDto(
    @SerialName("user_id") val userId: String,
    @SerialName("current_task_id") val currentTaskId: String,
    @SerialName("niche") val niche: String,
    @SerialName("message") val userMessage: String
)

@Serializable
data class CoachResponseDto(
    @SerialName("reply") val replyText: String,
    @SerialName("suggested_actions") val suggestedActions: List<String> = emptyList(),
    @SerialName("remaining_free_messages") val remainingMessages: Int = 3
)

@Serializable
data class DiagnosisRequestDto(
    @SerialName("answers") val answers: Map<String, List<String>>,
    @SerialName("macro_goal") val macroGoal: String
)

@Serializable
data class DiagnosisResponseDto(
    @SerialName("niche") val niche: String,
    @SerialName("product") val product: String,
    @SerialName("audience") val audience: String,
    @SerialName("channel") val channel: String,
    @SerialName("timeline") val timeline: String,
    @SerialName("justification") val justification: String
)
`
  },
  {
    path: 'app/src/main/java/com/prumo/app/data/repository/RemoteTaskRepositoryImpl.kt',
    name: 'RemoteTaskRepositoryImpl.kt',
    language: 'kotlin',
    category: 'network',
    description: 'Repositório consumindo Retrofit com Dispatchers.IO, tratamento com NetworkResult e mappers.',
    code: `package com.prumo.app.data.repository

import com.prumo.app.core.network.NetworkResult
import com.prumo.app.core.network.PrumoApiService
import com.prumo.app.core.network.model.toDomain
import com.prumo.app.domain.model.Task
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class RemoteTaskRepositoryImpl(
    private val apiService: PrumoApiService
) {
    suspend fun fetchTasks(): NetworkResult<List<Task>> {
        // Garante execução na thread pool de I/O
        return withContext(Dispatchers.IO) {
            try {
                val response = apiService.getRoadmapTasks()
                if (response.isSuccessful) {
                    val body = response.body() ?: emptyList()
                    val domainTasks = body.map { it.toDomain() }
                    NetworkResult.Success(domainTasks)
                } else {
                    NetworkResult.Error(
                        code = response.code(),
                        message = response.errorBody()?.string() ?: "Erro desconhecido na API"
                    )
                }
            } catch (e: Exception) {
                NetworkResult.Exception(e)
            }
        }
    }
}
`
  },
  {
    path: 'app/src/main/java/com/prumo/app/data/local/entity/TaskEntity.kt',
    name: 'TaskEntity.kt',
    language: 'kotlin',
    category: 'database',
    description: 'Entidade Room para persistência SQLite com @PrimaryKey, @ColumnInfo e mappers de domínio bidirecionais.',
    code: `package com.prumo.app.data.local.entity

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
)

fun Task.toEntity(): TaskEntity = TaskEntity(
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
)
`
  },
  {
    path: 'app/src/main/java/com/prumo/app/data/local/dao/TaskDao.kt',
    name: 'TaskDao.kt',
    language: 'kotlin',
    category: 'database',
    description: 'Data Access Object com consultas SQL reativas que emitem Flow contínuo e operações suspend.',
    code: `package com.prumo.app.data.local.dao

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
}
`
  },
  {
    path: 'app/src/main/java/com/prumo/app/data/local/converter/Converters.kt',
    name: 'Converters.kt',
    language: 'kotlin',
    category: 'database',
    description: 'Room TypeConverters para tipos complexos: Enums tipados e serialização JSON de List<String>.',
    code: `package com.prumo.app.data.local.converter

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
}
`
  },
  {
    path: 'app/src/main/java/com/prumo/app/data/local/PrumoDatabase.kt',
    name: 'PrumoDatabase.kt',
    language: 'kotlin',
    category: 'database',
    description: 'Classe abstrata central do Room com Singleton thread-safe (@Volatile + synchronized).',
    code: `package com.prumo.app.data.local

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
}
`
  },
  {
    path: 'app/src/main/java/com/prumo/app/data/repository/OfflineFirstTaskRepositoryImpl.kt',
    name: 'OfflineFirstTaskRepositoryImpl.kt',
    language: 'kotlin',
    category: 'database',
    description: 'Repositório Oficial Offline-First unindo Room DAO (Single Source of Truth) e Retrofit com Dispatchers.IO.',
    code: `package com.prumo.app.data.repository

import com.prumo.app.core.network.PrumoApiService
import com.prumo.app.data.local.dao.TaskDao
import com.prumo.app.data.local.entity.TaskEntity
import com.prumo.app.data.local.entity.toDomain
import com.prumo.app.domain.model.Task
import com.prumo.app.domain.model.TaskPhase
import com.prumo.app.domain.model.TaskStatus
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

    // 2. Ações do usuário persistem localmente na hora (sem lag de rede)
    override suspend fun toggleTaskStatus(taskId: String) {
        withContext(Dispatchers.IO) {
            val task = taskDao.getTaskById(taskId) ?: return@withContext
            val nextStatus = if (task.status == TaskStatus.COMPLETED) TaskStatus.PENDING else TaskStatus.COMPLETED
            taskDao.updateTaskStatus(taskId, nextStatus)
        }
    }

    // 3. Sincronização em background: busca dados remotos e insere no Room
    suspend fun syncWithRemote() = withContext(Dispatchers.IO) {
        try {
            val response = apiService.getRoadmapTasks()
            if (response.isSuccessful && response.body() != null) {
                val dtos = response.body()!!
                val entities = dtos.map { dto ->
                    TaskEntity(
                        id = dto.id,
                        phase = when (dto.phaseName.lowercase()) {
                            "marketing" -> TaskPhase.MARKETING
                            "lancamento", "lançamento" -> TaskPhase.LANCAMENTO
                            else -> TaskPhase.FUNDACAO
                        },
                        title = dto.title,
                        description = dto.description,
                        durationMinutes = dto.durationMinutes,
                        status = when (dto.statusStr.lowercase()) {
                            "completed", "concluida" -> TaskStatus.COMPLETED
                            "in_progress" -> TaskStatus.IN_PROGRESS
                            else -> TaskStatus.PENDING
                        },
                        whatToDo = dto.whatToDo,
                        howToKnowItIsGood = dto.howToKnowItIsGood,
                        resources = dto.resources,
                        notes = dto.notes,
                        isLocked = dto.isLocked
                    )
                }
                taskDao.insertTasks(entities)
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }
}
`
  },
  // ==========================================
  // ETAPA 7: TESTES UNITÁRIOS & UI COM TDD
  // ==========================================
  {
    path: 'app/src/test/java/com/prumo/app/domain/usecase/CalculateDiagnosisUseCaseTest.kt',
    name: 'CalculateDiagnosisUseCaseTest.kt',
    language: 'kotlin',
    category: 'test',
    description: 'Teste unitário com ciclo TDD (Red -> Green -> Refactor) para a regra de negócio do Diagnóstico de Anamnese.',
    code: `package com.prumo.app.domain.usecase

import com.prumo.app.domain.model.AnamnesisAnswers
import com.prumo.app.domain.model.ProfileType
import com.prumo.app.domain.model.TaskPhase
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Before
import org.junit.Test

/**
 * Exemplo de Test-Driven Development (TDD) no Prumo:
 * 1. RED: Escrevemos este teste que descreve o comportamento desejado.
 * 2. GREEN: Implementamos o CalculateDiagnosisUseCase para fazer o teste passar.
 * 3. REFACTOR: Limpamos a estrutura com total segurança de não quebrar regras.
 */
class CalculateDiagnosisUseCaseTest {

    private lateinit var useCase: CalculateDiagnosisUseCase

    @Before
    fun setUp() {
        useCase = CalculateDiagnosisUseCase()
    }

    @Test
    fun \`deve diagnosticar perfil CLAREZA_VALIDACAO quando usuario tem duvidas no nicho\`() {
        // Arrange (Dado que)
        val answers = AnamnesisAnswers(
            clarityScore = 2,
            validationConfidence = 1,
            availableHoursPerWeek = 10,
            hasPreviousAudience = false
        )

        // Act (Quando)
        val diagnosis = useCase(answers)

        // Assert (Entao)
        assertEquals(ProfileType.CLAREZA_VALIDACAO, diagnosis.profileType)
    }

    @Test
    fun \`deve priorizar fase FUNDACAO nas primeiras 3 tarefas recomendadas\`() {
        // Arrange
        val answers = AnamnesisAnswers(
            clarityScore = 1,
            validationConfidence = 2,
            availableHoursPerWeek = 5,
            hasPreviousAudience = false
        )

        // Act
        val diagnosis = useCase(answers)

        // Assert
        val top3Phases = diagnosis.recommendedTasks.take(3).map { it.phase }
        assertTrue(top3Phases.all { it == TaskPhase.FUNDACAO })
    }
}
`
  },
  {
    path: 'app/src/test/java/com/prumo/app/presentation/roadmap/RoadmapViewModelTest.kt',
    name: 'RoadmapViewModelTest.kt',
    language: 'kotlin',
    category: 'test',
    description: 'Teste de ViewModel com StandardTestDispatcher e Turbine para asserção precisa de StateFlow e UDF.',
    code: `package com.prumo.app.presentation.roadmap

import app.cash.turbine.test
import com.prumo.app.domain.model.Task
import com.prumo.app.domain.model.TaskPhase
import com.prumo.app.domain.model.TaskStatus
import com.prumo.app.domain.usecase.GetRoadmapTasksUseCase
import com.prumo.app.domain.usecase.ToggleTaskStatusUseCase
import com.prumo.app.data.repository.FakeTaskRepository
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.test.StandardTestDispatcher
import kotlinx.coroutines.test.resetMain
import kotlinx.coroutines.test.runTest
import kotlinx.coroutines.test.setMain
import org.junit.After
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Before
import org.junit.Test

@OptIn(ExperimentalCoroutinesApi::class)
class RoadmapViewModelTest {

    private val testDispatcher = StandardTestDispatcher()
    private lateinit var fakeRepository: FakeTaskRepository
    private lateinit var viewModel: RoadmapViewModel

    @Before
    fun setUp() {
        Dispatchers.setMain(testDispatcher)
        fakeRepository = FakeTaskRepository()
        viewModel = RoadmapViewModel(
            getRoadmapTasksUseCase = GetRoadmapTasksUseCase(fakeRepository),
            toggleTaskStatusUseCase = ToggleTaskStatusUseCase(fakeRepository)
        )
    }

    @After
    fun tearDown() {
        Dispatchers.resetMain()
    }

    @Test
    fun \`deve emitir Loading inicialmente e depois Success ao carregar tarefas\`() = runTest {
        viewModel.uiState.test {
            // Estado inicial pode ser loading
            val initial = awaitItem()
            assertTrue(initial.isLoading)

            testDispatcher.scheduler.advanceUntilIdle()

            // Emite tarefas do repositório
            val successState = awaitItem()
            assertFalse(successState.isLoading)
            assertEquals(3, successState.tasks.size)
        }
    }

    @Test
    fun \`ao alternar status da tarefa deve atualizar repositorio fake\`() = runTest {
        testDispatcher.scheduler.advanceUntilIdle()

        viewModel.handleIntent(RoadmapIntent.ToggleTask("task_1"))
        testDispatcher.scheduler.advanceUntilIdle()

        val updatedTask = fakeRepository.tasksFlow.value.find { it.id == "task_1" }
        assertEquals(TaskStatus.COMPLETED, updatedTask?.status)
    }
}
`
  },
  {
    path: 'app/src/androidTest/java/com/prumo/app/data/local/TaskDaoTest.kt',
    name: 'TaskDaoTest.kt',
    language: 'kotlin',
    category: 'test',
    description: 'Teste de integração do Room SQLite em memória (inMemoryDatabaseBuilder) validando queries e Flows.',
    code: `package com.prumo.app.data.local

import android.content.Context
import androidx.room.Room
import androidx.test.core.app.ApplicationProvider
import androidx.test.ext.junit.runners.AndroidJUnit4
import com.prumo.app.data.local.dao.TaskDao
import com.prumo.app.data.local.entity.TaskEntity
import com.prumo.app.domain.model.TaskPhase
import com.prumo.app.domain.model.TaskStatus
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.runBlocking
import org.junit.After
import org.junit.Assert.assertEquals
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith

@RunWith(AndroidJUnit4::class)
class TaskDaoTest {

    private lateinit var database: PrumoDatabase
    private lateinit var taskDao: TaskDao

    @Before
    fun createDb() {
        val context = ApplicationProvider.getApplicationContext<Context>()
        database = Room.inMemoryDatabaseBuilder(
            context,
            PrumoDatabase::class.java
        ).allowMainThreadQueries().build()
        taskDao = database.taskDao()
    }

    @After
    fun closeDb() {
        database.close()
    }

    @Test
    fun insertAndObserveTasks() = runBlocking {
        val task = TaskEntity(
            id = "task_room_1",
            phase = TaskPhase.FUNDACAO,
            title = "Definir Promessa de Valor",
            description = "Uma frase de impacto",
            durationMinutes = 20,
            status = TaskStatus.PENDING,
            whatToDo = "Escreva sua promessa",
            howToKnowItIsGood = "Clara e concisa",
            resources = emptyList(),
            notes = "",
            isLocked = false
        )

        taskDao.insertTasks(listOf(task))

        val observed = taskDao.observeAllTasks().first()
        assertEquals(1, observed.size)
        assertEquals("Definir Promessa de Valor", observed[0].title)
    }

    @Test
    fun updateTaskStatusChangesStatusInDatabase() = runBlocking {
        val task = TaskEntity(
            id = "task_room_2",
            phase = TaskPhase.FUNDACAO,
            title = "Testar Atualização",
            description = "",
            durationMinutes = 15,
            status = TaskStatus.PENDING,
            whatToDo = "",
            howToKnowItIsGood = "",
            resources = emptyList(),
            notes = "",
            isLocked = false
        )
        taskDao.insertTasks(listOf(task))

        taskDao.updateTaskStatus("task_room_2", TaskStatus.COMPLETED)

        val updated = taskDao.getTaskById("task_room_2")
        assertEquals(TaskStatus.COMPLETED, updated?.status)
    }
}
`
  },
  {
    path: 'app/src/androidTest/java/com/prumo/app/presentation/roadmap/RoadmapScreenComposeTest.kt',
    name: 'RoadmapScreenComposeTest.kt',
    language: 'kotlin',
    category: 'test',
    description: 'Teste de UI no Jetpack Compose com createComposeRule e semântica acessível (Espresso/Compose Rule).',
    code: `package com.prumo.app.presentation.roadmap

import androidx.compose.ui.test.assertIsDisplayed
import androidx.compose.ui.test.junit4.createComposeRule
import androidx.compose.ui.test.onNodeWithTag
import androidx.compose.ui.test.onNodeWithText
import androidx.compose.ui.test.performClick
import com.prumo.app.domain.model.Task
import com.prumo.app.domain.model.TaskPhase
import com.prumo.app.domain.model.TaskStatus
import com.prumo.app.presentation.theme.PrumoTheme
import org.junit.Assert.assertTrue
import org.junit.Rule
import org.junit.Test

class RoadmapScreenComposeTest {

    @get:Rule
    val composeTestRule = createComposeRule()

    @Test
    fun roadmapScreen_displaysTaskTitleAndCompletesOnClick() {
        var clicked = false
        val testTask = Task(
            id = "t_compose_1",
            phase = TaskPhase.FUNDACAO,
            title = "Validar Nicho de Atuação",
            description = "Fale com 5 pessoas do seu público-alvo",
            durationMinutes = 30,
            status = TaskStatus.PENDING,
            whatToDo = "Entrevistar 5 potenciais clientes",
            howToKnowItIsGood = "Descobrir as dores reais",
            resources = emptyList(),
            notes = "",
            isLocked = false
        )

        composeTestRule.setContent {
            PrumoTheme {
                RoadmapScreenContent(
                    uiState = RoadmapUiState(
                        isLoading = false,
                        tasks = listOf(testTask)
                    ),
                    onToggleTask = { clicked = true },
                    onSelectTask = {}
                )
            }
        }

        // Verifica se o título da tarefa é exibido na tela
        composeTestRule
            .onNodeWithText("Validar Nicho de Atuação")
            .assertIsDisplayed()

        // Clica no botão de alternar status
        composeTestRule
            .onNodeWithTag("toggle_btn_t_compose_1")
            .performClick()

        // Assegura que o callback foi disparado
        assertTrue("O clique deve disparar o callback onToggleTask", clicked)
    }
}
`
  },
  {
    path: 'app/src/test/java/com/prumo/app/data/repository/FakeTaskRepository.kt',
    name: 'FakeTaskRepository.kt',
    language: 'kotlin',
    category: 'test',
    description: 'Test Double oficial (Fake Repository) em memória para desacoplar testes de rede e banco de dados real.',
    code: `package com.prumo.app.data.repository

import com.prumo.app.domain.model.Task
import com.prumo.app.domain.model.TaskPhase
import com.prumo.app.domain.model.TaskStatus
import com.prumo.app.domain.repository.TaskRepository
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow

/**
 * Fake oficial para testes rápidos e previsíveis sem mocks complexos.
 * Permite simular estados de carregamento, falhas e mutações em memória.
 */
class FakeTaskRepository : TaskRepository {

    private val _tasksFlow = MutableStateFlow<List<Task>>(
        listOf(
            Task(
                id = "task_1",
                phase = TaskPhase.FUNDACAO,
                title = "Definir Proposta Única de Valor",
                description = "Escreva sua promessa clara em 1 linha",
                durationMinutes = 20,
                status = TaskStatus.PENDING,
                whatToDo = "Conecte dor, cliente e resultado",
                howToKnowItIsGood = "Qualquer pessoa entende em 5 segundos",
                resources = listOf("Guia de Posicionamento"),
                notes = "",
                isLocked = false
            ),
            Task(
                id = "task_2",
                phase = TaskPhase.FUNDACAO,
                title = "Mapear Primeiros 10 Contatos",
                description = "Crie uma lista no Notion ou papel",
                durationMinutes = 25,
                status = TaskStatus.PENDING,
                whatToDo = "Liste pessoas que têm a dor que você resolve",
                howToKnowItIsGood = "10 nomes com telefone ou rede social",
                resources = emptyList(),
                notes = "",
                isLocked = false
            ),
            Task(
                id = "task_3",
                phase = TaskPhase.MARKETING,
                title = "Publicar Primeiro Post de Valor",
                description = "Compartilhe um aprendizado prático",
                durationMinutes = 30,
                status = TaskStatus.PENDING,
                whatToDo = "Ensine como evitar um erro comum",
                howToKnowItIsGood = "Gera respostas ou mensagens diretas",
                resources = emptyList(),
                notes = "",
                isLocked = false
            )
        )
    )

    val tasksFlow = _tasksFlow.asStateFlow()

    override fun getAllTasks(): Flow<List<Task>> = _tasksFlow

    override suspend fun toggleTaskStatus(taskId: String) {
        val current = _tasksFlow.value
        val updated = current.map { task ->
            if (task.id == taskId) {
                task.copy(
                    status = if (task.status == TaskStatus.COMPLETED) TaskStatus.PENDING else TaskStatus.COMPLETED
                )
            } else task
        }
        _tasksFlow.value = updated
    }
}
`
  },
  // ==========================================
  // ETAPA 8: CI/CD COM GITHUB ACTIONS & GOOGLE PLAY
  // ==========================================
  {
    path: '.github/workflows/android-ci.yml',
    name: 'android-ci.yml',
    language: 'markdown',
    category: 'ci',
    description: 'Pipeline de CI no GitHub Actions executando Lint, validação de formatação e testes unitários em Pull Requests.',
    code: `name: Prumo Android CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

concurrency:
  group: \${{ github.workflow }}-\${{ github.ref }}
  cancel-in-progress: true

jobs:
  validate-and-test:
    name: Lint & Unit Tests
    runs-on: ubuntu-latest
    timeout-minutes: 25

    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Java 21 (Eclipse Temurin)
        uses: actions/setup-java@v4
        with:
          distribution: 'temurin'
          java-version: '21'

      - name: Setup Gradle Cache
        uses: gradle/actions/setup-gradle@v3
        with:
          cache-read-only: \${{ github.ref != 'refs/heads/main' }}

      - name: Grant Execute Permission to Gradlew
        run: chmod +x gradlew

      - name: Run Android Lint & Code Quality Checks
        run: ./gradlew lintDebug

      - name: Run Unit Tests & Coroutines Tests
        run: ./gradlew testDebugUnitTest

      - name: Upload Test Reports (on failure)
        uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: test-reports
          path: app/build/reports/tests/
`
  },
  {
    path: '.github/workflows/android-release.yml',
    name: 'android-release.yml',
    language: 'markdown',
    category: 'ci',
    description: 'Pipeline de Release CD gerando Android App Bundle (.aab) assinado e publicando diretamente na Google Play Store.',
    code: `name: Prumo Android Release & Google Play

on:
  push:
    tags:
      - 'v*.*.*'
  workflow_dispatch:
    inputs:
      track:
        description: 'Faixa do Google Play (internal, alpha, beta, production)'
        required: true
        default: 'internal'
        type: choice
        options:
          - internal
          - alpha
          - beta
          - production

jobs:
  build-and-deploy:
    name: Build Signed AAB & Deploy to Play Store
    runs-on: ubuntu-latest
    timeout-minutes: 40

    steps:
      - name: Checkout Code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup Java 21 (Eclipse Temurin)
        uses: actions/setup-java@v4
        with:
          distribution: 'temurin'
          java-version: '21'

      - name: Setup Gradle
        uses: gradle/actions/setup-gradle@v3

      - name: Decodificar Keystore de Assinatura
        env:
          KEYSTORE_BASE64: \${{ secrets.ANDROID_KEYSTORE_BASE64 }}
        run: |
          mkdir -p app/keystores
          echo "$KEYSTORE_BASE64" | base64 --decode > app/keystores/release.jks

      - name: Build Android App Bundle (AAB) Assinado
        env:
          KEYSTORE_PASSWORD: \${{ secrets.KEYSTORE_PASSWORD }}
          KEY_ALIAS: \${{ secrets.KEY_ALIAS }}
          KEY_PASSWORD: \${{ secrets.KEY_PASSWORD }}
        run: |
          chmod +x gradlew
          ./gradlew bundleRelease \\
            -Pandroid.injected.signing.store.file=keystores/release.jks \\
            -Pandroid.injected.signing.store.password="$KEYSTORE_PASSWORD" \\
            -Pandroid.injected.signing.key.alias="$KEY_ALIAS" \\
            -Pandroid.injected.signing.key.password="$KEY_PASSWORD"

      - name: Upload AAB como Artefato do GitHub
        uses: actions/upload-artifact@v4
        with:
          name: prumo-release-\${{ github.ref_name }}
          path: app/build/outputs/bundle/release/app-release.aab
          retention-days: 30

      - name: Publicar no Google Play Store
        uses: r0adkll/upload-google-play@v1
        with:
          serviceAccountJsonPlainText: \${{ secrets.PLAY_STORE_JSON_KEY }}
          packageName: com.prumo.app
          releaseFiles: app/build/outputs/bundle/release/app-release.aab
          track: \${{ github.event.inputs.track || 'internal' }}
          status: completed
          mappingFile: app/build/outputs/mapping/release/mapping.txt
`
  },
  {
    path: 'app/src/main/java/com/prumo/app/presentation/onboarding/CommitmentContractScreen.kt',
    name: 'CommitmentContractScreen.kt',
    language: 'kotlin',
    category: 'component',
    description: 'Componente Compose de Compromisso Consciente: gesto de pressão contínua (3s), anel animado e feedback háptico.',
    code: `package com.prumo.app.presentation.onboarding

import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CompassCalibration
import androidx.compose.material.icons.filled.Security
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.hapticfeedback.HapticFeedbackType
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.platform.LocalHapticFeedback
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlinx.coroutines.launch

@Composable
fun CommitmentContractScreen(
    personalAnchor: String,
    onContractSigned: () -> Unit,
    onBack: () -> Unit,
    modifier: Modifier = Modifier
) {
    val haptic = LocalHapticFeedback.current
    val coroutineScope = rememberCoroutineScope()
    val holdProgress = remember { Animatable(0f) }
    var isHolding by remember { mutableStateOf(false) }

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(Color(0xFFFAF7F2))
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.SpaceBetween
    ) {
        // Cabeçalho Emocional
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Surface(
                shape = RoundedCornerShape(16.dp),
                color = Color(0xFFFEF3E2),
                modifier = Modifier.padding(bottom = 16.dp)
            ) {
                Row(
                    modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(
                        imageVector = Icons.Default.Security,
                        contentDescription = null,
                        tint = Color(0xFFD97746),
                        modifier = Modifier.size(16.dp)
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = "Pacto de Compromisso Consciente",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = Color(0xFF92400E)
                    )
                }
            }

            Text(
                text = "Assumir seu Prumo",
                fontSize = 26.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFF1A1D1B),
                textAlign = TextAlign.Center
            )

            Spacer(modifier = Modifier.height(8.dp))

            Text(
                text = "Mudar de direção não é riscar tarefas: é um compromisso consciente com quem você escolhe se tornar daqui a 90 dias.",
                fontSize = 13.sp,
                color = Color(0xFF5B615D),
                textAlign = TextAlign.Center,
                lineHeight = 18.sp,
                modifier = Modifier.padding(horizontal = 16.dp)
            )

            Spacer(modifier = Modifier.height(20.dp))

            // Card da Promessa Pessoal (Âncora)
            Card(
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text(
                        text = "SUA PROMESSA PARA SI MESMO",
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFFD97746),
                        letterSpacing = 1.sp
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "\\"\\$personalAnchor\\"",
                        fontSize = 14.sp,
                        fontStyle = FontStyle.Italic,
                        color = Color(0xFF1A1D1B),
                        lineHeight = 20.sp
                    )
                }
            }
        }

        // Botão de Pressão Contínua com Anel SVG / Radial Canvas
        Box(
            contentAlignment = Alignment.Center,
            modifier = Modifier.size(160.dp)
        ) {
            val progress = holdProgress.value

            Canvas(modifier = Modifier.size(160.dp)) {
                // Trilha de fundo
                drawArc(
                    color = Color(0xFFE6E8E6),
                    startAngle = -90f,
                    sweepAngle = 360f,
                    useCenter = false,
                    style = Stroke(width = 8.dp.toPx(), cap = StrokeCap.Round)
                )
                // Arco de preenchimento animado
                drawArc(
                    color = Color(0xFF1F6F5C),
                    startAngle = -90f,
                    sweepAngle = 360f * progress,
                    useCenter = false,
                    style = Stroke(width = 8.dp.toPx(), cap = StrokeCap.Round)
                )
            }

            // Botão Central com detector de toque sustentado
            Box(
                modifier = Modifier
                    .size(110.dp)
                    .clip(CircleShape)
                    .background(Color(0xFF1F6F5C))
                    .pointerInput(Unit) {
                        detectTapGestures(
                            onPress = {
                                isHolding = true
                                haptic.performHapticFeedback(HapticFeedbackType.LongPress)
                                val animationJob = coroutineScope.launch {
                                    holdProgress.animateTo(
                                        targetValue = 1f,
                                        animationSpec = tween(durationMillis = 2600)
                                    )
                                    if (holdProgress.value >= 1f) {
                                        haptic.performHapticFeedback(HapticFeedbackType.LongPress)
                                        onContractSigned()
                                    }
                                }
                                tryAwaitRelease()
                                isHolding = false
                                animationJob.cancel()
                                coroutineScope.launch {
                                    holdProgress.snapTo(0f)
                                }
                            }
                        )
                    },
                contentAlignment = Alignment.Center
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Icon(
                        imageVector = Icons.Default.CompassCalibration,
                        contentDescription = null,
                        tint = Color.White,
                        modifier = Modifier.size(28.dp)
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = if (isHolding) "\${(holdProgress.value * 100).toInt()}%" else "SEGURAR",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color.White
                    )
                }
            }
        }

        // Rodapé com instrução
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            modifier = Modifier.fillMaxWidth()
        ) {
            Text(
                text = if (isHolding) "Firmando seu prumo..." else "Pressione e segure por 3 segundos para selar",
                fontSize = 12.sp,
                fontWeight = FontWeight.Medium,
                color = if (isHolding) Color(0xFF1F6F5C) else Color(0xFF5B615D)
            )
            Spacer(modifier = Modifier.height(12.dp))
            TextButton(onClick = onBack) {
                Text("Voltar ao diagnóstico", color = Color(0xFF5B615D), fontSize = 12.sp)
            }
        }
    }
}
`
  },
  {
    path: 'app/src/main/java/com/prumo/app/presentation/onboarding/FutureLetterScreen.kt',
    name: 'FutureLetterScreen.kt',
    language: 'kotlin',
    category: 'component',
    description: 'Tela editorial da Carta do Eu Futuro: selo de compromisso em 90 dias, tipografia Fraunces e transição para a jornada.',
    code: `package com.prumo.app.presentation.onboarding

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowForward
import androidx.compose.material.icons.filled.Bookmark
import androidx.compose.material.icons.filled.Sparkles
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun FutureLetterScreen(
    userName: String,
    productName: String,
    nicheName: String,
    personalAnchor: String,
    onEnterJourney: () -> Unit,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier
            .fillMaxSize()
            .background(Color(0xFFFAF7F2))
            .padding(20.dp),
        verticalArrangement = Arrangement.SpaceBetween
    ) {
        Column(
            modifier = Modifier
                .weight(1f)
                .verticalScroll(rememberScrollState())
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Surface(
                    shape = RoundedCornerShape(12.dp),
                    color = Color(0xFFE3F2ED)
                ) {
                    Row(
                        modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(
                            imageVector = Icons.Default.Sparkles,
                            contentDescription = null,
                            tint = Color(0xFF1F6F5C),
                            modifier = Modifier.size(14.dp)
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(
                            text = "Compromisso Assinado",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = Color(0xFF1F6F5C)
                        )
                    }
                }

                Text(
                    text = "Daqui a 90 dias",
                    fontSize = 11.sp,
                    color = Color(0xFF5B615D)
                )
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Cartão de Pergaminho Editorial
            Card(
                shape = RoundedCornerShape(20.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                elevation = CardDefaults.cardElevation(defaultElevation = 3.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .border(1.dp, Color(0xFFF3E4CD), RoundedCornerShape(20.dp))
            ) {
                Column(modifier = Modifier.padding(20.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "De: Seu Eu Futuro",
                            fontSize = 13.sp,
                            fontStyle = FontStyle.Italic,
                            fontWeight = FontWeight.Bold,
                            color = Color(0xFF78350F)
                        )
                        Surface(
                            shape = RoundedCornerShape(8.dp),
                            color = Color(0xFFFEF3E2)
                        ) {
                            Text(
                                text = "Selo de Prumo",
                                fontSize = 10.sp,
                                color = Color(0xFF92400E),
                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 2.dp)
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(14.dp))

                    Text(
                        text = "Querida \\$userName,",
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF1A1D1B)
                    )

                    Spacer(modifier = Modifier.height(10.dp))

                    Text(
                        text = "Escrevo esta carta no momento exato em que nosso plano se cumpriu. Lembra de quando você segurou aquele botão e assumiu o seu prumo?",
                        fontSize = 13.sp,
                        color = Color(0xFF2D3748),
                        lineHeight = 20.sp
                    )

                    Spacer(modifier = Modifier.height(10.dp))

                    Surface(
                        shape = RoundedCornerShape(8.dp),
                        color = Color(0xFFFEF9EE),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Text(
                            text = "\\"\\$personalAnchor\\"",
                            fontSize = 13.sp,
                            fontStyle = FontStyle.Italic,
                            color = Color(0xFF1F6F5C),
                            modifier = Modifier.padding(12.dp),
                            lineHeight = 18.sp
                        )
                    }

                    Spacer(modifier = Modifier.height(10.dp))

                    Text(
                        text = "Você estava insegura sobre por onde começar, mas decidiu construir \\$productName para o nicho de \\$nicheName. Hoje o método já existe, a vergonha passou e o retorno chegou. Agora entre no Capítulo 1.",
                        fontSize = 13.sp,
                        color = Color(0xFF2D3748),
                        lineHeight = 20.sp
                    )

                    Spacer(modifier = Modifier.height(16.dp))
                    HorizontalDivider(color = Color(0xFFF0EBE1))
                    Spacer(modifier = Modifier.height(12.dp))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(
                                imageVector = Icons.Default.Bookmark,
                                contentDescription = null,
                                tint = Color(0xFF1F6F5C),
                                modifier = Modifier.size(16.dp)
                            )
                            Spacer(modifier = Modifier.width(4.dp))
                            Text("Pacto Selado", fontSize = 11.sp, color = Color(0xFF78350F))
                        }
                        Text("Com carinho, Você.", fontSize = 11.sp, fontStyle = FontStyle.Italic, color = Color(0xFF5B615D))
                    }
                }
            }
        }

        Button(
            onClick = onEnterJourney,
            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF1F6F5C)),
            shape = RoundedCornerShape(14.dp),
            modifier = Modifier
                .fillMaxWidth()
                .height(52.dp)
        ) {
            Text("Entrar na Jornada (Capítulo 1)", fontSize = 14.sp, fontWeight = FontWeight.SemiBold)
            Spacer(modifier = Modifier.width(8.dp))
            Icon(Icons.Default.ArrowForward, contentDescription = null, modifier = Modifier.size(18.dp))
        }
    }
}
`
  },
  {
    path: 'app/src/main/java/com/prumo/app/presentation/audio/AudioCoachPlayer.kt',
    name: 'AudioCoachPlayer.kt',
    language: 'kotlin',
    category: 'component',
    description: 'Componente de áudio de presença com Media3 ExoPlayer e visualizador de ondas sonoras no Canvas do Jetpack Compose.',
    code: `package com.prumo.app.presentation.audio

import androidx.compose.animation.core.*
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Pause
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlin.math.sin

@Composable
fun AudioCoachPlayer(
    title: String,
    narrator: String,
    duration: String,
    isPlaying: Boolean,
    onTogglePlay: () -> Unit,
    modifier: Modifier = Modifier
) {
    val infiniteTransition = rememberInfiniteTransition(label = "audioWave")
    val phase by infiniteTransition.animateFloat(
        initialValue = 0f,
        targetValue = 6.28f,
        animationSpec = infiniteRepeatable(
            animation = tween(1200, easing = LinearEasing),
            repeatMode = RepeatMode.Restart
        ),
        label = "phase"
    )

    Surface(
        shape = RoundedCornerShape(16.dp),
        color = Color.White,
        tonalElevation = 2.dp,
        modifier = modifier.fillMaxWidth()
    ) {
        Row(
            modifier = Modifier
                .padding(12.dp)
                .fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                IconButton(
                    onClick = onTogglePlay,
                    colors = IconButtonDefaults.iconButtonColors(
                        containerColor = Color(0xFF1F6F5C),
                        contentColor = Color.White
                    ),
                    modifier = Modifier.size(38.dp)
                ) {
                    Icon(
                        imageVector = if (isPlaying) Icons.Default.Pause else Icons.Default.PlayArrow,
                        contentDescription = if (isPlaying) "Pausar" else "Ouvir",
                        modifier = Modifier.size(20.dp)
                    )
                }

                Spacer(modifier = Modifier.width(10.dp))

                Column {
                    Text(
                        text = title,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF1A1D1B)
                    )
                    Text(
                        text = "\\$narrator · \\$duration",
                        fontSize = 10.sp,
                        color = Color(0xFF5B615D)
                    )
                }
            }

            // Visualizador de Ondas Sonoras Dinâmico
            Canvas(
                modifier = Modifier
                    .width(64.dp)
                    .height(24.dp)
            ) {
                val barCount = 10
                val barWidth = 3.dp.toPx()
                val spacing = (size.width - (barCount * barWidth)) / (barCount - 1)

                for (i in 0 until barCount) {
                    val dynamicFactor = if (isPlaying) {
                        (sin(phase + i * 0.7f) * 0.4f + 0.6f).coerceIn(0.2f, 1f)
                    } else {
                        0.25f
                    }
                    val barHeight = size.height * dynamicFactor
                    val x = i * (barWidth + spacing)
                    val y = (size.height - barHeight) / 2f

                    drawRoundRect(
                        color = if (isPlaying) Color(0xFF1F6F5C) else Color(0xFFD1D5DB),
                        topLeft = Offset(x, y),
                        size = Size(barWidth, barHeight),
                        cornerRadius = CornerRadius(2.dp.toPx(), 2.dp.toPx())
                    )
                }
            }
        }
    }
}
`
  },
  {
    path: 'README_ANDROID_STUDIO.md',
    name: 'README_ANDROID_STUDIO.md',
    language: 'markdown',
    category: 'doc',
    description: 'Documentação com as Etapas 1 a 10 completas (Ambiente, Arquitetura, Design System, ViewModel, Retrofit, Room, Testes, CI/CD, Onboarding Narrativo & Presença Sonora).',
    code: `# 🧭 Prumo - Guia de Execução no Android Studio (Etapas 1 a 10 - Projeto Completo)

O projeto está configurado com todas as 10 Etapas da arquitetura e experiência de usuário implementadas:
1. **Etapa 1:** Configuração do Ambiente, Gradle Version Catalog, Kotlin 2.0 e Plugins oficiais.
2. **Etapa 2:** Clean Architecture, Navegação Type-Safe com Kotlinx Serialization, BottomBar Material 3 e DataStore.
3. **Etapa 3:** Design System completo em Jetpack Compose (Cores, Tipografia Inter/Fraunces, Grid 8pt, Componentes Atômicos).
4. **Etapa 4:** Gerenciamento de Estado com ViewModel, StateFlow e LiveData (Unidirectional Data Flow e State Hoisting).
5. **Etapa 5:** Consumo de APIs com Retrofit 2 e Kotlin Serialization (OkHttpClient, DTOs, Mappers e NetworkResult).
6. **Etapa 6:** Persistência de Dados Offline com Room Database (SQLite, Entidades, DAOs com Flow reativo e arquitetura Offline-First).
7. **Etapa 7:** Testes Automatizados & TDD (JUnit 4/5, Kotlin Coroutines Test & Turbine, Room In-Memory e Compose Test Rule com Espresso).
8. **Etapa 8:** CI/CD com GitHub Actions, Build AAB com ProGuard/R8, Assinatura de Keystore e Deploy Automatizado no Google Play Store.
9. **Etapa 9:** Onboarding Narrativo & Ritual de Compromisso (Micro-telas de valor, campos de reflexão livre, gesto de pressão contínua Hold-to-Sign com Feedback Háptico e Carta do Eu Futuro em 90 dias).
10. **Etapa 10:** Presença Sonora & Storytelling (Media3 ExoPlayer com micro-áudios serenos de 60-90s, ondas sonoras no Canvas do Compose, agrupamento do roteiro em Capítulos Narrativos e totens visuais estilizados).

---

## 🚀 Como executar testes no Android Studio
- **Testes Unitários de Domínio & ViewModel (JVM rápida):**
  - Botão direito na pasta \`app/src/test\` > **Run 'All Tests'** (ou terminal: \`./gradlew testDebugUnitTest\`).
- **Testes de Integração Room & UI Compose (Emulador/Dispositivo):**
  - Botão direito na pasta \`app/src/androidTest\` > **Run 'All Tests'** (ou terminal: \`./gradlew connectedAndroidTest\`).

## 📦 Como gerar o Android App Bundle (AAB) para Google Play
- Terminal: \`./gradlew bundleRelease\`
- O arquivo otimizado será gerado em: \`app/build/outputs/bundle/release/app-release.aab\`.

## 🚀 Como executar o App no Android Studio
1. Extraia o arquivo zip do projeto.
2. No Android Studio, selecione **File > Open...** e aponte para a pasta descompactada.
3. Aguarde o **Gradle Sync**.
4. Pressione **Run (Play)** para rodar no emulador ou dispositivo físico!
`
  }
];



