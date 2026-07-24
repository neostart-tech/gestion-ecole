<template>
  <div class="console">
    <header class="hero">
      <div class="hero-grid" aria-hidden="true"></div>
      <div class="hero-inner">
        <span class="eyebrow">Administration &middot; accès</span>
        <div class="hero-row">
          <div>
            <h1 class="hero-title">Rôles</h1>
            <p class="hero-subtitle">{{ roleStore.roles.length }} rôle(s) définis dans l'organisation</p>
          </div>
          <Can action="create-role">
            <button class="btn-ghost" @click="openAddModal">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
              Ajouter un rôle
            </button>
          </Can>
        </div>
      </div>
    </header>

    <div class="console-body">
      <div class="search-field">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <input v-model="searchQuery" type="search" placeholder="Rechercher un rôle…" />
      </div>

      <div v-if="roleStore.isLoading" class="loading-block">
        <div class="spinner"></div>
        <p>Chargement des rôles…</p>
      </div>

      <div v-else-if="filteredRoles.length > 0" class="roles-grid">
        <div v-for="role in filteredRoles" :key="role.id" class="role-card">
          <div class="role-card-top">
            <div class="role-glyph" :class="roleColorClass(role.nom)">
              {{ initialsOf(role.nom) }}
            </div>
            <div class="role-info">
              <h3 class="role-name">{{ role.nom }}</h3>
              <span class="role-slug mono">{{ role.slug }}</span>
            </div>
          </div>

          <div class="role-card-meta">
            <div class="perm-badge">
              <span class="perm-count mono">{{ role.permissions?.length || 0 }}</span>
              <span class="perm-label">permission{{ (role.permissions?.length || 0) > 1 ? "s" : "" }}</span>
            </div>
          </div>

          <div class="role-card-actions">
            <Can action="assign-role-permissions">
              <NuxtLink :to="`/roles/${role.slug}/permissions`" class="card-action" title="Gérer les permissions">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Permissions
              </NuxtLink>
            </Can>
            <span class="action-spacer"></span>
            <Can action="update-role">
              <button @click="openEditModal(role)" class="icon-action" title="Modifier le rôle">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a4 4 0 01-1.414.94l-3.05 1.144 1.144-3.05a4 4 0 01.94-1.414z"/>
                </svg>
              </button>
            </Can>
            <Can action="delete-role">
              <button @click="confirmDeleteRole(role)" class="icon-action is-danger" title="Supprimer le rôle">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
              </button>
            </Can>
          </div>
        </div>
      </div>

      <p v-else class="empty-note">Aucun rôle trouvé.</p>
    </div>

    <!-- Modal d'ajout / modification de rôle -->
    <div v-if="showFormModal" class="modal-overlay" @click.self="closeFormModal">
      <div class="modal">
        <div class="modal-header">
          <h3>{{ editingRole ? "Modifier le rôle" : "Ajouter un nouveau rôle" }}</h3>
          <button @click="closeFormModal" class="modal-close">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="submitRoleForm">
            <div class="form-group">
              <label for="role-nom-input" class="form-label">Nom du rôle *</label>
              <input
                type="text"
                id="role-nom-input"
                v-model="roleForm.nom"
                class="form-input"
                placeholder="Ex: Administrateur"
                required
              />
            </div>
            <div class="form-actions">
              <button type="button" class="btn-secondary" @click="closeFormModal">Annuler</button>
              <button type="submit" class="btn-primary" :disabled="savingForm">
                {{ savingForm ? "Enregistrement..." : (editingRole ? "Mettre à jour" : "Créer le rôle") }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoleStore } from "~~/stores/role";

const roleStore = useRoleStore();

const searchQuery = ref("");
const showFormModal = ref(false);
const editingRole = ref(null);
const savingForm = ref(false);

const roleForm = ref({ nom: "" });

onMounted(async () => {
  await roleStore.fetchRoles();
});

const filteredRoles = computed(() => {
  if (!searchQuery.value) return roleStore.roles;

  const query = searchQuery.value.toLowerCase();
  return roleStore.roles.filter((role) =>
    role.nom.toLowerCase().includes(query)
  );
});

const initialsOf = (nom) => {
  if (!nom) return "?";
  return nom
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join("");
};

// Classes CSS avec variantes clair/sombre définies dans <style> — pas de couleur
// calculée en inline, donc le mode sombre s'applique automatiquement.
const ROLE_COLOR_COUNT = 8;
const roleColorClass = (nom) => {
  let hash = 0;
  const str = nom || "";
  for (let i = 0; i < str.length; i++) hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  return `domain-color-${hash % ROLE_COLOR_COUNT}`;
};

const openAddModal = () => {
  editingRole.value = null;
  roleForm.value = { nom: "" };
  showFormModal.value = true;
};

const openEditModal = (role) => {
  editingRole.value = role;
  roleForm.value = { nom: role.nom };
  showFormModal.value = true;
};

const closeFormModal = () => {
  showFormModal.value = false;
  editingRole.value = null;
  roleForm.value = { nom: "" };
};

