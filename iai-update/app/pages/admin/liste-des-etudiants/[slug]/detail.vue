<template>
  <div
    class="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 sm:p-4 md:p-6 transition-colors"
  >
    <!-- Breadcrumb -->
    <Breadcrumb
      :items="[
        { label: 'Groupes', to: '/' },
        { label: 'Étudiants', to: '/admin/liste-des-etudiants' },
        { label: studentName, to: null },
      ]"
      :title="studentName"
      title-class="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 dark:text-white"
      spacing="mb-4"
    />

    <!-- Loading -->
    <div v-if="etudiantStore.isLoading" class="flex justify-center py-12">
      <div
        class="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"
      ></div>
    </div>

    <!-- Error -->
    <div
      v-else-if="etudiantStore.error"
      class="bg-white dark:bg-gray-800 rounded-lg p-8 text-center"
    >
      <p class="text-gray-600 dark:text-gray-400">Étudiant non trouvé</p>
    </div>

    <!-- Contenu principal -->
    <div v-else-if="etudiantStore.etudiant" class="max-w-7xl mx-auto">
      <!-- En-tête avec actions -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
        <div
          class="flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div class="flex items-center gap-4">
            <div
              class="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-semibold text-xl"
            >
              {{ initials }}
            </div>
            <div>
              <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">
                {{ etudiantStore.etudiant.prenom }}
                {{ etudiantStore.etudiant.nom }}
              </h1>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {{ etudiantStore.etudiant.matricule }} •
                {{ etudiantStore.etudiant.email }}
              </p>
            </div>
          </div>
