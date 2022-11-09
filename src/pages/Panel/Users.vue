<template>
    <div>
        <div
          class="search-filter-block"
          v-if="!selected.length"
        >
          <div class="dropdown-container">
            <label>
              Sort by status
              <dropdown
                class="my-dropdown-toggle"
                :options="arrayOfStatusObject"
                :selected="object"
                v-on:updateOption="methodToRunOnSelect"
                :closeOnOutsideClick="boolean"
              >
              </dropdown>
            </label>
            <label>
              Sort by role
              <dropdown
                class="my-dropdown-toggle"
                :options="arrayOfRolesObject"
                :selected="objectRole"
                v-on:updateOption="methodToRunOnSelectRole"
                :closeOnOutsideClick="boolean"
              >
              </dropdown>
            </label>
            <div class="search-window">
                <input type="text" v-model="reactiveFilterFields.search" placeholder="Search">
                <div class="search-button" @click="getData(reactiveFilterFields)">
                    <img src="../../assets/images/lense.svg" alt="">
                </div>
            </div>
          </div>
        </div>

        <div
          class="multiple-delete-block"
          v-if="selected.length"
        >
            <div class="checked">
              Checked items: {{ selected.length }}
            </div>
            <div
              class="delete-checked"
              @click="deleteMultipleUsers(selected)"
            >
              Delete
            </div>
        </div>

        <VTable
                style="overflow-x: initial"
                id="new-table"
                v-model="selected"
                :is-loading="false"
                :use-api-sorting="true"
                :headers="headers"
                :items="reactiveList"
                :is-pagination-mode-enabled="false"
                :show-select="true"
                :select-width="'50px'"
                :single-select="false"
                @handle-api-sorting="handleApiSorting"
        >

            <template v-slot:[`item.view_all`]="{ item }">
              <button 
                class="small-button"
                @click="openModalInfoInner(item)"
              >
                Info
              </button>
            </template>

            <template v-slot:[`item.full_name`]="{ item }">
                <span>{{ item.first_name }} {{ item.last_name }}</span>
            </template>

            <template v-slot:no-content>
                <div class="no-data-to-show" v-if="reactivePage > 1 && !reactiveList.length">
                    You do not have data for page {{ reactivePage }} please 
                    <button class="small-button"  @click="changePage(1)">open page 1</button>
                </div>
            </template>

            <template v-slot:[`item.delete_user`]="{ item }">
              <div class="delete-img-wrapper">
                <svg @click="startDeletionData(item.id)" width="13" height="16" viewBox="0 0 13 16" fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd"
                        d="M4.12877 1.87027V1.45397C4.12877 1.22539 4.35979 1.03906 4.64339 1.03906H7.53124C7.81553 1.03906 8.04655 1.22539 8.04655 1.45397V1.87027H4.12877ZM10.3838 2.90876C10.3237 4.47766 9.95084 14.0905 9.90381 14.5235C9.87614 14.7825 9.78068 14.91 9.7295 14.9612H2.44521C2.39333 14.91 2.29857 14.7825 2.2709 14.5235C2.22456 14.0905 1.80746 4.48459 1.73968 2.90876H10.3838ZM9.07994 1.87021V1.45392C9.07994 0.651803 8.43182 0 7.63429 0H4.54032C3.74279 0 3.09466 0.651803 3.09466 1.45392V1.87021H0V2.90852H0.705534L1.24229 14.9007C1.25128 14.9451 1.48162 16 2.37322 16H9.8C10.6923 16 10.9226 14.9451 10.9365 14.8668L11.4435 2.90852H12.1739V1.87021H9.07994ZM8.86954 3.74051H7.83545L7.51311 14.1299H8.5472L8.86954 3.74051ZM5.56975 14.1302H6.60385V3.74079H5.56975V14.1302ZM4.66083 14.1299L4.3385 3.74051H3.30441L3.62605 14.1299H4.66083Z"
                        fill="#666666"/>
                </svg>
              </div>
            </template>

            <template v-slot:[`item.statusReformatted`]="{ item }">
              <radio-dropdown
                :options="[
                  { id: 0, value: 'verified', name: 'verified' },
                  { id: 0, value: 'pending', name: 'pending' },
                  { id: 0, value: 'waiting for access', name: 'waiting for access' },
                ]"
                :currentItem="item.status"
                :optionNameId="item.id"
                :starRating="item.internal_rating"
                :statusDropdown="item.statusDropdown"
                :isAdminRole="item.isAdminRole"
                @newValue="updateUserStatus"
                @toggleDropdown="setDropdownVisibility"
              ></radio-dropdown>
            </template>

            <template v-slot:[`item.internal_rating`]="{ item }">
                <star-rating
                        v-model="item.internal_rating"
                        :rating="item.internal_rating"
                        :star-size="20"
                        :show-rating="false"
                        :read-only="false"
                        :inactiveColor="'#40BB15'"
                        :maxRating="4"
                        @update:rating="updateRating($event, item.id, item.status)"
                ></star-rating>
            </template>
        </VTable>

        <pagination v-model="reactivePage"
                    :records="reactivePagination.totalItems"
                    :per-page="reactivePagination.itemsPerPage"
        />

        <!-- -------- Delete user modal ------------- -->
        <modal-window v-if="isDeleteModalOpened" @close="closeDeletion">
          <template v-slot:title>
              Do you really want to delete
              {{ selected.length > 1 ? 'these users?' : 'this user?' }}
          </template>
          <template v-slot:back>
              <div @click="closeDeletion">Back</div>
          </template>
          <template v-slot:delete>
              <div @click="deleteData">Delete</div>
          </template>
        </modal-window>
        <!-- -------- Delete user modal ------------- -->

        <!-- -------- Rate user with stars modal ------------- -->
        <modal-window v-if="isModalEditRatingOpened" @close="cancelRating">
          <template v-slot:title>
              Do you really want to change rating to this user?
          </template>
          <template v-slot:back>
              <div @click="cancelRating">Back</div>
          </template>
          <template v-slot:delete>
              <div @click="setRating">Change</div>
          </template>
        </modal-window>
        <!-- -------- Rate user with stars modal ------------- -->

        <!-- -------- Open Info modal window ------------- -->
        <modal-info
          v-if="isModalInfo"
          @close="closeModalInfoInner"
          :infoModalDataTitles="infoModalDataTitles"
          :inputData="infoModalData"
        >
        </modal-info>
        <!-- -------- Open Info modal window ------------- -->

    </div>
