import { PERMISSIONS } from "./permissions";

const FULL_ACCESS = Object.values(PERMISSIONS);

const READ_ONLY = [PERMISSIONS.USER_VIEW, PERMISSIONS.COURS_VIEW];

const TEACHER_ACCESS = [
  PERMISSIONS.ENSEIGNANT_CREATE,
  PERMISSIONS.ENSEIGNANT_UPDATE,
  PERMISSIONS.ENSEIGNANT_DELETE,
  PERMISSIONS.ENSEIGNANT_VIEW,
];

export const roleAccess = {
  informaticien: [...FULL_ACCESS],
  "directeur-general-adjoint": [...FULL_ACCESS],
  admin: [...FULL_ACCESS],
  "directeur-general": [...FULL_ACCESS],

  // Rôles à accès restreint RH (pas de suppression, pas de modification de rôle, pas d'ajout admin)

  "directeur-des-affaires-financieres": [...READ_ONLY],
  "responsable-administratif-et-financier": [...READ_ONLY],
  "directeur-des-etudes": [...READ_ONLY],

  // Rôles intermédiaires (pas d'accès admin)
  "logiticien-academique": [
    ...READ_ONLY,
    ...TEACHER_ACCESS,
    PERMISSIONS.COURS_CREATE,
    PERMISSIONS.COURS_UPDATE,
    PERMISSIONS.COURS_DELETE,
    PERMISSIONS.COURS_VIEW,
  ],
  "directeur-academique": [
    ...READ_ONLY,
    ...TEACHER_ACCESS,
    PERMISSIONS.COURS_CREATE,
    PERMISSIONS.COURS_UPDATE,
    PERMISSIONS.COURS_DELETE,
    PERMISSIONS.COURS_VIEW,
  ],
};
