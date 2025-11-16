/* ============================================
   PORTFOLIO PERSONNEL - SCRIPT JAVASCRIPT
   Alitoh Martin ALABIDJARE
   ============================================ */

// Variables globales
let menuMobileOuvert = false;
const menuMobile = document.getElementById('menuMobile');
const boutonMenuMobile = document.getElementById('boutonMenuMobile');
const formulaire = document.getElementById('formulaireContact');

// ============================================
// GESTION DU MENU MOBILE
// ============================================

/**
 * Bascule l'affichage du menu mobile
 */
function basculerMenuMobile() {
    menuMobileOuvert = !menuMobileOuvert;
    
    if (menuMobileOuvert) {
        menuMobile.classList.add('actif');
        boutonMenuMobile.innerHTML = '<i class="fas fa-times"></i>';
    } else {
        menuMobile.classList.remove('actif');
        boutonMenuMobile.innerHTML = '<i class="fas fa-bars"></i>';
    }
}

/**
 * Ferme le menu mobile
 */
function fermerMenuMobile() {
    menuMobileOuvert = false;
    menuMobile.classList.remove('actif');
    boutonMenuMobile.innerHTML = '<i class="fas fa-bars"></i>';
}

// ============================================
// NAVIGATION ET SCROLL
// ============================================

/**
 * Navigue vers une section spécifique
 * @param {string} sectionId - L'ID de la section
 */
function naviguerVers(sectionId) {
    const section = document.getElementById(sectionId);
    
    if (section) {
        // Fermer le menu mobile si ouvert
        if (menuMobileOuvert) {
            fermerMenuMobile();
        }
        
        // Mettre à jour le menu actif
        mettreAJourMenuActif(sectionId);
        
        // Scroller vers la section
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

/**
 * Met à jour le lien du menu actif
 * @param {string} sectionId - L'ID de la section active
 */
function mettreAJourMenuActif(sectionId) {
    // Retirer la classe actif de tous les liens
    const tousLesLiens = document.querySelectorAll('.lien-menu, .lien-menu-mobile');
    tousLesLiens.forEach(lien => lien.classList.remove('actif'));
    
    // Ajouter la classe actif au lien correspondant
    const lienActif = document.querySelector(`a[href="#${sectionId}"]`);
    if (lienActif) {
        lienActif.classList.add('actif');
    }
}

/**
 * Détecte la section active lors du scroll
 */
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section');
    let sectionActive = null;
    
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 150 && rect.bottom > 150) {
            sectionActive = section.id;
        }
    });
    
    if (sectionActive) {
        mettreAJourMenuActif(sectionActive);
    }
});

// ============================================
// GESTION DU FORMULAIRE
// ============================================

/**
 * Valide le formulaire
 * @returns {boolean} - True si le formulaire est valide
 */
function validerFormulaire() {
    const prenom = document.getElementById('prenom').value.trim();
    const nom = document.getElementById('nom').value.trim();
    const sujet = document.getElementById('sujet').value.trim();
    const message = document.getElementById('message').value.trim();
    
    let estValide = true;
    
    // Réinitialiser les messages d'erreur
    reinitialiserErreurs();
    
    // Valider le prénom
    if (!prenom) {
        afficherErreur('prenom', 'Le Prénom est requis');
        estValide = false;
    }
    
    // Valider le nom
    if (!nom) {
        afficherErreur('nom', 'Le Nom est requis');
        estValide = false;
    }
    
    // Valider le sujet
    if (!sujet) {
        afficherErreur('sujet', 'Le Sujet est requis');
        estValide = false;
    }
    
    // Valider le message
    if (!message) {
        afficherErreur('message', 'Le Message est requis');
        estValide = false;
    } else if (message.length < 10) {
        afficherErreur('message', 'Le message doit contenir au moins 10 caractères');
        estValide = false;
    }
    
    return estValide;
}

/**
 * Affiche un message d'erreur
 * @param {string} champId - L'ID du champ
 * @param {string} message - Le message d'erreur
 */
function afficherErreur(champId, message) {
    const champ = document.getElementById(champId);
    const messageErreur = document.getElementById(`erreur${champId.charAt(0).toUpperCase() + champId.slice(1)}`);
    
    if (champ && messageErreur) {
        champ.classList.add('erreur');
        messageErreur.textContent = message;
        messageErreur.classList.add('visible');
    }
}

/**
 * Réinitialise les messages d'erreur
 */
