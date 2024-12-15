<template>
  <div class="flex flex-col min-h-screen bg-gray-50">
    <!-- Header -->
    <Header />

    <!-- Banner -->
    <div class="w-full bg-gradient-to-r from-green-600 to-green-500 flex items-center justify-center text-center text-white relative"
      style="height: 30vh;">
      <div class="absolute inset-0 bg-black opacity-50"></div> <!-- Subtle Overlay -->
      <div class="relative z-10 px-6 sm:px-8">
        <!-- Main Heading -->
        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-semibold text-white mb-6">
          Solid Waste Management System
        </h1>
      </div>
    </div>

    <!-- Our Services Section -->
    <div class="text-center py-16 px-6 sm:px-8 lg:px-12 bg-gray-100">
      <h2 class="text-xl sm:text-4xl font-semibold text-gray-800">Our Services</h2>
      <p class="mt-6 text-lg text-gray-700 max-w-4xl mx-auto">
        Explore our services designed to enhance waste management, sustainability, and keep you informed about the latest updates.
      </p>
    </div>

    <!-- Services Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-6 sm:px-8 lg:px-12 py-8">
      <!-- Card 1: Submit Complaints -->
      <p-card class="service-card bg-red-600">
      <template #title>
        <h3 class="text-xl font-semibold text-gray">Submit Concerns</h3>
      </template>
      <template #content>
        <p class="text-gray">Easily submit waste management complaints.</p>
      </template>
      <template #footer>
        <!-- Button to navigate to ComplainPage -->
        <Button
          label="View Reports"
          icon="pi pi-file"
          class="w-full p-button-success p-button-text"
          @click="goToComplainPage"
        />
      </template>
    </p-card>

      <!-- Card 2: Announcements -->
      <p-card class="service-card bg-green-600">
        <template #title>
          <h3 class="text-xl font-semibold text-gray">Announcements</h3>
        </template>
        <template #content>
          <p class="text-gray">Stay updated with the latest announcements and notifications.</p>
        </template>
        <template #footer>
          <Button label="View Announcements" icon="pi pi-megaphone" class="w-full p-button-info p-button-text" />
        </template>
      </p-card>

      <!-- Card 3: Education -->
      <p-card class="service-card bg-blue-600">
        <template #title>
          <h3 class="text-xl font-semibold text-gray">Education</h3>
        </template>
        <template #content>
          <p class="text-gray">Learn more about recycling, sustainability, and waste management.</p>
        </template>
        <template #footer>
          <Button label="Learn More" icon="pi pi-book" class="w-full p-button-text" />
        </template>
      </p-card>
    </div>
  </div>
</template>

<script>
import Header from "./Header.vue";
import Card from 'primevue/card';

export default {
  name: "LandingPage",
  components: { Header, 'p-card': Card },
   methods: {
    goToComplainPage() {
      // Use Vue Router to navigate to ComplainPage
      this.$router.push({ name: 'ComplainPage' });
    }
  }
};
</script>

<style scoped>
/* Banner Section */
.bg-gradient-to-r {
  background: linear-gradient(to right, #5fbde9bd, #85f0a1); /* Green gradient */
}

/* Text Shadow for Heading */
.text-shadow-lg {
  text-shadow: 3px 3px 12px rgba(0, 0, 0, 0.7);
}

/* Apply Poppins font to entire page */
body {
  font-family: 'Poppins', sans-serif;
}

/* Banner Text Styling */
h1, p {
  font-family: 'Poppins', sans-serif;
}

/* Cards Styling */
.service-card {
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 24px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.service-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

/* Button Styling */
.p-button-success {
  background-color: #38A169; /* Green Button */
  border: none;
  color: white;
}

.p-button-info {
  background-color: #2B6A4B; /* Darker Green Button */
  border: none;
  color: white;
}

.p-button-warning {
  background-color: #3182CE; /* Blue Button */
  border: none;
  color: white;
}

/* Button Hover Effects */
.p-button-success:hover, .p-button-info:hover, .p-button-warning:hover {
  opacity: 0.9;
}

/* Grid Layout */
.grid {
  display: grid;
  gap: 24px;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  justify-items: center;
}

/* Footer Styling */
footer {
  font-size: 1rem;
  text-align: center;
  color: #E2E8F0;
}

/* General Margin and Padding */
section {
  padding: 40px 0;
}
</style>
