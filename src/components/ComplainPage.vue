<template>
  <div class="complaint-form">
    <div class="form-container">
      <h2>Submit a Solid Waste Disposal Complaint</h2>
      
      <form @submit.prevent="submitComplaint">
        <!-- Subject Dropdown -->
        <div class="p-field">
          <label for="subject">Subject:</label>
          <Select v-model="form.subject" :options="subjectOptions" optionLabel="label" optionValue="value" placeholder="Select Subject" required class="w-full"/>
        </div>

        <!-- Email Input -->
        <div class="p-field">
          <label for="email">Email:</label>
          <InputText v-model="form.email" id="email" type="email" placeholder="Enter your email" required class="w-full"/>
        </div>

        <!-- Address Input (Based on Location) -->
        <div class="p-field">
          <label for="address">Address:</label>
          <InputText v-model="form.address" id="address" type="text" placeholder="Fetching address..." readonly class="w-full"/>
          <Button label="Get My Location" icon="pi pi-map-marker" @click="getLocation" class="p-button-text p-button-sm" />
        </div>

        <!-- Description Textarea -->
        <div class="p-field">
          <label for="description">Description:</label>
          <Textarea v-model="form.description" id="description" rows="5" placeholder="Describe the issue" required class="w-full"/>
        </div>

        <!-- File Upload -->
        <div class="p-field">
          <label for="file">Attachment:</label>
          <FileUpload v-model="form.file" name="file" chooseLabel="Choose File" uploadLabel="Upload" class="w-full"/>
        </div>

        <!-- Submit Button -->
        <Button label="Submit Complaint" type="submit" icon="pi pi-send" class="p-button-rounded p-button-success w-full" />
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import Select from 'primevue/select';
import  InputText  from 'primevue/inputtext';
import  Textarea  from 'primevue/textarea';
import  FileUpload  from 'primevue/fileupload';
import  Button  from 'primevue/button';

export default {
name:"ComplainPage",
  components: {
    Select,
    InputText,
    Textarea,
    FileUpload,
    Button
  },
  setup() {
    const subjectOptions = [
      { label: 'Garbage not picked up', value: 'garbage_not_picked_up' },
      { label: 'No garbage pickup truck', value: 'no_garbage_truck' },
      { label: 'Request for garbage pickup', value: 'request_pickup' },
      { label: 'Too many garbage on the streets', value: 'too_much_garbage' }
    ];

    const form = ref({
      subject: null,
      email: '',
      address: '',
      description: '',
      file: null
    });

    // Function to get user's location and reverse geocode to fetch address
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          fetchAddress(lat, lon);
        }, error => {
          console.error("Geolocation error:", error);
          alert("Unable to fetch your location.");
        });
      } else {
        alert("Geolocation is not supported by this browser.");
      }
    };

    // Function to reverse geocode latitude and longitude to address
    const fetchAddress = async (lat, lon) => {
      // Example using OpenStreetMap Nominatim API to fetch address (free API)
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`);
      const data = await response.json();
      if (data && data.address) {
        // Concatenate address components into a readable format
        const address = `${data.address.road || ''}, ${data.address.city || ''}, ${data.address.country || ''}`;
        form.value.address = address;
      }
    };

    const submitComplaint = () => {
      console.log('Complaint submitted:', form.value);
      // Handle the form submission logic here
    };

    return {
      subjectOptions,
      form,
      submitComplaint,
      getLocation
    };
  }
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
