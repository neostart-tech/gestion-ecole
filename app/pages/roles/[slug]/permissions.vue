<template>
  <div class="console">
    <!-- Hero -->
    <header class="hero">
      <div class="hero-grid" aria-hidden="true"></div>
      <div class="hero-inner">
        <nav class="crumb">
          <NuxtLink to="/roles/liste">Rôles</NuxtLink>
          <span>/</span>
          <span class="crumb-current">{{ role ? role.nom : "…" }}</span>
        </nav>

        <div class="hero-row">
          <div class="hero-identity">
            <div class="role-glyph">{{ initials }}</div>
            <div>
              <h1 class="hero-title">{{ role ? role.nom : "Chargement…" }}</h1>
              <p class="hero-subtitle">Console d'accès &middot; permissions rattachées à ce rôle</p>
            </div>
          </div>

          <NuxtLink to="/roles/liste" class="btn-ghost">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour
          </NuxtLink>
        </div>

        <div v-if="role" class="hero-stats">
          <div class="stat">
            <span class="stat-value">{{ grantedCount }}</span>
            <span class="stat-label">Accordées</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat">
            <span class="stat-value">{{ allPermissions.length }}</span>
            <span class="stat-label">Disponibles</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat">
            <span class="stat-value">{{ permissionGroups.length }}</span>
            <span class="stat-label">Domaines</span>
          </div>
          <div class="stat-divider stat-divider-fill"></div>
          <div class="coverage">
            <div class="coverage-track">
              <div class="coverage-fill" :style="{ width: `${coveragePercent}%` }"></div>
            </div>
            <span class="coverage-label">{{ coveragePercent }}% de couverture</span>
          </div>
        </div>
      </div>
    </header>

    <!-- Chargement -->
    <div v-if="isLoading" class="loading-block">
      <div class="spinner"></div>
      <p>Chargement des permissions…</p>
    </div>

    <template v-else-if="role">
      <div class="console-body">
        <!-- Barre d'outils -->
        <div class="toolbar">
          <div class="search-field">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input v-model="permissionSearch" type="search" placeholder="Rechercher un domaine ou une permission…" />
          </div>
          <div class="toolbar-actions">
            <button type="button" class="link-btn" @click="expandAll">Tout déplier</button>
            <span class="dot">&middot;</span>
            <button type="button" class="link-btn" @click="collapseAll">Tout replier</button>
          </div>
        </div>

        <!-- Ledger des domaines -->
        <div v-if="filteredPermissionGroups.length > 0" class="ledger">
          <details
            v-for="group in filteredPermissionGroups"
            :key="group.domain"
            class="domain-row"
            :open="openDomains.has(group.domain)"
            @toggle="onToggleDetails(group.domain, $event)"
          >
            <summary class="domain-summary" :class="domainColorClass(group.domain)">
              <span class="domain-glyph">
                {{ group.domain.charAt(0).toUpperCase() }}
              </span>

              <span class="domain-name">{{ formatDomainLabel(group.domain) }}</span>

              <span class="domain-progress">
                <span class="domain-progress-track">
                  <span
                    class="domain-progress-fill"
                    :style="{
                      width: `${(group.perms.filter((p) => selectedPermissionIds.includes(p.id)).length / group.perms.length) * 100}%`,
                    }"
                  ></span>
                </span>
                <span class="domain-count">
                  {{ group.perms.filter((p) => selectedPermissionIds.includes(p.id)).length }}/{{ group.perms.length }}
                </span>
              </span>

              <span
                class="select-all-toggle"
                :class="{ 'is-on': isGroupFullySelected(group), 'is-mixed': isGroupPartiallySelected(group) }"
                role="checkbox"
                :aria-checked="isGroupFullySelected(group)"
                tabindex="0"
                title="Tout accorder / retirer pour ce domaine"
                @click.prevent.stop="toggleGroup(group, !isGroupFullySelected(group))"
                @keydown.space.prevent.stop="toggleGroup(group, !isGroupFullySelected(group))"
              >
                <span class="select-all-knob"></span>
              </span>

              <svg class="chevron" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </summary>

            <div class="permission-list">
              <label v-for="permission in group.perms" :key="permission.id" class="permission-row">
                <span
                  class="switch"
                  :class="{ 'is-on': selectedPermissionIds.includes(permission.id) }"
                  role="checkbox"
                  :aria-checked="selectedPermissionIds.includes(permission.id)"
                  tabindex="0"
                  @click="togglePermission(permission.id)"
                  @keydown.space.prevent="togglePermission(permission.id)"
                >
                  <span class="switch-knob"></span>
                </span>
                <span class="permission-nom">{{ permission.nom }}</span>
                <code v-if="permission.slug" class="permission-slug">{{ permission.slug }}</code>
              </label>
            </div>
          </details>
        </div>
        <p v-else class="empty-note">Aucune permission ne correspond à la recherche.</p>
      </div>

      <!-- Barre d'actions -->
      <div class="dock">
        <span class="dock-hint">Les changements s'appliquent immédiatement à tous les utilisateurs ayant ce rôle.</span>
        <div class="dock-actions">
          <NuxtLink to="/roles/liste" class="btn-secondary">Annuler</NuxtLink>
          <button type="button" class="btn-primary" @click="savePermissions" :disabled="saving">
            <svg v-if="saving" class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            {{ saving ? "Enregistrement…" : "Enregistrer les permissions" }}
          </button>
        </div>
      </div>
    </template>

    <div v-else class="empty-note py-24">Rôle introuvable.</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useState } from "#app";
