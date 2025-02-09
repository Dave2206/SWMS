<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <h1 class="text-3xl font-semibold mb-6 text-gray-800">Account Management</h1>

    <!-- Create Account Button -->
    <Button 
      label="Create Account" 
      icon="pi pi-plus" 
      severity="info" 
      class="mb-6 px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all" 
      @click="showCreateDialog = true"
    ></Button>

    <!-- Create Account Dialog -->
    <Dialog 
      v-model:visible="showCreateDialog" 
      header="Create Account" 
      :modal="true" 
      :closable="true" 
      :style="{ width: '35vw' }"
    >
      <form @submit.prevent="createAccount">
        <div class="field mb-4">
          <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
          <InputText 
            id="name" 
            v-model="formData.name" 
            type="text" 
            class="w-full mt-1 border-gray-300 rounded-lg shadow-sm"
            required
          />
        </div>

        <div class="field mb-4">
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <InputText 
            id="email" 
            v-model="formData.email" 
            type="email" 
            class="w-full mt-1 border-gray-300 rounded-lg shadow-sm"
            required
          />
        </div>

        <div class="field mb-4">
          <label for="role" class="block text-sm font-medium text-gray-700">Role</label>
          <Select 
            id="role" 
            v-model="formData.role" 
            :options="roles" 
            option-label="label" 
            option-value="value" 
            placeholder="Select a role"
            class="w-full mt-1 border-gray-300 rounded-lg shadow-sm"
          ></Select>
        </div>

        <div class="flex justify-end space-x-2">
          <Button label="Cancel" severity="secondary" @click="showCreateDialog = false"></Button>
          <Button label="Save" type="submit" severity="success"></Button>
        </div>
      </form>
    </Dialog>

    <!-- Account Table -->
    <DataTable :value="accounts" paginator :rows="10" stripedRows >
      <Column field="name" header="Name"></Column>
      <Column field="email" header="Email"></Column>
      <Column field="role" header="Role"></Column>
      <Column header="Actions">
        <template #body="slotProps">
          <div class="flex space-x-2">
            <Button 
              icon="pi pi-pencil" 
              severity="success" 
              class="p-button-rounded p-button-text" 
              @click="editAccount(slotProps.data)"
            ></Button>
            <Button 
              icon="pi pi-trash" 
              severity="danger" 
              class="p-button-rounded p-button-text" 
              @click="confirmDeleteAccount(slotProps.data)"
            ></Button>
          </div>
        </template>
      </Column>
    </DataTable>

    <!-- Edit Account Dialog -->
    <Dialog 
      v-model:visible="showEditDialog" 
      header="Edit Account" 
      :modal="true" 
      :closable="true" 
      :style="{ width: '35vw' }"
    >
      <form @submit.prevent="updateAccount">
        <div class="field mb-4">
          <label for="edit-name" class="block text-sm font-medium text-gray-700">Name</label>
          <InputText 
            id="edit-name" 
            v-model="editData.name" 
            type="text" 
            class="w-full mt-1 border-gray-300 rounded-lg shadow-sm"
            required
          />
        </div>

        <div class="field mb-4">
          <label for="edit-email" class="block text-sm font-medium text-gray-700">Email</label>
          <InputText 
            id="edit-email" 
            v-model="editData.email" 
            type="email" 
            class="w-full mt-1 border-gray-300 rounded-lg shadow-sm"
            required
          />
        </div>

        <div class="field mb-4">
          <label for="edit-role" class="block text-sm font-medium text-gray-700">Role</label>
          <Select 
            id="edit-role" 
            v-model="editData.role" 
            :options="roles" 
            option-label="label" 
            option-value="value" 
            placeholder="Select a role"
            class="w-full mt-1 border-gray-300 rounded-lg shadow-sm"
          ></Select>
        </div>

        <div class="flex justify-end space-x-2">
          <Button label="Cancel" class="text-gray-600 hover:text-gray-900" @click="showEditDialog = false"></Button>
          <Button label="Update" type="submit" class="primary px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all"></Button>
        </div>
      </form>
    </Dialog>

    <!-- Confirmation Dialog for Deletion -->
    <Dialog 
      v-model:visible="showConfirmDialog" 
      header="Confirm Deletion" 
      :modal="true" 
      :closable="true" 
      :style="{ width: '30vw' }"
    >
      <p>Are you sure you want to delete this account?</p>
      <div class="flex justify-end space-x-2">
        <Button label="Cancel" severity="secondary" @click="showConfirmDialog = false"></Button>
        <Button label="Confirm" severity="success" @click="deleteAccount"></Button>
      </div>
    </Dialog>

    <!-- Toast Notification -->
    <Toast ref="toast"></Toast>
  </div>
