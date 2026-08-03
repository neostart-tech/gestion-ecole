# Spécification Fonctionnelle & Technique : Gestion des Honoraires & Rémunérations

> **Document de Référence & d'Architecture**  
> *Module de décompte des honoraires, salaires et prestations complémentaires pour le personnel enseignant et administratif.*

---

## 1. Vision & Objectifs du Module

L'objectif principal est d'établir un système unifié, flexible et automatisé pour gérer la rémunération et le décompte des honoraires au sein de l'établissement. 

Le système prend en charge :
1. **Les Enseignants Vacataires & Intervenants Extérieurs** : Rémunération aux honoraires basée sur le volume d'heures d'enseignement dispensées (CM, TD, TP) et activités académiques annexes (jurys, corrections).
2. **Le Personnel Administratif & Technique (PAT) & Permanents** : Rémunération fixe mensuelle avec possibilité de décompte d'heures supplémentaires ou de prestations spécifiques (surveillances d'examens/concours, astreintes, commissions).
3. **Le Filtrage & Ciblage du Personnel** : Identification claire du type de contrat de chaque agent afin d'exclure les profils non rémunérés ou exempts (stagiaires, bénévoles).

---

## 2. Classification des Modes de Rémunération

Chaque membre du personnel (User) est rattaché à un **Profil de Rémunération** :

```mermaid
graph TD
    User[Membre du Personnel] --> Contrat{Type de Contrat / Rémunération}
    Contrat -->|Honoraires Purs| Vacataire[Vacataire / Intervenant Extérieur]
    Contrat -->|Fixe Mensuel| Permanent[Permanent Administratif / Cadre]
    Contrat -->|Mixte| PermanentAcademic[Enseignant Permanent / Agent Polyvalent]
    Contrat -->|Exempt| NonRemunere[Stagiaire / Bénévole / Exempt]

    Vacataire --> Décompte[Décompte Heures x Taux]
    Permanent --> SalaireFixe[Salaire de Base Fixe]
    PermanentAcademic --> MixteCalc[Fixe + Heures Comp. + Prestations]
```

### Table des Types de Contrats :
* **`HONORAIRES_PURS`** : Rémunération calculée exclusivement sur le volume d'heures ou prestations réalisées.
* **`SALAIRE_FIXE`** : Rémunération mensuelle forfaitaire.
* **`MIXTE`** : Salaire de base fixe + paiement des heures complémentaires et vacations.
* **`EXEMPT`** : Aucune génération de fiche d'honoraires ou de bulletin.

---

## 3. Catalogue des Prestations & Tarification

Le système repose sur un catalogue de prestations paramétrables permettant de définir des taux horaires ou forfaitaires.

### A. Prestations Académiques (Enseignement)
| Code Prestation | Intitulé | Unité de Calcul | Application / Exemple |
| :--- | :--- | :--- | :--- |
| `COURS_CM` | Cours Magistral (CM) | Heure | Taux enseignant / Matière (ex: 15 000 FCFA/h) |
| `COURS_TD` | Travaux Dirigés (TD) | Heure | Coefficient ou taux spécifique |
| `COURS_TP` | Travaux Pratiques (TP) | Heure | Encadrement labo / atelier |
| `JURY_SOUTENANCE` | Jury de Soutenance | Forfait / Commission | Forfait par étudiant ou par session |
| `CORRECTION_COPIE` | Correction d'Épreuve | Forfait par copie | Prix unitaire par copie corrigée |

### B. Prestations Administratives & Transversales
| Code Prestation | Intitulé | Unité de Calcul | Application / Concerne |
| :--- | :--- | :--- | :--- |
| `SURVEILLANCE_EXAMEN` | Surveillance d'Examen / Concours | Heure ou Séance | Professeurs & Personnel Administratif |
| `SECRETARIAT_CONCOURS` | Organisation / Secrétariat Concours | Forfait / Journée | Membres du PAT |
| `HEURE_SUP_ADMIN` | Heures Supplémentaires Admin | Heure | Personnel Administratif Permanent/Contractuel |
| `ASTREINTE_LOGISTIQUE` | Astreinte / Permanence | Journée / Week-end | Support informatique & logistique |

---

## 4. Modèle de Données (Base de Données)