const submitRoleForm = async () => {
  if (!roleForm.value.nom.trim()) {
    alert("Veuillez saisir un nom de rôle");
    return;
  }

  savingForm.value = true;
  try {
    if (editingRole.value) {
      await roleStore.updateRole(editingRole.value.slug, { nom: roleForm.value.nom });
    } else {
      await roleStore.addRole({ nom: roleForm.value.nom, permissions: [] });
    }
    closeFormModal();
  } catch (error) {
    alert(error.response?.data?.message || "Erreur lors de l'enregistrement du rôle.");
  } finally {
    savingForm.value = false;
  }
};

const confirmDeleteRole = async (role) => {
  if (!confirm(`Supprimer le rôle "${role.nom}" ? Cette action est irréversible.`)) {
    return;
  }
  try {
    await roleStore.deleteRole(role.slug);
  } catch (error) {
    alert(error.response?.data?.message || "Erreur lors de la suppression du rôle.");
  }
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap");

.console {
  min-height: 100vh;
  background: #f8fafc;
  font-family: "Sora", ui-sans-serif, system-ui, sans-serif;
}
:global(.dark) .console {
  background: #0b1120;
}
.mono {
  font-family: "JetBrains Mono", ui-monospace, monospace;
}

.hero {
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #0f172a 0%, #172554 60%, #1d4ed8 130%);
  padding: 36px 24px;
}
:global(.dark) .hero {
  background: linear-gradient(135deg, #05070d 0%, #0b1a3a 60%, #1e3a8a 130%);
}
.hero-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.06) 1px, transparent 1px);
  background-size: 32px 32px;
  mask-image: radial-gradient(ellipse at top, black 40%, transparent 85%);
}
.hero-inner {
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
}
.eyebrow {
  font-family: "JetBrains Mono", monospace;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(255, 255, 255, 0.55);
}
.hero-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  margin-top: 10px;
}
.hero-title {
  font-size: 28px;
  font-weight: 800;
  color: #fff;
  letter-spacing: -0.01em;
  margin: 0;
}
.hero-subtitle {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
  margin: 4px 0 0;
}
.btn-ghost {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  font-size: 13.5px;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.2s;
}
.btn-ghost:hover {
  background: rgba(255, 255, 255, 0.16);
}

.console-body {
  max-width: 1200px;
  margin: 0 auto;
  padding: 28px 24px 60px;
}

.search-field {
  position: relative;
  max-width: 380px;
  display: flex;
  align-items: center;
  color: #64748b;
  margin-bottom: 24px;
}
:global(.dark) .search-field {
  color: #94a3b8;
}
.search-field svg {
  position: absolute;
  left: 14px;
  pointer-events: none;
}
.search-field input {
  width: 100%;
  padding: 10px 14px 10px 40px;
  border-radius: 999px;
  border: 1px solid #e2e8f0;
  background: #ffffff;
  color: #0f172a;
  font-size: 13.5px;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}
:global(.dark) .search-field input {
  border-color: #223047;
  background: #131b2e;
  color: #e2e8f0;
}
.search-field input::placeholder {
  color: #64748b;
}
:global(.dark) .search-field input::placeholder {
  color: #94a3b8;
}
.search-field input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.18);
}
:global(.dark) .search-field input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.18);
}

.loading-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  padding: 80px 20px;
  color: #64748b;
  font-size: 14px;
}
:global(.dark) .loading-block {
  color: #94a3b8;
}
.spinner {
  width: 34px;
  height: 34px;
  border-radius: 999px;
  border: 3px solid #e2e8f0;
  border-top-color: #2563eb;
  animation: spin 0.7s linear infinite;
}
:global(.dark) .spinner {
  border-color: #223047;
  border-top-color: #3b82f6;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.roles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
  gap: 16px;
}

.role-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
}
:global(.dark) .role-card {
  background: #131b2e;
  border-color: #223047;
}
.role-card:hover {
  border-color: rgba(37, 99, 235, 0.4);
  transform: translateY(-2px);
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
}
:global(.dark) .role-card:hover {
  border-color: rgba(59, 130, 246, 0.4);
}

.role-card-top {
  display: flex;
  align-items: center;
  gap: 12px;
}
.role-glyph {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 15px;
  flex-shrink: 0;
}

