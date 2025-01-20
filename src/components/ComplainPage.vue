<template>
  <div class="complaint-form">
    <div class="form-container">
      <h2>Submit a Solid Waste Disposal Complaint</h2>

      <form @submit.prevent="submitComplaint">
        <!-- Subject Dropdown -->
        <div class="p-field">
          <label for="subject">Subject:</label>
          <Select v-model="form.subject" :options="subjectOptions" optionLabel="label" optionValue="value" placeholder="Select Subject" required class="w-full" />
        </div>

        <!-- Email Input -->
        <div class="p-field">
          <label for="email">Email:</label>
          <InputText v-model="form.email" id="email" type="email" placeholder="Enter your email" required class="w-full" />
        </div>

        <!-- Address Input (Based on Location) -->
        <div class="p-field">
          <label for="address">Address:</label>
          <InputText v-model="form.address" id="address" type="text" placeholder="Fetching address..." readonly class="w-full" />
          <Button label="Get My Location" icon="pi pi-map-marker" @click="getLocation" class="p-button-text p-button-sm" />
        </div>

        <!-- Description Textarea -->
        <div class="p-field">
          <label for="description">Description:</label>
          <Textarea v-model="form.description" id="description" rows="5" placeholder="Describe the issue" required class="w-full" />
        </div>

        <!-- File Upload -->
        <div class="p-field">
          <label for="file">Attachment:</label>
          <FileUpload v-model="form.file" name="file" chooseLabel="Choose File" uploadLabel="Upload" class="w-full" />
        </div>

        <!-- Submit Button -->
        <Button label="Submit Complaint" type="submit" icon="pi pi-send" class="p-button-rounded p-button-success w-full" />
      </form>
    </div>
  </div>
  <Toast ref="toast"></Toast>
</template>

<script>
import axios from "axios";

export default {
  name: "ComplainPage",
  data() {
    return {
      subjectOptions: [
        { label: "Garbage not picked up", value: "Garbage not picked up" },
        { label: "No garbage pickup truck", value: "No garbage pickup truck" },
        { label: "Request for garbage pickup", value: "Request for garbage pickup" },
        { label: "Too many garbage on the streets", value: "Too many garbage on the streets" },
      ],
      form: {
        subject: null,
        email: "",
        address: "",
        description: "",
        file: null,
      },
    };
  },
  methods: {
    async getLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            this.fetchAddress(lat, lon);
          },
          (error) => {
            console.error("Geolocation error:", error);
            alert("Unable to fetch your location.");
          }
        );
      } else {
        alert("Geolocation is not supported by this browser.");
      }
    },
    async fetchAddress(lat, lon) {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`
        );
        const data = await response.json();
        if (data && data.address) {
          this.form.address = `${data.address.road || ""}, ${data.address.city || ""}, ${data.address.country || ""}`;
        }
      } catch (error) {
        console.error("Error fetching address:", error);
      }
    },
    showSuccessToast(message) {
      this.$refs.toast.add({ severity: 'success', summary: 'Success', detail: message, life: 3000 });
    },
    showErrorToast(message) {
      this.$refs.toast.add({ severity: 'error', summary: 'Error', detail: message, life: 3000 });
    },
    async submitComplaint() {
      const formData = new FormData();
      formData.append("subject", this.form.subject);
      formData.append("email", this.form.email);
      formData.append("address", this.form.address);
      formData.append("description", this.form.description);
      if (this.form.file) {
        formData.append("file", this.form.file);
      }

      try {
        const response = await axios.post("http://127.0.0.1:8000/api/complaints", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
          this.showSuccessToast(response.data.message);
      } catch (error) {
          this.showErrorToast(error.response.data.message);
      }
    },
  },
};
</script>

<style scoped>
.complaint-form {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f4f8;
}

.form-container {
  background-color: #ffffff;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 700px;
}

h2 {
  text-align: center;
  color: #333;
  font-size: 24px;
  margin-bottom: 20px;
}

.p-field {
  margin-bottom: 1.5em;
}

.p-field label {
  font-weight: bold;
}

button {
  width: 100%;
  padding: 10px;
}

.p-button-rounded {
  border-radius: 50px;
}

.p-button-success {
  background-color: #28a745;
  border: none;
}

.p-button-success:hover {
  background-color: #218838;
}

@media (max-width: 768px) {
  .form-container {
    padding: 20px;
  }

  h2 {
    font-size: 20px;
  }
}
</style>