</template>

<script>
    import { reactive, ref } from "vue";
    import { useRoute } from "vue-router";

    import VTable from 'vue3-table-component';
    import Pagination from 'v-pagination-3';
    import dropdown from 'vue-dropdowns';
    import StarRating from './../../components/star-rating';

    import dayjs from "dayjs";

    import { pageDataWorkerSetup } from "../../workers/page.data.woker";
    import { $api } from "../../api";
    import { pageActionWorkerSetup } from "../../workers/page.action.woker";
    import ModalWindow from "../../components/ModalWindow";
    import { dropdownValue } from '../../utils/dropDownValue';
    import { updateDefSortOrGet } from '../../utils/updateSortColumn';
    import RadioDropdown from '../../components/Radio-dropdown.vue';
    import ModalInfo from '../../components/ModalInfo.vue'

    const $getRequest = (query) => $api.UsersRequest.getAll(query);
    const $deleteOneDataRequest = (id) => $api.UsersRequest.deleteSelected([ id ]);
    const $updateOneDataRequest = (id, data) => $api.UsersRequest.patch(id, data);

    const $getPagination = e => e.data.meta;

    const transformOperatorItems = (data) => {
        return {
            ...data,
            default_internal_rating: data.internal_rating,
            statusReformatted: `"${data.status}"`,
            created_at: dayjs(data.created_at).format('D MMM YYYY'),
            statusDropdown: false,
            isAdminRole: !!data.userRoles
                        .find(item => 
                          item.role.name === "admin" ||
                          item.role.name === "super admin"
                        )
        }
    };


    const handleApiSorting = ($configData) => async (e) => {
        const orderBy = e
            .map(i => `${i.field} ${i.order}`)
            .join();

        await $configData.getData({
            ...$configData.getQuery(),
            orderBy
        })
    };

    const columnHeaders = [
        {
            text: 'View all',
            value: 'view_all',
            width: '100px'
        },
        {
            text: 'Date of register',
            value: 'created_at',
            sortable: true,
        },
        {
            text: 'Email',
            value: 'email',
            sortable: true
        },
        {
            text: 'Status',
            value: 'statusReformatted',
            style: {
                className: 'waiting-for-access',
                expectedValue: '"waiting for access"',
                condition: '===',
            },
        },
        {
            text: 'Name',
            value: 'full_name',
            width: '200px'
        },
        {
            text: 'Internal rating',
            value: 'internal_rating'
        },
        {
            text: 'Delete User',
            value: 'delete_user'
        }
    ];


    const filterFields = {
        limit: 5,
        page: 1,
        search: '',
        sortBy: '',
        orderBy: '',
        role: ''
    };

    const dropdownItems = {
        ALL: 'All',
        NEW: 'New (access needed)',
        PENDING: 'Pending',
        VERIFIED: 'Verified'
    };


    const dropdownItemsRoles = {
        ALL: 'All',
        SUPER_ADMINS: 'Super admins',
        ADMINS: 'Admins',
        USERS: 'Users'
    };

    const statusesArray = [
      { name: dropdownItems.ALL, value: '' },
      { name: dropdownItems.NEW, value: 'waiting for access' },
      { name: dropdownItems.PENDING, value: 'pending' },
      { name: dropdownItems.VERIFIED, value: 'verified' },
    ]

    const rolesArray = [
      { name: dropdownItemsRoles.ALL, value: '' },
      { name: dropdownItemsRoles.SUPER_ADMINS, value: 'super admin' },
      { name: dropdownItemsRoles.ADMINS, value: 'admin' },
      { name: dropdownItemsRoles.USERS, value: 'user' },
    ]

    export default {
        name: "Community",
        components: {
            VTable,
            StarRating,
            Pagination,
            'dropdown': dropdown,
            'modal-window': ModalWindow,
            'radio-dropdown': RadioDropdown,
            'modal-info': ModalInfo
        },

        setup() {
            // ---------------- operations with changing user rating
            const modifiedItemId = ref(null);
            const arrayOfStatusObject = reactive(statusesArray);
            const arrayOfRolesObject = reactive(rolesArray);

            const route = useRoute();
            let headers = ref(
              updateDefSortOrGet(
                columnHeaders,
                route.query.orderBy
              )
           );

            const selected = ref([]);

            let object = dropdownValue(route.query.sortBy, statusesArray)

            let objectRole = dropdownValue(route.query.role, rolesArray);

            // let objectRole = reactive( { name: dropdownItemsRoles.ADMINS, value: 'admins' });

            const updateRating = (event, id, status) => {
                const data = {
                  internal_rating: event,
                  status: status
                }
                $configAction.startRating(id, data);
                const modifiedRatingItem = $configData.reactiveList.value.find(item => item.id === id);
                modifiedRatingItem.internal_rating = event;
                modifiedItemId.value = id
            };

            const cancelRating = () => {
                $configData.reactiveList.value.find(item => {
                    if (item.id === modifiedItemId.value) {
                        item.internal_rating = item.default_internal_rating
                    }

                    return item.id === modifiedItemId.value;
                });
                $configAction.closeRating()
            };
            // ---------------- operations with changing user rating

            const $configData = pageDataWorkerSetup({
                $initData: {
                    reactiveList: route.meta.usersData.data.items.map(transformOperatorItems),
                    reactiveFilterFields: {
                        ...filterFields,
                        ...route.query
                    },
                    reactivePagination: $getPagination(route.meta.usersData),
                    formData: []
                },

                $getPagination,
                $getDataRequest: $getRequest,
                $updateOneDataRequest: $updateOneDataRequest,
                $deleteOneDataRequest: $deleteOneDataRequest,
                $updateList: (usersData) => usersData.data.items.map(transformOperatorItems)
            });

            console.log($configData)

            const $configAction = pageActionWorkerSetup({
                getOne: $configData.getOne,
                updateOne: $configData.updateOne,
                deleteOneData: $configData.deleteOneData,
                createOneData: $configData.createOneData,
                reactiveList: $configData.reactiveList,
                getData: $configData.getData
            });

            // ---------------- sort dropdown

            const methodToRunOnSelect = async payload => {
                object = payload;
                $configData.reactiveFilterFields.value.sortBy = payload.value ? `status ${payload.value}` : '';
                await $configData.getData({
                    ...$configData.getQuery(),
                    sortBy: $configData.reactiveFilterFields.value.sortBy
                })
            };


            const methodToRunOnSelectRole = async payload => {
                objectRole = payload;
                $configData.reactiveFilterFields.value.role = payload.value;
                await $configData.getData({
                    ...$configData.getQuery(),
                    role: $configData.reactiveFilterFields.value.role
                })
            };

            // ---------------- sort dropdown

            // --------------- multiple deletion of users
            const deleteMultipleUsers = selected => {
                const ids = selected.map(item => item.id);
                $configAction.startDeletionData(ids);
            };
            // --------------- multiple deletion of users

            const updateUserStatus = async (id, value, rating) => {
              const updatedData = {
                internal_rating: rating,
                status: value
              }

              const result = await $configData.updateOne(id, updatedData);

              if(result) {
                await $configData.getData();
              }
            }

            const setDropdownVisibility = (id, status, isAdminRole) => {
              if (isAdminRole) return
              $configData.reactiveList.value = $configData.reactiveList.value
                .map(item => ({...item, statusDropdown: false}))
                .map(item => item.id === id ? { ...item, statusDropdown: status } : item)
            }


            const infoModalDataTitles = {
              first_name : 'Name',
              last_name : 'Surname',
              created_at : 'Date of creation'
            }

            let infoModalData = ref({})

            const openModalInfoInner = data => {
              infoModalData.value = data
              $configAction.openModalInfo()
            }

            const closeModalInfoInner = () => {
              infoModalData.value = {}
              $configAction.closeModalInfo()
            }

            return {
                ...$configData,
                ...$configAction,
                selected,
                headers,
                arrayOfStatusObject,
                arrayOfRolesObject,
                object,
                objectRole,
                methodToRunOnSelect,
                methodToRunOnSelectRole,
                updateRating,
                deleteMultipleUsers,
                cancelRating,
                handleApiSorting: handleApiSorting($configData),
                updateUserStatus,
                setDropdownVisibility,
                infoModalDataTitles,
                infoModalData,
                openModalInfoInner,
                closeModalInfoInner
            };
        }
    }
</script>

<style lang="scss">
    .search-filter-block {
        display: flex;
        margin-bottom: 10px;
    }

    .waiting-for-access {
        td {
            background: gray!important;
        }
    }

    @import '../../assets/styles/_colors.scss';
    @import '../../assets/styles/_mixins.scss';
    @import '../../assets/styles/_table.scss';
    @import '../../assets/styles/_pagination.scss';
    @import '../../assets/styles/_filter-dropdown.scss';
    @import '../../assets/styles/_search-window.scss';
    @import '../../assets/styles/_multiple-delete-block';
</style>
