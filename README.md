# Mobile Boilerplate

Boilerplate complet pour développer rapidement une app mobile avec Expo/React Native, serveur Node.js/Koa et base de données PostgreSQL.

## 🏗️ Architecture

- **Frontend**: Expo + React Native
- **Backend**: Node.js + Koa + Knex (ORM)
- **Base de données**: PostgreSQL
- **Conteneurisation**: Docker + Docker Compose

## 🚀 Démarrage rapide

### Prérequis

- Node.js (v18+)
- Docker et Docker Compose
- Expo CLI: `npm install -g @expo/cli`

### 1. Cloner et configurer

```bash
git clone <votre-repo>
cd mobile-boilerplate
```

### 2. Setup automatique (recommandé)

```bash
# Installation et configuration complète en une commande
npm install
npm run setup
```

Cette commande va:
- Démarrer PostgreSQL et le serveur backend avec Docker
- Installer toutes les dépendances
- Appliquer les migrations de base de données
- Charger les données de test

### 3. Démarrage quotidien

```bash
# Lance backend + frontend en parallèle
npm run dev
```

**OU séparément:**

```bash
# Backend seulement
npm run backend:dev

# Frontend seulement  
npm run mobile:dev
```

### 4. Options de lancement frontend

L'app Expo offre plusieurs façons de tester:

#### **Option 1: Expo Go (Recommandé)**
- Installez l'app "Expo Go" sur votre téléphone
- Scannez le QR code affiché dans le terminal/navigateur
- ✅ Le plus simple pour tester rapidement

#### **Option 2: Émulateurs**
```bash
cd mobile

# Android (nécessite Android Studio)
npm run android

# iOS (nécessite macOS + Xcode)
npm run ios
```

#### **Option 3: Navigateur web**
```bash
cd mobile
npm run web
```

### 5. Configuration réseau

**Pour développement local**: L'app utilise `http://localhost:3000` par défaut.

**Pour tester sur appareil physique**: Changez l'IP dans `mobile/services/api.js`:

```javascript
// Trouvez votre IP locale avec: ipconfig (Windows) ou ifconfig (Mac/Linux)
const API_BASE_URL = 'http://192.168.1.XXX:3000';
```

## 📱 App Mobile (Expo)

### Commandes utiles

```bash
cd mobile

# Démarrer le serveur de développement
npm start

# Lancer sur Android
npm run android

# Lancer sur iOS (macOS uniquement)
npm run ios

# Lancer sur le web
npm run web
```

### Configuration API

L'app se connecte au backend via `services/api.js`. Par défaut, elle utilise `http://localhost:3000`.

Pour tester sur un appareil physique, vous devrez changer l'URL vers l'IP de votre machine:

```javascript
// services/api.js
const API_BASE_URL = 'http://192.168.1.XXX:3000'; // Remplacer par votre IP
```

## 🔧 Backend (Node.js + Koa)

### Structure

```
backend/
├── src/
│   ├── index.js        # Point d'entrée du serveur
│   └── database.js     # Configuration Knex
├── migrations/         # Migrations de la base de données
├── seeds/             # Données de test
├── package.json
├── knexfile.js        # Configuration Knex
└── Dockerfile
```

### API Endpoints

- `GET /` - Info de l'API
- `GET /health` - Vérification de santé (API + DB)
- `GET /users` - Liste des utilisateurs
- `POST /users` - Créer un utilisateur

### Commandes Knex

```bash
# Depuis la racine du projet
npm run migrate    # Appliquer les migrations
npm run seed       # Exécuter les seeds

# Ou depuis le dossier backend
cd backend

# === Gestion des migrations ===
# Créer une nouvelle migration
npm run migrate:make nom_de_la_migration

# Appliquer les migrations (toutes les nouvelles)
npm run migrate

# Voir le statut des migrations
npm run migrate:status

# Appliquer une migration spécifique (prochaine)
npm run migrate:up

# === Rollback des migrations ===
# Annuler la dernière migration
npm run migrate:rollback

# Annuler une migration spécifique (précédente)
npm run migrate:down

# Annuler TOUTES les migrations (⚠️ ATTENTION)
npm run migrate:rollback:all

# === Seeds ===
# Exécuter les seeds
npm run seed
```