import { useRoleStore } from "~~/stores/role";
import { useAccess } from "~/composables/useAccess";

const route = useRoute();
const router = useRouter();
const roleStore = useRoleStore();
const { can } = useAccess();
const userLoaded = useState("userLoaded");

const waitForUserLoaded = () =>
  new Promise((resolve) => {
    if (userLoaded.value) {
      resolve();
      return;
    }
    const stop = watch(userLoaded, (loaded) => {
      if (loaded) {
        stop();
        resolve();
      }
    });
  });

const isLoading = ref(true);
const saving = ref(false);
const role = ref(null);
const selectedPermissionIds = ref([]);
const permissionSearch = ref("");
const openDomains = ref(new Set());

const allPermissions = computed(() => roleStore.availablePermissions);

// N'affiche/ne compte que les permissions réellement gérables ici : un rôle peut avoir
// hérité d'une permission legacy non encore sluggée, absente de allPermissions — sans ce
// filtre le compteur "accordées" pouvait dépasser "disponibles" (ex: 110/109 = 101%).
const grantedCount = computed(() => {
  const availableIds = new Set(allPermissions.value.map((p) => p.id));
  return selectedPermissionIds.value.filter((id) => availableIds.has(id)).length;
});

const initials = computed(() => {
  if (!role.value?.nom) return "?";
  return role.value.nom
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join("");
});

const coveragePercent = computed(() => {
  if (!allPermissions.value.length) return 0;
  return Math.min(100, Math.round((grantedCount.value / allPermissions.value.length) * 100));
});

const ACTION_PREFIXES = ["create", "view", "update", "delete", "publish", "send", "declare", "duplicate"];

const permissionDomain = (permission) => {
  const slug = permission.slug || "";
  const prefix = ACTION_PREFIXES.find((a) => slug.startsWith(`${a}-`));
  return prefix ? slug.slice(prefix.length + 1) : (slug || "autre");
};

const formatDomainLabel = (domain) => {
  const label = domain.replace(/-/g, " ");
  return label.charAt(0).toUpperCase() + label.slice(1);
};

// Palette déterministe (même domaine -> même couleur, sans dépendre de l'ordre de rendu).
// Chaque couleur est une classe CSS (voir <style>) qui définit ses propres variantes
// clair/sombre — aucune couleur n'est calculée/injectée en inline, donc le mode sombre
// s'applique automatiquement comme le reste de la page.
const DOMAIN_COLOR_COUNT = 8;
const domainColorClass = (domain) => {
  let hash = 0;
  for (let i = 0; i < domain.length; i++) hash = (hash * 31 + domain.charCodeAt(i)) >>> 0;
  return `domain-color-${hash % DOMAIN_COLOR_COUNT}`;
};

