<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      <!-- Header -->
      <div class="mb-6">
        <Breadcrumb
          :items="[
            { label: 'Tableau de bord', to: '/admin/dashboard' },
            { label: 'Frais scolaires', to: '/admin/negociations' },
            { label: 'Nouvel échéancier', to: null }
          ]"
          title="Créer un échéancier"
          title-class="text-2xl font-bold text-gray-900 dark:text-white"
        />
      </div>

      <!-- Message d'info -->
      <div class="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
        <div class="flex">
          <div class="flex-shrink-0">
            <i class="pi pi-info-circle text-blue-400 text-xl"></i>
          </div>
          <div class="ml-3">
            <p class="text-sm text-blue-700">
              Sélectionnez un étudiant dans la liste pour commencer
            </p>
          </div>
        </div>
      </div>

      <!-- Étape 1 : Sélection étudiant -->
      <div class="bg-white rounded-lg shadow mb-6">
        <div class="p-6">
          <div class="flex items-center mb-4">
            <span class="bg-indigo-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm mr-2">1</span>
            <h2 class="text-lg font-semibold">Sélectionner un étudiant</h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Dropdown étudiants PrimeVue -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Étudiant <span class="text-red-500">*</span>
              </label>
              <Dropdown
                v-model="selectedStudent"
                :options="etudiantsList"
                optionLabel="label"
                optionValue="value"
                placeholder="Sélectionnez un étudiant"
                class="w-full"
                :filter="true"
                filterPlaceholder="Rechercher un étudiant..."
                :showClear="true"
                @change="handleStudentChange"
              >
                <template #value="slotProps">
                  <div v-if="slotProps.value" class="flex items-center">
                    <div class="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-medium mr-2">
                      {{ getInitialsFromValue(slotProps.value) }}
                    </div>
                    <div>
                      <div>{{ slotProps.value.nom }} {{ slotProps.value.prenom }}</div>
                      <div class="text-xs text-gray-500">{{ slotProps.value.matricule }}</div>
                    </div>
                  </div>
                  <span v-else>{{ slotProps.placeholder }}</span>
                </template>
              </Dropdown>
              
              <div v-if="loadingEtudiants" class="flex items-center mt-2 text-gray-500">
                <i class="pi pi-spin pi-spinner mr-2"></i>
                <span>Chargement des étudiants...</span>
              </div>
            </div>

            <!-- Infos étudiant sélectionné avec bourse -->
            <div v-if="selectedStudent" class="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
              <h3 class="text-sm font-medium text-blue-800 mb-3 flex items-center">
                <i class="pi pi-graduation-cap mr-2"></i>
                Étudiant sélectionné
              </h3>
              <div class="flex items-start">
                <div class="w-12 h-12 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold mr-3 shadow-md">
                  {{ getInitialsFromValue(selectedStudent) }}
                </div>
                <div class="flex-1">
                  <div class="font-semibold text-gray-900">{{ selectedStudent.nom }} {{ selectedStudent.prenom }}</div>
                  <div class="text-sm text-gray-600">{{ selectedStudent.matricule }}</div>
                  <div class="flex mt-2 space-x-2">
                    <Tag :value="selectedStudent.niveau || 'Niveau'" severity="info" />
                    <Tag :value="selectedStudent.filiere || 'Filière'" severity="warning" />
                  </div>
                  
                  <!-- Aperçu de la bourse si existante -->
                  <div v-if="boursesEtudiant.length > 0 && !bourseLoading" class="mt-3 pt-3 border-t border-blue-200">
                    <p class="text-xs font-medium text-blue-600 mb-2 flex items-center">
                      <i class="pi pi-star-fill text-yellow-500 mr-1 text-xs"></i>
                      Bourse active
                    </p>
                    <div class="bg-white/80 rounded-lg p-2 text-sm">
                      <div class="font-medium text-gray-800">{{ boursesEtudiant[0].nom }}</div>
                      <div class="text-xs text-gray-600 mt-1">
                        {{ boursesEtudiant[0].type === 'pourcentage' 
                          ? `${boursesEtudiant[0].valeur}% de réduction` 
                          : formatMontant(boursesEtudiant[0].valeur) }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div v-else class="bg-gray-50 p-4 rounded-lg flex items-center justify-center text-gray-400">
              <i class="pi pi-user mr-2 text-xl"></i>
              <span>Aucun étudiant sélectionné</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Étape 2 : Bourses -->
      <div v-if="selectedStudent" class="bg-white rounded-lg shadow mb-6">
        <div class="p-6">
          <div class="flex items-center mb-4">
            <span class="bg-indigo-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm mr-2">2</span>
            <h2 class="text-lg font-semibold">Bourse de l'étudiant</h2>
          </div>

          <!-- Loading -->
          <div v-if="bourseLoading" class="flex justify-center py-8">
            <ProgressSpinner style="width: 40px; height: 40px" strokeWidth="4" />
            <span class="ml-3 text-gray-600">Vérification des bourses...</span>
          </div>

          <!-- Liste bourses -->
          <div v-else-if="boursesEtudiant.length" class="space-y-4">
            <Message severity="success" :closable="false" class="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
              <div class="flex items-center">
                <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                  <i class="pi pi-check text-white text-sm"></i>
                </div>
                <div>
                  <span class="font-medium">Félicitations !</span>
                  <p class="text-sm mt-1">Cet étudiant bénéficie de {{ boursesEtudiant.length }} bourse(s)</p>
                </div>
              </div>
            </Message>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                v-for="bourse in boursesEtudiant"
                :key="bourse.id"
                @click="selectBourse(bourse)"
                class="relative overflow-hidden rounded-xl border-2 transition-all duration-300 cursor-pointer group"
                :class="selectedBourse?.id === bourse.id 
                  ? 'border-indigo-500 shadow-lg shadow-indigo-100' 
                  : 'border-gray-200 hover:border-indigo-300 hover:shadow-md'"
              >
                <!-- Badge décoratif -->
                <div class="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-yellow-400 to-amber-500 transform rotate-45 translate-x-8 -translate-y-8"></div>
                
                <div class="p-5">
                  <div class="flex justify-between items-start mb-3">
                    <div class="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-md">
                      <i class="pi pi-star-fill text-sm"></i>
                    </div>
                    <Tag 
                      :value="bourse.type === 'pourcentage' ? 'Pourcentage' : 'Montant fixe'" 
                      :severity="bourse.type === 'pourcentage' ? 'info' : 'warning'"
                      class="text-xs"
                    />
                  </div>
                  
                  <h3 class="font-semibold text-gray-900 text-lg mb-1">{{ bourse.nom }}</h3>
                  <p class="text-sm text-gray-500 mb-3">{{ bourse.description || 'Bourse étudiante' }}</p>
                  
                  <div class="flex items-center justify-between">
                    <div>
                      <span class="text-xs text-gray-400">Valeur</span>
                      <p class="text-xl font-bold text-green-600">
                        {{ bourse.type === 'pourcentage' 
                          ? bourse.valeur + '%' 
                          : formatMontant(bourse.valeur) }}
                      </p>
                    </div>
                    
                    <!-- Checkbox de sélection -->
                    <div class="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors"
                      :class="selectedBourse?.id === bourse.id 
                        ? 'bg-indigo-500 border-indigo-500 text-white' 
                        : 'border-gray-300 group-hover:border-indigo-300'">
                      <i v-if="selectedBourse?.id === bourse.id" class="pi pi-check text-xs"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Pas de bourse -->
          <div v-else class="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 p-8 text-center rounded-xl">
            <div class="absolute top-0 right-0 w-32 h-32 bg-gray-200 rounded-full blur-3xl opacity-30"></div>
            <div class="relative">
              <div class="w-20 h-20 mx-auto bg-gray-200 rounded-full flex items-center justify-center mb-4">
                <i class="pi pi-money-bill text-4xl text-gray-400"></i>
              </div>
              <h3 class="text-lg font-medium text-gray-700 mb-2">Aucune bourse</h3>
              <p class="text-gray-500 max-w-md mx-auto">
                Cet étudiant ne bénéficie pas de bourse pour le moment. 
                Vous pouvez continuer la création de l'échéancier sans appliquer de réduction.
              </p>
              <Button
                @click="continueWithoutBourse"
                label="Continuer sans bourse"
                icon="pi pi-arrow-right"
                class="p-button-outlined p-button-secondary mt-4"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Étape 3 : Sélection des frais -->
      <div v-if="selectedStudent" class="bg-white rounded-lg shadow mb-6">
        <div class="p-6">
          <div class="flex items-center mb-4">
            <span class="bg-indigo-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm mr-2">3</span>
            <h2 class="text-lg font-semibold">Frais de scolarité</h2>
          </div>

          <!-- Loading -->
          <div v-if="fraisLoading" class="flex justify-center py-8">
            <ProgressSpinner style="width: 40px; height: 40px" strokeWidth="4" />
            <span class="ml-3 text-gray-600">Chargement des frais...</span>
          </div>

          <!-- Message si aucun frais -->
          <div v-else-if="fraisDisponibles.length === 0" class="text-center py-8 bg-orange-50 rounded-xl">
            <i class="pi pi-exclamation-triangle text-4xl text-orange-400 mb-3"></i>
            <p class="text-orange-600">Aucun frais disponible pour cet étudiant</p>
            <p class="text-sm text-orange-500 mt-1">Vérifiez les paramètres de frais pour son niveau/filière</p>
          </div>

          <!-- Liste des frais -->
          <div v-else class="space-y-4">
            <Message severity="info" :closable="false" class="bg-blue-50 border-blue-200">
              <div class="flex items-center">
                <i class="pi pi-info-circle text-blue-500 mr-2"></i>
                <span>Sélectionnez les frais à appliquer pour <strong>{{ selectedStudent.prenom }} {{ selectedStudent.nom }}</strong></span>
              </div>
            </Message>

            <div class="grid grid-cols-1 gap-4">
              <div
                v-for="frais in fraisDisponibles"
                :key="frais.id"
                @click="selectFrais(frais)"
                class="relative overflow-hidden rounded-xl border-2 transition-all duration-300 cursor-pointer"
                :class="selectedFrais?.id === frais.id 
                  ? 'border-indigo-500 bg-indigo-50/50 shadow-lg shadow-indigo-100' 
                  : 'border-gray-200 hover:border-indigo-300 hover:shadow-md'"
              >
                <div class="p-5">
                  <div class="flex justify-between items-start mb-3">
                    <div class="flex items-center">
                      <div class="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-md mr-3">
                        <i class="pi pi-dollar text-sm"></i>
                      </div>
                      <div>
                        <h3 class="font-semibold text-gray-900">{{ frais.niveau?.libelle || 'Frais' }}</h3>
                        <p class="text-xs text-gray-500">
                          {{ frais.filiere?.nom || 'Toutes filières' }} 
                          <span v-if="frais.genre" class="ml-2">({{ frais.genre }})</span>
                        </p>
                      </div>
                    </div>
                    <Tag value="Frais scolaire" severity="info" class="text-xs" />
                  </div>
                  
                  <div class="flex items-center justify-between mt-4">
                    <div>
                      <span class="text-xs text-gray-400">Montant initial</span>
                      <p class="text-2xl font-bold text-gray-900">{{ formatMontant(frais.montant) }}</p>
                    </div>
                    
                    <div v-if="frais.tranches?.length > 0" class="text-right">
                      <span class="text-xs text-gray-400">Tranches disponibles</span>
                      <p class="text-sm font-medium text-indigo-600">{{ frais.tranches.length }} tranche(s)</p>
                    </div>

                    <!-- Radio de sélection -->
                    <div class="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors"
                      :class="selectedFrais?.id === frais.id 
                        ? 'bg-indigo-500 border-indigo-500 text-white' 
                        : 'border-gray-300'">
                      <i v-if="selectedFrais?.id === frais.id" class="pi pi-check text-xs"></i>
                    </div>
                  </div>

                  <!-- Description si existante -->
                  <p v-if="frais.description" class="text-xs text-gray-500 mt-3 italic">
                    "{{ frais.description }}"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Étape 4 : Configuration de l'échéancier -->
      <div v-if="selectedStudent && selectedFrais" class="bg-white rounded-lg shadow">
        <div class="p-6">
          <div class="flex items-center mb-4">
            <span class="bg-indigo-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm mr-2">4</span>
            <h2 class="text-lg font-semibold">Configuration de l'échéancier</h2>
          </div>

          <!-- Résumé frais et bourse -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div class="p-4 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl border border-indigo-200">
              <div class="flex items-start">
                <div class="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white mr-3">
                  <i class="pi pi-dollar text-sm"></i>
                </div>
                <div>
                  <p class="text-xs text-indigo-600">Frais sélectionnés</p>
                  <p class="font-semibold text-gray-900">{{ selectedFrais.niveau?.libelle || 'Frais' }}</p>
                  <p class="text-sm text-gray-600 mt-1">Montant: {{ formatMontant(selectedFrais.montant) }}</p>
                </div>
              </div>
            </div>

            <div v-if="selectedBourse" class="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
              <div class="flex items-start">
                <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white mr-3">
                  <i class="pi pi-tag text-sm"></i>
                </div>
                <div>
                  <p class="text-xs text-green-600">Bourse appliquée</p>
                  <p class="font-semibold text-gray-900">{{ selectedBourse.nom }}</p>
                  <p class="text-sm text-green-600 mt-1">
                    Réduction: {{ selectedBourse.type === 'pourcentage' 
                      ? selectedBourse.valeur + '%' 
                      : formatMontant(selectedBourse.valeur) }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div class="space-y-6">
            <!-- Année scolaire et type -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Année scolaire <span class="text-red-500">*</span>
                </label>
                <Dropdown
                  v-model="form.annee_scolaire_id"
                  :options="anneesScolaires"
                  optionLabel="libelle"
                  optionValue="id"
                  placeholder="Sélectionner une année"
                  class="w-full"
                  :filter="true"
                  :showClear="true"
                >
                  <template #option="slotProps">
                    <div class="flex items-center p-2">
                      <i class="pi pi-calendar mr-2 text-gray-400"></i>
                      <span>{{ slotProps.option.libelle }}</span>
                    </div>
                  </template>
                </Dropdown>
                <small v-if="anneesScolaires.length === 0" class="text-yellow-600 block mt-1">
                  <i class="pi pi-exclamation-triangle mr-1"></i>
                  Aucune année scolaire disponible
                </small>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Type de paiement <span class="text-red-500">*</span>
                </label>
                <div class="grid grid-cols-2 gap-3">
                  <button
                    v-for="option in typePaiementOptions"
                    :key="option.value"
                    type="button"
                    @click="form.type_paiement = option.value"
                    class="relative flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all duration-200 h-[75px]"
                    :class="form.type_paiement === option.value
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm'
                      : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'"
                  >
                    <!-- Badge indicateur -->
                    <span 
                      class="absolute -top-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider transition-colors"
                      :class="form.type_paiement === option.value ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-400'"
                    >
                      {{ option.value === 'negociation' ? 'Libre' : 'Standard' }}
                    </span>
                    
                    <span class="text-sm font-bold leading-tight">{{ option.label }}</span>
                    <i v-if="form.type_paiement === option.value" class="pi pi-check-circle absolute top-2 right-2 text-indigo-600 text-xs"></i>
                  </button>
                </div>
              </div>
            </div>

            <!-- Fréquence pour tranches globales -->
            <div v-if="form.type_paiement === 'tranches_globales'">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Fréquence de paiement <span class="text-red-500">*</span>
              </label>
              <div class="flex flex-wrap gap-2">
                <Button
                  v-for="freq in frequenceOptions"
                  :key="freq.value"
                  @click="form.frequence_paiement = freq.value"
                  :label="freq.label"
                  :class="form.frequence_paiement === freq.value
                    ? 'p-button-primary'
                    : 'p-button-outlined p-button-secondary'"
                  class="flex-1"
                />
              </div>
            </div>

            <!-- Section Échéances (Négociation ou Aperçu Global) -->
            <div v-if="form.type_paiement === 'negociation' || (form.type_paiement === 'tranches_globales' && form.echeances.length > 0)">
              <div class="flex justify-between items-center mb-4">
                <h3 class="font-medium text-gray-900">
                  {{ form.type_paiement === 'negociation' ? 'Échéances personnalisées' : 'Aperçu des tranches' }}
                </h3>
                <div v-if="form.type_paiement === 'negociation'" class="space-x-2">
                  <Button
                    @click="openAutoGeneration"
                    icon="pi pi-cog"
                    label="Générer auto"
                    class="p-button-outlined p-button-sm"
                  />
                  <Button
                    @click="addEcheance"
                    icon="pi pi-plus"
                    label="Ajouter"
                    class="p-button-primary p-button-sm"
                  />
                </div>
                <div v-else class="text-xs text-gray-500 italic">
                  Les tranches par défaut ne sont pas modifiables individuellement
                </div>
              </div>

              <div class="space-y-5">
                 <Card
                   v-for="(echeance, index) in form.echeances"
                   :key="echeance.id || index"
                   class="border-none shadow-sm relative group"
                   :class="isLocked(echeance) ? 'bg-gray-200 opacity-80' : 'bg-gray-50'"
                 >
                  <template #content>
                    <div class="flex items-start space-x-4 w-full">
                      <span class="bg-indigo-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm flex-shrink-0 shadow-md">
                        {{ index + 1 }}
                      </span>
                      
                        <div class="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-5 items-end">
                          <div class="field xl:col-span-3">
                            <span class="text-[10px] text-gray-500 uppercase font-bold ml-1 mb-1 block">Désignation / Libellé</span>
                            <InputText
                              v-model="echeance.libelle"
                              placeholder="ex: Tranche 1"
                              class="w-full font-bold"
                              :disabled="isLocked(echeance) || form.type_paiement === 'tranches_globales'"
                            />
                          </div>
                          
                          <div class="field xl:col-span-3">
                            <span class="text-[10px] text-gray-500 uppercase font-bold ml-1 mb-1 block">Montant attendu</span>
                            <InputNumber
                              v-model="echeance.montant"
                              placeholder="0"
                              class="w-full"
                              mode="currency"
                              currency="XOF"
                              locale="fr-FR"
                              :disabled="isLocked(echeance) || form.type_paiement === 'tranches_globales'"
                            />
                          </div>

                          <div v-if="existingNegociation && echeance.montant_paye > 0" class="field xl:col-span-3">
                            <span class="text-[10px] text-green-600 uppercase font-bold ml-1 mb-1 block">Règlement reçu</span>
                            <div class="h-[42px] flex items-center justify-between px-3 bg-white rounded-xl border border-green-200 text-green-700 shadow-sm relative overflow-hidden group/pay">
                                <div class="absolute left-0 top-0 w-1 h-full bg-green-500"></div>
                                <span class="font-bold text-sm whitespace-nowrap mr-1">{{ formatMontant(echeance.montant_paye) }}</span>
                                <div class="flex-shrink-0 px-1.5 py-0.5 bg-green-100 text-green-700 border border-green-200 rounded text-[9px] font-black uppercase tracking-tighter">
                                    {{ echeance.montant_paye >= echeance.montant ? 'Soldé' : 'Partiel' }}
                                </div>
                            </div>
                          </div>

                          <div class="field" :class="(existingNegociation && echeance.montant_paye > 0) ? 'xl:col-span-3' : 'xl:col-span-12 xl:col-span-6'">
                            <span class="text-[10px] text-gray-500 uppercase font-bold ml-1 mb-1 block">Date limite de paiement</span>
                            <Calendar
                              v-model="echeance.date_limite"
                              placeholder="JJ/MM/AAAA"
                              class="w-full"
                              :minDate="new Date()"
                              dateFormat="dd/mm/yy"
                              showIcon
                              :disabled="isLocked(echeance) || form.type_paiement === 'tranches_globales'"
                            />
                          </div>
                        </div>
                        <div v-if="form.type_paiement === 'negociation'" class="flex-shrink-0">
                           <Button
                                @click="removeEcheance(index)"
                                severity="danger"
                                rounded
                                type="button"
                                :disabled="isLocked(echeance)"
                                v-tooltip.left="isLocked(echeance) ? 'Impossible de supprimer une tranche déjà payée' : 'Supprimer cette tranche'"
                           >
                                <ButtonDelete class="text-white w-5 h-5" />
                           </Button>
                        </div>
                    </div>
                  </template>
                </Card>

                <div v-if="!form.echeances.length" class="text-center py-8 text-gray-500">
                  <i class="pi pi-calendar-times text-4xl text-gray-300 mb-3"></i>
                  <p>Aucune échéance ajoutée</p>
                  <p class="text-sm text-gray-400 mt-1">Cliquez sur "Ajouter" pour commencer</p>
                </div>
              </div>
            </div>
            
            <!-- Ventilation du montant total -->
            <div v-if="form.type_paiement === 'negociation' && form.echeances.length > 0" class="mt-4 p-4 rounded-xl border border-blue-100 bg-blue-50/50 mb-4 transition-all">
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                        <span class="text-xs font-semibold text-blue-600 uppercase tracking-wider">État de la répartition</span>
                        <div class="flex items-center gap-2 mt-1">
                            <i :class="resteARepartir === 0 ? 'pi pi-check-circle text-green-500' : 'pi pi-info-circle text-blue-500'"></i>
                            <span class="text-sm font-medium text-gray-700">
                                {{ resteARepartir === 0 ? 'Répartition complète' : 'Montant restant à répartir' }}
                            </span>
                        </div>
                    </div>
                    
                    <div class="flex flex-col items-end">
                        <span class="text-xs text-gray-500 mb-1">{{ resteARepartir < 0 ? 'Surplus' : 'Reste' }}</span>
                        <span :class="resteARepartir === 0 ? 'text-green-600' : (resteARepartir > 0 ? 'text-blue-600' : 'text-red-600')" class="text-2xl font-black tabular-nums">
                            {{ formatMontant(resteARepartir) }}
                        </span>
                    </div>
                </div>
            </div>

            <!-- Résumé -->
            <div class="border-t pt-4">
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card class="bg-gradient-to-br from-green-50 to-emerald-50">
                  <template #content>
                    <span class="text-sm text-gray-600">Montant total</span>
                    <p class="text-xl font-bold text-green-600">{{ formatMontant(totalMontant) }}</p>
                  </template>
                </Card>
                
                <Card class="bg-gradient-to-br from-blue-50 to-indigo-50">
                  <template #content>
                    <span class="text-sm text-gray-600">Nombre d'échéances</span>
                    <p class="text-xl font-bold text-blue-600">{{ form.echeances.length }}</p>
                  </template>
                </Card>
                
                <Card class="bg-gradient-to-br from-purple-50 to-pink-50">
                  <template #content>
                    <span class="text-sm text-gray-600">Moyenne</span>
                    <p class="text-xl font-bold text-purple-600">{{ formatMontant(moyenneParEcheance) }}</p>
                  </template>
                </Card>
              </div>

              <!-- Aperçu avec bourse -->
              <div v-if="selectedBourse && selectedBourse.type === 'pourcentage'" class="mt-4 p-3 bg-gray-50 rounded-lg text-sm">
                <div class="flex justify-between items-center">
                  <span class="text-gray-600">Montant après réduction ({{ selectedBourse.valeur }}%) :</span>
                  <span class="font-bold text-green-600">{{ formatMontant(montantApresBourse) }}</span>
                </div>
              </div>
            </div>

            <!-- Boutons -->
            <div class="flex justify-end space-x-3 pt-4 border-t">
              <Button
                @click="resetForm"
                label="Annuler"
                icon="pi pi-times"
                class="p-button-outlined"
              />
              <Button
                @click="submitForm"
                :loading="isSubmitting"
                :label="isSubmitting ? (existingNegociation ? 'Mise à jour...' : 'Création...') : (existingNegociation ? 'Mettre à jour' : 'Enregistrer')"
                :icon="isSubmitting ? 'pi pi-spin pi-spinner' : 'pi pi-check'"
                class="p-button-primary"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Dialog génération auto - MODIFIÉ -->
      <Dialog
        v-model:visible="showAutoGeneration"
        header="Génération automatique"
        :modal="true"
        class="p-fluid w-full md:w-3/4 lg:w-1/2"
      >
        <div class="space-y-4">
          <div class="field">
            <label class="font-medium block mb-2">Fréquence de paiement</label>
            <div class="flex space-x-2">
              <Button
                v-for="freq in frequenceOptions"
                :key="freq.value"
                @click="autoGenFrequence = freq.value"
                :label="freq.label"
                :class="autoGenFrequence === freq.value
                  ? 'p-button-primary'
                  : 'p-button-outlined'"
                class="flex-1"
              />
            </div>
          </div>

          <!-- Montant total (pré-rempli et désactivé) -->
          <div class="field">
            <label class="font-medium block mb-2">Montant total</label>
            <div class="p-inputgroup">
              <span class="p-inputgroup-addon bg-gray-100">
                <i class="pi pi-dollar"></i>
              </span>
              <InputNumber
                v-model="autoGenMontant"
                :disabled="true"
                class="w-full bg-gray-50"
                mode="currency"
                currency="XOF"
                locale="fr-FR"
              />
            </div>
            <small class="text-gray-500 block mt-1">
              Montant basé sur le frais sélectionné {{ selectedBourse ? '(avec réduction)' : '' }}
            </small>
          </div>

          <div class="field">
            <label class="font-medium block mb-2">Date de début</label>
            <Calendar
              v-model="autoGenDateDebut"
              class="w-full"
              :minDate="new Date()"
              dateFormat="dd/mm/yy"
            />
          </div>

          <Message severity="info" class="bg-blue-50 border-blue-200">
            <div class="flex items-center">
              <i class="pi pi-info-circle text-blue-500 mr-2"></i>
              <span>
                <strong>{{ nombreEcheancesAuto }}</strong> échéances de 
                <strong>{{ formatMontant(montantParEcheanceAuto) }}</strong> seront générées
              </span>
            </div>
          </Message>
        </div>

        <template #footer>
          <Button
            @click="showAutoGeneration = false"
            label="Annuler"
            icon="pi pi-times"
            class="p-button-outlined"
          />
          <Button
            @click="generateEcheances"
            label="Générer"
            icon="pi pi-cog"
            class="p-button-primary"
            autofocus
          />
        </template>
      </Dialog>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import Breadcrumb from '~/components/Breadcrumb.vue'
import { useNegociationStore } from '~~/stores/negociation'
import { useAnneScolaireStore } from '~~/stores/annee-scolaire'
import { useEtudiantStore } from '~~/stores/etudiant'
import { useBourseStore } from '~~/stores/bourse'
import { useFraisStore } from '~~/stores/frais-de-scolarite'

// PrimeVue components
import Dropdown from 'primevue/dropdown'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Calendar from 'primevue/calendar'
import Card from 'primevue/card'
import Message from 'primevue/message'
import Tag from 'primevue/tag'
import Dialog from 'primevue/dialog'
import ProgressSpinner from 'primevue/progressspinner'
import ButtonDelete from '~/components/ui/buttonDelete.vue'

const { $toastr, $swal } = useNuxtApp()

// Stores
const negociationStore = useNegociationStore()
const anneeStore = useAnneScolaireStore()
const etudiantStore = useEtudiantStore()
const bourseStore = useBourseStore()
const fraisStore = useFraisStore()

// États
const selectedStudent = ref(null)
const etudiantsList = ref([])
const loadingEtudiants = ref(false)
const boursesEtudiant = ref([])
const selectedBourse = ref(null)
const bourseLoading = ref(false)
const fraisDisponibles = ref([])
const selectedFrais = ref(null)
const fraisLoading = ref(false)
const isSubmitting = ref(false)
const showAutoGeneration = ref(false)
const autoGenFrequence = ref('trimestriel')
const autoGenMontant = ref(null)
const autoGenDateDebut = ref(new Date())

// Formulaire
const form = reactive({
  etudiant_id: null,
  frais_scolarite_id: null,
  annee_scolaire_id: null,
  type_paiement: 'negociation',
  frequence_paiement: 'trimestriel',
  bourse_etudiant_id: null,
  commentaire: null,
  echeances: []
})

// Options
const typePaiementOptions = [
  { label: 'Tranches par défaut', value: 'tranches_globales' },
  { label: 'Négociation personnalisée', value: 'negociation' }
]

const frequenceOptions = [
  { label: 'Annuel (1 fois)', value: 'annuel' },
  { label: 'Trimestriel (3 fois)', value: 'trimestriel' },
  { label: 'Bimestriel (4 fois)', value: 'bimestriel' }
]

// Computed
const anneesScolaires = computed(() => {
  if (!anneeStore.annneescolaires || !Array.isArray(anneeStore.annneescolaires)) {
    return []
  }
  return anneeStore.annneescolaires.map(a => ({
    id: a.id,
    libelle: a.nom
  }))
})

const totalMontant = computed(() => {
  return form.echeances.reduce((sum, e) => sum + (Number(e.montant) || 0), 0)
})

const moyenneParEcheance = computed(() => {
  if (!form.echeances.length) return 0
  return totalMontant.value / form.echeances.length
})

const resteARepartir = computed(() => {
  const attendu = montantApresBourse.value || 0
  const actuel = totalMontant.value
  return attendu - actuel
})

function isLocked(echeance) {
  if (!echeance) return false
  const paye = parseFloat(echeance.montant_paye || 0)
  const isPaid = paye > 0 || echeance.statut === 'paye' || echeance.statut === 'partiel'
  return isPaid
}

// const montantApresBourse = computed(() => {
//   if (!selectedFrais) return 0
  
//   let montant = selectedFrais.montant
  
//   if (selectedBourse) {
//     if (selectedBourse.type === 'pourcentage') {
//       montant = montant * (1 - selectedBourse.valeur / 100)
//     } else {
//       montant = Math.max(0, montant - selectedBourse.valeur)
//     }
//   }
  
//   return montant
// })

const montantApresBourse = computed(() => {
  console.log('=== DÉBUG MONTANT APRÈS BOURSE ===')
  console.log('1. selectedFrais:', selectedFrais.value)
  console.log('2. selectedBourse:', selectedBourse.value)
  
  if (!selectedFrais.value) {
    console.log('3. Pas de frais sélectionné → retour 0')
    return 0
  }
  
  let montant = selectedFrais.value.montant
  
  if (selectedBourse.value) {
   
    
    if (selectedBourse.value.type === 'pourcentage') {
     
      const pourcentage = selectedBourse.value.valeur
      const pourcentageNumerique = parseFloat(pourcentage) 
      
      const facteurReduction = 1 - (pourcentageNumerique / 100)
      
      montant = montant * facteurReduction
    } else {
      montant = Math.max(0, montant - selectedBourse.value.valeur)
    }
  } 
 
  
  return montant
})

const nombreEcheancesAuto = computed(() => {
  const map = { mensuel: 10, bimestriel: 4, trimestriel: 3, annuel: 1 }
  return map[autoGenFrequence.value] || 0
})

const montantParEcheanceAuto = computed(() => {
  const montantTotal = autoGenMontant.value || 0
  const nombre = nombreEcheancesAuto.value
  return nombre > 0 ? montantTotal / nombre : 0
})

const canSubmit = computed(() => {
  if (!selectedStudent.value || !selectedFrais.value || !form.annee_scolaire_id) {
    return false
  }
  
  if (form.type_paiement === 'negociation') {
    return form.echeances.length > 0 &&
      form.echeances.every(e => e.libelle?.trim() && e.montant > 0 && e.date_limite)
  }

  
  return form.frequence_paiement 
})

// Watch étudiant
watch(selectedStudent, async (newStudent) => {
  if (newStudent) {
    form.etudiant_id = newStudent.id
    await Promise.all([
      loadBourses(newStudent.id),
      loadFraisDisponibles(newStudent),
      checkExistingNegociation(newStudent.id)
    ])
  } else {
    resetSelection()
  }
})

// Watch frais sélectionné
watch(selectedFrais, (newFrais) => {
  if (newFrais) {
    form.frais_scolarite_id = newFrais.id
  } else {
    form.frais_scolarite_id = null
  }
})

// Watch bourse sélectionnée
watch(selectedBourse, (newBourse) => {
  if (newBourse) {
    form.bourse_etudiant_id = newBourse.id
  } else {
    form.bourse_etudiant_id = null
  }
})

// Watch année scolaire pour recharger la négociation si nécessaire
watch(() => form.annee_scolaire_id, async (newAnnee) => {
  if (newAnnee && selectedStudent.value) {
    await checkExistingNegociation(selectedStudent.value.id)
  }
})

// NOUVEAU: Watch pour mettre à jour autoGenMontant quand le frais ou la bourse change
watch([selectedFrais, selectedBourse], () => {
  if (selectedFrais.value) {
    autoGenMontant.value = montantApresBourse.value || selectedFrais.value.montant
  }
}, { immediate: true })

// Watch pour charger les tranches par défaut ou gérer le type de paiement
watch([selectedFrais, () => form.type_paiement], ([newFrais, newType]) => {
  // Protection CRITIQUE : Ne JAMAIS écraser si une négociation existe déjà ou est en cours de chargement
  if (loadingExisting.value || existingNegociation.value) return

  if (newFrais && (newType === 'tranches_globales' || (newType === 'negociation' && form.echeances.length === 0))) {
    if (newFrais.tranches && newFrais.tranches.length > 0) {
      // Calcul du coefficient de bourse pour l'aperçu
      let coeff = 1
      if (selectedBourse.value) {
        if (selectedBourse.value.type === 'pourcentage') {
          coeff = 1 - (selectedBourse.value.valeur / 100)
        }
      }

      form.echeances = newFrais.tranches.map(t => ({
        libelle: t.libelle,
        montant: Math.round(parseFloat(t.montant) * coeff),
        date_limite: t.date_limite ? new Date(t.date_limite) : null,
        montant_paye: 0,
        statut: 'en_attente',
        ordre: t.ordre
      }))
    }
  }
})

// Initialisation
onMounted(async () => {
  try {
    loadingEtudiants.value = true
    await Promise.all([
      anneeStore.fetchAnneeScolaire(),
      etudiantStore.fetchEtudiants({ limit: 1000 }),
      fraisStore.fetchFrais() 
    ])
    
    // Sélectionner automatiquement l'année scolaire active
    if (anneeStore.activeAnneeScolaire) {
      form.annee_scolaire_id = anneeStore.activeAnneeScolaire.id
    } else if (anneeStore.annees && anneeStore.annees.length > 0) {
      const active = anneeStore.annees.find(a => a.active)
      if (active) form.annee_scolaire_id = active.id
    }
    
    // Formater la liste des étudiants
    etudiantsList.value = (etudiantStore.etudiants || []).map(etudiant => ({
      label: `${etudiant.nom} ${etudiant.prenom} - ${etudiant.matricule}`,
      value: {
        id: etudiant.id,
        nom: etudiant.nom,
        prenom: etudiant.prenom,
        matricule: etudiant.matricule,
        niveau: etudiant.dernier_groupe?.niveau?.libelle,
        niveau_id: etudiant.dernier_groupe?.niveau?.id,
        filiere: etudiant.dernier_groupe?.filiere?.nom,
        filiere_id: etudiant.dernier_groupe?.filiere?.id,
        genre: etudiant.genre
      }
    }))
    
    $swal.fire({
      title: 'Chargement réussi',
      text: 'Les données ont été récupérées.',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false,
      toast: true,
      position: 'top-end'
    })
  } catch (error) {
    console.error('Erreur chargement:', error)
    $swal.fire({
      title: 'Erreur',
      text: 'Échec du chargement des données initiales.',
      icon: 'error',
      confirmButtonColor: '#6366f1'
    })
  } finally {
    loadingEtudiants.value = false
  }
})

// Méthodes
function handleStudentChange(event) {
  // Le v-model gère déjà
  console.log('Étudiant sélectionné:', event.value)
}

const existingNegociation = ref(null)

const loadingExisting = ref(false)

async function checkExistingNegociation(etudiantId) {
  existingNegociation.value = null
  loadingExisting.value = true
  try {
    const result = await negociationStore.fetchNegociationByEtudiant(etudiantId, form.annee_scolaire_id)
    if (result && result.success && result.data) {
      existingNegociation.value = result.data
      const data = result.data
      
      // Mettre à jour les montants globaux
      if (data.frais_scolarite) {
          form.frais_scolarite_id = data.frais_scolarite_id
          // Forcer le montant après bourse si disponible
          montantApresBourse.value = parseFloat(data.montant_apres_bourse || 0)
          autoGenMontant.value = montantApresBourse.value
      }
      // Mettre à jour l'année scolaire SEULEMENT si non encore définie (au chargement initial)
      if (data.annee_scolaire_id && !form.annee_scolaire_id) {
        form.annee_scolaire_id = data.annee_scolaire_id
      }
      
      form.type_paiement = data.type_paiement || 'negociation'
      form.frequence_paiement = data.frequence_paiement || 'trimestriel'
      form.commentaire = data.commentaire || ''
      
      // Sélectionner les frais correspondants
      if (data.frais_scolarite_id) {
          const match = fraisDisponibles.value.find(f => f.id === data.frais_scolarite_id)
          if (match) selectedFrais.value = match
      }
      
      // Sélectionner la bourse correspondante
      if (data.bourse_etudiant_id) {
          const match = boursesEtudiant.value.find(b => b.id === data.bourse_etudiant_id)
          if (match) selectedBourse.value = match
      }
      
      // Remplir les échéances
      if (data.echeances && data.echeances.length > 0) {
        form.echeances = data.echeances.map(e => ({
          id: e.id,
          libelle: e.libelle,
          montant: parseFloat(e.montant),
          montant_paye: parseFloat(e.montant_paye || 0),
          date_limite: e.date_limite ? new Date(e.date_limite) : null,
          statut: e.statut
        }))
      }
    }
  } catch (error) {
    console.error('Erreur checkExistingNegociation:', error)
  } finally {
    loadingExisting.value = false
  }
}

function getInitialsFromValue(studentValue) {
  if (!studentValue) return ''
  return ((studentValue.nom?.[0] || '') + (studentValue.prenom?.[0] || '')).toUpperCase()
}

async function loadBourses(etudiantId) {
  bourseLoading.value = true
  boursesEtudiant.value = []
  selectedBourse.value = null
  form.bourse_etudiant_id = null
  
  try {
    const result = await bourseStore.fetchBoursesByEtudiant(etudiantId)
    
    if (result && Array.isArray(result)) {
      boursesEtudiant.value = result
    } else if (result?.data && Array.isArray(result.data)) {
      boursesEtudiant.value = result.data
    } else {
      boursesEtudiant.value = []
    }
    
    // Si une seule bourse, la sélectionner automatiquement
    if (boursesEtudiant.value.length === 1) {
      selectBourse(boursesEtudiant.value[0])
    }
  } catch (error) {
    console.error('Erreur chargement bourses:', error)
    boursesEtudiant.value = []
    $swal.fire({
      title: 'Erreur',
      text: 'Impossible de charger les bourses de l\'étudiant.',
      icon: 'error',
      confirmButtonColor: '#6366f1'
    })
  } finally {
    bourseLoading.value = false
  }
}

async function loadFraisDisponibles(etudiant) {
  fraisLoading.value = true
  fraisDisponibles.value = []
  selectedFrais.value = null
  form.frais_scolarite_id = null
  
  try {
    // Récupérer tous les frais du store
    const tousFrais = fraisStore.frais || []
    
    // Filtrer selon l'étudiant
    fraisDisponibles.value = tousFrais.filter(f => {
      // Même année scolaire (par défaut ou sélectionnée)
      const memeAnnee = !form.annee_scolaire_id || f.annee_scolaire?.id === form.annee_scolaire_id
      
      // Même niveau ou niveau non spécifié
      const memeNiveau = !f.niveau || !etudiant.niveau_id || f.niveau.id === etudiant.niveau_id
      
      // Même filière ou filière non spécifiée
      const memeFiliere = !f.filiere || !etudiant.filiere_id || f.filiere.id === etudiant.filiere_id
      
      // Même genre ou genre non spécifié
      const memeGenre = !f.genre || !etudiant.genre || f.genre === etudiant.genre
      
      return memeAnnee && memeNiveau && memeFiliere && memeGenre
    })
    
    console.log('Frais disponibles:', fraisDisponibles.value)
    
    // Si un seul frais disponible, le sélectionner automatiquement
    if (fraisDisponibles.value.length === 1) {
      selectFrais(fraisDisponibles.value[0])
    }
  } catch (error) {
    console.error('Erreur chargement frais:', error)
    $swal.fire({
      title: 'Erreur',
      text: 'Impossible de charger les frais disponibles.',
      icon: 'error',
      confirmButtonColor: '#6366f1'
    })
  } finally {
    fraisLoading.value = false
  }
}

function selectBourse(bourse) {
  selectedBourse.value = bourse
  form.bourse_etudiant_id = bourse.id
  $swal.fire({
    title: 'Bourse appliquée',
    text: `La bourse "${bourse.nom}" a été sélectionnée.`,
    icon: 'success',
    timer: 2000,
    showConfirmButton: false,
    toast: true,
    position: 'top-end'
  })
}

function selectFrais(frais) {
  selectedFrais.value = frais
  form.frais_scolarite_id = frais.id
  $swal.fire({
    title: 'Frais sélectionnés',
    text: 'Les frais de scolarité ont été mis à jour.',
    icon: 'success',
    timer: 2000,
    showConfirmButton: false,
    toast: true,
    position: 'top-end'
  })
}

function continueWithoutBourse() {
  selectedBourse.value = null
  form.bourse_etudiant_id = null
  $swal.fire({
    title: 'Information',
    text: 'Création de la négociation sans bourse.',
    icon: 'info',
    timer: 2000,
    showConfirmButton: false,
    toast: true,
    position: 'top-end'
  })
}

function resetSelection() {
  form.etudiant_id = null
  form.frais_scolarite_id = null
  form.bourse_etudiant_id = null
  boursesEtudiant.value = []
  selectedBourse.value = null
  fraisDisponibles.value = []
  selectedFrais.value = null
  form.echeances = []
}

// Fonction isLocked déplacée plus haut pour une meilleure visibilité

function formatMontant(montant) {
  if (!montant && montant !== 0) return '0 FCFA'
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0
  }).format(montant)
}

