# 🌍 Comment accéder à votre site depuis n'importe où

Pour ouvrir votre base de données (Backend) au monde entier (sécurisé) :

## Étape 1 : Créer un compte Ngrok (Une seule fois)
1. Allez sur [https://dashboard.ngrok.com/signup](https://dashboard.ngrok.com/signup) et créez un compte gratuit.
2. Allez dans **"Your Authtoken"** dans le menu à gauche.
3. Copiez le code qui commence par `2...`.

## Étape 2 : Lancer le Mode Public
1. Double-cliquez sur le fichier **`GO_PUBLIC.bat`** sur votre bureau (dossier jebalisweet).
2. S'il vous demande le token, collez-le (clic droit pour coller dans le terminal).
3. Une fois lancé, vous verrez une ligne comme :
   ```
   Forwarding                    https://a1b2-c3d4.ngrok-free.app -> http://localhost:5000
   ```
   👉 **C'est votre URL Publique Backend !** Copiez-la.

## Étape 3 : Connecter le Frontend
Vous avez deux choix :

### Choix A : Site déjà sur Netlify
1. Allez sur votre dashboard Netlify.
2. Site Settings > Environment variables.
3. Modifiez `NEXT_PUBLIC_API_URL` avec votre nouvelle URL ngrok (ex: `https://a1b2-c3d4.ngrok-free.app`).
4. **Pas besoin de redéployer !** Rafraîchissez juste la page sur votre téléphone/autre PC.

### Choix B : Lancer le Frontend Localement aussi
Si vous voulez tout lancer depuis ce PC :
1. Modifiez le fichier `.env.local` :
   ```
   NEXT_PUBLIC_API_URL=https://a1b2-c3d4.ngrok-free.app
   ```
2. Lancez `npm run dev` dans un autre terminal.
3. Pour accéder au frontend depuis un autre PC, il faut AUSSI un tunnel ngrok pour le port 3000 (ce qui nécessite un 2ème terminal ngrok ou un compte payant pour 2 tunnels), C'EST POURQUOI **Je recommande d'utiliser Netlify pour le Frontend** et Ngrok juste pour le Backend.

## Résumé
1. Lancez `GO_PUBLIC.bat`.
2. Prenez l'URL `https://...`.
3. Mettez-la dans Netlify.
4. Ouvrez votre site Netlify sur votre téléphone ! 📱
