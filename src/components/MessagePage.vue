<template>
  <div class="space-y-8">
    <div class="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 class="text-xl font-semibold text-gray-800 mb-6">Messaging</h2>

      <!-- Tabs -->
      <div class="flex border-b border-gray-200 mb-6">
        <button
          @click="tab = 'compose'"
          class="px-4 py-2 focus:outline-none"
          :class="tab === 'compose' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-600'"
        >
          Compose
        </button>
        <button
          @click="tab = 'inbox'"
          class="px-4 py-2 focus:outline-none"
          :class="tab === 'inbox' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-600'"
        >
          Inbox
        </button>
        <button
          @click="tab = 'sent'"
          class="px-4 py-2 focus:outline-none"
          :class="tab === 'sent' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-600'"
        >
          Sent
        </button>
      </div>

      <!-- Compose Tab -->
      <div v-if="tab === 'compose'" class="space-y-6">
        <h3 class="text-lg font-semibold text-gray-800">Compose Message</h3>

        <form @submit.prevent="sendMessage" class="space-y-4">
          <!-- Recipient -->
          <div>
            <label for="recipient" class="block text-sm font-medium text-gray-700 mb-1">Recipient</label>
            <select
              id="recipient"
              v-model="compose.recipient"
              class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="" disabled>Select recipient</option>
              <option value="City Hall">City Hall</option>
              <option value="Garbage Truck Driver">Garbage Truck Driver</option>
            </select>
          </div>

          <!-- Subject -->
          <div>
            <label for="subject" class="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <select
              id="subject"
              v-model="compose.subject"
              class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="" disabled>Select subject</option>
              <option
                v-for="(concern, index) in concerns"
                :key="index"
                :value="`${concern.title} (${concern.address})`"
              >
                {{ concern.title }} ({{ concern.address }})
              </option>
            </select>
          </div>

          <!-- Message -->
          <div>
            <label for="message" class="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea
              id="message"
              v-model="compose.message"
              rows="5"
              placeholder="Write your message here..."
              class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            ></textarea>
          </div>

          <!-- Attach Image -->
          <div>
            <label for="attachment" class="block text-sm font-medium text-gray-700 mb-1">Attach Image</label>
            <input
              type="file"
              id="attachment"
              accept="image/*"
              @change="onFileChange"
              class="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <!-- Submit Button -->
          <div class="flex justify-center">
            <button
              type="submit"
              class="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Send
            </button>
          </div>
        </form>
      </div>

      <!-- Inbox and Sent Tabs -->
      <div v-if="tab === 'inbox'" class="space-y-6">...</div>
      <div v-if="tab === 'sent'" class="space-y-6">...</div>

      <!-- Message Modal -->
      <Dialog v-model:visible="messageModalVisible" header="Message Details" class="w-1/2" modal>...</Dialog>
    </div>
  </div>
</template>

<script>
import Dialog from 'primevue/dialog';

export default {
  name: 'MessagingPage',
  components: {
    Dialog,
  },
  data() {
    return {
      tab: 'compose',
      compose: {
        recipient: '',
        subject: '',
        message: '',
        attachment: null,
      },
      concerns: [],
      inbox: [],
      sent: [],
      selectedMessage: null,
      messageModalVisible: false,
    };
  },
  mounted() {
    this.fetchConcerns();
  },
  methods: {
    fetchConcerns() {
      // Simulating API call to fetch submitted concerns
      this.concerns = [
        { id: 1, title: 'Delay of Garbage Pickup', address: '123 Main St' },
        { id: 2, title: 'No Pickup Schedule', address: '456 Elm St' },
        { id: 3, title: 'Schedule of Pickup', address: '789 Maple Ave' },
        { id: 4, title: 'Program', address: '101 Pine Blvd' },
      ];
    },
    sendMessage() {
      if (!this.compose.recipient || !this.compose.subject || !this.compose.message) {
        alert('All fields are required.');
        return;
      }
      this.sent.push({ ...this.compose });
      this.compose = { recipient: '', subject: '', message: '', attachment: null };
      alert('Message sent successfully.');
    },
    onFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          this.compose.attachment = reader.result;
        };
        reader.readAsDataURL(file);
      }
    },
  },
};
</script>

<style scoped>
/* Add any additional styles here */
</style>
