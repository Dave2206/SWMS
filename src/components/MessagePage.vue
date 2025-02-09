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
          @click="tab = 'messages'"
          class="px-4 py-2 focus:outline-none"
          :class="tab === 'messages' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-600'"
        >
          Messages
        </button>
      </div>

      <!-- Compose Tab -->
      <div v-if="tab === 'compose'" class="space-y-6">
        <h3 class="text-lg font-semibold text-gray-800">Compose Message</h3>

        <form @submit.prevent="sendMessage" class="space-y-4">
          <!-- Recipient Dropdown -->
          <div>
            <label for="recipient" class="block text-sm font-medium text-gray-700 mb-1">Recipient</label>
            <select
              id="recipient"
              v-model="compose.recipient"
              class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="" disabled>Select a recipient</option>
              <option v-for="user in users" :key="user.id" :value="user.id">{{ user.name }}</option>
            </select>
          </div>

          <!-- Subject -->
          <div>
            <label for="subject" class="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <input
              id="subject"
              v-model="compose.subject"
              type="text"
              placeholder="Enter subject"
              class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
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

      <!-- Messages Tab -->
      <div v-if="tab === 'messages'" class="space-y-6">
        <h3 class="text-lg font-semibold text-gray-800">Messages</h3>

        <div v-for="(messages, recipientId) in groupedMessages" :key="recipientId" class="border-b pb-4 mb-4">
          <h4 class="text-lg font-semibold text-gray-800 mb-2">{{ getUserNameById(recipientId) }}</h4>
          <ul class="bg-white shadow rounded-lg p-4">
            <template v-if="Array.isArray(messages)">
              <li v-for="message in messages" :key="message.id" class="border-b py-2">
                <strong>{{ message.subject }}</strong> - {{ message.message }}
              </li>
            </template>
            <template v-else>
              <li>No messages available</li>
            </template>
          </ul>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      tab: 'messages', // Default tab is 'messages'
      compose: {
        recipient: '',
        subject: '',
        message: '',
        attachment: null,
      },
      messages: [], // Combined inbox and sent messages
      groupedMessages: {}, // Grouped messages by recipient
      users: [], // List of users to populate the dropdown
    };
  },
  mounted() {
    this.fetchMessages(); // Fetch messages
    this.fetchUsers(); // Fetch the list of users
  },
  methods: {
    async fetchUsers() {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/users', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
          },
        });
        this.users = response.data;
      } catch (error) {
        console.error(error);
        alert('Failed to load users.');
      }
    },
    async sendMessage() {
      if (!this.compose.recipient || !this.compose.subject || !this.compose.message) {
        alert('All fields are required.');
        return;
      }

      const formData = new FormData();
      formData.append('recipient', this.compose.recipient);
      formData.append('subject', this.compose.subject);
      formData.append('message', this.compose.message);
      if (this.compose.attachment) {
        formData.append('attachment', this.compose.attachment);
      }

      try {
        await axios.post('http://127.0.0.1:8000/api/messages/send', formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        alert('Message sent successfully.');
        this.fetchMessages(); // Refresh the messages after sending
        this.compose = { recipient: '', subject: '', message: '', attachment: null };
      } catch (error) {
        console.error(error);
        alert('Failed to send message.');
      }
    },
    async fetchMessages() {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/messages', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
          },
        });

        console.log('API Response:', response); // Log the full API response

        // Check if response.data is an object
        if (response.data && typeof response.data === 'object') {
          this.messages = response.data;
          this.groupMessagesByRecipient();
        } else {
          console.error('Unexpected response format:', response.data);
          alert('Failed to load messages. Invalid response format.');
        }
      } catch (error) {
        console.error('Error fetching messages:', error); // Log the error
        alert('Failed to load messages.');
      }
    },
    groupMessagesByRecipient() {
      // Ensure 'this.messages' is an object containing keys
      if (typeof this.messages === 'object' && this.messages !== null) {
        this.groupedMessages = {};  // Clear existing grouped messages

        // Loop through the object keys
        Object.keys(this.messages).forEach((recipientId) => {
          const messages = this.messages[recipientId].messages; // Extract messages for the current recipient
          this.groupedMessages[recipientId] = messages; // Group messages by recipientId
        });
      } else {
        console.error('Expected messages data to be an object:', this.messages);
      }
    },
    getUserNameById(id) {
      const user = this.users.find((user) => user.id === id);
      return user ? user.name : 'Unknown User';
    },
    onFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.compose.attachment = file;
      }
    },
  },
};
</script>
