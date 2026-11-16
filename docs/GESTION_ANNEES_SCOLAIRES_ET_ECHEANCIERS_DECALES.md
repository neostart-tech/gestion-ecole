# Architecture et Réflexion : Gestion des Années Scolaires et Échéanciers Décalés

## 1. Contexte et Problématique Métier

Dans un établissement d'enseignement supérieur (comme l'IAI), le calendrier académique et les flux financiers ne sont pas uniformes pour tous les étudiants :

1. **Rentrées échelonnées (Décalage de rentrée)** :
   * Les nouveaux étudiants (ex: Licence 1) démarrent généralement en début d'année académique (ex: octobre).
   * Les promotions supérieures (Licence 2, Licence 3, Masters, cours du soir, formations continues) démarrent souvent plus tard (ex: novembre, décembre ou janvier), en raison des sessions de rattrapage, soutenances de stage ou calendriers spécifiques.

2. **Impact financier direct (Échéanciers et Retards de paiement)** :
   * Si les tranches de paiement sont générées à partir d'une seule date de début globale fixée à octobre :
     * Tranche 1 : Échéance en octobre.
     * Tranche 2 : Échéance en décembre/janvier.
   * Conséquence : Dès leur rentrée en décembre, les étudiants de Licence 2 se retrouvent marqués **en retard** sur la Tranche 1 (alors que les cours viennent tout juste de commencer), et la Tranche 2 leur est exigée immédiatement.

3. **Chevauchement d'années académiques** :
   * Une promotion N-1 peut être encore en cours de finalisation (soutenances, jurys, rattrapages de 2024-2025) au moment où la nouvelle année 2025-2026 est déjà ouverte pour les Licence 1.

---

## 2. Analyse de la Demande Initiale du Client

### Demande formulée par le client
> "Permettre d'activer plusieurs années scolaires en même temps dans le système."

### Pourquoi cette approche est dangereuse et à proscrire
Activer simultanément plusieurs années scolaires briserait le système en profondeur :
* **Unicité attendue dans le code** : De multiples fonctions reposent sur l'existence d'une unique année active (`getAnneeScolaireId()`, `AnneeScolaire::where('active', true)->value('id')`).
* **Scopes globaux Eloquent** : Le scope `CurrentAnneeScolaireScope` applique automatiquement un filtre `where('annee_scolaire_id', '=', getAnneeScolaireId())`. Avec plusieurs années actives, le système prendrait arbitrairement la première ou créerait des comportements erratiques.
* **Intégrité académique** : Les calculs de moyennes, délibérations, bulletins, présences et emplois du temps mélangeraient les promotions de deux années différentes.

Le besoin réel du client n'est pas d'avoir plusieurs années administratives actives en vrac, mais de **gérer des calendriers et des échéanciers décalés par filière et par niveau**.

---

## 3. Solution Retenue : Le Modèle Unifié par "Cohorte"

Au lieu de considérer l'année scolaire comme un bloc monolithique rigide, le système sépare :
* **L'Année Scolaire Administrative** (ex: 2025-2026) : Cadre officiel global qui reste unique et actif.
* **La Cohorte Pédagogique** : Le triplet **Année Scolaire + Filière + Niveau**.

Chaque cohorte possède :
1. Sa propre **date de rentrée effective** (date de début des cours).
2. Sa propre **date de fin prévisionnelle**.
3. Sa propre **grille tarifaire et son échéancier de tranches** calé sur sa date de rentrée.

---

## 4. Comparatif Avant / Après

### Scénario Avant (Blocage actuel)
* Année 2025-2026 : Date de début = 01/10/2025.
* L1 Informatique : Rentrée le 01/10/2025.
  * Tranche 1 (01/10/2025) : Conforme.
* L2 Informatique : Rentrée le 01/12/2025.
  * Tranche 1 (01/10/2025) : En retard de 2 mois dès le premier jour de cours.
  * Tranche 2 (01/01/2026) : Exigée 1 mois après la rentrée.

### Scénario Après (Modèle par Cohorte)
* Année 2025-2026 (Active globale) :
  * **Cohorte L1 Informatique** (Rentrée le 01/10/2025) :
    * Tranche 1 : Date limite au 15/10/2025.
    * Tranche 2 : Date limite au 15/01/2026.
    * Tranche 3 : Date limite au 15/04/2026.
  * **Cohorte L2 Informatique** (Rentrée le 01/12/2025) :
    * Tranche 1 : Date limite au 15/12/2025.
    * Tranche 2 : Date limite au 15/03/2026.
    * Tranche 3 : Date limite au 15/06/2026.
* **Résultat** :
  * Le calcul du statut `en_retard` (`$this->date_limite < now() && $this->montant_paye < $this->montant`) devient parfaitement juste pour chaque étudiant.
  * Aucun faux signalement de retard.
  * Les relances automatiques et les tableaux de bord comptables reflètent la réalité du terrain.

