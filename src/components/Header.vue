<template>
    <!-- Menu Bar -->
    <Menubar :model="filteredMenuItems">
      <template #start>
        <span class="text-xl font-bold text-gray-800">Solid Waste Management System</span>
      </template>
      <template #end>
        <!-- Login or Logout Button -->
        <Button 
          v-if="!isLoggedIn" 
          label="Login" 
          icon="pi pi-user" 
          class="p-button-outlined p-button-lg" 
          @click="showLoginModal = true" 
        />
        <Button 
          v-if="isLoggedIn" 
          label="Logout" 
          icon="pi pi-sign-out" 
          class="p-button-outlined p-button-lg" 
          @click="logout" 
        />
      </template>
    </Menubar>

    <!-- Login Modal -->
    <Dialog 
      header="Login" 
      v-model:visible="showLoginModal" 
      modal 
      class="login-modal p-dialog-lg" 
      style="width: 40vw; max-width: 500px;"
    >
      <!-- Logo -->
      <div class="flex justify-center mb-6">
        <img src="assets/logo.png" alt="Logo" class="h-25 w-auto" />
      </div>

      <div class="p-fluid">
        <!-- Email Field -->
        <div class="p-field mb-4">
          <label for="email" class="block text-lg font-medium text-gray-700 mb-2">Email</label>
          <InputText 
            id="email" 
            v-model="email" 
            placeholder="Enter your email" 
            class="p-inputtext-lg w-full" 
          />
        </div>

        <!-- Password Field -->
        <div class="p-field mb-6">
          <label for="password" class="block text-lg font-medium text-gray-700 mb-2">Password</label>
          <InputText 
            type="password" 
            id="password" 
            v-model="password" 
            placeholder="Enter your password" 
            class="p-inputtext-lg w-full" 
          />
        </div>

        <!-- Login Button -->
        <div class="p-field button-container">
          <Button 
            label="Login" 
            icon="pi pi-sign-in" 
            class="p-button-lg p-button-success w-full login-btn" 
            @click="login" 
          />
        </div>
      </div>
    </Dialog>
     <!-- Toast Notification -->
    <Toast ref="toast"></Toast>
</template>

<script>
import axios from "axios";

export default {
  name: "HeaderVue",
  data() {
    return {
      showLoginModal: false, // Controls modal visibility
      isLoggedIn: false, // Indicates if the user is logged in
      email: "", // Email input
      password: "", // Password input
      abilities: [], // User's access levels
    };
  },
  computed: {
    filteredMenuItems() {
      // Generate menu items dynamically based on abilities
      return this.abilities.map((ability) => {
        const routes = {
          announcement: { label: "Announcement", icon: "pi pi-megaphone", page: "AnnouncementPage" },
          messages: { label: "Messages", icon: "pi pi-comments", page: "MessagePage" },
          account_management: { label: "Account Management", icon: "pi pi-users", page: "AccountManagementPage" },
          concern: { label: "Concerns", icon: "pi pi-comments", page: "ConcernPage" },
          reports_and_analytics: { label: "Reports and Analytics", icon: "pi pi-file", page: "ReportPage" },
          complain:{ label: "Complain", icon: "pi pi-folder-open", page: "ComplainPage"},
          routes:{ label: "Routes", icon: "pi pi-folder-open", page: "RoutesPage"},
        };

        const route = routes[ability];
        return route
          ? {
              label: route.label,
              icon: route.icon,
              command: () => this.navigateTo(route.page),
            }
          : null;
      }).filter((item) => item !== null); // Filter out null entries
    },
  },
  methods: {
    async login() {
      try {
        const response = await axios.post("http://127.0.0.1:8000/api/login", {
          email: this.email,
          password: this.password,
        });

        // Save token to localStorage
        localStorage.setItem("auth_token", response.data.access_token);

        // Set token in axios headers
        axios.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem("auth_token")}`;

        // Set login state
        this.isLoggedIn = true;
        this.showLoginModal = false;

        this.$refs.toast.add({ severity: 'success', summary: 'Login successfully', detail: "Login successfully", life: 3000 });

        // Fetch user abilities
        await this.fetchAbilities();

        // Redirect to dashboard
        this.$router.push("/DashboardPage");
      } catch (error) {
         this.$refs.toast.add({ severity: 'error', summary: 'Login failed', detail: error.response.data.message, life: 3000 });
      }
    },
    logout() {
      localStorage.removeItem("auth_token");
      this.isLoggedIn = false;
      this.abilities = [];
      this.$router.push("/");
    },
    async fetchAbilities() {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/user/access-levels");
        this.abilities = response.data.access_levels || [];
      } catch (error) {
        console.error("Error fetching abilities:", error);
        this.abilities = [];
      }
    },
    navigateTo(page) {
      this.$router.push({ name: page });
    },
  },
  async mounted() {
    const token = localStorage.getItem("auth_token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      this.isLoggedIn = true;
      await this.fetchAbilities();
    }
  },
};
</script>

<style scoped>
.header-container {
  padding: 0 20px;
  background: #f8f9fa;
}
</style>