</template>
<script>
import axios from 'axios';

export default {
  data() {
    return {
      showCreateDialog: false,
      showEditDialog: false,
      showConfirmDialog: false,
      roles: [], // Initially empty, will be populated from API
      accounts: [],
      formData: {
        name: '',
        email: '',
        role: '',
      },
      editData: {},
      selectedAccount: null,
    };
  },
  created() {
    this.fetchAccounts();
    this.fetchRoles(); // Fetch roles when component is created
  },
  methods: {
    // Fetch all accounts
    fetchAccounts() {
      axios.get('http://127.0.0.1:8000/api/users')
        .then(response => {
          this.accounts = response.data;
        })
        .catch(error => {
          this.showErrorToast('Failed to fetch accounts',error);
        });
    },

    // Fetch roles from API
    fetchRoles() {
      axios.get('http://127.0.0.1:8000/api/roles') // Update with your actual API endpoint
        .then(response => {
          this.roles = response.data.map(role => ({
            label: role.user_role, // Adjust based on API response structure
            value: role.id,   // Use role ID as value
          }));
        })
        .catch(error => {
          this.showErrorToast('Failed to fetch roles',error);
        });
    },

    // Create a new account
    createAccount() {
      axios.post('http://127.0.0.1:8000/api/users', this.formData)
        .then(response => {
          this.accounts.push(response.data);
          this.resetFormData();
          this.showCreateDialog = false;
          this.fetchAccounts();
          this.showSuccessToast('Account created successfully');
        })
        .catch(error => {
          this.showErrorToast('Failed to create account',error);
        });
    },

    // Edit an existing account
    editAccount(account) {
      this.editData = { ...account };
      this.showEditDialog = true;
    },

    // Update account information
    updateAccount() {
      axios.put(`http://127.0.0.1:8000/api/users/${this.editData.id}`, this.editData)
        .then(response => {
          const index = this.accounts.findIndex(a => a.id === this.editData.id);
          if (index !== -1) {
            this.accounts.splice(index, 1, response.data);
          }
          this.showEditDialog = false;
          this.fetchAccounts();
          this.showSuccessToast('Account updated successfully');
        })
        .catch(error => {
          this.showErrorToast('Failed to update account',error);
        });
    },

    // Confirm account deletion
    confirmDeleteAccount(account) {
      this.selectedAccount = account;
      this.showConfirmDialog = true;
    },

    // Delete an account
    deleteAccount() {
      axios.delete(`http://127.0.0.1:8000/api/users/${this.selectedAccount.id}`)
        .then(response => {
          this.accounts = this.accounts.filter(a => a.id !== this.selectedAccount.id);
          this.showConfirmDialog = false;
          this.fetchAccounts();
          this.showSuccessToast('Account deleted successfully',response.data.message);
        })
        .catch(error => {
          this.showErrorToast('Failed to delete account',error);
        });
    },

    // Reset form data
    resetFormData() {
      this.formData = {
        name: '',
        email: '',
        role: '',
      };
    },

    // Show success toast
    showSuccessToast(message) {
      this.$refs.toast.add({ severity: 'success', summary: 'Success', detail: message, life: 3000 });
    },

    // Show error toast
    showErrorToast(message) {
      this.$refs.toast.add({ severity: 'error', summary: 'Error', detail: message, life: 3000 });
    },
  },
};
</script>