**Workflow de migration typique :**
1. `npm run migrate:status` → Voir l'état actuel
2. `npm run migrate:make nouvelle_table` → Créer migration
3. `npm run migrate` → Appliquer les changements
4. `npm run migrate:rollback` → Annuler en cas de problème

### Variables d'environnement

Copiez `.env.example` vers `.env` et ajustez selon vos besoins:

```env
PORT=3000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=mobile_app_dev
DB_USER=postgres
DB_PASSWORD=postgres
```

## 🐳 Docker

### Commandes Docker

```bash
# Démarrer tous les services
docker-compose up -d
# ou via script npm
npm run docker:up

# Voir les logs
docker-compose logs -f
# ou via script npm  
npm run docker:logs

# Arrêter les services
docker-compose down
# ou via script npm
npm run docker:down

# Reconstruire et redémarrer
docker-compose up --build
```

### Services

- **postgres**: Base PostgreSQL sur le port 5432
- **backend**: API Node.js sur le port 3000

## 📊 Base de données

PostgreSQL est configuré avec:
- Base: `mobile_app_dev`
- User: `postgres`
- Password: `postgres`
- Port: `5432`

### Connexion directe

```bash
# Via Docker
docker exec -it mobile-boilerplate-db psql -U postgres -d mobile_app_dev

# Via client local (si PostgreSQL installé)
psql -h localhost -U postgres -d mobile_app_dev
```

## 🛠️ Développement

### Workflow recommandé

1. **Backend**: Développer les nouvelles routes/fonctionnalités
2. **Migrations**: Créer les migrations pour les changements de DB
3. **Frontend**: Intégrer les nouvelles API dans l'app mobile
4. **Test**: Vérifier sur l'émulateur/appareil

### Hot reload

- **Backend**: Nodemon redémarre automatiquement le serveur
- **Frontend**: Expo recharge automatiquement l'app

## 🔍 Debug

### Vérifier que tout fonctionne

1. **Backend health check**: `curl http://localhost:3000/health`
2. **API users**: `curl http://localhost:3000/users`
3. **App mobile**: Ouvrir l'app et vérifier la connexion API

### Problèmes courants

- **App ne se connecte pas à l'API**: Vérifier l'URL dans `services/api.js`
- **Erreurs de base de données**: Vérifier que les migrations sont appliquées
- **Docker ne démarre pas**: Vérifier que les ports 3000 et 5432 sont libres

## ✨ Fonctionnalités incluses

### 🎯 Backend
- ✅ Serveur Koa.js avec routes REST
- ✅ Base de données PostgreSQL
- ✅ Migrations et seeds avec Knex
- ✅ Hot reload avec Nodemon
- ✅ Docker & Docker Compose
- ✅ Health check endpoint
- ✅ CORS configuré

### 📱 Frontend
- ✅ App Expo/React Native
- ✅ Service API intégré
- ✅ Interface de test fonctionnelle
- ✅ Hot reload Expo
- ✅ Support Android/iOS/Web

### 🛠️ DevOps
- ✅ Scripts npm pour tout automatiser
- ✅ Docker pour PostgreSQL et backend
- ✅ Variables d'environnement
- ✅ Documentation complète

## 🎨 Solutions de lancement proposées

Ce boilerplate offre **plusieurs solutions** pour répondre à vos besoins:

### **Solution 1: Développement full-stack** 🚀
```bash
npm run dev  # Lance tout en parallèle
```
- Backend + frontend ensemble
- Idéal pour développement rapide

### **Solution 2: Backend + Database uniquement** 🐳
```bash
npm run docker:up  # PostgreSQL + API seulement
```
- Pour intégrer avec une app existante
- Backend prêt à l'emploi

### **Solution 3: Setup complet automatisé** ⚡
```bash
npm run setup  # Installation + migrations + seeds
```
- Configuration complète en une commande
- Parfait pour nouveaux projets

### **Solution 4: Commandes séparées** 🎛️
```bash
npm run backend:dev  # Backend seulement
npm run mobile:dev   # Frontend seulement
```
- Contrôle granulaire
- Idéal pour débogage

## 📝 TODO

- [ ] Authentification JWT
- [ ] Tests automatisés (Jest/Detox)
- [ ] CI/CD (GitHub Actions)
- [ ] Variables d'environnement pour production
- [ ] Logs structurés (Winston)
- [ ] API documentation (Swagger)
- [ ] Push notifications
- [ ] Gestion d'erreurs globale