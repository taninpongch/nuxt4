<template>
  <label>Input</label>
  <UForm :schema="schema" :state="state" class="space-y-6" @submit="onSubmit">
    <!-- Input -->
    <UFormField label="default" name="username">
      <UInput v-model="state.username" placeholder="Enter username" />
    </UFormField>

    <UFormField label="disabled" name="disabled">
      <UInput :disabled="true" placeholder="disabled" />
    </UFormField>

    <UFormField label="Focus-UseHighlight" name="Focus-UseHighlight">
      <UInput highlight placeholder="disable" />
    </UFormField>

    <UFormField label="Focus-UseFocus" name="Focus-UseFocus">
      <UInput :autofocus="true" placeholder="disable" />
    </UFormField>

    <UFormField label="Input+Icon" name="username">
      <UInput v-model="state.username" placeholder="placeholder" :trailing="true" trailing-icon="i-lucide-smile" />
    </UFormField>

    <UFormField label="Input+Text" name="username">
      <UInput placeholder="Placeholder">
        <template #trailing>
          <span class="text-gray-700 text-sm font-medium">ABC</span>
        </template>
      </UInput>
    </UFormField>

    <UFormField label="Icon+Text" name="Icon+Text">
      <UInput icon="i-lucide-smile" placeholder="Search..." />
    </UFormField>
    <UFormField label="Icon+Text-Disabled" name="Icon+Text-Disabled">
      <UInput icon="i-lucide-smile" placeholder="Search..." :disabled="true" />
    </UFormField>

    <UFormField label="Icon+Text-Disabled" name="Icon+Text-Disabled">
      <UInput highlight icon="i-lucide-smile" placeholder="Search..." />
    </UFormField>
    <hr />
    <label>Form Field</label>

    <UFormField label="กรอกนะจ๊ะ" name="username" help="We won't share your email." required>
      <UInput v-model="state.username" placeholder="Enter username" />
    </UFormField>

    <UFormField label="กรอกนะจ๊ะ" name="username2" help="We won't share your email." required
      :error="true && 'กรอกด้วยนะจ๊ะ'">
      <UInput highlight v-model="state.username2" placeholder="Enter username" />
    </UFormField>


    <hr />
    <label>Select</label>

    <!-- Select -->
    <UFormField label="Default" name="country">
      <USelect v-model="state.country" :items="countryOptions" icon="i-lucide-smile" placeholder="Select country" />
    </UFormField>

    <UFormField label="Disabled" name="Disabled">
      <USelect v-model="state.country" :items="countryOptions" icon="i-lucide-smile" placeholder="Select country"
        :disabled="true" />
    </UFormField>

    <UFormField label="Default" name="country">
      <USelect highlight v-model="state.country" :items="countryOptions" icon="i-lucide-smile"
        placeholder="Select country" />
    </UFormField>

    <hr />
    <label>From Field Text Area</label>
    <UFormField label="Default" name="bio" hint="todsob">
      <UTextarea v-model="state.bio" placeholder="Write something about you…" :rows="4" />
    </UFormField>

    <UFormField label="Focus" name="bio" hint="todsob">
      <UTextarea highlight v-model="state.bio" placeholder="Write something about you…" :rows="4" />
    </UFormField>

    <hr />
    <label>Checkbox</label>
    <!-- Checkbox -->
    <UFormField label="default" name="default">
      <UCheckbox v-model="state.agreeTerms" label="I agree to terms" />
    </UFormField>

    <UFormField label="default" name="default">
      <UCheckbox v-model="state.agreeTerms2" label="I agree to terms" :disabled="true" />
    </UFormField>

    <UFormField label="Focus" name="default" required>
      <UCheckbox v-model="state.agreeTerms3" label="I agree to terms" highlight />
    </UFormField>

    <UFormField label="Checked" name="default" required>
      <UCheckbox v-model="state.agreeTerms4" label="I agree to terms" :default-value="true" />
    </UFormField>


    <hr />
    <label>RadioGroup</label>
    <!--  -->
    <UFormField label="default" name="gender">
      <URadioGroup v-model="state.gender" :items="genderOptions" />
    </UFormField>

    <UFormField label="genderdisabled" name="genderdisabled">
      <URadioGroup v-model="state.genderdisabled" :items="genderOptions" :disabled="true" />
    </UFormField>

    <UFormField label="genderfocus" name="genderfocus">
      <URadioGroup v-model="state.genderfocus" :items="genderOptions" highlight value="female" />
    </UFormField>

    <UFormField label="genderchecked" name="genderchecked">
      <URadioGroup v-model="state.genderchecked" :items="genderOptions" />
    </UFormField>


    <hr />
    <label>Switch</label>

    <UFormField label="Default" name="notifications">
      <USwitch v-model="state.notifications" />
    </UFormField>

    <UFormField label="Active" name="notifications2">
      <USwitch v-model="state.notifications2" />
    </UFormField>

    <UFormField label="Disable" name="notifications3">
      <USwitch v-model="state.notifications3" />
    </UFormField>

    <UFormField label="Active" name="notifications4">
      <USwitch v-model="state.notifications4" highlight />
    </UFormField>

    <hr />
    <label>Tabs</label>
    <UTabs :items="itemsTabs">
      <template #account>
        <UForm :state="statetabs" class="flex flex-col gap-4">
          <UFormField label="Name" name="name">
            <UInput v-model="statetabs.name" class="w-full" />
          </UFormField>
          <UFormField label="Username" name="username">
            <UInput v-model="statetabs.username" class="w-full" />
          </UFormField>
        </UForm>
      </template>

      <template #password>
        <UForm :state="statetabs" class="flex flex-col gap-4">
          <UFormField label="Current Password" name="current" required>
            <UInput v-model="statetabs.currentPassword" type="password" required class="w-full" />
          </UFormField>
          <UFormField label="New Password" name="new" required>
            <UInput v-model="statetabs.newPassword" type="password" required class="w-full" />
          </UFormField>
          <UFormField label="Confirm Password" name="confirm" required>
            <UInput v-model="statetabs.confirmPassword" type="password" required class="w-full" />
          </UFormField>
        </UForm>
      </template>
    </UTabs>

    <UFormField label="Hobbies" name="hobbies">
      <UCheckboxGroup v-model="state.hobbies" :items="hobbyOptions" />
    </UFormField>

    <!-- Switch -->

    <!-- Slider -->
    <UFormField label="Age" name="age">
      <USlider v-model="state.age" :min="0" :max="100" />
    </UFormField>

    <!-- FileUpload -->
    <UFormField label="Avatar" name="avatar">
      <UFileUpload v-model="state.avatar" />
    </UFormField>

    <!-- ColorPicker -->
    <UFormField label="Favorite Color" name="favoriteColor">
      <UColorPicker v-model="state.favoriteColor" class="border-" />
    </UFormField>

    <!-- PinInput -->
    <UFormField label="PIN Code" name="pin">
      <!-- <UPinInput v-model="state.pin" length="4" /> -->
    </UFormField>

    <!-- InputTags -->
    <UFormField label="Tags" name="tags">
      <UInputTags v-model="state.tags" placeholder="Add tags" />
    </UFormField>

    <!-- Submit Button -->
    <UButton type="submit">Submit</UButton>
  </UForm>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import * as z from 'zod'  // หรือไลบรารี validation ที่คุณใช้
