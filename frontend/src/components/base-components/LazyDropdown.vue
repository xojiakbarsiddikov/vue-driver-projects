<template>
    <div class="field" :class="containerClass">
        <label class="block text-900 text-0 font-medium mb-2">{{ labelText }}</label>
        <AutoComplete
            input-class="w-100"
            v-bind="$attrs"
            v-model="selectedItem"
            :suggestions="options"
            @item-select="onSelect"
            :delay="1000"
            forceSelection
            autoHighlight
            @complete="onSearch($event)"
            @clear="clearData"
            :dropdown="options.length > 0"
            :field="item => {
                let res = ''
                optionLabels.forEach(label => {
                    res = `${res} ${item[label]}`
                })
                {{res}}
                return res
            }">
            <template #content="{items}">
                {{items}}
            </template>
            <template #item="{item}">
                <template v-for="(optionLabel, index) in optionLabels" :key="index">
                    {{item[optionLabel]+' '}}
                </template>
            </template>
        </AutoComplete>
    </div>
</template>

<script>

import {errorHandling, API_URL} from "../../helper"
import * as _ from "lodash"

import {showToast} from "../../helper"

export default {
    name: "LazyDropdown",
    data() {
        return {
            selectedItem: null,
            options: [],
            loading: false,
        }
    },
    props: {
        url: {type: String, default: ''},
        labelText: {type: String, default: ''},
        filters: {type: Object, default: null},
        optionLabels: {type: Array},
        optionValue: {type: String, default: 'id'},
        containerClass: {type: String},
    },
    created() {
        this.selectedItem = this.options.filter(item => item.id === this.$attrs.modelValue)
    },
    methods: {
        clearData() {
            this.selectedItem = null
            this.options = []
            this.$emit('update:modelValue', null)
            this.$emit('selectOption', null)
        },
        onSelect() {
            let val = this.selectedItem !== null ? this.selectedItem[this.optionValue] : null
            if (val === null) {
                this.clearData()
            }
            this.$emit('update:modelValue', val)
            this.$emit('selectOption', val)
        },
        prepareQuery(defaulValue) {
            if (!defaulValue) {
                defaulValue = ''
            }
            let query = {}
            _.each(this.filters, (operator, key) => {
                if (Object.keys(operator).length > 0) {
                    query[key] = {}
                    _.each(this.filters[key], (field, fieldKey) => {
                        if (field.value) {
                            defaulValue = field.value
                        }
                        query[key][fieldKey] = {value: defaulValue, matchMode: field.matchMode}
                    })
                }
            })
            return query
        },
        onSearch(event) {
            this.selectedItem = null
            let filters = this.prepareQuery(event.query)
            this.axios.get(API_URL + `${this.url}`, {params: {filters}}).then(res => {
                this.options = res.data.items
                if (res.data.length === 0) {
                    showToast(this.$toast, 'error', this.$t('error_occurred'), this.$t('errors.404'))
                } else if (res.data.length === 1) {
                    this.selectedItem = res.data[0]
                    this.$emit('update:modelValue', this.selectedItem.id)
                }
            }).catch(e => {
                this.errors = errorHandling(e, this.$t, this.$toast)
            })
        }
    },
}
</script>

<style scoped>

</style>