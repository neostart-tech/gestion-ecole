<template>
  <div
    class="h-screen w-screen bg-gradient-to-br from-[#dbeff7] to-white overflow-hidden"
  >
    <!-- Main Container -->
    <div class="h-full w-full flex">
      <div class="w-full h-full bg-white flex flex-col">
        <div class="grid grid-cols-1 lg:grid-cols-2 h-full">
          <!-- Left Side - Forgot Password Form -->
          <div
            class="flex flex-col p-6 md:p-10 lg:p-12 xl:p-12 h-full overflow-y-auto custom-scrollbar"
          >
            <!-- Container -->
            <div class="min-h-full flex flex-col justify-start">
              <div class="max-w-md mx-auto w-full space-y-6 pt-6">
                <!-- Logo -->
                <div class="text-center lg:text-left mb-3">
                  <NuxtLink to="/" class="inline-block">
                    <img
                      :src="appLogo"
                      :alt="appName"
                      class="h-30 w-auto mx-auto lg:mx-0"
                    />
                  </NuxtLink>
                </div>

                <!-- Welcome Section -->
                <div class="space-y-2">
                  <h1
                    class="text-2xl md:text-3xl lg:text-4xl font-bold text-[#202a51]"
                  >
                    Mot de passe oublié
                  </h1>
                  <p class="text-gray-600 text-sm md:text-base">
                    {{ currentStep === 1 
                      ? "Saisissez votre email pour recevoir un code de vérification." 
                      : currentStep === 2
                      ? "Entrez le code de vérification que vous avez reçu par email."
                      : "Choisissez votre nouveau mot de passe."
                    }}
                  </p>
                </div>

                <!-- Steps Indicator -->
                <div class="flex items-center justify-between mb-6">
                  <div class="flex items-center w-full">
                    <div 
                      class="flex items-center" 
                      :class="{ 'text-[#00b3d4]': currentStep >= 1, 'text-gray-300': currentStep < 1 }"
                    >
                      <div 
                        class="w-8 h-8 rounded-full flex items-center justify-center font-semibold"
                        :class="currentStep >= 1 ? 'bg-[#00b3d4] text-white' : 'bg-gray-200 text-gray-500'"
                      >
                        1
                      </div>
                      <span class="ml-2 text-sm font-medium hidden sm:block">Email</span>
                    </div>
                    
                    <div class="flex-1 mx-2 h-1 rounded" :class="currentStep >= 2 ? 'bg-[#00b3d4]' : 'bg-gray-200'"></div>
                    
                    <div 
                      class="flex items-center" 
                      :class="{ 'text-[#00b3d4]': currentStep >= 2, 'text-gray-300': currentStep < 2 }"
                    >
                      <div 
                        class="w-8 h-8 rounded-full flex items-center justify-center font-semibold"
                        :class="currentStep >= 2 ? 'bg-[#00b3d4] text-white' : 'bg-gray-200 text-gray-500'"
                      >
                        2
                      </div>
                      <span class="ml-2 text-sm font-medium hidden sm:block">Code</span>
                    </div>
                    
                    <div class="flex-1 mx-2 h-1 rounded" :class="currentStep >= 3 ? 'bg-[#00b3d4]' : 'bg-gray-200'"></div>
                    
                    <div 
                      class="flex items-center" 
                      :class="{ 'text-[#00b3d4]': currentStep >= 3, 'text-gray-300': currentStep < 3 }"
                    >
                      <div 
                        class="w-8 h-8 rounded-full flex items-center justify-center font-semibold"
                        :class="currentStep >= 3 ? 'bg-[#00b3d4] text-white' : 'bg-gray-200 text-gray-500'"
                      >
                        3
                      </div>
                      <span class="ml-2 text-sm font-medium hidden sm:block">Nouveau</span>
                    </div>
                  </div>
                </div>

                <!-- Step 1: Email Form -->
                <form v-if="currentStep === 1" @submit.prevent="sendResetCode" class="space-y-6">
                  <!-- Email Input -->
                  <div class="space-y-2">
                    <label class="block text-[#202a51] font-semibold text-sm">
                      <span class="flex items-center">
                        <svg
                          class="w-4 h-4 mr-1 text-[#00b3d4]"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                        Adresse email
                      </span>
                    </label>

                    <div class="relative group">
                      <div
                        class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                      >
                        <svg
                          class="w-5 h-5 text-gray-400 group-focus-within:text-[#00b3d4]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      </div>

                      <input
                        type="email"
                        v-model="email"
                        required
                        placeholder="exemple@escen.university"
                        class="w-full pl-10 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#00b3d4] focus:border-transparent bg-white hover:bg-gray-50 transition-all duration-200"
                      />
                    </div>
                  </div>

                  <!-- Submit Button -->
                  <button
                    type="submit"
                    :disabled="isLoading"
                    class="w-full relative overflow-hidden group rounded-xl"
                  >
                    <div
                      class="relative bg-gradient-to-r from-[#00b3d4] to-[#6cc6e2] py-4 px-6 rounded-xl flex items-center justify-center transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
                    >
                      <svg
                        v-if="isLoading"
                        class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          class="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          stroke-width="4"
                        ></circle>
                        <path
                          class="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span class="text-white font-semibold text-base">
                        {{ isLoading ? "Envoi en cours..." : "Envoyer le code" }}
                      </span>
                    </div>
                  </button>
                </form>

                <!-- Step 2: Verification Code Form -->
                <form v-else-if="currentStep === 2" @submit.prevent="verifyCode" class="space-y-6">
                  <!-- Code Input -->
                  <div class="space-y-2">
                    <label class="block text-[#202a51] font-semibold text-sm">
                      <span class="flex items-center">
                        <svg
                          class="w-4 h-4 mr-1 text-[#00b3d4]"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path fill-rule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-3 3a1 1 0 112 0v3a1 1 0 11-2 0v-3z" clip-rule="evenodd" />
                        </svg>
                        Code de vérification
                      </span>
                    </label>

                    <div class="relative group">
                      <div
                        class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                      >
                        <svg
                          class="w-5 h-5 text-gray-400 group-focus-within:text-[#00b3d4]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                          />
                        </svg>
                      </div>

                      <input
                        type="text"
                        v-model="verificationCode"
                        required
                        maxlength="6"
                        placeholder="123456"
                        class="w-full pl-10 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#00b3d4] focus:border-transparent bg-white hover:bg-gray-50 transition-all duration-200 text-center text-2xl tracking-widest"
                      />
                    </div>
                    <p class="text-xs text-gray-500 mt-1">Code à 6 chiffres envoyé à {{ email }}</p>
                  </div>

                  <!-- Actions -->
                  <div class="space-y-3">
                    <button
                      type="submit"
                      :disabled="isLoading"
                      class="w-full relative overflow-hidden group rounded-xl"
                    >
                      <div
                        class="relative bg-gradient-to-r from-[#00b3d4] to-[#6cc6e2] py-4 px-6 rounded-xl flex items-center justify-center transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
                      >
                        <svg
                          v-if="isLoading"
                          class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            class="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            stroke-width="4"
                          ></circle>
                          <path
                            class="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        <span class="text-white font-semibold text-base">
                          {{ isLoading ? "Vérification..." : "Vérifier le code" }}
                        </span>
                      </div>
                    </button>

                    <button
                      type="button"
                      @click="resendCode"
                      :disabled="resendDisabled"
                      class="w-full text-sm text-[#00b3d4] hover:text-[#202a51] hover:underline transition-all duration-200 font-medium py-2"
                    >
                      {{ resendDisabled ? `Renvoyer dans ${resendCountdown}s` : "Renvoyer le code" }}
                    </button>
                  </div>
                </form>

                <!-- Step 3: New Password Form -->
                <form v-else-if="currentStep === 3" @submit.prevent="resetPassword" class="space-y-6">
                  <!-- New Password Input -->
                  <div class="space-y-2">
                    <label class="block text-[#202a51] font-semibold text-sm">
                      <span class="flex items-center">
                        <svg
                          class="w-4 h-4 mr-1 text-[#00b3d4]"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                        </svg>
                        Nouveau mot de passe
                      </span>
                    </label>

                    <div class="relative group">
                      <div
                        class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                      >
                        <svg
                          class="w-5 h-5 text-gray-400 group-focus-within:text-[#00b3d4]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                          />
                        </svg>
                      </div>

                      <input
                        :type="showNewPassword ? 'text' : 'password'"
                        v-model="newPassword"
                        required
                        minlength="8"
                        placeholder="••••••••"
                        class="w-full pl-10 pr-12 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#00b3d4] focus:border-transparent bg-white hover:bg-gray-50 transition-all duration-200"
                      />

                      <button
                        type="button"
                        @click="showNewPassword = !showNewPassword"
                        class="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                      >
                        <svg
                          v-if="!showNewPassword"
                          class="w-5 h-5 text-gray-400 hover:text-[#00b3d4] transition-colors duration-200"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                        <svg
                          v-else
                          class="w-5 h-5 text-[#00b3d4]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <!-- Confirm Password Input -->
                  <div class="space-y-2">
                    <label class="block text-[#202a51] font-semibold text-sm">
                      <span class="flex items-center">
                        <svg
                          class="w-4 h-4 mr-1 text-[#00b3d4]"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                        </svg>
                        Confirmer le mot de passe
                      </span>
                    </label>

                    <div class="relative group">
                      <div
                        class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                      >
                        <svg
                          class="w-5 h-5 text-gray-400 group-focus-within:text-[#00b3d4]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                          />
                        </svg>
                      </div>

                      <input
                        :type="showConfirmPassword ? 'text' : 'password'"
                        v-model="confirmPassword"
                        required
                        minlength="8"
                        placeholder="••••••••"
                        class="w-full pl-10 pr-12 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#00b3d4] focus:border-transparent bg-white hover:bg-gray-50 transition-all duration-200"
                      />

                      <button
                        type="button"
                        @click="showConfirmPassword = !showConfirmPassword"
                        class="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                      >
                        <svg
                          v-if="!showConfirmPassword"
                          class="w-5 h-5 text-gray-400 hover:text-[#00b3d4] transition-colors duration-200"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                        <svg
                          v-else
                          class="w-5 h-5 text-[#00b3d4]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <!-- Password strength indicator -->
                  <div v-if="newPassword" class="space-y-1">
                    <div class="flex items-center justify-between text-xs">
                      <span class="text-gray-600">Force du mot de passe:</span>
                      <span :class="passwordStrengthColor">{{ passwordStrengthText }}</span>
                    </div>
                    <div class="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        class="h-full transition-all duration-300"
                        :class="passwordStrengthClass"
                        :style="{ width: passwordStrength + '%' }"
                      ></div>
                    </div>
                    <p class="text-xs text-gray-500 mt-1">Minimum 8 caractères</p>
                  </div>

                  <!-- Submit Button -->
                  <button
                    type="submit"
                    :disabled="isLoading || !passwordsMatch || newPassword.length < 8"
                    class="w-full relative overflow-hidden group rounded-xl"
                  >
                    <div
                      class="relative bg-gradient-to-r from-[#00b3d4] to-[#6cc6e2] py-4 px-6 rounded-xl flex items-center justify-center transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
                      :class="{ 'opacity-50 cursor-not-allowed': isLoading || !passwordsMatch || newPassword.length < 8 }"
                    >
                      <svg
                        v-if="isLoading"
                        class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          class="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          stroke-width="4"
                        ></circle>
                        <path
                          class="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span class="text-white font-semibold text-base">
                        {{ isLoading ? "Réinitialisation..." : "Réinitialiser le mot de passe" }}
                      </span>
                    </div>
                  </button>
                </form>

                <!-- Back to Login Link -->
                <div class="text-center mt-6">
                  <NuxtLink
                    to="/login"
                    class="text-sm text-[#00b3d4] hover:text-[#202a51] hover:underline transition-all duration-200 font-medium inline-flex items-center"
                  >
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Retour à la connexion
                  </NuxtLink>
                </div>

                <!-- Espace bas -->
                <div class="h-16"></div>
              </div>
            </div>
          </div>

          <!-- Right Side - Hero Image & Info (same as login) -->
          <div
            class="hidden lg:flex flex-col relative bg-gradient-to-br from-[#202a51] via-[#2a3874] to-[#374c9c] overflow-hidden"
          >
            <!-- Background Pattern (same as login) -->
            <div class="absolute inset-0 opacity-5">
              <div
                class="absolute top-1/4 -right-24 w-96 h-96 bg-gradient-to-r from-[#00b3d4] to-[#6cc6e2] rounded-full blur-3xl"
              ></div>
              <div
                class="absolute bottom-1/4 -left-24 w-96 h-96 bg-gradient-to-r from-[#6cc6e2] to-[#00b3d4] rounded-full blur-3xl"
              ></div>
            </div>

            <!-- Decorative Elements -->
            <div
              class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#00b3d4] via-[#6cc6e2] to-transparent"
            ></div>
            <div class="absolute top-8 right-8">
              <div
                class="w-24 h-24 bg-gradient-to-br from-[#00b3d4]/20 to-transparent rounded-full blur-xl"
              ></div>
            </div>

            <!-- Content -->
            <div
              class="relative z-10 h-full flex flex-col p-8 md:p-10 lg:p-12 xl:p-16"
            >
              <!-- Main Content -->
              <div class="flex-1 flex flex-col justify-center">
                <!-- Hero Image Container -->
                <div class="mb-8">
                  <div class="relative w-full max-w-2xl mx-auto">
                    <!-- Floating elements -->
                    <div
                      class="absolute -top-6 -left-6 w-32 h-32 bg-gradient-to-br from-[#00b3d4] to-[#6cc6e2] rounded-full opacity-20 blur-xl"
                    ></div>
                    <div
                      class="absolute -bottom-6 -right-6 w-40 h-40 bg-gradient-to-br from-[#6cc6e2] to-[#00b3d4] rounded-full opacity-20 blur-xl"
                    ></div>

                    <!-- Main Image -->
                    <div
                      class="relative rounded-2xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-transform duration-500"
                    >
                      <img
                        src="/bg/loginvector.png"
                        :alt="`Étudiants ${appName} collaborant sur un projet digital`"
                        class="w-full h-auto object-cover"
                      />
                      <div
                        class="absolute inset-0 bg-gradient-to-t from-[#202a51]/70 to-transparent"
                      ></div>
                    </div>
                  </div>
                </div>

                <!-- Welcome Message -->
                <div class="text-center text-white space-y-4 max-w-lg mx-auto">
                  <h2 class="text-3xl font-bold">Récupération de mot de passe</h2>
                  <p class="text-white/80">
                    Suivez les étapes pour réinitialiser votre mot de passe en toute sécurité.
                  </p>

                  <!-- Security badges -->
                  <div class="flex flex-wrap justify-center gap-3 mt-6">
                    <span
                      class="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium text-white"
                    >
                      Sécurisé
                    </span>
                    <span
                      class="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium text-white"
                    >
                      Rapide
                    </span>
                    <span
                      class="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium text-white"
                    >
                      Fiable
                    </span>
                  </div>
                </div>
              </div>

              <!-- Footer Note -->
              <div class="mt-8 pt-6 border-t border-white/10">
                <p class="text-white/60 text-sm text-center">
                  © 2024 ESCEN University • Tous droits réservés
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useParametreStore } from "~~/stores/parametre";
import config from "~~/config";