import type { FormSubmitEvent } from '@nuxt/ui'
import { error } from '#build/ui'

// กำหนด schema (ตัวอย่างโดยใช้ zod)
const schema = z.object({
  username: z.string().min(1, `ⓘ 🛈 Username is required`),
  username2: z.string().min(1, "Need is required"),
  password: z.string().min(6, "At least 6 characters"),
  bio: z.string().optional(),
  country: z.string().optional(),
  gender: z.string().optional(),
  genderdisabled: z.string().optional(),
  genderfocus: z.string().optional(),
  genderchecked: z.string().optional(),
  agreeTerms: z.boolean().refine(v => v === true, "You must agree"),
  agreeTerms2: z.boolean().refine(v => v === true, "You must agree"),
  agreeTerms3: z.boolean().refine(v => v === true, "You must agree"),
  agreeTerms4: z.boolean().refine(v => v === true, "You must agree"),
  hobbies: z.array(z.string()).optional(),
  notifications: z.boolean().optional(),
  notifications2: z.boolean().optional(),
  notifications3: z.boolean().optional(),
  notifications4: z.boolean().optional(),
  age: z.number().min(0).max(100).optional(),
  avatar: z.any().optional(),
  favoriteColor: z.string().optional(),
  pin: z.string().length(4).optional(),
  tags: z.array(z.string()).optional(),
})

type Schema = z.infer<typeof schema>

// สถานะข้อมูล
const state = reactive<Schema>({
  username: '',
  username2: '',
  password: '',
  bio: '',
  country: '',
  gender: '',
  genderdisabled: '',
  genderfocus: 'male',
  genderchecked: 'female',
  agreeTerms: false,
  agreeTerms2: false,
  agreeTerms3: false,
  agreeTerms4: true,
  hobbies: [],
  notifications: false,
  notifications2: true,
  notifications3: false,
  notifications4: true,
  age: 0,
  avatar: null,
  favoriteColor: '',
  pin: '',
  tags: [],
})

const statetabs = reactive({
  name: 'Benjamin Canac',
  username: 'benjamincanac',
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// ตัวเลือกสำหรับ components ต่าง ๆ
const countryOptions = [
  { label: 'Thailand', value: 'th' },
  { label: 'USA', value: 'us' },
  { label: 'Japan', value: 'jp' },
]

const genderOptions = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' },
]

const hobbyOptions = [
  { label: 'Reading', value: 'reading' },
  { label: 'Gaming', value: 'gaming' },
  { label: 'Traveling', value: 'travel' },
]

const itemsTabs = [
  {
    label: 'Account',
    icon: 'i-lucide-user',
    slot: 'account'
  },
  {
    label: 'Password',
    icon: 'i-lucide-lock',
    slot: 'password'
  }
]

// ฟังก์ชัน submit
function onSubmit(evt: FormSubmitEvent<Schema>) {
  console.log('Form submitted:', evt.data)
  // ทำงานหลังจาก submit เช่น ส่ง API
}
</script>