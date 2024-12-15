<template>
  <div class="header-container shadow-md">
    <!-- Menu Bar -->
    <Menubar :model="menuItems">
      <template #start>
        <span class="text-xl font-bold text-white">Solid Waste Management System</span>
      </template>
      <template #end>
        <!-- Button to trigger the login modal -->
        <Button label="Login" icon="pi pi-user" class="p-button-outlined p-button-lg" @click="showLoginModal = true" />
      </template>
    </Menubar>
  </div>

  <!-- Login Modal -->
  <Dialog header="Login" v-model:visible="showLoginModal" modal class="login-modal">
    <div class="p-fluid">
      <div class="p-field">
        <label for="username" class="label">Username</label>
        <InputText id="username" v-model="username" placeholder="Enter your username" class="input-field" />
      </div>
      <div class="p-field">
        <label for="password" class="label">Password</label>
        <InputText type="password" id="password" v-model="password" placeholder="Enter your password" class="input-field" feedback />
      </div>
      <div class="p-field button-container">
        <Button label="Login" icon="pi pi-sign-in" class="p-button-success w-full login-btn" @click="login" />
      </div>
    </div>
  </Dialog>
</template>

<script>
export default {
  name: "HeaderVue",
  data() {
    return {
      showLoginModal: false, // Controls modal visibility
      username: '', // Username input field
      password: '', // Password input field
      menuItems: [
        // Your menu items here (optional for now)
      ]
    };
  },
  methods: {
    login() {
      // Handle login logic here
      console.log('Logging in with:', this.username, this.password);
      this.showLoginModal = false; // Close the modal after login
    }
  }
};
</script>

<style scoped>
/* Header styling */
.header-container {
  background-color: #2C3E50; /* Dark header background */
}

/* Menu Bar Text */
.menubar .p-menubar-start {
  color: white;
}

/* Modal Styling */
.login-modal .p-dialog {
  width: 400px;
  border-radius: 8px;
  padding: 30px;
  background-color: #f9f9f9;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

/* Label Styling */
.label {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  display: block;
}

/* Input Field Styling */
.input-field {
  border-radius: 6px;
  background-color: #fafafa;
  padding: 12px;
  border: 1px solid #ccc;
  width: 100%;
  font-size: 16px;
}

.input-field:focus {
  border-color: #4CAF50; /* Green focus color */
  outline: none;
  box-shadow: 0 0 5px rgba(76, 175, 80, 0.5); /* Green focus shadow */
}

/* Button Styling */
.login-btn {
  border-radius: 6px;
  font-size: 16px;
  padding: 12px;
  font-weight: bold;
  background-color: #4CAF50; /* Green color */
  border: none;
  transition: background-color 0.3s ease, transform 0.2s ease;
  width: auto;
  margin: 0 auto; /* Centering button */
}

.login-btn:hover {
  background-color: #45a049; /* Darker green on hover */
  transform: translateY(-3px);
}

.login-btn:focus {
  outline: none;
}

/* Button Container */
.button-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

/* Responsive Styling */
@media (max-width: 600px) {
  .login-modal .p-dialog {
    width: 90%;
    padding: 20px 10px;
  }

  .login-btn {
    font-size: 14px;
    padding: 10px;
  }
}

/* Menubar Styling */
.p-menubar {
  background-color: #2C3E50; /* Dark header background */
  border: none;
}

.p-menubar .p-menuitem-link {
  color: #ecf0f1;
  font-size: 16px;
}

.p-menubar .p-menuitem-link:hover {
  background-color: #34495E; /* Darker background on hover */
  color: #ffffff;
}

/* Button Styles for Menubar */
.p-button-outlined {
  color: #ecf0f1; /* White color for text */
  border-color: #ecf0f1;
}

.p-button-outlined:hover {
  background-color: #34495E; /* Darker color on hover */
  border-color: #ecf0f1;
}
</style>
