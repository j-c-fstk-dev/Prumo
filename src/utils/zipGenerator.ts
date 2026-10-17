import JSZip from 'jszip';
import { ANDROID_STUDIO_FILES } from '../data/androidFiles';

export async function generateAndroidProjectZip(): Promise<Blob> {
  const zip = new JSZip();

  // Root folder
  const projectRoot = zip.folder('Prumo-Android-App') || zip;

  // Adicionar arquivos essenciais
  for (const file of ANDROID_STUDIO_FILES) {
    projectRoot.file(file.path, file.code);
  }

  // Adicionar .gitignore padrão do Android
  const gitignoreContent = `*.iml
.gradle
/local.properties
/.idea/caches
/.idea/libraries
/.idea/modules.xml
/.idea/workspace.xml
.DS_Store
/build
/captures
.externalNativeBuild
.cxx
local.properties
app/build/
`;
  projectRoot.file('.gitignore', gitignoreContent);

  // Adicionar proguard-rules.pro padrão
  const proguardContent = `# Rules for Jetpack Compose and Kotlin Serialization
-keepattributes *Annotation*
-dontwarn org.jetbrains.annotations.**
`;
  projectRoot.file('app/proguard-rules.pro', proguardContent);

  return await zip.generateAsync({ type: 'blob' });
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
