<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <DataTable ref="dt" :value="users" v-model:selection="selectedRows" dataKey="id"
                           :lazy="true"
                           paginatorPosition="both"
                           @row-dblclick="$event => $router.replace({name: 'UserCard', params: {id: $event.data.id}})"
                           selectionMode="multiple"
                           :total-records="totalRecords"
                           :loading="loading"
                           @filter="onFilter"
                           @sort="onSort"
                           @page="onPage"
                           :paginator="true"
                           :rows="25"
                           :filters="filters"
                           v-model:filters="filters"
                           :globalFilterFields="['username', 'password']"
                           :resizableColumns="true"
                           filterDisplay="row"
                           paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                           :rowsPerPageOptions="[10,25,50]"
                           :currentPageReportTemplate="'{first} '+$t('crud_table.pagination.from')+' - {last} '+$t('crud_table.pagination.to')+' / '+$t('crud_table.pagination.total')+`: ${totalRecords}`"
                           responsiveLayout="scroll">
                    <template #header>
                        <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                            <h5 class="m-0">{{ $t('user.titles') }}</h5>
                            <span class="block mt-2 md:mt-0 p-input-icon-left">
                                <i class="pi pi-search"/>
                                <InputText v-model="filters.global.value" :placeholder="$t('crud_table.search')"
                                           @input="onSearch"/>
                            </span>
                        </div>
                    </template>

                    <Column selectionMode="multiple" headerStyle="width: 1rem"></Column>
                    <Column field="id" header="Id" :sortable="true" headerStyle="width:10%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Id</span>
                            {{ slotProps.data.id }}
                        </template>
                    </Column>
                    <Column field="username" :header="$t('user.username')" :sortable="true"
                            headerStyle="width:30%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">{{ $t('user.username') }}</span>
                            {{ slotProps.data.username }}
                        </template>

                        <template #filter="{filterModel, filterCallback}">
                            <InputText type="text" v-model="filterModel.value" class="p-column-filter"
                                       @change="filterCallback()"
                                       :placeholder="$t('user.username')"/>
                        </template>
                    </Column>
                    <Column headerStyle="min-width:10rem;">
                        <template #body="slotProps">
                            <router-link :to="{name: 'UserCard', params: {id: slotProps.data.id}}">
                                <Button icon="pi pi-eye" class="p-button-rounded p-button-success mr-2"/>
                            </router-link>
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
    </div>

</template>

<script>
import {FilterMatchMode} from 'primevue/api';
import {throttle, API_URL, deleteRecords, errorHandling, lazyParams} from "../../../helper"

export default {
    name: 'User',
    data() {
        return {
            loading: false,
            filters: {},
            uploadData: null,

            users: null,
            user: null,
            selectedRows: [],
            errors: [],
            lazyParams: {},
            totalRecords: 0,
        }
    },
    watch: {
        '$route.name'(name) {
            this.checkRole(name)
            this.loadLazyData()
        }
    },
    created() {
        this.initFilters();
        this.checkRole()
        this.onSearch = throttle(this.onSearch, 1000)
    },
    computed: {
        userData() {
            return this.$store.getters['auth/user']
        },
        url() {
            return 'user'
        },
        tag() {
            return 'user'
        },
    },
    mounted() {
        this.loading = true;
        this.lazyParams = lazyParams(this.$refs, this.filters)
        this.checkRole(this.$route.name)
        this.getRelations()
        this.loadLazyData();
        this.uploadData = {
            entity: this.tag,
            entity_id: null,
            user_id: this.userData.id,
        }
    },
    methods: {
        testfunc($event) {
            this.$router.replace({name: 'UserCard', params: {id: $event.data.id}})
        },
        checkRole(name = '') {
            switch (name) {
                case 'Teacher':
                    this.lazyParams.filters.roleId.value = 2
                    break
                case 'Student':
                    this.lazyParams.filters.roleId.value = 3
                    break
            }
        },
        loadLazyData() {
            this.loading = true;
            this.axios.get(API_URL + `${this.url}`, {params: this.lazyParams}).then(res => {
                this.users = res.data.items
                this.totalRecords = res.data.totalRecords
                this.loading = false
            }).catch(e => {
                this.errors = errorHandling(e, this.$t, this.$toast)
            })
        },
        onFilter() {
            this.lazyParams.filters = this.filters;
            this.loadLazyData()
        },
        onSort($event) {
            this.lazyParams = $event;
            this.loadLazyData();
        },
        onPage(event) {
            this.lazyParams = event;
            this.loadLazyData();
        },
        async onSearch() {
            this.lazyParams.filters = this.filters
            this.loadLazyData()
        },
        exportCSV() {
            this.$refs.dt.exportCSV();
        },
        deleteSelected(items) {
            deleteRecords(items, this.$confirm, this.$t, this.$toast, this.url, (this.selectedRows.length && this.selectedRows.length > 0)).then(ids => {
                this.users = this.users.filter(val => !ids.includes(val.id));
                this.selectedRows = null;
            }).catch(e => {
                this.errors = errorHandling(e, this.$t, this.$toast)
            })
        },
        getRelations() {
            this.axios.get(API_URL + 'roles').then(res => {
                this.roles = res.data
            }).catch(e => {
                this.errors = errorHandling(e, this.$t, this.$toast)
            })
        },
        initFilters() {
            let filter_fields = ['username', 'password']
            this.filters = {
                'global': {value: '', matchMode: FilterMatchMode.CONTAINS, fields: filter_fields},
                'username': {value: '', matchMode: FilterMatchMode.CONTAINS},
                'password': {value: null, matchMode: FilterMatchMode.CONTAINS},
                'roleId': {value: null, matchMode: FilterMatchMode.EQUALS},
            }
        }
    },
}
</script>

<style scoped lang="scss">
@import '../../../assets/demo/badges';
</style>
