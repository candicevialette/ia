// 1. Sélectionner les éléments HTML de la page avec lesquels nous allons interagir.
// C'est comme donner des noms à nos outils.
const userInput = document.getElementById('userInput'); // La zone où l'utilisateur écrit
const submitBtn = document.getElementById('submitBtn');   // Le bouton "Traduire !"
const resultArea = document.getElementById('resultArea'); // La "bulle" qui contiendra la réponse

// 2. Créer un élément <p> à l'intérieur de la "bulle" de résultat.
// C'est dans cet élément que le texte de la réponse sera écrit.
const resultParagraph = document.createElement('p');
resultArea.appendChild(resultParagraph);

// 3. Définir la fonction qui communique avec notre serveur backend.
// Le mot-clé "async" signifie que cette fonction peut effectuer des opérations qui prennent du temps (comme attendre une réponse du réseau) sans bloquer le navigateur.
async function appelerIA(consigne) {
    try {
        // On utilise "fetch" pour envoyer une requête à notre serveur.
        // L'adresse '/api/reformulate' correspond à celle définie dans server.js.
        const response = await fetch('/api/reformulate', {
            method: 'POST', // On envoie des données, donc on utilise la méthode POST.
            headers: {
                'Content-Type': 'application/json', // On prévient le serveur qu'on lui envoie du JSON.
            },
            // On convertit notre objet JavaScript en une chaîne de texte JSON.
            body: JSON.stringify({ consigne: consigne }), 
        });

        // Si la réponse du serveur n'est pas un succès (ex: erreur 404 ou 500),
        // on génère une erreur pour l'attraper dans le "catch".
        if (!response.ok) {
            throw new Error(`Erreur du serveur: ${response.statusText}`);
        }

        // On convertit la réponse JSON du serveur en un objet JavaScript.
        const data = await response.json();
        // On retourne uniquement le texte de la réponse de l'IA.
        return data.reponse;

    } catch (error) {
        // Si quelque chose se passe mal (pas de réseau, serveur planté...), on affiche une erreur.
        console.error("Erreur lors de l'appel au backend:", error);
        return "Désolée, une erreur de connexion est survenue. Veuillez vérifier que le serveur est bien lancé et réessayer.";
    }
}

// 4. Attacher un "écouteur d'événement" au bouton.
// Le code à l'intérieur de cette fonction ne s'exécutera que lorsque l'utilisateur cliquera sur le bouton.
submitBtn.addEventListener('click', async () => {
    // On récupère le texte que l'utilisateur a écrit.
    const consigne = userInput.value;

    // On vérifie que le champ n'est pas vide.
    if (consigne.trim() === '') {
        alert("Veuillez saisir une consigne.");
        return; // On arrête l'exécution de la fonction.
    }

    // On prépare l'interface pour le temps d'attente.
    resultArea.classList.remove('hidden'); // On rend la "bulle" de réponse visible.
    resultParagraph.textContent = 'Lou réfléchit...'; // On affiche un message de chargement.
    submitBtn.disabled = true; // On désactive le bouton pour éviter les clics multiples.
    submitBtn.style.cursor = 'wait'; // On change le curseur pour montrer que le système travaille.

    // On appelle notre fonction qui contacte le serveur et on attend la réponse.
    const reponseFinale = await appelerIA(consigne);

    // Une fois la réponse reçue, on met à jour l'interface.
    resultParagraph.textContent = reponseFinale; // On affiche la réponse de l'IA.
    submitBtn.disabled = false; // On réactive le bouton.
    submitBtn.style.cursor = 'pointer'; // On remet le curseur normal.
});
