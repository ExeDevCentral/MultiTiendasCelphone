<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h1 class="text-2xl font-bold mb-6 text-center text-gray-800">Multi-Store POS</h1>
      
      <div v-if="auth.error" class="bg-red-100 text-red-700 p-3 rounded mb-4">
        {{ auth.error }}
      </div>

      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2">Email</label>
          <input 
            v-model="email" 
            type="email" 
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
            placeholder="admin@demo.com"
          >
        </div>
        
        <div class="mb-6">
          <label class="block text-gray-700 text-sm font-bold mb-2">Password</label>
          <input 
            v-model="password" 
            type="password" 
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
            placeholder="password"
          >
        </div>
        
        <div class="flex items-center justify-between">
          <button 
            type="submit" 
            class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            :disabled="auth.loading"
          >
            {{ auth.loading ? 'Logging in...' : 'Sign In' }}
          </button>
        </div>
      </form>

      <p class="mt-4 text-center text-sm text-gray-600">
        Demo: admin@demo.com / password
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

const email = ref('admin@demo.com'); // Pre-fill for demo
const password = ref('password');
const auth = useAuthStore();
const router = useRouter();

const handleLogin = async () => {
  const success = await auth.login({
    email: email.value,
    password: password.value
  });

  if (success) {
    router.push('/dashboard');
  }
};
</script>