const permissionGroups = computed(() => {
  const groups = {};
  for (const permission of allPermissions.value) {
    const domain = permissionDomain(permission);
    if (!groups[domain]) groups[domain] = [];
    groups[domain].push(permission);
  }
  return Object.entries(groups)
    .map(([domain, perms]) => ({
      domain,
      perms: [...perms].sort((a, b) => a.nom.localeCompare(b.nom)),
    }))
    .sort((a, b) => a.domain.localeCompare(b.domain));
});

const filteredPermissionGroups = computed(() => {
  if (!permissionSearch.value.trim()) return permissionGroups.value;

  const query = permissionSearch.value.toLowerCase();
  return permissionGroups.value
    .map((group) => ({
      domain: group.domain,
      perms: group.domain.toLowerCase().includes(query)
        ? group.perms
        : group.perms.filter((p) => p.nom.toLowerCase().includes(query) || (p.slug || "").includes(query)),
    }))
    .filter((group) => group.perms.length > 0);
});

const isGroupFullySelected = (group) =>
  group.perms.length > 0 && group.perms.every((p) => selectedPermissionIds.value.includes(p.id));

const isGroupPartiallySelected = (group) =>
  !isGroupFullySelected(group) && group.perms.some((p) => selectedPermissionIds.value.includes(p.id));

const toggleGroup = (group, checked) => {
  const groupIds = group.perms.map((p) => p.id);
  if (checked) {
    selectedPermissionIds.value = [...new Set([...selectedPermissionIds.value, ...groupIds])];
  } else {
    selectedPermissionIds.value = selectedPermissionIds.value.filter((id) => !groupIds.includes(id));
  }
};

const togglePermission = (id) => {
  if (selectedPermissionIds.value.includes(id)) {
    selectedPermissionIds.value = selectedPermissionIds.value.filter((existing) => existing !== id);
  } else {
    selectedPermissionIds.value = [...selectedPermissionIds.value, id];
  }
};

const onToggleDetails = (domain, event) => {
  if (event.target.open) {
    openDomains.value.add(domain);
  } else {
    openDomains.value.delete(domain);
  }
};

const expandAll = () => {
  openDomains.value = new Set(permissionGroups.value.map((g) => g.domain));
};

const collapseAll = () => {
  openDomains.value = new Set();
};

const savePermissions = async () => {
  if (!role.value) return;
  saving.value = true;
  try {
    await roleStore.syncRolePermissions(role.value.slug, selectedPermissionIds.value);
    router.push("/roles/liste");
  } catch (error) {
    alert(error.response?.data?.message || "Erreur lors de l'enregistrement des permissions.");
  } finally {
    saving.value = false;
  }
};

