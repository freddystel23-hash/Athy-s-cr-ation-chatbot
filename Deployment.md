# 🚀 Guide de Déploiement - Athy's Studio IA

## Étape 1 : Préparation GitHub

### 1.1 Créer un Nouveau Repository sur GitHub

1. Aller sur [github.com](https://github.com)
2. Cliquer sur **"New repository"**
3. Nommer le repo : `athys-studio-ia` (ou autre nom)
4. Choisir **Public** ou **Private**
5. **NE PAS** initialiser avec README, .gitignore ou license
6. Cliquer sur **"Create repository"**

### 1.2 Initialiser Git Localement

Ouvrir un terminal dans le dossier du projet et exécuter :

```bash
# Initialiser Git
git init

# Ajouter tous les fichiers
git add .

# Premier commit
git commit -m "🚀 Initial commit - Athy's Studio IA Premium Website"

# Renommer la branche en main (si nécessaire)
git branch -M main

# Ajouter l'origine GitHub (remplacer USERNAME et REPO)
git remote add origin https://github.com/USERNAME/REPO.git

# Pousser le code
git push -u origin main
