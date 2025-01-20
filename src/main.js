import { createApp } from 'vue';
import App from './App.vue';
import PrimeVue from 'primevue/config';

import Aura from '@primevue/themes/aura';
import 'primeicons/primeicons.css'; // icons

// Importing PrimeIcons
import 'primeicons/primeicons.css';

import Drawer from 'primevue/drawer';
import Menubar from 'primevue/menubar';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Fieldset from 'primevue/fieldset';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import FloatLabel from 'primevue/floatlabel';
import Select from 'primevue/select';
import Divider from 'primevue/divider';
import Card from 'primevue/card';
import Tag from 'primevue/tag';
import InputGroup from 'primevue/inputgroup';
import InputGroupAddon from 'primevue/inputgroupaddon';
import ConfirmDialog from 'primevue/confirmdialog';
import Password from 'primevue/password';
import Checkbox from 'primevue/checkbox';
import RadioButton from 'primevue/radiobutton';
import MultiSelect from 'primevue/multiselect';
import  DatePicker  from 'primevue/datepicker';
import FileUpload from 'primevue/fileupload';
import '../src/styles/global.css';
import router from './router.js'; // Import router
import Toast from 'primevue/toast';
import  Textarea  from 'primevue/textarea';
import {useToast}  from 'primevue/usetoast';

const app = createApp(App);

app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            prefix: 'p',
            darkModeSelector: 'system',
            cssLayer: false
        }
    }
});
const components = {
    Drawer,
    Menubar,
    Dialog,
    InputText,
    Button,
    Fieldset,
    ConfirmDialog,
    FloatLabel,
    Select,
    DataTable,
    Column,
    Divider,
    Card,
    Tag,
    InputGroup,
    InputGroupAddon,
    Password,
    Checkbox,
    RadioButton,
    MultiSelect,
    DatePicker,
    FileUpload,
    Toast,
    Textarea,
    useToast,
};


Object.entries(components).forEach(([name, component]) => {
    app.component(name, component);
});


app.use(router);
app.mount('#app');
