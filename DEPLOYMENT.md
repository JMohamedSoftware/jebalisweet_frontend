# Guide de Déploiement - Jebali Sweet

## Architecture
- **Frontend**: Déployé sur Netlify
- **Backend**: Hébergé sur votre PC local

## Prérequis

### Pour le Frontend (Netlify)
1. Compte Netlify (gratuit)
2. Repository Git (GitHub, GitLab, ou Bitbucket)

### Pour le Backend (Votre PC)
1. Node.js installé
2. MongoDB en cours d'exécution
3. IP publique ou service de tunneling (ngrok)

---

## Étape 1: Préparer le Backend sur Votre PC

### 1.1 Configurer le Backend pour l'Accès Externe

Modifiez `backend/server.js` pour accepter les connexions externes:

```javascript
// Assurez-vous que CORS accepte votre domaine Netlify
const cors = require('cors');
app.use(cors({
  origin: ['https://votre-site.netlify.app', 'http://localhost:4028'],
  credentials: true
}));
```

### 1.2 Obtenir une URL Publique

**Option A: IP Publique Statique**
- Configurez le port forwarding sur votre routeur (port 3000)
- Utilisez votre IP publique: `http://VOTRE_IP:3000`

**Option B: ngrok (Recommandé pour les tests)**
```bash
# Installer ngrok
npm install -g ngrok

# Lancer ngrok
ngrok http 3000
```
Vous obtiendrez une URL comme: `https://abc123.ngrok.io`

### 1.3 Démarrer le Backend
```bash
cd backend
npm start
```

---

## Étape 2: Déployer le Frontend sur Netlify

### 2.1 Pousser le Code sur Git
```bash
git add .
git commit -m "Prepare for Netlify deployment"
git push origin main
```

### 2.2 Connecter Netlify à votre Repository

1. Allez sur [netlify.com](https://netlify.com)
2. Cliquez sur "Add new site" → "Import an existing project"
3. Connectez votre compte Git (GitHub/GitLab/Bitbucket)
4. Sélectionnez le repository `jebalisweet`

### 2.3 Configurer les Build Settings

Netlify devrait détecter automatiquement Next.js, mais vérifiez:
- **Build command**: `npm run build`
- **Publish directory**: `.next`
- **Node version**: 18 ou supérieur

### 2.4 Configurer les Variables d'Environnement

Dans Netlify Dashboard → Site settings → Environment variables:

```
NEXT_PUBLIC_API_URL = http://VOTRE_IP:3000
```
ou
```
NEXT_PUBLIC_API_URL = https://votre-url.ngrok.io
```

### 2.5 Déployer
Cliquez sur "Deploy site"

---

## Étape 3: Vérification

### 3.1 Tester le Backend
```bash
curl http://VOTRE_IP:3000/api/products
```

### 3.2 Tester le Frontend
Visitez votre site Netlify: `https://votre-site.netlify.app`

---

## Maintenance

### Redémarrer le Backend
```bash
cd c:\Users\User\Desktop\jebalisweet\backend
npm start
```

### Mettre à Jour le Frontend
```bash
git add .
git commit -m "Update frontend"
git push origin main
# Netlify redéploiera automatiquement
```

---

## Troubleshooting

### Le Frontend ne peut pas se connecter au Backend

1. **Vérifiez que le backend est en cours d'exécution**
   ```bash
   curl http://localhost:3000/api/products
   ```

2. **Vérifiez CORS**
   - Assurez-vous que votre domaine Netlify est dans la liste CORS du backend

3. **Vérifiez le Firewall**
   - Windows Firewall doit autoriser le port 3000
   - Votre routeur doit avoir le port forwarding configuré

4. **Vérifiez l'URL de l'API**
   - Dans Netlify → Environment variables
   - Doit pointer vers votre IP publique ou ngrok URL

### Erreurs de Build sur Netlify

1. **Vérifiez la version de Node.js**
   - Netlify → Site settings → Build & deploy → Environment
   - Ajoutez: `NODE_VERSION = 18`

2. **Vérifiez les dépendances**
   ```bash
   npm install
   npm run build
   ```

---

## Sécurité

### Pour la Production

1. **Utilisez HTTPS**
   - Configurez un certificat SSL sur votre PC
   - Ou utilisez un reverse proxy (Cloudflare Tunnel)

2. **Protégez votre API**
   - Implémentez rate limiting
   - Validez tous les tokens JWT
   - Utilisez des variables d'environnement pour les secrets

3. **Sauvegardez MongoDB**
   ```bash
   mongodump --db jebalisweet --out ./backup
   ```

---

## Alternative: Cloudflare Tunnel (Gratuit et Sécurisé)

Au lieu de ngrok ou IP publique, utilisez Cloudflare Tunnel:

1. Installez cloudflared
2. Configurez un tunnel vers localhost:3000
3. Obtenez une URL HTTPS gratuite et permanente

[Documentation Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/)