function addEcheance() {
  form.echeances.push({
    libelle: `Échéance ${form.echeances.length + 1}`,
    montant: 0,
    date_limite: null
  })
  equilibrerMontants()
}

function removeEcheance(index) {
  const echeance = form.echeances[index]
  
  if (echeance.montant_paye > 0) {
    $swal.fire({
      title: 'Action impossible',
      text: 'Vous ne pouvez pas supprimer une échéance qui a déjà reçu des paiements.',
      icon: 'error',
      confirmButtonText: 'Compris'
    })
    return
  }

  $swal.fire({
    title: 'Supprimer cette échéance ?',
    text: "Cette action est irréversible dans l'aperçu actuel.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Oui, supprimer',
    cancelButtonText: 'Annuler'
  }).then((result) => {
    if (result.isConfirmed) {
      form.echeances.splice(index, 1)
      if (form.echeances.length > 0) {
        equilibrerMontants()
      }
      $swal.fire({
        title: 'Supprimé',
        text: 'L\'échéance a été retirée.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      })
    }
  })
}

// NOUVELLE: Méthode pour ouvrir le dialog de génération auto
function openAutoGeneration() {
  if (selectedFrais.value) {
    autoGenMontant.value = montantApresBourse.value || selectedFrais.value.montant
  }
  showAutoGeneration.value = true
}

function generateEcheances() {
  const cibleTotal = parseFloat(montantApresBourse.value || 0);
  
  if (cibleTotal <= 0) {
    $swal.fire({
      title: 'Configuration requise',
      text: 'Le montant total après bourse doit être défini pour générer les échéances.',
      icon: 'info',
      confirmButtonColor: '#6366f1'
    })
    return;
  }

  // 1. Filtrer les échéances verrouillées (avec paiement) et AJUSTER les montants
  const vues = new Set();
  const aGarder = [];
  
  form.echeances.forEach(e => {
    if (isLocked(e)) {
      const key = e.id || e.libelle;
      if (!vues.has(key)) {
        const copy = { ...e };
        // LOGIQUE CRITIQUE : Si la tranche est partielle, on la réduit à ce qui est payé
        // pour libérer le reste du montant pour la nouvelle répartition
        if (parseFloat(copy.montant_paye) > 0 && parseFloat(copy.montant) > parseFloat(copy.montant_paye)) {
            copy.montant = parseFloat(copy.montant_paye);
            copy.statut = 'paye'; // On la considère comme "soldée" à son nouveau montant
        }
        
        aGarder.push(copy);
        vues.add(key);
      }
    }
  });

  // 2. Calculer le reliquat réel sur les montants ajustés
  const nbGarde = aGarder.length;
  const dejaConsomme = aGarder.reduce((acc, e) => acc + (parseFloat(e.montant) || 0), 0);
  const aDistribuer = Math.max(0, cibleTotal - dejaConsomme);

  if (aDistribuer <= 0 && nbGarde > 0) {
    form.echeances = [...aGarder];
    showAutoGeneration.value = false;
    $swal.fire({
      title: 'Déjà couvert',
      text: 'Le montant total est déjà entièrement couvert par les échéances payées.',
      icon: 'info',
      confirmButtonColor: '#6366f1'
    })
    return;
  }

  // 3. Calculer combien de nouvelles tranches on doit créer
  const totalSouhaite = parseInt(nombreEcheancesAuto.value || 0);
  const aCreer = Math.max(1, totalSouhaite);
  
  const montantBase = Math.floor(aDistribuer / aCreer);
  const reliquatCents = aDistribuer - (montantBase * aCreer);
  
  const finalListe = [...aGarder];
  const dateStock = autoGenDateDebut.value ? new Date(autoGenDateDebut.value) : new Date();

  for (let i = 0; i < aCreer; i++) {
    const d = new Date(dateStock);
    
    // Application de la fréquence de manière robuste
    const steps = {
      'mensuel': 1,
      'bimestriel': 2,
      'trimestriel': 3,
      'annuel': 12
    };
    const step = steps[autoGenFrequence.value] || 1;
    
    // On commence à décaler dès la première nouvelle tranche
    d.setMonth(d.getMonth() + (step * (i + 1))); 

    // PLAFONNAGE : Ne pas dépasser la fin de l'année scolaire
    const selectedYear = anneeStore.annneescolaires.find(a => a.id === form.annee_scolaire_id);
    if (selectedYear && selectedYear.date_fin) {
      const dateLimiteAnnee = new Date(selectedYear.date_fin);
      if (d > dateLimiteAnnee) {
        d.setTime(dateLimiteAnnee.getTime());
      }
    }

    finalListe.push({
      libelle: `Échéance ${finalListe.length + 1}`,
      montant: (i === aCreer - 1) ? (montantBase + reliquatCents) : montantBase,
      date_limite: d,
      montant_paye: 0,
      statut: 'en_attente',
      ordre: finalListe.length + 1
    });
  }

  // 4. Update
  form.echeances = finalListe;
  showAutoGeneration.value = false;
  
  $swal.fire({
    title: 'Génération réussie',
    text: `${aCreer} nouvelles tranches ont été générées.`,
    icon: 'success',
    timer: 2500,
    showConfirmButton: false,
    toast: true,
    position: 'top-end'
  })
}

function equilibrerMontants() {
  const totalAttendu = montantApresBourse.value
  const nb = form.echeances.length
  
  if (nb === 0 || totalAttendu <= 0) return
  
  // Échéances totalement payées (on n'y touche plus)
  const echeancesSoldées = form.echeances.filter(e => e.statut === 'paye')
  const montantSoldé = echeancesSoldées.reduce((sum, e) => sum + (e.montant_paye || 0), 0)
  
  // Échéances restantes (non payées ou partiellement payées)
  const echeancesRestantes = form.echeances.filter(e => e.statut !== 'paye')
  
  if (echeancesRestantes.length === 0) return
  
  // Somme des montants déjà payés sur les tranches restantes (partiels)
  const montantPartielPaye = echeancesRestantes.reduce((sum, e) => sum + (e.montant_paye || 0), 0)
  
  // Ce qu'il reste à distribuer au-delà de ce qui est déjà payé
  const surplusADistribuer = Math.max(0, totalAttendu - montantSoldé - montantPartielPaye)
  
  const partSupplementaire = Math.floor(surplusADistribuer / echeancesRestantes.length)
  const reliquat = surplusADistribuer - (partSupplementaire * echeancesRestantes.length)
  
  echeancesRestantes.forEach((e, i) => {
    const sup = (i === echeancesRestantes.length - 1) ? partSupplementaire + reliquat : partSupplementaire
    e.montant = (e.montant_paye || 0) + sup
  })
  
  $swal.fire({
    title: 'Équilibrage terminé',
    text: 'La répartition a été mise à jour.',
    icon: 'success',
    timer: 2000,
    showConfirmButton: false,
    toast: true,
    position: 'top-end'
  })
}

function resetForm() {
  selectedStudent.value = null
  selectedBourse.value = null
  selectedFrais.value = null
  form.etudiant_id = null
  form.frais_scolarite_id = null
  form.annee_scolaire_id = null
  form.type_paiement = 'negociation'
  form.frequence_paiement = 'trimestriel'
  form.bourse_etudiant_id = null
  form.commentaire = null
  form.echeances = []
  boursesEtudiant.value = []
  fraisDisponibles.value = []
}

async function submitForm() {
  if (!canSubmit.value) {
    let message = 'Veuillez remplir les informations suivantes :<br><ul class="text-left mt-2">';
    if (!selectedStudent.value) message += '<li>- Sélectionner un étudiant</li>';
    if (!form.annee_scolaire_id) message += '<li>- Sélectionner l\'année scolaire</li>';
    if (!selectedFrais.value) message += '<li>- Sélectionner les frais de scolarité</li>';
    if (form.type_paiement === 'negociation') {
      if (form.echeances.length === 0) message += '<li>- Ajouter au moins une échéance</li>';
      else if (!form.echeances.every(e => e.libelle?.trim() && e.montant > 0 && e.date_limite)) {
        message += '<li>- Compléter toutes les échéances (libellé, montant > 0, date)</li>';
      }
    }
    message += '</ul>';

    $swal.fire({
      title: 'Formulaire incomplet',
      html: message,
      icon: 'warning',
      confirmButtonColor: '#6366f1'
    })
    return
  }

  // Vérifier la cohérence du montant total pour une négociation
  if (form.type_paiement === 'negociation' && Math.abs(resteARepartir.value) > 1) {
    const result = await $swal.fire({
      title: 'Déséquilibre détecté',
      text: `Le montant total des échéances (${formatMontant(totalMontant.value)}) ne correspond pas au montant attendu (${formatMontant(montantApresBourse.value)}). Voulez-vous quand même enregistrer ?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Oui, enregistrer',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#6366f1'
    })
    
    if (!result.isConfirmed) return
  }

  isSubmitting.value = true
  try {
    const data = {
      etudiant_id: form.etudiant_id,
      frais_scolarite_id: form.frais_scolarite_id,
      annee_scolaire_id: form.annee_scolaire_id,
      type_paiement: form.type_paiement,
      frequence_paiement: form.frequence_paiement,
      bourse_etudiant_id: form.bourse_etudiant_id,
      commentaire: form.commentaire,
      echeances: form.type_paiement === 'negociation' 
        ? form.echeances.map(e => {
            let dateStr = null;
            if (e.date_limite) {
              const d = new Date(e.date_limite);
              // Format YYYY-MM-DD sans décalage de fuseau horaire
              const year = d.getFullYear();
              const month = String(d.getMonth() + 1).padStart(2, '0');
              const day = String(d.getDate()).padStart(2, '0');
              dateStr = `${year}-${month}-${day}`;
            }
            return {
              id: e.id || null,
              libelle: e.libelle,
              montant: e.montant,
              date_limite: dateStr
            };
          })
        : []
    }

    if (existingNegociation.value) {
      await negociationStore.updateNegociation(existingNegociation.value.id, data)
      $swal.fire({
        title: 'Succès !',
        text: 'L\'échéancier a été mis à jour avec succès.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      })
    } else {
      await negociationStore.createNegociation(data)
      $swal.fire({
        title: 'Félicitations',
        text: 'L\'échéancier a été créé avec succès.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      })
    }
    
    resetForm()
    setTimeout(() => navigateTo('/admin/negociations/'), 1500)
  } catch (error) {
    console.error('Erreur submission:', error)
    
    if (error.response?.data?.errors) {
      const errors = error.response.data.errors
      let errorMsg = '<ul>'
      Object.keys(errors).forEach(key => {
        errorMsg += `<li>${errors[key][0]}</li>`
      })
      errorMsg += '</ul>'
      
      $swal.fire({
        title: 'Erreur de validation',
        html: `<strong>${errorMsg}</strong>${detailedList}`,
        icon: 'error',
        confirmButtonColor: '#ef4444'
      });
    } else {
      $swal.fire({
        title: 'Erreur',
        text: errorMsg,
        icon: 'error',
        confirmButtonColor: '#ef4444'
      });
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
:deep(.p-dropdown) {
  width: 100%;
}

:deep(.p-button.p-button-primary) {
  background: linear-gradient(to right, #4f46e5, #6366f1);
  border: none;
}

:deep(.p-button.p-button-primary:hover) {
  background: linear-gradient(to right, #4338ca, #4f46e5);
}

:deep(.p-card) {
  border-radius: 0.75rem;
}

:deep(.p-tag) {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
}

:deep(.p-message) {
  border-radius: 0.75rem;
}

/* Animation pour les cartes */
.group {
  transition: all 0.3s ease;
}

.group:hover {
  transform: translateY(-2px);
}

/* Style pour les étapes */
.bg-indigo-600 {
  background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
}
</style>