onMounted(async () => {
  await waitForUserLoaded();
  if (!can("assign-role-permissions")) {
    router.replace("/unauthorized");
    return;
  }

  isLoading.value = true;
  try {
    const [fetchedRole] = await Promise.all([
      roleStore.fetchRole(route.params.slug),
      roleStore.fetchAvailablePermissions(),
    ]);
    role.value = fetchedRole;
    selectedPermissionIds.value = (fetchedRole?.permissions || []).map((p) => p.id);
  } catch (error) {
    role.value = null;
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap");

/*
 * Mode sombre : uniquement des propriétés littérales redéclarées sous
 * `:global(.dark) .selecteur { ... }`, jamais de variable CSS custom
 * (--xxx) redéfinie dans un bloc :global(.dark). Sur ce projet, cette
 * dernière approche ne se propage pas de façon fiable (probablement le
 * pipeline Lightning CSS/Tailwind v4 côté Nuxt) alors que la redéclaration
 * directe d'une propriété fonctionne toujours. Ne pas réintroduire de
 * variables ici sans re-tester en profondeur.
 */

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

/* Hero */
.hero {
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #0f172a 0%, #172554 60%, #1d4ed8 130%);
  padding: 40px 24px 32px;
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
  max-width: 1100px;
  margin: 0 auto;
}
.crumb {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: "JetBrains Mono", monospace;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.55);
  margin-bottom: 20px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
.crumb a {
  color: rgba(255, 255, 255, 0.75);
  text-decoration: none;
}
.crumb a:hover {
  color: #fff;
}
.crumb-current {
  color: #fff;
}

.hero-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}
.hero-identity {
  display: flex;
  align-items: center;
  gap: 16px;
}
.role-glyph {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.18);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 18px;
  color: #fff;
  flex-shrink: 0;
  backdrop-filter: blur(4px);
}
.hero-title {
  font-size: 26px;
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
  padding: 10px 18px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  transition: background-color 0.2s;
}
.btn-ghost:hover {
  background: rgba(255, 255, 255, 0.1);
}

.hero-stats {
  margin-top: 28px;
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}
.stat {
  display: flex;
  flex-direction: column;
}
.stat-value {
  font-family: "JetBrains Mono", monospace;
  font-size: 22px;
  font-weight: 600;
  color: #fff;
  line-height: 1;
}
.stat-label {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-top: 4px;
}
.stat-divider {
  width: 1px;
  height: 28px;
  background: rgba(255, 255, 255, 0.15);
}
.stat-divider-fill {
  display: none;
}
.coverage {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 180px;
  flex: 1;
  max-width: 260px;
}
.coverage-track {
  height: 6px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.15);
  overflow: hidden;
}
.coverage-fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, #34d399, #60a5fa);
  transition: width 0.3s ease;
}
.coverage-label {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.6);
  font-family: "JetBrains Mono", monospace;
}

@media (min-width: 768px) {
  .stat-divider-fill {
    display: block;
    flex: 1;
    background: none;
    width: auto;
  }
}

/* Corps */
.loading-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  padding: 90px 20px;
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

.console-body {
  max-width: 1100px;
  margin: 0 auto;
  padding: 28px 24px 40px;
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 18px;
}
.search-field {
  position: relative;
  flex: 1;
  min-width: 240px;
  max-width: 420px;
  display: flex;
  align-items: center;
  color: #64748b;
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
.toolbar-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12.5px;
  color: #64748b;
}
:global(.dark) .toolbar-actions {
  color: #94a3b8;
}
.link-btn {
  background: none;
  border: none;
  color: #2563eb;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  font-size: 12.5px;
}
:global(.dark) .link-btn {
  color: #3b82f6;
}
.link-btn:hover {
  text-decoration: underline;
}
.dot {
  opacity: 0.5;
}

/* Ledger */
.ledger {
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  overflow: hidden;
  background: #ffffff;
}
:global(.dark) .ledger {
  border-color: #223047;
  background: #131b2e;
}
.domain-row {
  border-bottom: 1px solid #e2e8f0;
}
:global(.dark) .domain-row {
  border-bottom-color: #223047;
}
.domain-row:last-child {
  border-bottom: none;
}
.domain-row[open] .chevron {
  transform: rotate(180deg);
}
.domain-summary {
  list-style: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 20px;
  user-select: none;
}
.domain-summary::-webkit-details-marker {
  display: none;
}
.domain-summary:hover {
  background: rgba(37, 99, 235, 0.04);
}
:global(.dark) .domain-summary:hover {
  background: rgba(59, 130, 246, 0.08);
}
.domain-glyph {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 13px;
  flex-shrink: 0;
}

/* Palette par domaine : chaque couleur = deux règles directes (clair / sombre),
   jamais de variable CSS custom (voir note en tête de bloc <style>). */
