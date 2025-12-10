<template>
  <div class="modal fade" id="showModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header border-0 pb-0">
          <h5 class="modal-title">{{ filiere.nom }}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="row align-items-center">
            <div class="col-md-4">
              <div class="bg-light rounded position-relative p-3">
                <div class="text-center">
                  <div class="mx-auto" style="width: 150px; height: 150px;">
                    <img 
                      v-if="filiere.image" 
                      :src="getImageUrl(filiere.image)" 
                      class="img-fluid rounded" 
                      alt="Image de la filière"
                      style="width: 100%; height: 100%; object-fit: cover;"
                    />
                    <div v-else class="d-flex align-items-center justify-content-center h-100">
                      <i class="bi bi-image text-muted" style="font-size: 3rem;"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-8">
              <p class="text-muted text-justify mb-4">
                {{ filiere.description || 'Aucune description' }}
              </p>
              <div class="table-responsive">
                <table class="table w-auto table-borderless">
                  <tbody>
                    <tr>
                      <td class="text-muted py-1">Code</td>
                      <td class="py-1 fw-bold">{{ filiere.code }}</td>
                    </tr>
                    <tr>
                      <td class="text-muted py-1">Nombre d'inscrits</td>
                      <td class="py-1 fw-bold">{{ filiere.etudiants_count || 0 }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  filiere: {
    type: Object,
    required: true
  }
})

const getImageUrl = (imagePath) => {
  if (imagePath instanceof File) {
    return URL.createObjectURL(imagePath)
  }
  return imagePath || '/images/default-filiere.jpg'
}
</script>