<!-- 
          <div class="flex gap-2">
            <button
              @click="openEditModal"
              class="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
            >
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
              Modifier
            </button>

          
            <button
              @click="openDisableModal"
              class="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
            >
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                />
              </svg>
              Désactiver le compte
            </button>
          </div> -->
        </div>
      </div>

      <!-- Onglets -->
      <div
        class="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden"
      >
        <div class="border-b border-gray-200 dark:border-gray-700">
          <nav class="flex -mb-px">
            <button
              @click="activeTab = 'info'"
              :class="[
                'px-6 py-3 text-sm font-medium transition-colors duration-200',
                activeTab === 'info'
                  ? 'border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300',
              ]"
            >
              Informations
            </button>
            <button
              @click="activeTab = 'releves'"
              :class="[
                'px-6 py-3 text-sm font-medium transition-colors duration-200',
                activeTab === 'releves'
                  ? 'border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300',
              ]"
            >
              Relevés de notes
            </button>
          </nav>
        </div>

        <!-- Contenu des onglets -->
        <div class="p-6">
          <!-- Onglet Informations -->
          <div v-if="activeTab === 'info'">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <!-- Colonne principale -->
              <div class="lg:col-span-2 space-y-6">
                <!-- Informations personnelles -->
                <div>
                  <h2
                    class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4"
                  >
                    Informations personnelles
                  </h2>
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <p class="text-xs text-gray-400 dark:text-gray-500">
                        Nom
                      </p>
                      <p class="text-sm text-gray-900 dark:text-white mt-1">
                        {{ etudiantStore.etudiant.nom }}
                      </p>
                    </div>
                    <div>
                      <p class="text-xs text-gray-400 dark:text-gray-500">
                        Prénom
                      </p>
                      <p class="text-sm text-gray-900 dark:text-white mt-1">
                        {{ etudiantStore.etudiant.prenom }}
                      </p>
                    </div>
                    <div>
                      <p class="text-xs text-gray-400 dark:text-gray-500">
                        Genre
                      </p>
                      <p class="text-sm text-gray-900 dark:text-white mt-1">
                        {{ etudiantStore.etudiant.genre || "-" }}
                      </p>
                    </div>
                    <div>
                      <p class="text-xs text-gray-400 dark:text-gray-500">
                        Nationalité
                      </p>
                      <p class="text-sm text-gray-900 dark:text-white mt-1">
                        {{ etudiantStore.etudiant.nationalite || "-" }}
                      </p>
                    </div>
                    <div class="col-span-2">
                      <p class="text-xs text-gray-400 dark:text-gray-500">
                        Email
                      </p>
                      <p
                        class="text-sm text-gray-900 dark:text-white mt-1 break-all"
                      >
                        {{ etudiantStore.etudiant.email }}
                      </p>
                    </div>
                    <div class="col-span-2">
                      <p class="text-xs text-gray-400 dark:text-gray-500">
                        Téléphone
                      </p>
                      <p class="text-sm text-gray-900 dark:text-white mt-1">
                        {{ etudiantStore.etudiant.tel || "-" }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Dates -->
                <div>
                  <h2
                    class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4"
                  >
                    Dates
                  </h2>
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <p class="text-xs text-gray-400 dark:text-gray-500">
                        Date de naissance
                      </p>
                      <p class="text-sm text-gray-900 dark:text-white mt-1">
                        {{
                          etudiantStore.etudiant.date_naissance
                            ? formatDate(etudiantStore.etudiant.date_naissance)
                            : "-"
                        }}
                      </p>
                    </div>
                    <div>
                      <p class="text-xs text-gray-400 dark:text-gray-500">
                        Année d'admission
                      </p>
                      <p class="text-sm text-gray-900 dark:text-white mt-1">
                        {{ etudiantStore.etudiant.annee_admission || "-" }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Colonne latérale -->
              <div class="space-y-6">
                <!-- Parcours actuel -->
                <div>
                  <h2
                    class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4"
                  >
                    Parcours actuel
                  </h2>
                  <div
                    v-if="etudiantStore.etudiant.dernier_groupe"
                    class="space-y-3"
                  >
                    <div>
                      <p class="text-xs text-gray-400 dark:text-gray-500">
                        Groupe
                      </p>
                      <p
                        class="text-sm font-medium text-gray-900 dark:text-white mt-1"
                      >
                        {{ etudiantStore.etudiant.dernier_groupe.group.nom }}
                      </p>
                    </div>
                    <div>
                      <p class="text-xs text-gray-400 dark:text-gray-500">
                        Niveau
                      </p>
                      <p class="text-sm text-gray-900 dark:text-white mt-1">
                        {{ etudiantStore.etudiant.dernier_groupe.niveau.nom }}
                      </p>
                    </div>
                    <div>
                      <p class="text-xs text-gray-400 dark:text-gray-500">
                        Filière
                      </p>
                      <p class="text-sm text-gray-900 dark:text-white mt-1">
                        {{ etudiantStore.etudiant.dernier_groupe.filiere.nom }}
                      </p>
                    </div>
                  </div>
                  <p v-else class="text-sm text-gray-500 dark:text-gray-400">
                    Aucun groupe assigné
                  </p>
                </div>

                <!-- Lieux -->
                <div>
                  <h2
                    class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4"
                  >
                    Lieux
                  </h2>
                  <div class="space-y-3">
                    <div>
                      <p class="text-xs text-gray-400 dark:text-gray-500">
                        Lieu de naissance
                      </p>
                      <p class="text-sm text-gray-900 dark:text-white mt-1">
                        {{ etudiantStore.etudiant.lieu_naissance || "-" }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Onglet Relevés de notes -->
          <div v-if="activeTab === 'releves'">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-lg font-medium text-gray-900 dark:text-white">
                Relevés de notes
              </h2>
              <button
                @click="openReleveModal"
                class="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
              >
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Nouveau relevé
              </button>
            </div>

            <!-- Liste des relevés simulés -->
            <div class="space-y-3">
              <div
                v-for="releve in simulatedReleves"
                :key="releve.id"
                class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div class="flex items-center gap-3">
                  <div
                    class="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg"
                  >
                    <svg
                      class="w-5 h-5 text-indigo-600 dark:text-indigo-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p class="font-medium text-gray-900 dark:text-white">
                      {{ releve.titre }}
                    </p>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {{ releve.annee }} • {{ releve.semestre }} • Généré le
                      {{ formatDate(releve.date_generation) }}
                    </p>
                  </div>
                </div>
                <button
                  @click="generatePDF(releve)"
                  class="p-2 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors"
                  title="Télécharger le PDF"
                >
                  <svg
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Template du relevé de notes (caché) -->
    <div v-show="false" ref="releveTemplate">
      <div
        id="releve-content"
        class="releve-pdf"
        style="
          background: white;
          padding: 20px;
          font-family: Arial, sans-serif;
          width: 210mm;
          margin: 0 auto;
        "
      >
        <!-- En-tête avec logo -->
        <div style="text-align: center; margin-bottom: 20px">
          <h1
            style="
              color: #4f46e5;
              font-size: 24px;
              font-weight: bold;
              text-transform: uppercase;
              letter-spacing: 2px;
              margin: 0;
            "
          >
            UNIVERSITÉ EXCELLENCE
          </h1>
          <p style="color: #666; font-size: 12px; margin: 5px 0">
            ---------- Excellence et Innovation ----------
          </p>
        </div>

        <!-- Titre du document -->
        <div style="text-align: center; margin-bottom: 30px">
          <h2
            style="
              font-size: 20px;
              font-weight: bold;
              color: #333;
              border-bottom: 2px solid #4f46e5;
              padding-bottom: 5px;
              display: inline-block;
              padding-left: 30px;
              padding-right: 30px;
              margin: 0;
            "
          >
            RELEVÉ DE NOTES
          </h2>
        </div>

        <!-- Informations de l'étudiant -->
        <div
          style="
            margin-bottom: 30px;
            background: #f9fafb;
            padding: 15px;
            border: 1px solid #e5e7eb;
            border-radius: 4px;
          "
        >
          <table style="width: 100%; border-collapse: collapse">
            <tr>
              <td style="padding: 5px; width: 50%">
                <span style="color: #666; font-size: 12px"
                  >Nom et Prénoms :</span
                >
                <span
                  style="
                    font-weight: bold;
                    color: #111;
                    margin-left: 10px;
                    font-size: 14px;
                  "
                  >{{ studentName }}</span
                >
              </td>
              <td style="padding: 5px">
                <span style="color: #666; font-size: 12px">Matricule :</span>
                <span
                  style="
                    font-weight: bold;
                    color: #111;
                    margin-left: 10px;
                    font-size: 14px;
                  "
                  >{{ etudiantStore.etudiant?.matricule }}</span
                >
              </td>
            </tr>
            <tr>
              <td style="padding: 5px">
                <span style="color: #666; font-size: 12px">Niveau :</span>
                <span
                  style="
                    font-weight: bold;
                    color: #111;
                    margin-left: 10px;
                    font-size: 14px;
                  "
                  >{{
                    etudiantStore.etudiant?.dernier_groupe?.niveau?.nom || "-"
                  }}</span
                >
              </td>
              <td style="padding: 5px">
                <span style="color: #666; font-size: 12px">Filière :</span>
                <span
                  style="
                    font-weight: bold;
                    color: #111;
                    margin-left: 10px;
                    font-size: 14px;
                  "
                  >{{
                    etudiantStore.etudiant?.dernier_groupe?.filiere?.nom || "-"
                  }}</span
                >
              </td>
            </tr>
          </table>
        </div>

        <!-- Période concernée -->
        <div style="margin-bottom: 20px; text-align: center">
          <p style="font-size: 14px; margin: 0">
            <span style="font-weight: bold">Année académique :</span>
            {{ releveForm.annee || "2023-2024" }} •
            <span style="font-weight: bold">{{
              releveForm.semestre || "Semestre 1"
            }}</span>
          </p>
        </div>

        <!-- Tableau des notes -->
        <table
          style="width: 100%; border-collapse: collapse; margin-bottom: 30px"
        >
          <thead>
            <tr style="background-color: #4f46e5">
              <th
                style="
                  border: 1px solid #3730a3;
                  padding: 10px;
                  text-align: left;
                  color: white;
                  font-weight: bold;
                "
              >
                Matières
              </th>
              <th
                style="
                  border: 1px solid #3730a3;
                  padding: 10px;
                  text-align: center;
                  color: white;
                  font-weight: bold;
                "
              >
                Notes (/20)
              </th>
              <th
                style="
                  border: 1px solid #3730a3;
                  padding: 10px;
                  text-align: center;
                  color: white;
                  font-weight: bold;
                "
              >
                Crédits
              </th>
              <th
                style="
                  border: 1px solid #3730a3;
                  padding: 10px;
                  text-align: center;
                  color: white;
                  font-weight: bold;
                "
              >
                Mentions
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(matiere, index) in matieresNotes" :key="index">
              <td style="border: 1px solid #d1d5db; padding: 8px">
                {{ matiere.nom }}
              </td>
              <td
                style="
                  border: 1px solid #d1d5db;
                  padding: 8px;
                  text-align: center;
                  font-weight: bold;
                "
              >
                {{ matiere.note }}
              </td>
              <td
                style="
                  border: 1px solid #d1d5db;
                  padding: 8px;
                  text-align: center;
                "
              >
                {{ matiere.credits }}
              </td>
              <td
                style="
                  border: 1px solid #d1d5db;
                  padding: 8px;
                  text-align: center;
                "
              >
                {{ matiere.mention }}
              </td>
            </tr>
          </tbody>
          <tfoot style="background-color: #f3f4f6">
            <tr>
              <td
                colspan="3"
                style="
                  border: 1px solid #d1d5db;
                  padding: 10px;
                  text-align: right;
                  font-weight: bold;
                "
              >
                Moyenne générale :
              </td>
              <td
                style="
                  border: 1px solid #d1d5db;
                  padding: 10px;
                  text-align: center;
                  font-weight: bold;
                "
              >
                {{ moyenneGenerale }}
              </td>
            </tr>
            <tr>
              <td
                colspan="3"
                style="
                  border: 1px solid #d1d5db;
                  padding: 10px;
                  text-align: right;
                  font-weight: bold;
                "
              >
                Total crédits :
              </td>
              <td
                style="
                  border: 1px solid #d1d5db;
                  padding: 10px;
                  text-align: center;
                  font-weight: bold;
                "
              >
                {{ totalCredits }}
              </td>
            </tr>
          </tfoot>
        </table>

        <!-- Section décision -->
        <div
          style="
            margin-bottom: 30px;
            padding: 15px;
            border: 2px solid #4f46e5;
            border-radius: 4px;
            background-color: #eef2ff;
          "
        >
          <p style="text-align: center; font-size: 16px; margin: 0">
            <span style="font-weight: bold">DÉCISION DU JURY :</span>
            <span
              style="margin-left: 10px; color: #4f46e5; font-weight: bold"
              >{{ decision }}</span
            >
          </p>
        </div>

        <!-- Signatures -->
        <div
          style="
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;
            margin-top: 50px;
          "
        >
          <div style="text-align: center">
            <div
              style="
                border-top: 1px solid #9ca3af;
                padding-top: 5px;
                margin-top: 30px;
              "
            ></div>
            <p style="margin: 0; font-size: 12px">Le Chef de département</p>
          </div>
          <div style="text-align: center">
            <div
              style="
                border-top: 1px solid #9ca3af;
                padding-top: 5px;
                margin-top: 30px;
              "
            ></div>
            <p style="margin: 0; font-size: 12px">Le Directeur académique</p>
          </div>
          <div style="text-align: center">
            <div
              style="
                border-top: 1px solid #9ca3af;
                padding-top: 5px;
                margin-top: 30px;
              "
            ></div>
            <p style="margin: 0; font-size: 12px">Le Recteur</p>
          </div>
        </div>

        <!-- Date et lieu -->
        <div style="text-align: right; margin-top: 30px">
          <p style="color: #666; font-size: 12px; margin: 0">
            Fait à Cotonou, le {{ currentDate }}
          </p>
        </div>

        <!-- Pied de page -->
        <div
          style="
            margin-top: 30px;
            padding-top: 15px;
            border-top: 1px solid #d1d5db;
            text-align: center;
            font-size: 11px;
            color: #666;
          "
        >
          <p style="margin: 0">
            Ce document est officiel et tient lieu de justificatif académique
          </p>
          <p style="margin: 5px 0 0 0">
            www.universite-excellence.bj • contact@universite-excellence.bj
          </p>
        </div>
      </div>
    </div>

    <!-- Modal de modification -->
    <TransitionRoot appear :show="showEditModal" as="template">
      <Dialog as="div" class="relative z-50" @close="closeEditModal">
        <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="ease-in duration-200"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black/60" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <TransitionChild
              as="template"
              enter="ease-out duration-300"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="ease-in duration-200"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel
                class="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all"
              >
                <DialogTitle
                  class="text-lg font-medium text-gray-900 dark:text-white mb-4"
                >
                  Modifier les informations
                </DialogTitle>

                <div class="space-y-4">
                  <div>
                    <label
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Nom
                    </label>
                    <input
                      v-model="editForm.nom"
                      type="text"
                      class="w-full px-3 py-2 rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Prénom
                    </label>
                    <input
                      v-model="editForm.prenom"
                      type="text"
                      class="w-full px-3 py-2 rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Téléphone
                    </label>
                    <input
                      v-model="editForm.tel"
                      type="text"
                      class="w-full px-3 py-2 rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <div class="mt-6 flex justify-end gap-3">
                  <button
                    @click="closeEditModal"
                    class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    Annuler
                  </button>
                  <button
                    @click="saveEdit"
                    class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
                  >
                    Enregistrer
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Modal de désactivation -->
    <TransitionRoot appear :show="showDisableModal" as="template">
      <Dialog as="div" class="relative z-50" @close="closeDisableModal">
        <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="ease-in duration-200"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black/60" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <TransitionChild
              as="template"
              enter="ease-out duration-300"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="ease-in duration-200"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel
                class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all"
              >
                <div class="flex items-center gap-3 text-red-600 mb-4">
                  <svg
                    class="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <DialogTitle
                    class="text-lg font-medium text-gray-900 dark:text-white"
                  >
                    Désactiver le compte
                  </DialogTitle>
                </div>

                <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Êtes-vous sûr de vouloir désactiver le compte de
                  {{ studentName }} ? Cette action peut être réversible.
                </p>

                <div class="mb-4">
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Motif (optionnel)
                  </label>
                  <textarea
                    v-model="disableReason"
                    rows="3"
                    class="w-full px-3 py-2 rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                    placeholder="Raison de la désactivation..."
                  ></textarea>
                </div>

                <div class="flex justify-end gap-3">
                  <button
                    @click="closeDisableModal"
                    class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    Annuler
                  </button>
                  <button
                    @click="confirmDisable"
                    class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
                  >
                    Désactiver
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Modal de génération de relevé -->
    <TransitionRoot appear :show="showReleveModal" as="template">
      <Dialog as="div" class="relative z-50" @close="closeReleveModal">
        <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="ease-in duration-200"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black/60" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <TransitionChild
              as="template"
              enter="ease-out duration-300"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="ease-in duration-200"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel
                class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all"
              >
                <DialogTitle
                  class="text-lg font-medium text-gray-900 dark:text-white mb-4"
                >
                  Générer un relevé de notes
                </DialogTitle>

                <div class="space-y-4">
                  <Dropdown
                    v-model="form.periode_id"
                    :options="periodeOptions"
                    optionLabel="label"
                    optionValue="value"
                    filter
                    showClear
                    placeholder="Sélectionner une période"
                    class="w-full"
                  />
                </div>

                <div class="mt-6 flex justify-end gap-3">
                  <button
                    @click="closeReleveModal"
                    class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    Annuler
                  </button>
                  <button
                    @click="generateReleveDeNote"
                    class="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
                  >
                    Générer
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from "vue";
import { useRoute } from "vue-router";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionRoot,
  TransitionChild,
} from "@headlessui/vue";
import Breadcrumb from "~/components/Breadcrumb.vue";
import { useEtudiantStore } from "~~/stores/etudiant";
import { usePeriodeStore } from "~~/stores/periode";
import { useReleveNoteStore } from "~~/stores/relevenote";

const periodeStore = usePeriodeStore();
const relevenoteStore = useReleveNoteStore();

// Import dynamique de html2pdf avec fallback
let html2pdf = null;

if (process.client) {
  import("html2pdf.js")
    .then((module) => {
      html2pdf = module.default;
    })
    .catch((err) => {
      console.error("Erreur chargement html2pdf:", err);
    });
}

const route = useRoute();
const { $toastr } = useNuxtApp();
const etudiantStore = useEtudiantStore();

// Référence pour le template de relevé
const releveTemplate = ref(null);

const form = ref({
  periode_id: "",
});

// État
const activeTab = ref("info");
const showEditModal = ref(false);
const showDisableModal = ref(false);
const showReleveModal = ref(false);
const disableReason = ref("");

// Formulaire d'édition
const editForm = ref({
  nom: "",
  prenom: "",
  tel: "",
});

// Formulaire de relevé
const releveForm = ref({
  annee: "2023-2024",
  semestre: "Semestre 1",
});

// Données simulées pour les matières
const matieresNotes = ref([
  { nom: "Programmation Web", note: 16, credits: 4, mention: "Bien" },
  { nom: "Base de données", note: 14, credits: 4, mention: "Assez bien" },
  { nom: "Algorithmique", note: 15, credits: 3, mention: "Bien" },
  { nom: "Réseaux", note: 13, credits: 3, mention: "Assez bien" },
  { nom: "Anglais technique", note: 17, credits: 2, mention: "Très bien" },
  { nom: "Gestion de projet", note: 15, credits: 3, mention: "Bien" },
]);

// Données simulées pour les relevés
const simulatedReleves = ref([
  {
    id: 1,
    titre: "Relevé de notes - Licence 1",
    annee: "2021-2022",
    semestre: "Semestre 1",
    date_generation: "2022-01-15",
  },
  {
    id: 2,
    titre: "Relevé de notes - Licence 1",
    annee: "2021-2022",
    semestre: "Semestre 2",
    date_generation: "2022-06-20",
  },
  {
    id: 3,
    titre: "Relevé de notes - Licence 2",
    annee: "2022-2023",
    semestre: "Semestre 1",
    date_generation: "2023-01-10",
  },
  {
    id: 4,
    titre: "Relevé de notes - Licence 2",
    annee: "2022-2023",
    semestre: "Semestre 2",
    date_generation: "2023-06-15",
  },
]);

// Computed
const studentName = computed(() => {
  if (!etudiantStore.etudiant) return "";
  return `${etudiantStore.etudiant.prenom} ${etudiantStore.etudiant.nom}`;
});

const initials = computed(() => {
  if (!etudiantStore.etudiant) return "?";
  const prenom = etudiantStore.etudiant.prenom || "";
  const nom = etudiantStore.etudiant.nom || "";
  return (prenom.charAt(0) + nom.charAt(0)).toUpperCase() || "?";
});

const moyenneGenerale = computed(() => {
  const total = matieresNotes.value.reduce((acc, m) => acc + m.note, 0);
  return (total / matieresNotes.value.length).toFixed(2);
});

const totalCredits = computed(() => {
  return matieresNotes.value.reduce((acc, m) => acc + m.credits, 0);
});

const decision = computed(() => {
  const moyenne = parseFloat(moyenneGenerale.value);
  if (moyenne >= 16) return "Admis avec Félicitations";
  if (moyenne >= 14) return "Admis avec Mention Bien";
  if (moyenne >= 12) return "Admis avec Mention Assez Bien";
  if (moyenne >= 10) return "Admis";
  return "Ajourné";
});

const currentDate = computed(() => {
  return new Date().toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
});

// Fonctions utilitaires
const formatDate = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR");
};

// Gestion des modales
const openEditModal = () => {
  if (etudiantStore.etudiant) {
    editForm.value = {
      nom: etudiantStore.etudiant.nom || "",
      prenom: etudiantStore.etudiant.prenom || "",
      tel: etudiantStore.etudiant.tel || "",
    };
    showEditModal.value = true;
  }
};

const closeEditModal = () => {
  showEditModal.value = false;
};

const saveEdit = () => {
  // Logique de sauvegarde
  $toastr.success("Informations mises à jour");
  closeEditModal();
};

const openDisableModal = () => {
  showDisableModal.value = true;
};

const closeDisableModal = () => {
  showDisableModal.value = false;
  disableReason.value = "";
};

const confirmDisable = () => {
  $toastr.warning(
    `Compte désactivé${disableReason.value ? " : " + disableReason.value : ""}`,
  );
  closeDisableModal();
};

const openReleveModal = () => {
  showReleveModal.value = true;
};

const closeReleveModal = () => {
  showReleveModal.value = false;
  releveForm.value = {
    annee: "2023-2024",
    semestre: "Semestre 1",
  };
};

const generateReleveDeNote = async () => {
  try {
    await relevenoteStore.GenererReleveNotes(route.params.slug, form.value);
    $toastr.success("Releve de note généré avec succes");
  } catch (error) {
    $toastr.error(error.response.data.message);
  }
};

// Génération de relevé avec html2pdf
const generateReleve = async () => {
  if (!html2pdf) {
    $toastr.error("Bibliothèque de génération PDF non disponible");
    return;
  }

  try {
    const element = document.getElementById("releve-content");
    if (!element) {
      $toastr.error("Élément du relevé non trouvé");
      return;
    }

    const options = {
      margin: [0.5, 0.5, 0.5, 0.5],
      filename: `releve_${etudiantStore.etudiant?.matricule || "etudiant"}_${releveForm.value.semestre}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        letterRendering: true,
        useCORS: true,
        logging: false,
      },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };

    await html2pdf().set(options).from(element).save();
    $toastr.success("Relevé généré avec succès");
    closeReleveModal();
  } catch (error) {
    console.error("Erreur génération PDF:", error);
    $toastr.error("Erreur lors de la génération du PDF");
  }
};

// Génération de PDF pour un relevé existant
const generatePDF = async (releve) => {
  if (!html2pdf) {
    $toastr.error("Bibliothèque de génération PDF non disponible");
    return;
  }

  try {
    const element = document.getElementById("releve-content");
    if (!element) {
      $toastr.error("Élément du relevé non trouvé");
      return;
    }

    // Mettre à jour temporairement les données pour ce relevé
    const originalAnnee = releveForm.value.annee;
    const originalSemestre = releveForm.value.semestre;

    releveForm.value.annee = releve.annee;
    releveForm.value.semestre = releve.semestre;

    // Attendre que le DOM soit mis à jour
    await nextTick();

    const options = {
      margin: [0.5, 0.5, 0.5, 0.5],
      filename: `releve_${etudiantStore.etudiant?.matricule || "etudiant"}_${releve.semestre}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        letterRendering: true,
        useCORS: true,
        logging: false,
      },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    await html2pdf().set(options).from(element).save();

    // Restaurer les valeurs
    releveForm.value.annee = originalAnnee;
    releveForm.value.semestre = originalSemestre;
  } catch (error) {
    console.error("Erreur génération PDF:", error);
    $toastr.error("Erreur lors de la génération du PDF");
  }
};

const periodeOptions = computed(() =>
  periodeStore.periode.map((p) => ({
    label: p.nom,
    value: p.id,
  })),
);

// Chargement initial
onMounted(async () => {
  await etudiantStore.fetchEtudiant(route.params.slug);
  await periodeStore.fetchPeriodeByYear();
  await relevenoteStore.getReleveNotes(route.params.slug)
});
</script>

<style scoped>
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
.animate-spin {
  animation: spin 0.8s linear infinite;
}

/* Styles spécifiques pour le PDF */
.releve-pdf {
  background: white;
  font-family: Arial, sans-serif;
}

.releve-pdf table {
  border-collapse: collapse;
  width: 100%;
}

.releve-pdf th {
  background-color: #4f46e5;
  color: white;
  padding: 10px;
  text-align: left;
  border: 1px solid #3730a3;
}

.releve-pdf td {
  padding: 8px;
  border: 1px solid #d1d5db;
}

.releve-pdf tfoot td {
  background-color: #f3f4f6;
  font-weight: bold;
}
</style>
