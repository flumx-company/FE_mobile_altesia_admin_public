<template>
    <div>
        <div
          class="search-filter-block"
          v-if="!selected.length"
        >
          <div class="dropdown-container">
            <label>
              Sort by status
              <dropdown class="my-dropdown-toggle"
                        :options="arrayOfStatusObject"
                        :selected="object"
                        v-on:updateOption="methodToRunOnSelect"
                        :closeOnOutsideClick="boolean"
              >
              </dropdown>
            </label>
            <div class="search-window">
              <input
                type="text"
                v-model="reactiveFilterFields.search"
                placeholder="Search"
              >
                <div
                  class="search-button"
                  @click="getData(reactiveFilterFields)"
                >
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
          id="new-table"
          v-model="selected"
          :is-loading="false"
          :use-api-sorting="true"
          :headers="headers"
          :items="reactiveList"
          :is-pagination-mode-enabled="false"
          :show-select="true"
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

          <template v-slot:[`item.first_name`]="{ item }">
            <span v-if="item.user">{{ item.user.first_name }}&nbsp;{{ item.user.last_name }}</span>
          </template>

          <template v-slot:[`item.email`]="{ item }">
            <span v-if="item.user">{{ item.user.email }} </span>
          </template>

          <template v-slot:[`item.reply`]="{ item }">
              <div v-if="item.replied_description" class="reply-text">
                  {{ item.replied_description }}