.domain-color-0 .domain-glyph { background: #eef2ff; color: #4f46e5; }
.domain-color-1 .domain-glyph { background: #ecfdf5; color: #059669; }
.domain-color-2 .domain-glyph { background: #fff7ed; color: #c2410c; }
.domain-color-3 .domain-glyph { background: #fdf2f8; color: #be185d; }
.domain-color-4 .domain-glyph { background: #f0f9ff; color: #0369a1; }
.domain-color-5 .domain-glyph { background: #fefce8; color: #a16207; }
.domain-color-6 .domain-glyph { background: #f5f3ff; color: #7c3aed; }
.domain-color-7 .domain-glyph { background: #f0fdfa; color: #0f766e; }

:global(.dark) .domain-color-0 .domain-glyph { background: rgba(99, 102, 241, 0.18); color: #a5b4fc; }
:global(.dark) .domain-color-1 .domain-glyph { background: rgba(16, 185, 129, 0.18); color: #6ee7b7; }
:global(.dark) .domain-color-2 .domain-glyph { background: rgba(249, 115, 22, 0.18); color: #fdba74; }
:global(.dark) .domain-color-3 .domain-glyph { background: rgba(236, 72, 153, 0.18); color: #f9a8d4; }
:global(.dark) .domain-color-4 .domain-glyph { background: rgba(14, 165, 233, 0.18); color: #7dd3fc; }
:global(.dark) .domain-color-5 .domain-glyph { background: rgba(217, 119, 6, 0.18); color: #fcd34d; }
:global(.dark) .domain-color-6 .domain-glyph { background: rgba(139, 92, 246, 0.18); color: #c4b5fd; }
:global(.dark) .domain-color-7 .domain-glyph { background: rgba(20, 184, 166, 0.18); color: #5eead4; }

.domain-color-0 .domain-progress-fill { background: #4f46e5; }
.domain-color-1 .domain-progress-fill { background: #059669; }
.domain-color-2 .domain-progress-fill { background: #c2410c; }
.domain-color-3 .domain-progress-fill { background: #be185d; }
.domain-color-4 .domain-progress-fill { background: #0369a1; }
.domain-color-5 .domain-progress-fill { background: #a16207; }
.domain-color-6 .domain-progress-fill { background: #7c3aed; }
.domain-color-7 .domain-progress-fill { background: #0f766e; }

:global(.dark) .domain-color-0 .domain-progress-fill { background: #a5b4fc; }
:global(.dark) .domain-color-1 .domain-progress-fill { background: #6ee7b7; }
:global(.dark) .domain-color-2 .domain-progress-fill { background: #fdba74; }
:global(.dark) .domain-color-3 .domain-progress-fill { background: #f9a8d4; }
:global(.dark) .domain-color-4 .domain-progress-fill { background: #7dd3fc; }
:global(.dark) .domain-color-5 .domain-progress-fill { background: #fcd34d; }
:global(.dark) .domain-color-6 .domain-progress-fill { background: #c4b5fd; }
:global(.dark) .domain-color-7 .domain-progress-fill { background: #5eead4; }

.domain-name {
  font-weight: 600;
  font-size: 14.5px;
  color: #0f172a;
  text-transform: capitalize;
  min-width: 140px;
}
:global(.dark) .domain-name {
  color: #e2e8f0;
}
.domain-progress {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
  max-width: 260px;
}
.domain-progress-track {
  flex: 1;
  height: 5px;
  border-radius: 999px;
  background: #e2e8f0;
  overflow: hidden;
}
:global(.dark) .domain-progress-track {
  background: #223047;
}
.domain-progress-fill {
  display: block;
  height: 100%;
  border-radius: 999px;
  transition: width 0.25s ease;
}
.domain-count {
  font-family: "JetBrains Mono", monospace;
  font-size: 11.5px;
  color: #64748b;
  white-space: nowrap;
}
:global(.dark) .domain-count {
  color: #94a3b8;
}

.select-all-toggle {
  margin-left: auto;
  width: 38px;
  height: 22px;
  border-radius: 999px;
  background: #e2e8f0;
  position: relative;
  flex-shrink: 0;
  transition: background-color 0.2s;
  cursor: pointer;
}
:global(.dark) .select-all-toggle {
  background: #223047;
}
.select-all-toggle .select-all-knob {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 18px;
  height: 18px;
  border-radius: 999px;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
  transition: transform 0.2s ease;
}
.select-all-toggle.is-on {
  background: #2563eb;
}
:global(.dark) .select-all-toggle.is-on {
  background: #3b82f6;
}
.select-all-toggle.is-on .select-all-knob {
  transform: translateX(16px);
}
.select-all-toggle.is-mixed {
  background: rgba(37, 99, 235, 0.45);
}
:global(.dark) .select-all-toggle.is-mixed {
  background: rgba(59, 130, 246, 0.45);
}

.chevron {
  width: 16px;
  height: 16px;
  color: #64748b;
  flex-shrink: 0;
  transition: transform 0.2s ease;
}
:global(.dark) .chevron {
  color: #94a3b8;
}

.permission-list {
  padding: 4px 20px 16px 66px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.permission-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 4px;
  border-radius: 8px;
  cursor: pointer;
}
.permission-row:hover {
  background: rgba(37, 99, 235, 0.05);
}
:global(.dark) .permission-row:hover {
  background: rgba(59, 130, 246, 0.08);
}
.permission-nom {
  font-size: 13.5px;
  color: #0f172a;
  flex: 1;
}
:global(.dark) .permission-nom {
  color: #e2e8f0;
}
.permission-slug {
  font-family: "JetBrains Mono", monospace;
  font-size: 10.5px;
  color: #64748b;
  background: rgba(226, 232, 240, 0.6);
  padding: 2px 8px;
  border-radius: 6px;
}
:global(.dark) .permission-slug {
  color: #94a3b8;
  background: rgba(34, 48, 71, 0.6);
}

.switch {
  width: 34px;
  height: 20px;
  border-radius: 999px;
  background: #e2e8f0;
  position: relative;
  flex-shrink: 0;
  transition: background-color 0.2s;
}
:global(.dark) .switch {
  background: #223047;
}
.switch .switch-knob {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 16px;
  height: 16px;
  border-radius: 999px;
  background: #fff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.25);
  transition: transform 0.2s ease;
}
.switch.is-on {
  background: #059669;
}
.switch.is-on .switch-knob {
  transform: translateX(14px);
}

.empty-note {
  text-align: center;
  color: #64748b;
  font-size: 13.5px;
  padding: 40px 20px;
}
:global(.dark) .empty-note {
  color: #94a3b8;
}

/* Dock d'actions */
.dock {
  position: sticky;
  bottom: 16px;
  max-width: 1100px;
  margin: 0 auto;
  padding: 14px 22px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid #e2e8f0;
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.12);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}
:global(.dark) .dock {
  background: rgba(19, 27, 46, 0.92);
  border-color: #223047;
}
.dock-hint {
  font-size: 12.5px;
  color: #64748b;
}
:global(.dark) .dock-hint {
  color: #94a3b8;
}
.dock-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-left: auto;
}
.btn-secondary {
  padding: 10px 20px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  color: #0f172a;
  font-size: 13.5px;
  font-weight: 600;
  text-decoration: none;
  transition: background-color 0.2s;
}
:global(.dark) .btn-secondary {
  border-color: #223047;
  color: #e2e8f0;
}
.btn-secondary:hover {
  background: rgba(15, 23, 42, 0.06);
}
:global(.dark) .btn-secondary:hover {
  background: rgba(226, 232, 240, 0.08);
}
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 22px;
  border-radius: 10px;
  border: none;
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  color: #fff;
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
  .domain-progress {
    display: none;
  }
  .domain-name {
    min-width: 0;
    flex: 1;
  }
  .permission-list {
    padding-left: 20px;
  }
  .permission-slug {
    display: none;
  }
  .dock {
    flex-direction: column;
    align-items: stretch;
  }
  .dock-actions {
    margin-left: 0;
    justify-content: stretch;
  }
  .dock-actions > * {
    flex: 1;
    text-align: center;
  }
}
</style>
