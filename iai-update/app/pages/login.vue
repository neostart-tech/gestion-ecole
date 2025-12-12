<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div class="form">
      <!-- En-tête IAI-TOGO -->
      <div class="text-center mb-6">
        <h1 class="text-xl font-bold text-gray-800 mb-1">
          IAI-TOGO
        </h1>
        <p class="text-xs text-gray-500">Institut Africain d'Informatique - Togo</p>
      </div>

      <div class="flex-column">
        <label>Email</label>
      </div>
      <div class="inputForm">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" viewBox="0 0 32 32" height="20">
          <g data-name="Layer 3" id="Layer_3">
            <path d="m30.853 13.87a15 15 0 0 0 -29.729 4.082 15.1 15.1 0 0 0 12.876 12.918 15.6 15.6 0 0 0 2.016.13 14.85 14.85 0 0 0 7.715-2.145 1 1 0 1 0 -1.031-1.711 13.007 13.007 0 1 1 5.458-6.529 2.149 2.149 0 0 1 -4.158-.759v-10.856a1 1 0 0 0 -2 0v1.726a8 8 0 1 0 .2 10.325 4.135 4.135 0 0 0 7.83.274 15.2 15.2 0 0 0 .823-7.455zm-14.853 8.13a6 6 0 1 1 6-6 6.006 6.006 0 0 1 -6 6z"></path>
          </g>
        </svg>
        <input v-model="form.email" placeholder="exemple@iai-togo.tg" class="input" type="email" required>
      </div>

      <div class="flex-column">
        <label>Mot de passe</label>
      </div>
      <div class="inputForm">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" viewBox="-64 0 512 512" height="20">
          <path d="m336 512h-288c-26.453125 0-48-21.523438-48-48v-224c0-26.476562 21.546875-48 48-48h288c26.453125 0 48 21.523438 48 48v224c0 26.476562-21.546875 48-48 48zm-288-288c-8.8125 0-16 7.167969-16 16v224c0 8.832031 7.1875 16 16 16h288c8.8125 0 16-7.167969 16-16v-224c0-8.832031-7.1875-16-16-16zm0 0"></path>
          <path d="m304 224c-8.832031 0-16-7.167969-16-16v-80c0-52.929688-43.070312-96-96-96s-96 43.070312-96 96v80c0 8.832031-7.167969 16-16 16s-16-7.167969-16-16v-80c0-70.59375 57.40625-128 128-128s128 57.40625 128 128v80c0 8.832031-7.167969 16-16 16zm0 0"></path>
        </svg>
        <input v-model="form.password" placeholder="••••••••" class="input" type="password" required>
      </div>

      <div class="flex-row">
        <div>
          <input v-model="form.remember" type="checkbox" id="remember">
          <label for="remember">Se souvenir de moi</label>
        </div>
        <span class="span">Mot de passe oublié ?</span>
      </div>
      
      <button class="button-submit" @click.prevent="handleLogin" :disabled="loading">
        {{ loading ? 'Connexion...' : 'Se connecter' }}
      </button>
      
      <div class="flex-row" style="margin-top: 20px;">
        
        
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

definePageMeta({
  layout: false
})

const router = useRouter()

const form = reactive({
  email: '',
  password: '',
  remember: false
})

const loading = ref(false)

const handleLogin = async () => {
  // Validation des identifiants
  if (!form.email || !form.password) {
    alert('Veuillez remplir tous les champs')
    return
  }

  // Vérification des identifiants
  if (form.email === 'admin@test.com' && form.password === 'password') {
    loading.value = true
    
    // Stocker l'état de connexion dans localStorage
    if (process.client) {
      localStorage.setItem('isAuthenticated', 'true')
      localStorage.setItem('userEmail', form.email)
      localStorage.setItem('userRole', 'admin')
      if (form.remember) {
        localStorage.setItem('rememberMe', 'true')
      }
    }
    
    // Simuler un délai de chargement
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // Redirection vers la page d'accueil
    await router.push('/')
    
  } else {
    alert('Identifiants incorrects. Utilisez admin@test.com / password')
  }
  
  loading.value = false
}

const loginWithGoogle = () => {
  alert('Connexion avec Google - Fonctionnalité à implémenter')
}

const loginWithApple = () => {
  alert('Connexion avec Apple - Fonctionnalité à implémenter')
}


</script>

<style scoped>
.form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: #ffffff;
  padding: 30px;
  width: 450px;
  border-radius: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

::placeholder {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  font-size: 14px;
}

.flex-column > label {
  color: #151717;
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 4px;
}

.inputForm {
  border: 1.5px solid #ecedec;
  border-radius: 10px;
  height: 50px;
  display: flex;
  align-items: center;
  padding-left: 10px;
  transition: 0.2s ease-in-out;
}

.input {
  margin-left: 10px;
  border-radius: 10px;
  border: none;
  width: 100%;
  height: 100%;
  font-size: 14px;
  font-family: inherit;
}

.input:focus {
  outline: none;
}

.inputForm:focus-within {
  border: 1.5px solid #2d79f3;
}

.flex-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  justify-content: space-between;
}

.flex-row > div > label {
  font-size: 14px;
  color: black;
  font-weight: 400;
  cursor: pointer;
}

.flex-row > div {
  display: flex;
  align-items: center;
  gap: 8px;
}

.span {
  font-size: 14px;
  color: #2d79f3;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.2s;
}

.span:hover {
  text-decoration: underline;
}

.button-submit {
  margin: 10px 0 10px 0;
  background-color: #2563eb; /* Bleu */
  border: none;
  color: white;
  font-size: 15px;
  font-weight: 500;
  border-radius: 10px;
  height: 50px;
  width: 100%;
  cursor: pointer;
  transition: background-color 0.2s;
}

.button-submit:hover {
  background-color: #1d4ed8; /* Bleu foncé au hover */
}

.button-submit:disabled {
  background-color: #93c5fd; /* Bleu clair désactivé */
  cursor: not-allowed;
}


.btn {
  width: 100%;
  height: 50px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 500;
  gap: 10px;
  border: 1px solid #ededef;
  background-color: white;
  cursor: pointer;
  transition: 0.2s ease-in-out;
  font-size: 14px;
}

.btn:hover {
  border: 1px solid #2d79f3;
}

.google {
  color: #3c4043;
}

.apple {
  color: #000;
}

input[type="checkbox"] {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

@media (max-width: 480px) {
  .form {
    width: 100%;
    max-width: 380px;
    padding: 20px;
  }
}
</style>