```mermaid
erDiagram
    USERS ||--o{ TEACHER_RATES : "possède"
    USERS ||--o{ FEE_STATEMENTS : "reçoit"
    UNITE_VALEURS ||--o{ TEACHER_RATES : "applique"
    FEE_STATEMENTS ||--o{ FEE_STATEMENT_ITEMS : "contient"
    FEE_STATEMENTS ||--o{ PAYMENTS : "règle"

    USERS {
        bigint id PK
        string nom
        string prenom
        string contrat_type "HONORAIRES_PURS, SALAIRE_FIXE, MIXTE, EXEMPT"
        decimal salaire_base_fixe
        boolean requires_nif
    }

    FEE_CATALOG {
        bigint id PK
        string code "COURS_CM, SURVEILLANCE_EXAMEN, etc."
        string libelle
        enum type_unite "HEURE, FORFAIT, COPIE, SEANCE"
        decimal taux_par_defaut
    }

    TEACHER_RATES {
        bigint id PK
        bigint user_id FK
        bigint unite_valeur_id FK
        bigint fee_catalog_id FK
        decimal taux_horaire
    }

    FEE_STATEMENTS {
        bigint id PK
        bigint user_id FK
        string reference "HON-2026-01-004"
        date periode_debut
        date periode_fin
        decimal total_brut
        decimal total_retenues
        decimal total_net
        string statut "BROUILLON, SOUMIS, VALIDE, PAYE"
    }

    FEE_STATEMENT_ITEMS {
        bigint id PK
        bigint fee_statement_id FK
        string libelle_prestation
        decimal quantite "heures ou nombre de copies"
        decimal taux_unitaire
        decimal montant_total
        bigint seance_id FK "optionnel (si issu de l'emploi du temps)"
    }
```

---

## 5. Workflow de Calcul & Validation

```mermaid
sequenceDiagram
    autonumber
    participant Admin as Gestionnaire RH / DAF
    participant Controller as Honoraires Engine (Laravel)
    participant Timetable as Emploi du Temps / Séances
    participant Statement as Fiche d'Honoraires (DB)
    participant User as Enseignant / Agent Admin

    Admin->>Controller: Initialiser Décompte (Mois M, Utilisateur X)
    Controller->>Timetable: Extraire Séances terminées & Validées (Présence vérifiée)
    Timetable-->>Controller: Liste des heures (CM, TD, TP, Surveillances)
    Controller->>Controller: Calculer Quantités x Taux par Prestation
    Controller->>Statement: Créer Fiche en statut BROUILLON
    Admin->>Statement: Ajuster / Ajouter Prestations Administratives Manuelles
    Admin->>Controller: Valider la Fiche (Statut -> VALIDE)
    Controller->>Statement: Verrouiller les montants & Générer le PDF
    Admin->>Statement: Enregistrer Règlement (Statut -> PAYE)
    User->>Statement: Consulter & Télécharger Bulletin/Décompte PDF
```

---

## 6. Composants Frontend & Expérience Utilisateur (Nuxt 3)

1. **Écran de Paramétrage des Taux (`/rh/honoraires/tarifs`)** :
   - Interface de définition des taux par défaut et des dérogations par enseignant / matière.
2. **Console de Génération des Décomptes (`/rh/honoraires/generation`)** :
   - Sélection de la période et filtrage par département / type de personnel.
   - Prévisualisation dynamique du nombre d'heures calculées vs montants.
3. **Gestion des Fiches & Règlements (`/rh/honoraires/liste`)** :
   - Table `Vue3Datatable` récapitulative avec filtre par statut (*Brouillon*, *Validé*, *Payé*).
   - Modal d'enregistrement des règlements avec reçu d'impression.
4. **Portail Collaborateur (`/mon-compte/honoraires`)** :
   - Vue enseignant/personnel pour consulter ses décomptes mensuels et télécharger les bulletins PDF.

---

## 7. Questions Ouvertes & Points à Arbitrer

> [!IMPORTANT]
> **Points de validation pour la prochaine session :**
> 1. **Périodicité des décomptes** : Préférez-vous une génération mensuelle automatique pour tout le monde ou une génération à la demande par période personnalisée ?
> 2. **Règles de retenues fiscales** : Y a-t-il des taxes ou retenues à la source (ex: TPR, impôt sur honoraires) à appliquer automatiquement sur le total brut ?
> 3. **Modalité de validation des séances** : Une séance réalisée par un prof doit-elle obligatoirement être validée par le surveillant/chef de département avant d'être comptabilisée dans ses honoraires ?

---
*Document généré le 31/07/2026 – Enregistré dans le projet frontend pour référence ultérieure.*
