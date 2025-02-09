<template>
  <div class="container mx-auto p-6 max-w-lg">
    <h2 class="text-2xl font-bold mb-4">Update Account</h2>
    <form @submit.prevent="updateAccount">
      <div class="mb-4">
        <label class="block text-gray-700">Username</label>
        <input v-model="form.name" type="text" class="w-full p-2 border rounded" />
      </div>
      
      <div class="mb-4">
        <label class="block text-gray-700">Email</label>
        <input v-model="form.email" type="email" class="w-full p-2 border rounded" />
      </div>
      
      <div class="mb-4">
        <label class="block text-gray-700">New Password</label>
        <input v-model="form.password" type="password" class="w-full p-2 border rounded" />
      </div>
      
      <div class="mb-4">
        <label class="block text-gray-700">Confirm Password</label>
        <input v-model="form.password_confirmation" type="password" class="w-full p-2 border rounded" />
      </div>
      <button type="submit" class="bg-blue-500 text-white p-2 rounded">Update</button>
    </form>
  </div>
  <Toast ref="toast"></Toast>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      form: {
        name: '',
        email: '',
        password: '',
        password_confirmation:'',
      },
    };
  },
  methods: {
    async updateAccount() {
      try {
        this.errorMessage = '';
        this.successMessage = '';
        
        const token = localStorage.getItem('auth_token'); // Ensure token is stored in localStorage
        const response = await axios.put('http://127.0.0.1:8000/api/user/update', this.form, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        this.$refs.toast.add({ severity: 'success', summary: 'User Profile updated successfully', detail:response.data.message, life: 3000 })
      } catch (error) {
        this.$refs.toast.add({ severity: 'error', summary: 'User Profile updated failed', detail:error.response?.data?.message, life: 3000 })
      }
    }
  }
};
</script>

<style scoped>
.container {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
</style>
