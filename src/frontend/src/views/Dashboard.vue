<template>
  <div class="min-h-screen bg-gray-50">
    <nav class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <h1 class="text-xl font-bold text-blue-600">POS System</h1>
            </div>
          </div>
          <div class="flex items-center">
            <span class="mr-4 text-gray-700" v-if="auth.user">
              {{ auth.user.name }} ({{ auth.user.roles[0]?.name || 'User' }})
            </span>
            <button 
              @click="handleLogout"
              class="text-gray-600 hover:text-gray-900"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>

    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <div class="border-4 border-dashed border-gray-200 rounded-lg h-96 p-8">
          <h2 class="text-2xl font-bold mb-4">Dashboard</h2>
          
          <div v-if="auth.user" class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-white p-6 shadow rounded">
              <h3 class="font-bold text-lg mb-2">Organization</h3>
              <p>{{ auth.user.organization?.name || 'Loading...' }}</p>
            </div>

            <div class="bg-white p-6 shadow rounded">
              <h3 class="font-bold text-lg mb-2">My Store</h3>
              <p>{{ auth.user.store?.name || 'No Store Assigned' }}</p>
            </div>

            <div class="bg-white p-6 shadow rounded col-span-2">
              <h3 class="font-bold text-lg mb-2">Quick Actions</h3>
              <div class="flex gap-4">
                <button class="bg-green-500 text-white px-4 py-2 rounded">New Sale</button>
                <button class="bg-blue-500 text-white px-4 py-2 rounded">Inventory</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';

const auth = useAuthStore();
const router = useRouter();

onMounted(async () => {
    if (!auth.user) {
        await auth.fetchUser();
    }
});

const handleLogout = async () => {
  await auth.logout();
  router.push('/login');
};
</script>
