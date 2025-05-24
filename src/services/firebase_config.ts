// src/services/firebase_config.ts

import { initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
// import { getStorage, FirebaseStorage } from 'firebase/storage'; // Descomente se for usar o Firebase Storage
// import { getAnalytics, Analytics } from "firebase/analytics";   // Descomente se for usar o Firebase Analytics

// Validação básica das variáveis de ambiente (opcional, mas bom para debug)
const requiredEnvVars: (keyof ImportMetaEnv)[] = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
];

for (const varName of requiredEnvVars) {
  if (!import.meta.env[varName]) {
    console.error(`Variável de ambiente do Firebase ausente: ${varName}. Verifique seu arquivo .env.local`);
    // Você pode querer lançar um erro aqui para interromper a inicialização se uma variável crítica estiver faltando.
    // throw new Error(`Variável de ambiente do Firebase ausente: ${varName}`);
  }
}

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID, // Será undefined se não estiver no .env.local, o Firebase lida com isso
};

// Inicializar Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);

// Inicializar serviços do Firebase que você usará
const db: Firestore = getFirestore(app);
const auth: Auth = getAuth(app);
// const storage: FirebaseStorage = getStorage(app); // Descomente se for usar
// const analytics: Analytics = getAnalytics(app);   // Descomente se for usar

// Exportar as instâncias para serem usadas em outros lugares do seu app
export { db, auth, app }; // Adicione 'storage', 'analytics' aqui se os descomentar