const { $toastr, $api } = useNuxtApp();
const router = useRouter();
const parametreStore = useParametreStore();

const file_url = config.app_local
  ? config.app_dev_storage_url
  : config.app_prod_storage_url;

const appLogo = computed(() => {
  const logo = parametreStore.getAppLogo;
  if (!logo) return null;
  return `${file_url}/storage/${logo}`;
});

const appName = computed(() => {
  return parametreStore.getAppName || "ESCEN University";
});

// Step management
const currentStep = ref(1);

// Form data
const email = ref("");
const verificationCode = ref("");
const newPassword = ref("");
const confirmPassword = ref("");

// UI states
const isLoading = ref(false);
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);
const resendDisabled = ref(false);
const resendCountdown = ref(60);

// Password strength
const passwordStrength = computed(() => {
  const pwd = newPassword.value;
  if (!pwd) return 0;
  
  let strength = 0;
  if (pwd.length >= 8) strength += 25;
  if (pwd.match(/[a-z]+/)) strength += 25;
  if (pwd.match(/[A-Z]+/)) strength += 25;
  if (pwd.match(/[0-9]+/) || pwd.match(/[$@#&!]+/)) strength += 25;
  
  return strength;
});

const passwordStrengthText = computed(() => {
  const strength = passwordStrength.value;
  if (strength < 25) return "Très faible";
  if (strength < 50) return "Faible";
  if (strength < 75) return "Moyen";
  return "Fort";
});

const passwordStrengthColor = computed(() => {
  const strength = passwordStrength.value;
  if (strength < 25) return "text-red-500";
  if (strength < 50) return "text-orange-500";
  if (strength < 75) return "text-yellow-500";
  return "text-green-500";
});

const passwordStrengthClass = computed(() => {
  const strength = passwordStrength.value;
  if (strength < 25) return "bg-red-500";
  if (strength < 50) return "bg-orange-500";
  if (strength < 75) return "bg-yellow-500";
  return "bg-green-500";
});

const passwordsMatch = computed(() => {
  return newPassword.value && confirmPassword.value && newPassword.value === confirmPassword.value;
});

// Step 1: Send reset code
const sendResetCode = async () => {
  isLoading.value = true;
  
  try {
    // Appel API pour envoyer le code de réinitialisation
    await $api.post("/forgot-password", { email: email.value });
    
    $toastr.success("Un code de vérification a été envoyé à votre adresse email.");
    currentStep.value = 2;
    startResendCountdown();
  } catch (error) {
    console.error("Erreur lors de l'envoi du code:", error);
    
    let errorMsg = "Une erreur est survenue. Veuillez réessayer.";
    if (error.response?.data?.message) {
      errorMsg = error.response.data.message;
    } else if (error.response?.status === 404) {
      errorMsg = "Aucun compte trouvé avec cette adresse email.";
    }
    
    $toastr.error(errorMsg);
  } finally {
    isLoading.value = false;
  }
};

// Step 2: Verify code
const verifyCode = async () => {
  if (verificationCode.value.length !== 6) {
    $toastr.warning("Veuillez entrer un code à 6 chiffres.");
    return;
  }
  
  isLoading.value = true;
  
  try {
    // Appel API pour vérifier le code
    await $api.post("/verify-reset-code", {
      email: email.value,
      code: verificationCode.value
    });
    
    $toastr.success("Code vérifié avec succès.");
    currentStep.value = 3;
  } catch (error) {
    console.error("Erreur lors de la vérification du code:", error);
    
    let errorMsg = "Code de vérification invalide.";
    if (error.response?.data?.message) {
      errorMsg = error.response.data.message;
    }
    
    $toastr.error(errorMsg);
  } finally {
    isLoading.value = false;
  }
};

// Resend code
const resendCode = async () => {
  if (resendDisabled.value) return;
  
  isLoading.value = true;
  
  try {
    await $api.post("/forgot-password", { email: email.value });
    
    $toastr.success("Un nouveau code a été envoyé.");
    startResendCountdown();
  } catch (error) {
    console.error("Erreur lors du renvoi du code:", error);
    $toastr.error("Impossible de renvoyer le code. Veuillez réessayer.");
  } finally {
    isLoading.value = false;
  }
};

// Step 3: Reset password
const resetPassword = async () => {
  if (newPassword.value.length < 8) {
    $toastr.warning("Le mot de passe doit contenir au moins 8 caractères.");
    return;
  }
  
  if (!passwordsMatch.value) {
    $toastr.warning("Les mots de passe ne correspondent pas.");
    return;
  }
  
  isLoading.value = true;
  
  try {
    // Appel API pour réinitialiser le mot de passe
    await $api.post("/reset-password", {
      email: email.value,
      code: verificationCode.value,
      password: newPassword.value,
      password_confirmation: confirmPassword.value
    });
    
    $toastr.success("Mot de passe réinitialisé avec succès. Vous pouvez maintenant vous connecter.");
    
    // Redirection vers la page de connexion
    setTimeout(() => {
      router.push("/login");
    }, 2000);
  } catch (error) {
    console.error("Erreur lors de la réinitialisation:", error);
    
    let errorMsg = "Une erreur est survenue. Veuillez réessayer.";
    if (error.response?.data?.message) {
      errorMsg = error.response.data.message;
    } else if (error.response?.data?.errors) {
      const errors = error.response.data.errors;
      errorMsg = Object.values(errors).flat()[0] || errorMsg;
    }
    
    $toastr.error(errorMsg);
  } finally {
    isLoading.value = false;
  }
};

// Countdown for resend button
const startResendCountdown = () => {
  resendDisabled.value = true;
  resendCountdown.value = 60;
  
  const interval = setInterval(() => {
    resendCountdown.value -= 1;
    if (resendCountdown.value <= 0) {
      clearInterval(interval);
      resendDisabled.value = false;
    }
  }, 1000);
};

onMounted(() => {
  parametreStore.fetchParametres();
});

definePageMeta({
  layout: false,
  title: "Mot de passe oublié",
});
</script>

<style scoped>
/* Custom animations */
@keyframes slide-in {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.animate-slide-in {
  animation: slide-in 0.3s ease-out;
}

/* Custom scrollbar */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 transparent;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 20px;
}

/* Smooth transitions */
* {
  transition-property:
    color, background-color, border-color, transform, opacity, box-shadow;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

/* Custom focus styles */
input:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(0, 179, 212, 0.1);
}

/* Ensure full height */
html,
body,
#__nuxt {
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

/* Responsive adjustments */
@media (max-width: 1023px) {
  .flex-col.justify-center {
    justify-content: flex-start;
    padding-top: 2rem;
  }

  .max-w-md {
    max-width: 100%;
  }
}

/* Loading spinner animation */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Hover effects */
.hover-lift {
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
}
</style>