---

## 5. Cartographie Technique et Implémentation

### Base de données (Modèles existants exploitables)

1. **`frais_scolarites`** :
   * Dispose déjà des colonnes : `annee_scolaire_id`, `filiere_id`, `niveau_id`, `genre`, `mode_formation`.
   * Chaque configuration de frais possède déjà sa propre collection de `tranche_paiements`.
   * **Évolution préconisée** : Ajouter un champ optionnel `date_debut_cours` sur `frais_scolarites` (ou s'appuyer sur la date de rentrée de la filière/niveau).

2. **`annee_filiere`** :
   * Table pivot existante (`annee_scolaire_id`, `filiere_id`, `date_debut`, `date_fin`).
   * **Évolution préconisée** : Étendre cette logique pour associer les dates au couple (filière, niveau) si les rentrées diffèrent par niveau au sein d'une même filière.

3. **`FraisScolariteController::generateAutoTranches`** :
   * Actuellement :
     ```php
     $targetAnnee = $anneeScolaire ?? AnneeScolaire::where('active', true)->first();
     $dateDebut = $targetAnnee && $targetAnnee->date_debut ? Carbon::parse($targetAnnee->date_debut) : Carbon::now();
     ```
   * Évolution :
     Prendre en priorité la `date_debut_cours` propre au tarif / à la cohorte, et se rabattre sur `$targetAnnee->date_debut` uniquement si aucune date spécifique n'est définie.

4. **`FraisEtudiantService::assignDefaultFrais`** :
   * L'affectation d'un étudiant à un groupe (`etudiant_group`) identifie déjà son `niveau_id`, son `filiere_id` et son `annee_scolaire_id`.
   * L'échéancier individuel généré pour l'étudiant hérite automatiquement des tranches adaptées à sa promotion.

---

## 6. Parcours Utilisateur Côté Frontend (`gestion-ecole`)

### A. Dans la configuration des Années Scolaires (`/annee-scolaire/liste`)
* L'année scolaire active reste unique (sécurité maximale contre les régressions).
* Une vue de gestion des calendriers permet de visualiser et définir les dates de rentrée par filière et par niveau.

### B. Dans la configuration des Frais de Scolarité (`/frais-de-scolarite`)
* Lors de la création ou modification d'une grille de frais (ex: Licence 2 - Génie Logiciel) :
  * Un champ "Date de rentrée / début des tranches" est proposé (pré-rempli avec la date de rentrée de la cohorte ou de l'année scolaire).
  * La génération automatique des tranches calcule les dates limites par rapport à cette date spécifique.
  * Le comptable conserve la possibilité d'ajuster individuellement la date limite de chaque tranche.

---

## 7. Gestion du Chevauchement d'Années (Promotions en retard N-1)

Pour les cas où une promotion de l'année précédente (2024-2025) n'a pas terminé ses cours ou rattrapages alors que 2025-2026 a démarré :
1. L'année 2025-2026 devient l'année courante active.
2. Pour les enseignants ou jurys devant encore intervenir sur 2024-2025, prévoir un **sélecteur d'année de consultation/saisie** dans l'en-tête (au lieu de forcer l'activation simultanée en base).
3. Les étudiants non encore réinscrits restent rattachés à leur dossier 2024-2025 jusqu'à leur réinscription effective en 2025-2026.


---

## 8. Architecture Déployée : Le Calendrier Académique Centralisé (`calendrier_rentrees`)

### A. Base de données
* Table `calendrier_rentrees` :
  * `id`
  * `annee_scolaire_id`
  * `niveau_id` (Niveau scolaire : L1, L2, etc.)
  * `filiere_id` (Nullable : si null, s'applique à tout le niveau ; si renseigné, dérogation filière)
  * `date_rentree`
  * `date_fin`
  * `description`
* Modèle `App\Models\CalendrierRentree` avec méthode de résolution en cascade :
  `CalendrierRentree::resolveDateRentree($anneeId, $niveauId, $filiereId)` :
  1. Cherche la date spécifique `(annee_id, niveau_id, filiere_id)`.
  2. Sinon cherche la date par défaut du niveau `(annee_id, niveau_id, null)`.
  3. Sinon utilise la date de début générale de l'année `annee_scolaires.date_debut`.

### B. Consommation par les modules
* **Module Années Scolaires (`/annee-scolaire/liste`)** :
  * Bouton "Calendrier rentrées" sur chaque année scolaire.
  * Modale de configuration rapide par niveau avec possibilité d'ajouter des filières spécifiques.
  * Option de synchronisation automatique immédiate des échéanciers étudiants.
* **Module Frais de Scolarité (`/frais-de-scolarite/liste`)** :
  * La génération automatique des tranches (`generateAutoTranches`) s'alimente directement du calendrier central.
  * Les étudiants inscrits ont leurs échéanciers synchronisés sans jamais toucher aux montants déjà payés.
