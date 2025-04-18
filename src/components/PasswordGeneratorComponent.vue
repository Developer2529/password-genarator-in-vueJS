<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
const $toast = useToast();


const passwordGenerated = ref('');
const passwordLength = ref(16);  // Longitud predeterminada de la contraseña
const checkedEmpresas = ref('UAPA');
const isChecked = ref(false);

const passwordMessages = ref({
  passCopied: false,
  generateNewPass: 'Please, generate a new password',
  passwordLengthMessage: {
    strong: 'Strong',
    medium: 'Medium',
    weak: 'Weak',
  },
});

const isPasswordCopied = ref(false);  // Para saber si ya se copió la contraseña

const soporteHD = ref({
  fname: "Mike",
  passwordAmount: 0,
})

// Recuperar datos desde localStorage cuando la app carga
onMounted(() => {
  const storedData = localStorage.getItem("dataSent");
  if (storedData) {
    const parsedData = JSON.parse(storedData);
    soporteHD.value.fname = parsedData.fname;
    soporteHD.value.passwordAmount = parsedData.passwordAmount;
  }

  // Generar una nueva contraseña solo si passwordGenerated está vacío
  if (!passwordGenerated.value) {
    generateNumber();
  }
});


// Función para generar el número aleatorio
const generateNumber = () => {
  soporteHD.value.passwordAmount++; //me guarda la cantidad de password generado

  localStorage.setItem("dataSent", JSON.stringify(soporteHD.value));
  console.log("Objeto original:", soporteHD.value);



  const specialChars = '!@#$%&*+?/({)}\)';
  const specialCharSaved = specialChars.charAt(Math.floor(Math.random() * specialChars.length));
  const specialCharSaved2 = specialChars.charAt(Math.floor(Math.random() * specialChars.length));
  const randomNum = Math.random().toString().slice(2, passwordLength.value - checkedEmpresas.value.length - (isChecked.value ? 1 : 0));  // Ajustamos el tamaño según la longitud deseada

  // Generamos la contraseña tomando en cuenta la longitud deseada
  passwordGenerated.value = checkedEmpresas.value + randomNum + (isChecked.value ? specialCharSaved : '') + (isChecked.value ? specialCharSaved2 : '');

  // Ajustamos la longitud de la contraseña
  if (passwordGenerated.value.length < passwordLength.value) {
    passwordGenerated.value = passwordGenerated.value.padEnd(passwordLength.value, Math.floor(Math.random() * 99).toString());  // Rellenamos con números aleatorios si es necesario
  }

  passwordLength.value = passwordGenerated.value.length;
  isPasswordCopied.value = false;  // Resetear el estado de copiado cuando se genera una nueva contraseña
};

// Observadores para cambios
watch(checkedEmpresas, generateNumber);
watch(isChecked, generateNumber);

// Cuando se cambia el rango de longitud
watch(passwordLength, generateNumber);

// Función para copiar la contraseña
const copyPassword = () => {
  if (!passwordGenerated.value) {
    $toast.info("Please, generate a new password", { position: 'top' });
    return;
  }

  if (!isPasswordCopied.value) {
    navigator.clipboard.writeText(passwordGenerated.value).then(() => {
      isPasswordCopied.value = true;
      $toast.success("Password copied successfully", { position: 'top' });  // Ahora se muestra correctamente en el primer clic

      setTimeout(() => {
        passwordGenerated.value = '';
        isPasswordCopied.value = false;
      }, 5000);
    });
  }
};



</script>