<!--                  <button class="action-button has-reply" @click="editRepliedRequest(item, item.id)">-->
<!--                      Review the request-->
<!--                  </button>-->
              </div>
              <button
                      v-else
                      @click="editRepliedRequest(item, item.id)"
                      class="action-button"
              >
                  Respond to request
              </button>
          </template>

          <template v-slot:[`item.image`]="{ item }">
            <Attachment
              :isTable="true"
              :data="item"
              :envAddress="envAddress"
            />
          </template>

          <template v-slot:[`item.delete_request`]="{ item }">
            <div class="delete-img-wrapper">
              <svg @click.stop="startDeletionData(item.id)" width="13" height="16" viewBox="0 0 13 16" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd"
                        d="M4.12877 1.87027V1.45397C4.12877 1.22539 4.35979 1.03906 4.64339 1.03906H7.53124C7.81553 1.03906 8.04655 1.22539 8.04655 1.45397V1.87027H4.12877ZM10.3838 2.90876C10.3237 4.47766 9.95084 14.0905 9.90381 14.5235C9.87614 14.7825 9.78068 14.91 9.7295 14.9612H2.44521C2.39333 14.91 2.29857 14.7825 2.2709 14.5235C2.22456 14.0905 1.80746 4.48459 1.73968 2.90876H10.3838ZM9.07994 1.87021V1.45392C9.07994 0.651803 8.43182 0 7.63429 0H4.54032C3.74279 0 3.09466 0.651803 3.09466 1.45392V1.87021H0V2.90852H0.705534L1.24229 14.9007C1.25128 14.9451 1.48162 16 2.37322 16H9.8C10.6923 16 10.9226 14.9451 10.9365 14.8668L11.4435 2.90852H12.1739V1.87021H9.07994ZM8.86954 3.74051H7.83545L7.51311 14.1299H8.5472L8.86954 3.74051ZM5.56975 14.1302H6.60385V3.74079H5.56975V14.1302ZM4.66083 14.1299L4.3385 3.74051H3.30441L3.62605 14.1299H4.66083Z"
                        fill="#666666"/>
              </svg>
            </div>
          </template>
            <template v-slot:no-content>
                <div class="no-data-to-show" v-if="reactivePage > 1 && !reactiveList.length">
                    You do not have data for page {{ reactivePage }} please
                    <button class="small-button"  @click="changePage(1)">open page 1</button>
                </div>
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
                {{ selected.length > 1 ? 'these features?' : 'this feature?' }}
            </template>
            <template v-slot:back>
                <div @click="closeDeletion">Back</div>
            </template>
            <template v-slot:delete >
                <div @click="deleteData">Delete</div>
            </template>
        </modal-window>
        <!-- -------- Delete user modal ------------- -->

        <!-- -------- Respond to request modal ------------- -->
        <modal-window
          :width="'648px'"
          :height="'748px'"
          v-if="isModalRespondRequest"
          @close="closeRespondRequestModal"
        >
            <template v-slot:title>
              Responding to request
              <div class="name-of-request">
                <div class="left">
                  <img src="../../assets/images/redirect-arrow.svg" alt="">
                </div>
                <div class="right">
                  <div><h3>title :</h3> {{ initialValues.event.title }}</div><br/>
                  <div><h3>description :</h3> {{ initialValues.event.description }}</div><br/>
                  <div><h3>previous answer :</h3> {{ initialValues.event.replied_description }}</div><br/>
                </div>
              </div>
            </template>
            <template v-slot:create-form-opportunity>
              <Form @submit="onSubmit" :validation-schema="schema" :initial-values="initialValues">
                <div class="big-modal-window">
                  <div class="right-side">
                    <div class="information-block">
                      <label for="description">
                        Your answer
                        <Field
                          as="textarea"
                          style="resize: none; height: 468px;"
                          name="description"
                          id="description"
                        />
                      </label>
                      <ErrorMessage name="description" />
                    </div>
                    <div class="btns-block">
                      <div class="btn save" @click="closeRespondRequestModal">
                        close
                      </div>
                      <button type="submit" class="btn save-publish">
                        Save & Send
                      </button>
                    </div>
                  </div>
                </div>
              </Form>
            </template>
        </modal-window>
        <!-- -------- Respond to request modal ------------- -->

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
    require('dotenv').config();

    import VTable from 'vue3-table-component';
    import Pagination from 'v-pagination-3';
    import dropdown from 'vue-dropdowns';
    import StarRating from './../../components/star-rating';
    import { Field, Form, ErrorMessage } from "vee-validate";

    import dayjs from "dayjs";

    import { pageDataWorkerSetup } from "../../workers/page.data.woker";
    import { $api } from "../../api";
    import { pageActionWorkerSetup } from "../../workers/page.action.woker";
    import ModalWindow from "../../components/ModalWindow";
    import Attachment from '../../components/Attachment.vue';
    import ModalInfo from '../../components/ModalInfo.vue'

    const $updateOneDataRequest = (id, data) => $api.RequestedFeaturesRequest.update(id, data);
    const $createOneDataRequest = (data) => $api.RequestedFeaturesRequest.create(data);
    const $getRequest = (query) => $api.RequestedFeaturesRequest.getAll(query);
    const $deleteOneDataRequest = (id) => $api.RequestedFeaturesRequest.deleteSelected([id]);

    const $getPagination = e => {
      return e.data ? e.data.meta : e.meta
    };

    const transformOperatorItems = (data) => {
        return {
            ...data,
            created_at: dayjs(data.created_at).format('D MMM YYYY')
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
            text: 'Date',
            value: 'created_at',
            sortable: true,
        },
        {
            text: 'Autor’s name',
            value: 'first_name',
        },
        {
            text: 'Autor’s email',
            value: 'email',
        },
        {
            text: 'Title of the request',
            value: 'title',
        },
        {
            text: 'Subject of the request',
            value: 'description',
        },
        {
            text: 'Added images',
            value: 'image'
        },
        {
            text: 'Responce from Admin',
            value: 'reply',
            width: '228px'
        },
        {
            text: 'Delete request feature',
            value: 'delete_request'
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
        RESPONDED: 'Responded',
        NOT_RESPONDED: 'Not responded',
    };

    const onSubmit = (configData, configAction) => {
      return async (data) => {
        const id = configAction.idInfo.value;
        const result = await configData.updateOne( id, {
            answer: data.description
        } );

        if(result) {
          await configData.getData();
          configAction.closeRespondRequestModal()
        }
      }
    };

    export default {
        name: "RequestedFeatures",
        components: {
            VTable,
            StarRating,
            Pagination,
            'dropdown': dropdown,
            'modal-window': ModalWindow,
            Field,
            Form,
            ErrorMessage,
            Attachment,
            'modal-info': ModalInfo
        },

        setup() {
          const envAddress = ref(process.env.VUE_APP_FILE_LINK)

          // ---------------- operations with changing user rating
          const modifiedItemId = ref(null)

          const updateRating = (event, id) => {
            $configAction.startRating(id);
            const modifiedRatingItem = $configData.reactiveList.value.find(item => item.id === id);
            modifiedRatingItem.internal_rating = event;
            modifiedItemId.value = id
          };

          const cancelRating = () => {
            $configData.reactiveList.value.find(item => {
              if (item.id === modifiedItemId.value) {
                item.internal_rating = item.default_internal_rating
              }
            });
            $configAction.closeRating()
          };
          // ---------------- operations with changing user rating

          // ---------------- sort dropdown
          const arrayOfStatusObject = reactive([
              { name: dropdownItems.ALL, value: '' },
              { name: dropdownItems.RESPONDED, value: '1' },
              { name: dropdownItems.NOT_RESPONDED, value: '0' },
          ]);
          let object = reactive({ name: dropdownItems.ALL });
          const methodToRunOnSelect = async payload => {
              object = payload;
              $configData.reactiveFilterFields.value.sortBy = payload.value ? `is_replied ${payload.value}` : '';
              await $configData.getData({
                  ...$configData.getQuery(),
                  sortBy: $configData.reactiveFilterFields.value.sortBy
              })
          };

          // ---------------- sort dropdown

          // --------------- multiple deletion of users
          const deleteMultipleUsers = selected => {
            const ids = selected.map(item => item.id)
            $configAction.startDeletionData(ids)
          };
          // --------------- multiple deletion of users

          const route = useRoute();

          const $configData = pageDataWorkerSetup({
              $initData: {
                  reactiveList: route.meta.requestedFeaturesData.data.items.map(transformOperatorItems),
                  reactiveFilterFields: {
                      ...filterFields,
                      ...route.query
                  },
                  reactivePagination: $getPagination(route.meta.requestedFeaturesData.data),
                  formData: []
              },

              $getPagination,
              $updateOneDataRequest,
              $createOneDataRequest,
              $getDataRequest: $getRequest,
              $deleteOneDataRequest: $deleteOneDataRequest,
              $updateList: (usersData) => usersData.data.items.map(transformOperatorItems)
          });

          const $configAction = pageActionWorkerSetup({
              getOne: $configData.getOne,
              updateOne: $configData.updateOne,
              deleteOneData: $configData.deleteOneData,
              createOneData: $configData.createOneData,
              reactiveList: $configData.reactiveList
          });

          const headers = reactive(columnHeaders);

          const selected = ref([]);
          let initialValues = ref({});
          const editRepliedRequest = (event, id) => {

              initialValues.value = {
                  event,
                  description: event.replied_description
              };

              $configAction.respondToRequest(id)
          };

          const infoModalDataTitles = {
            client_name : 'Name',
            created_at : 'Date of creation'
          }

          let infoModalData = ref({})

          const openModalInfoInner = data => {
            console.log(data)
            infoModalData.value = data
            console.log(infoModalData.value)

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
              object,
              initialValues,
              methodToRunOnSelect,
              updateRating,
              deleteMultipleUsers,
              cancelRating,
              arrayOfStatusObject,
              envAddress,
              onSubmit: onSubmit($configData, $configAction),
              handleApiSorting: handleApiSorting($configData),
              editRepliedRequest,
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
@import '../../assets/styles/_colors.scss';
@import '../../assets/styles/_mixins.scss';
@import '../../assets/styles/_table.scss';
@import '../../assets/styles/_pagination.scss';
@import '../../assets/styles/_filter-dropdown.scss';
@import '../../assets/styles/_search-window.scss';
@import '../../assets/styles/_multiple-delete-block';
@import '../../assets/styles/_modal-window';
@import '../../assets/styles/_big-modal-window';


</style>
