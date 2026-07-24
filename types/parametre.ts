// Cette interface représente UN paramètre
export interface Parametre {
  id: number;           // Identifiant unique
  key: string;          // La clé technique
  value: string | number | boolean | null;  // La valeur actuelle
  valueKey: string | null;  // Le libellé à afficher
  options: string | null;   // Les options pour les selects (format: "valeur|label,valeur2|label2")
  type: 'text' | 'textarea' | 'boolean' | 'select' | 'file';  // Type de champ
  created_at: string | null;
  updated_at: string | null;
}

// Pour gérer l'upload de fichiers (état temporaire)
export interface FileUploadState {
  file: File | null;           // Le fichier sélectionné
  preview: string | null;      // L'URL de prévisualisation
  existingPath: string | null; // Le chemin de l'image existante
  isDeleting: boolean;         // Si on est en train de supprimer
  isUploading: boolean;        // Si on est en train d'uploader
}

// Pour gérer les données du formulaire (ce qu'on envoie)
export interface ParametreFormData {
  [key: string]: string | number | boolean | File | null;
  _delete_files?: { [key: string]: boolean }; // Pour marquer les fichiers à supprimer
}