.domain-color-0 { background: #eef2ff; color: #4f46e5; }
.domain-color-1 { background: #ecfdf5; color: #059669; }
.domain-color-2 { background: #fff7ed; color: #c2410c; }
.domain-color-3 { background: #fdf2f8; color: #be185d; }
.domain-color-4 { background: #f0f9ff; color: #0369a1; }
.domain-color-5 { background: #fefce8; color: #a16207; }
.domain-color-6 { background: #f5f3ff; color: #7c3aed; }
.domain-color-7 { background: #f0fdfa; color: #0f766e; }

:global(.dark) .domain-color-0 { background: rgba(99, 102, 241, 0.18); color: #a5b4fc; }
:global(.dark) .domain-color-1 { background: rgba(16, 185, 129, 0.18); color: #6ee7b7; }
:global(.dark) .domain-color-2 { background: rgba(249, 115, 22, 0.18); color: #fdba74; }
:global(.dark) .domain-color-3 { background: rgba(236, 72, 153, 0.18); color: #f9a8d4; }
:global(.dark) .domain-color-4 { background: rgba(14, 165, 233, 0.18); color: #7dd3fc; }
:global(.dark) .domain-color-5 { background: rgba(217, 119, 6, 0.18); color: #fcd34d; }
:global(.dark) .domain-color-6 { background: rgba(139, 92, 246, 0.18); color: #c4b5fd; }
:global(.dark) .domain-color-7 { background: rgba(20, 184, 166, 0.18); color: #5eead4; }
.role-info {
  min-width: 0;
}
.role-name {
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
:global(.dark) .role-name {
  color: #e2e8f0;
}
.role-slug {
  font-size: 11px;
  color: #64748b;
}
:global(.dark) .role-slug {
  color: #94a3b8;
}

.role-card-meta {
  display: flex;
}
.perm-badge {
  display: inline-flex;
  align-items: baseline;
  gap: 6px;
  background: rgba(37, 99, 235, 0.1);
  padding: 4px 12px;
  border-radius: 999px;
}
:global(.dark) .perm-badge {
  background: rgba(59, 130, 246, 0.15);
}
.perm-count {
  font-size: 14px;
  font-weight: 700;
  color: #2563eb;
}
:global(.dark) .perm-count {
  color: #3b82f6;
}
.perm-label {
  font-size: 11.5px;
  color: #64748b;
}
:global(.dark) .perm-label {
  color: #94a3b8;
}

.role-card-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  border-top: 1px solid #e2e8f0;
  padding-top: 14px;
  margin-top: auto;
}
:global(.dark) .role-card-actions {
  border-top-color: #223047;
}
.action-spacer {
  flex: 1;
}
.card-action {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12.5px;
  font-weight: 600;
  color: #2563eb;
  text-decoration: none;
}
:global(.dark) .card-action {
  color: #3b82f6;
}
.card-action:hover {
  text-decoration: underline;
}
.icon-action {
  width: 30px;
  height: 30px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
}
:global(.dark) .icon-action {
  color: #94a3b8;
}
.icon-action:hover {
  background: rgba(37, 99, 235, 0.1);
  color: #2563eb;
}
:global(.dark) .icon-action:hover {
  background: rgba(59, 130, 246, 0.15);
  color: #3b82f6;
}
.icon-action.is-danger:hover {
  background: rgba(239, 68, 68, 0.12);
  color: #ef4444;
}

.empty-note {
  text-align: center;
  color: #64748b;
  font-size: 13.5px;
  padding: 60px 20px;
}
:global(.dark) .empty-note {
  color: #94a3b8;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(8, 10, 20, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  backdrop-filter: blur(4px);
}
.modal {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  width: 100%;
  max-width: 440px;
  overflow: hidden;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.35);
  font-family: "Sora", ui-sans-serif, sans-serif;
}
:global(.dark) .modal {
  background: #131b2e;
  border-color: #223047;
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 22px;
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  color: white;
}
:global(.dark) .modal-header {
  background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
}
.modal-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
}
.modal-close {
  background: rgba(255, 255, 255, 0.15);
  border: none;
  color: white;
  cursor: pointer;
  padding: 6px;
  border-radius: 999px;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}
.modal-close:hover {
  background: rgba(255, 255, 255, 0.28);
}
.modal-body {
  padding: 22px;
}
.form-group {
  margin-bottom: 20px;
}
.form-label {
  display: block;
  margin-bottom: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #0f172a;
}
:global(.dark) .form-label {
  color: #e2e8f0;
}
.form-input {
  width: 100%;
  padding: 11px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  font-size: 13.5px;
  color: #0f172a;
  background: #f8fafc;
  transition: all 0.2s;
}
:global(.dark) .form-input {
  border-color: #223047;
  color: #e2e8f0;
  background: #0b1120;
}
.form-input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.18);
}
:global(.dark) .form-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.18);
}
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}
.btn-secondary {
  background: none;
  color: #64748b;
  border: 1px solid #e2e8f0;
  padding: 10px 20px;
  border-radius: 10px;
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
:global(.dark) .btn-secondary {
  color: #94a3b8;
  border-color: #223047;
}
.btn-secondary:hover {
  background: rgba(15, 23, 42, 0.06);
}
:global(.dark) .btn-secondary:hover {
  background: rgba(226, 232, 240, 0.08);
}
.btn-primary {
  padding: 10px 22px;
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 13.5px;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
:global(.dark) .btn-primary {
  background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
}
.btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 8px 20px rgba(37, 99, 235, 0.35);
}
:global(.dark) .btn-primary:hover:not(:disabled) {
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.35);
}
.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

@media (max-width: 640px) {
  .console-body {
    padding: 20px 16px 40px;
  }
  .roles-grid {
    grid-template-columns: 1fr;
  }
}
</style>