function reinitialiserErreurs() {
    const champsErreur = document.querySelectorAll('.input-formulaire.erreur');
    champsErreur.forEach(champ => champ.classList.remove('erreur'));
    
    const messagesErreur = document.querySelectorAll('.message-erreur.visible');
    messagesErreur.forEach(message => {
        message.classList.remove('visible');
        message.textContent = '';
    });
}

/**
 * Gère l'envoi du formulaire via Web3Forms
 * @param {Event} event 
 */
function gererEnvoiFormulaire(event) {
    event.preventDefault();

    // Valider le formulaire
    if (!validerFormulaire()) {
        afficherNotification('Veuillez corriger les erreurs du formulaire', 'erreur');
        return;
    }

    const form = document.getElementById('formulaireContact');
    const boutonEnvoyer = document.getElementById('boutonEnvoyer');
    const texteOriginal = boutonEnvoyer.textContent;

    // Désactiver le bouton
    boutonEnvoyer.disabled = true;
    boutonEnvoyer.textContent = "Envoi en cours...";

    // Construire les données Web3Forms
    const formData = new FormData(form);
    formData.append("access_key", "d43edfff-4d7a-41b5-b0d1-a7bec705cadc");

    // Envoi à Web3Forms
    fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
    })
    .then(async response => {
        const data = await response.json();

        if (response.ok) {
            afficherNotification("Message envoyé avec succès ! 🎉", "succes");
            form.reset();
        } else {
            afficherNotification("Erreur : " + data.message, "erreur");
        }

        boutonEnvoyer.disabled = false;
        boutonEnvoyer.textContent = texteOriginal;
    })
    .catch(error => {
        afficherNotification("Une erreur est survenue. Veuillez réessayer.", "erreur");
        boutonEnvoyer.disabled = false;
        boutonEnvoyer.textContent = texteOriginal;
    });
}


/**
 * Affiche une notification
 * @param {string} message - Le message à afficher
 * @param {string} type - Le type de notification ('succes' ou 'erreur')
 */
function afficherNotification(message, type) {
    // Créer l'élément de notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Ajouter la notification au DOM
    document.body.appendChild(notification);
    
    // Ajouter des styles CSS dynamiques
    const styles = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 8px;
        font-weight: 600;
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
        ${type === 'succes' ? 'background-color: #4caf50; color: white;' : 'background-color: #ef4444; color: white;'}
    `;
    
    notification.setAttribute('style', styles);
    
    // Supprimer la notification après 3 secondes
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ============================================
// GESTION DES CHAMPS DU FORMULAIRE
// ============================================

/**
 * Réinitialise l'erreur d'un champ lors de la saisie
 */
const champsFormulaire = document.querySelectorAll('.input-formulaire');
champsFormulaire.forEach(champ => {
    champ.addEventListener('input', function() {
        if (this.classList.contains('erreur')) {
            this.classList.remove('erreur');
            const messageErreur = this.nextElementSibling;
            if (messageErreur && messageErreur.classList.contains('message-erreur')) {
                messageErreur.classList.remove('visible');
                messageErreur.textContent = '';
            }
        }
    });
});

// ============================================
// ANIMATIONS AU SCROLL
// ============================================

/**
 * Observe les éléments pour les animer au scroll
 */
const observateur = new IntersectionObserver((entrees) => {
    entrees.forEach(entree => {
        if (entree.isIntersecting) {
            entree.target.classList.add('animate-fadeInUp');
            observateur.unobserve(entree.target);
        }
    });
}, {
    threshold: 0.1
});

// Observer les cartes de projets
document.querySelectorAll('.carte-projet').forEach(carte => {
    observateur.observe(carte);
});

// Observer les boites de compétences
document.querySelectorAll('.boite-competences').forEach(boite => {
    observateur.observe(boite);
});

// ============================================
// INITIALISATION
// ============================================

/**
 * Initialise le portfolio
 */
function initialiser() {
    console.log('Portfolio initialisé avec succès ! 🎉');
    
    // Mettre à jour le menu actif au chargement
    mettreAJourMenuActif('accueil');
}

// Initialiser le portfolio au chargement de la page
document.addEventListener('DOMContentLoaded', initialiser);

// ============================================
// ANIMATIONS CSS SUPPLÉMENTAIRES
// ============================================

// Ajouter les animations CSS dynamiquement
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(30px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(30px);
        }
    }
`;
document.head.appendChild(style);
