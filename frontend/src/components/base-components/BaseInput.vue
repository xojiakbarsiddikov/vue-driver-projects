<template>
  <div class="field" :class="containerClass">
    <label :for="tag" class="block text-900 text-0 font-medium mb-2">{{ labelText }}</label>
    <template v-for="error in errors[tag]" :key="error">
      <Message v-if="errors[tag]" severity="error">{{ $t(error) }}</Message>
    </template>

    <template v-if="type==='password'">
      <Password
          :id="tag"
          :class="{'p-invalid': errors[tag]}"
          v-bind="$attrs"
          @change="changedEvent"
          @input="e => $emit('update:modelValue', e.target.value)"
      />
    </template>

    <template v-if="type==='mask'">
      <InputMask
          :id="tag"
          class="p-inputtext"
          :mask="mask"
          :placeholder="placeholder"
          :class="{'p-invalid': errors[tag]}"
          v-bind="$attrs"
          @change="changedEvent"
          @update:modelValue="e => $emit('update:modelValue', e)"
      />
    </template>
  </div>
</template>

<script>
export default {
  name: "BaseInput",
  emits: ['dropdownSelected', 'update:modelValue', 'change'],
  data() {
    return {
      modelNode: false
    }
  },
  props: {
    tag: {type: String},
    type: {type: String},
    labelText: {type: String},
    errors: {
      default: []
    },
    containerClass: {type: String},
    mask: {type: String},
    placeholder: {type: String},
  },
  methods: {
    changedEvent(event) {
      this.$emit('change', event)
    },
  }
}
</script>

<style scoped>

</style>