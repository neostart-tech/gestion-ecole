// Filet de sécurité dynamique pour role.global.js.
//
// Le fichier permissions.js (rolePermissions) est une liste de chemins autorisés,
// maintenue à la main par rôle. Le problème : accorder une permission à un rôle
// depuis la page "Rôles" (système dynamique piloté par la base) ne met pas à jour
// cette liste — la navigation reste bloquée même si le bouton s'affiche bien.
//
// Ce fichier comble l'écart : si le chemin ne correspond à aucune entrée statique
// autorisée pour le rôle, on vérifie ICI si le préfixe de la page correspond à un
// domaine de permissions dynamiques, et si l'utilisateur possède au moins une des
// permissions listées. Si oui, l'accès est autorisé sans toucher à permissions.js.
//
// Pas besoin d'y toucher pour une page déjà couverte par une entrée statique
// existante (ex: pages "*" en accès complet) — seulement pour élargir l'accès
// aux détenteurs de permissions dynamiques sur des pages qui ne les listaient pas.
export const routePermissionFallback = [
  { prefix: "/roles", anySlugOf: ["assign-role-permissions", "create-role", "update-role", "delete-role"] },
  { prefix: "/journal-activite", anySlugOf: ["view-logs"] },
  { prefix: "/filieres", anySlugOf: ["view-filiere", "create-filiere", "update-filiere", "delete-filiere"] },
  { prefix: "/salles", anySlugOf: ["view-salle", "create-salle", "update-salle", "delete-salle"] },
  { prefix: "/ues", anySlugOf: ["view-ue", "create-ue", "update-ue", "delete-ue"] },
  { prefix: "/uvs", anySlugOf: ["view-uv", "create-uv", "update-uv", "delete-uv"] },
  { prefix: "/matieres", anySlugOf: ["view-uv", "create-uv", "update-uv", "delete-uv"] },
  {
    prefix: "/evaluations",
    anySlugOf: [
      "view-evaluation", "create-evaluation", "update-evaluation", "delete-evaluation", "publish-evaluation",
      "create-note", "update-note", "publish-note", "view-note",
      // Générateur d'examens en ligne + console de correction, sous /evaluations/examen-en-ligne/*
      "create-question-examen", "update-question-examen", "delete-question-examen",
      "grade-examen", "manage-exam-session",
    ],
  },
  {
    prefix: "/personnel",
    anySlugOf: [
      "view-enseignant", "create-enseignant", "update-enseignant", "delete-enseignant",
      "view-user", "create-user", "update-user", "delete-user", "update-surveillant",
    ],
  },
  { prefix: "/groupes", anySlugOf: ["view-groupe", "create-groupe", "delete-groupe", "update-groupe"] },
  { prefix: "/periodes", anySlugOf: ["view-semestre", "create-semestre", "update-semestre", "delete-semestre"] },
  {
    prefix: "/finance",
    anySlugOf: [
      "create-depense", "delete-depense",
      "create-tranche-paiement", "update-tranche-paiement", "delete-tranche-paiement",
      "create-plan-paiement", "update-plan-paiement", "delete-plan-paiement",
      "create-paiement", "update-paiement",
      "send-rappel-recouvrement", "declare-abandon-etudiant",
    ],
  },
  {
    prefix: "/frais-de-scolarite",
    anySlugOf: ["create-frais-scolarite", "update-frais-scolarite", "delete-frais-scolarite", "duplicate-frais-scolarite"],
  },
  {
    prefix: "/frais-inscription",
    anySlugOf: ["create-frais-inscription", "update-frais-inscription", "delete-frais-inscription"],
  },
  {
    prefix: "/admin/negociations",
    anySlugOf: ["create-negociation", "update-negociation", "delete-negociation", "create-paiement-negociation"],
  },
  { prefix: "/admin/paiements", anySlugOf: ["create-paiement", "update-paiement"] },
  {
    prefix: "/admin/liste-des-etudiants",
    anySlugOf: ["view-etudiant", "create-etudiant", "update-etudiant", "delete-etudiant"],
  },
  { prefix: "/evenements", anySlugOf: ["view-evenement", "create-evenement", "update-evenement", "delete-evenement"] },
  {
    prefix: "/actualites",
    anySlugOf: ["view-actualite", "create-actualite", "update-actualite", "delete-actualite"],
  },
  {
    prefix: "/info-urgente",
    anySlugOf: ["view-actualite", "create-actualite", "update-actualite", "delete-actualite"],
  },
  {
    prefix: "/publications/infos-urgentes",
    anySlugOf: ["view-actualite", "create-actualite", "update-actualite", "delete-actualite"],
  },
  { prefix: "/annee-scolaire", anySlugOf: ["create-annee-scolaire", "update-annee-scolaire"] },
  { prefix: "/parametre/niveaux", anySlugOf: ["create-niveau", "update-niveau", "delete-niveau"] },
  { prefix: "/parametre/champs-obligatoires", anySlugOf: ["update-candidature-field-config"] },
  { prefix: "/parametre/types-diplome", anySlugOf: ["create-type-diplome", "update-type-diplome", "delete-type-diplome"] },
  {
    prefix: "/parametre/moyens-connaissance",
    anySlugOf: ["create-moyen-connaissance", "update-moyen-connaissance", "delete-moyen-connaissance"],
  },
  {
    prefix: "/parametre/types-documents",
    anySlugOf: ["create-type-document", "update-type-document", "delete-type-document"],
  },
  { prefix: "/admin/jours-feries", anySlugOf: ["create-jour-ferie", "update-jour-ferie", "delete-jour-ferie"] },
  { prefix: "/reclamations", anySlugOf: ["update-reclamation"] },
  { prefix: "/admin/prospects", anySlugOf: ["update-prospect", "delete-prospect"] },
  {
    prefix: "/galerie",
    anySlugOf: [
      "create-galerie-album", "update-galerie-album", "delete-galerie-album",
      "create-galerie-photo", "update-galerie-photo", "delete-galerie-photo",
    ],
  },
  { prefix: "/publications", anySlugOf: ["create-blog", "update-blog", "delete-blog", "publish-blog"] },
  { prefix: "/partenaires", anySlugOf: ["create-partenaire", "update-partenaire", "delete-partenaire"] },
  {
    prefix: "/admin/communications",
    anySlugOf: ["create-communication", "update-communication", "delete-communication"],
  },
  { prefix: "/communications", anySlugOf: ["moderate-commentaire-web", "delete-abonne-newsletter"] },
  {
    prefix: "/candidatures",
    anySlugOf: [
      "create-candidat-entrant", "update-candidat-entrant", "view-candidat-entrant", "delete-candidat-entrant",
      "valider-candidature", "rejeter-candidature", "rectifier-candidature", "transmettre-candidature",
      "reorienter-candidature", "attribuer-groupe-candidature", "controler-presence-candidature",
      "controler-admission-candidature", "inscrire-etudiant-candidature", "payer-participation-candidature",
    ],
  },
  {
    prefix: "/bourses",
    anySlugOf: ["create-bourse", "update-bourse", "delete-bourse", "affecter-bourse"],
  },
  { prefix: "/admin/etudiants/situation", anySlugOf: ["update-situation-etudiant"] },
  {
    prefix: "/parametre/concours-sessions",
    anySlugOf: ["create-concours-session", "update-concours-session", "publish-concours-session"],
  },
  {
    prefix: "/parametre/concours-matieres",
    anySlugOf: ["create-concours-matiere", "update-concours-matiere", "delete-concours-matiere"],
  },
  {
    prefix: "/concours",
    anySlugOf: [
      "create-concours-session", "update-concours-session", "publish-concours-session",
      "create-concours-matiere", "update-concours-matiere", "delete-concours-matiere",
      "enregistrer-notes-concours",
    ],
  },
  {
    prefix: "/opportunites",
    anySlugOf: ["create-opportunite", "update-opportunite", "delete-opportunite", "publish-opportunite"],
  },
  { prefix: "/messages", anySlugOf: ["reply-message-contact", "delete-message-contact"] },
  { prefix: "/admin/liste-des-releves", anySlugOf: ["create-releve", "delete-releve"] },
  { prefix: "/admin/releves-globaux", anySlugOf: ["create-releve", "delete-releve"] },
  { prefix: "/Enseignant/syllabuses", anySlugOf: ["update-syllabus"] },
  { prefix: "/parametre/modification", anySlugOf: ["update-configuration-site"] },
];