<template>
  <div class="flex flex-col mx-auto mt-8 px-4 md:px-0">
    <div class="flex flex-col items-center w-full max-w-md bg-white p-4 rounded-xl custom-shadow gap-2">
      <div>
        <img class="h-16 w-16 md:h-20 md:w-20" src="/src/assets/img/password.gif" alt="" />
      </div>
      <h2 class="text-lg font-bold mt-2 text-center pb-2">PASSWORD GENERATOR</h2>
      <p>Has generado <span class="font-extrabold text-orange-600">{{ soporteHD.passwordAmount }}</span> passwords</p>
      <div class="flex flex-col md:flex-row items-center justify-center w-full   px-4 ">
        <div class="flex flex-col  w-full py-8">
          <div class="relative w-68  ">
            <input type="text" id="password_output"
              class="border border-black text-base md:text-[1.1rem] rounded-lg w-full pl-6 pr-8 py-4" readonly
              :value="passwordGenerated ? passwordGenerated : 'Generate a password'" />
            <button class="absolute right-2 top-1/2 transform -translate-y-1/2" v-on:click="generateNumber()">
              <img src="/src/assets/img/reset_icon.svg" alt="Reset Icon" class="w-9 h-9 reset-btn" />
            </button>
          </div>
        </div>

        <div v-on:click="copyPassword" class="copy-div flex items-center bg-[#ccc] rounded-lg p-4 cursor-pointer">
          <button class="flex items-center justify-center pr-1">
            <img src="/src/assets/img/content_copy.svg" alt="Copy Icon" />
            <p class="font-semibold text-sm md:text-base">Copy</p>
          </button>
        </div>
      </div>

      <p class="text-sm pb-2" :class="passwordLength <= 11 ? 'text-red-700' : 'text-green-600'">
        {{ passwordLength <= 11 ? 'Weak' : 'Strong' }} </p>
          <p class="text-sm  pb-3">Password Length: {{ passwordLength }}</p>

          <input type="range" id="password_length" min="8" max="18" v-model="passwordLength" class="w-full mt-2 px-4" />

          <div class="mt-4 w-full flex flex-col gap-2 pt-6 px-4">
            <label v-for="option in ['UAPA', 'coding', 'vueJS', 'Javascript', 'Typescript', 'Tailwind', 'CSS', 'HTML']"
              :key="option" class="flex justify-between text-sm">
              <span class="capitalize">{{ option }}</span>
              <input type="radio" :value="option" v-model="checkedEmpresas" class="mr-2" />
            </label>
          </div>

          <div class="flex justify-between w-full mt-1 pt-4 pb-3 px-4">
            <label class="text-sm flex justify-between w-full mt-4 cursor-pointer">Special Characters
              <input type="checkbox" v-model="isChecked" class="mr-2" />
            </label>
          </div>
    </div>
  </div>
</template>

<style scoped>
custom-shadow {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

::placeholder {
  color: black;
}

/* Custom shadow for the main container */
.custom-shadow {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  /* stronger shadow */
}

/* Range input styling */
input[type='range'] {
  -webkit-appearance: none;
  /* Remove default appearance */
  appearance: none;
  width: 100%;
  cursor: pointer;
  outline: none;
  border-radius: 16px;
}

/* Track styling (for webkit browsers) */
input[type='range']::-webkit-slider-runnable-track {
  height: 15px;
  background: #ccc;
  border-radius: 16px;
}

/* Track styling (for Firefox) */
input[type='range']::-moz-range-track {
  height: 20px;
  background: #ccc;
  border-radius: 16px;
}

/* Thumb (button) styling for webkit browsers */
input[type='range']::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 25px;
  /* Larger thumb */
  height: 25px;
  background-color: #fff;
  border-radius: 50%;
  border: 2px solid #e4010b;
  box-shadow: 0 0 0 5px rgba(228, 1, 11, 0.2);
  /* Red shadow */
  cursor: pointer;
  transition:
    background-color 0.3s ease,
    transform 0.3s ease;
}

/* Thumb (button) styling for Firefox */
input[type='range']::-moz-range-thumb {
  width: 40px;
  /* Larger thumb */
  height: 40px;
  background-color: #fff;
  border-radius: 50%;
  border: 2px solid #e4010b;
  box-shadow: 0 0 0 5px rgba(228, 1, 11, 0.2);
  /* Red shadow */
  cursor: pointer;
  transition:
    background-color 0.3s ease,
    transform 0.3s ease;
}

/* Hover effect for the thumb */
input[type='range']::-webkit-slider-thumb:hover {
  background-color: #e4010b;
  /* Thumb turns red on hover */
  transform: scale(1.2);
  /* Slightly enlarge the thumb */
}

/* Checkbox styling */
input[type='radio'],
input[type='checkbox'] {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 4px;
  border: 1px solid rgb(0, 0, 0);
  /* Red border */
  background-color: white;
  transition: all 0.3s ease;
  cursor: pointer;
}

/* Checked state for checkbox */
input[type='radio']:checked,
input[type='checkbox']:checked {
  background-color: #e4010b;
  border-color: #e4010b;
  box-shadow: 0 0 0 4px rgba(228, 1, 11, 0.2);
  /* Red shadow */
}

/* Hover effect for checkbox */
input[type='radio']:hover,
input[type='checkbox']:hover {
  border-color: #d1d1d1;
  /* Light gray border on hover */
}

.copy-div:hover {
  transform: scale(1.1);
  transition: 0.3s;
}

.reset-btn {
  animation: rotate 2s linear infinite;
}

.copy-div:hover {
  transform: scale(1.1);
  transition: 0.3s;
}

.reset-btn:hover {
  animation: rotate 2s linear none;
  transform: scale(1.4);
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
