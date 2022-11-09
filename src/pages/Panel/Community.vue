<template>
    <div>
        <div
          class="search-filter-block"
          v-if="!selected.length"
        >
          <div class="dropdown-container">
            <label>
              Sort by category
              <dropdown class="my-dropdown-toggle"
                        :options="arrayOfCategoryObject"
                        :selected="object"
                        v-on:updateOption="methodToRunOnSelect"
                        :closeOnOutsideClick="boolean"
              >
              </dropdown>
            </label>
            <label>
              Sort by status
              <dropdown class="my-dropdown-toggle"
                        :options="arrayOfStatusObject"
                        :selected="objectStaus"
                        v-on:updateOption="methodToRunOnSelectStatus"
                        :closeOnOutsideClick="boolean"
              >
              </dropdown>
            </label>
          </div>

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

          <template v-slot:[`item.reply`]="{ item }">
            <button 
              class="small-button"
              @click="openModalRespondIssueInner(item)"
              :disabled="item.is_replied"
              :style="{ background: item.is_replied && '#a7a7a7'  }"
            >
              Reply
            </button>
          </template>

          <template v-slot:[`item.view_all`]="{ item }">
            <button 
              class="small-button"
              @click="openModalInfoInner(item)"
            >
              Info
            </button>
          </template>

          <template v-slot:no-content>
            <div 
              v-if="reactivePage > 1 && !reactiveList.length"
              class="no-data-to-show">
                You do not have data for page {{ reactivePage }} please 
                <button class="small-button" @click="changePage(1)">open page 1</button>
            </div>
          </template>

          <template v-slot:[`item.user`]="{ item }">
            {{ item.user.last_name }} &nbsp;
            {{ item.user.first_name }}
          </template>

          <template v-slot:[`item.action`]="{ item }">
            <toggle-switch
              @click.stop="switchStatus(item.id, item.status)"
              :currentStatus="item.status"
            ></toggle-switch>
          </template>

          <template v-slot:[`item.image`]="{ item }">
            <Attachment 
              :isTable="true"
              :data="item"
              :envAddress="envAddress"
            />
          </template>

          <template v-slot:[`item.delete_question`]="{ item }">
            <div class="delete-img-wrapper">
              <svg @click.stop="startDeletionData(item.id)" style="margin-right: 10px" width="13" height="16" viewBox="0 0 13 16" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd"
                        d="M4.12877 1.87027V1.45397C4.12877 1.22539 4.35979 1.03906 4.64339 1.03906H7.53124C7.81553 1.03906 8.04655 1.22539 8.04655 1.45397V1.87027H4.12877ZM10.3838 2.90876C10.3237 4.47766 9.95084 14.0905 9.90381 14.5235C9.87614 14.7825 9.78068 14.91 9.7295 14.9612H2.44521C2.39333 14.91 2.29857 14.7825 2.2709 14.5235C2.22456 14.0905 1.80746 4.48459 1.73968 2.90876H10.3838ZM9.07994 1.87021V1.45392C9.07994 0.651803 8.43182 0 7.63429 0H4.54032C3.74279 0 3.09466 0.651803 3.09466 1.45392V1.87021H0V2.90852H0.705534L1.24229 14.9007C1.25128 14.9451 1.48162 16 2.37322 16H9.8C10.6923 16 10.9226 14.9451 10.9365 14.8668L11.4435 2.90852H12.1739V1.87021H9.07994ZM8.86954 3.74051H7.83545L7.51311 14.1299H8.5472L8.86954 3.74051ZM5.56975 14.1302H6.60385V3.74079H5.56975V14.1302ZM4.66083 14.1299L4.3385 3.74051H3.30441L3.62605 14.1299H4.66083Z"
                        fill="#666666"/>
              </svg>
              <button 
                @click.stop="$router.push(`/panel/community/${item.id}/responses`)"
                class="small-button"
              >
                  show resp
              </button>
            </div>
          </template>

          <template v-slot:[`item.rating`]="{ item }">
            <star-rating
                    v-model="item.rating"
                    :rating="item.rating"
                    :star-size="20"
                    :show-rating="false"
                    :read-only="true"
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
                {{ selected.length > 1 ? 'these rates?' : 'this rate?' }}
            </template>
            <template v-slot:back>
                <div @click="closeDeletion">Back</div>
            </template>
            <template v-slot:delete >
                <div @click="deleteData">Delete</div>
            </template>
        </modal-window>
        <!-- -------- Delete user modal ------------- -->

        <!-- -------- Open Info modal window ------------- -->
        <modal-info
          v-if="isModalInfo"
          @close="closeModalInfoInner"
          :infoModalDataTitles="infoModalDataTitles"
          :inputData="infoModalData"
        >
        </modal-info>
        <!-- -------- Open Info modal window ------------- -->

        <!-- -------- Respond to request modal ------------- -->
        <modal-window
          :width="'648px'"
          v-if="isModalRespondCommunityIssue"
          @close="closeModalRespondIssueInner"
        >
          <template v-slot:title>
            Responding to community issue
            <div class="name-of-request">
              <div class="left">
                <img src="../../assets/images/redirect-arrow.svg" alt="">
              </div>
              <div class="right">
                <div><h3>title :</h3> {{ respondIssueModalData.title }}</div><br/>
                <div><h3>description :</h3> {{ respondIssueModalData.description }}</div><br/>
              </div>
            </div>
          </template>
          <template v-slot:create-form-opportunity>
            <Form 
              @submit="onSubmit" 
              :validation-schema="schema" 
            >
              <div class="big-modal-window">
                <div class="right-side">
                  <div class="information-block">
                    <label for="description">
                      Your answer
                      <Field
                        as="textarea"
                        style="resize: none; height: 300px;"
                        name="answer"
                        id="description"
                      />
                    </label>
                    <ErrorMessage name="description" />
                  </div>
                  <div class="btns-block">
                    <div class="btn save" @click="closeModalRespondIssueInner">
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

    </div>
</template>

<script>
    import { reactive, ref } from "vue";
    import { useRoute } from "vue-router";

    import VTable from 'vue3-table-component';
    import Pagination from 'v-pagination-3';
    import dropdown from 'vue-dropdowns';
    import StarRating from './../../components/star-rating';
    import { Field, Form, ErrorMessage } from "vee-validate";

    require('dotenv').config()

    import dayjs from "dayjs";

    import { pageDataWorkerSetup } from "../../workers/page.data.woker";
    import { $api } from "../../api";
    import { pageActionWorkerSetup } from "../../workers/page.action.woker";
    import ModalWindow from "../../components/ModalWindow";
    import ToggleSwitch from '../../components/ToggleSwitch.vue';
    import Attachment from '../../components/Attachment.vue';
    import ModalInfo from '../../components/ModalInfo.vue';

    const $getRequest = (query) => $api.CommunityQuestionsRequest.getAll(query);
    const $updateOneDataRequest = (id, data) => $api.CommunityQuestionsRequest.update(id, data);
    const $deleteOneDataRequest = (id) => $api.CommunityQuestionsRequest.deleteSelected([id]);

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
            text: 'Reply',
            value: 'reply',
            width: '90px'
        },
        {
            text: 'Date of register',
            value: 'created_at',
            sortable: true
        },
        {
            text: 'User',
            value: 'user'
        },
        {
            text: 'Title of the issue',
            value: 'title'
        },
        {
            text: 'Body',
            value: 'description'
        },
        {
            text: 'Added images',
            value: 'image'
        },
        {
            text: 'Post’s rating',
            value: 'rating'
        },
        {
            text: 'Action',
            value: 'action'
        },
        {
            text: 'Delete Question',
            value: 'delete_question'
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
        PUBLISHED: 'Published',
        UNPUBLISHED: 'Unpublished'
    };

    export default {
        name: "Community",
        components: {
            VTable,
            StarRating,
            Pagination,
            'dropdown': dropdown,
            'modal-window': ModalWindow,
            'toggle-switch': ToggleSwitch,
            Attachment,
            'modal-info': ModalInfo,
            Field, 
            Form, 
            ErrorMessage
        },

        setup() {
          const route = useRoute();

          const envAddress = ref(process.env.VUE_APP_FILE_LINK)

          // ---------------- operations with changing user rating
          const modifiedItemId = ref(null)

          const updateRating = (event, id) => {
            $configAction.startRating(id);
            const modifiedRatingItem = $configData.reactiveList.value.find(item => item.id === id);
            modifiedRatingItem.internal_rating = event;
            modifiedItemId.value = id;
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

          // ---------------- sort dropdown categories
          const dropdownCategories = ref(route.meta.communitiesCategoriesData.data);

          let arrayOfCategoryObject = reactive(route.meta.communitiesCategoriesData.data);
          arrayOfCategoryObject = [
            { name: 'All', value: '' },
            ...arrayOfCategoryObject,
          ]

          let object = reactive({ name: dropdownItems.ALL });
          const methodToRunOnSelect = async payload => {
              object = payload;

              $configData.reactiveFilterFields.value.communityCategoryId = payload.id ? `${payload.id}` : '';
              await $configData.getData({
                  ...$configData.getQuery(),
                  communityCategoryId: $configData.reactiveFilterFields.value.communityCategoryId
              })
          };
          // ---------------- sort dropdown categories

          // ---------------- sort dropdown status
          const arrayOfStatusObject = reactive([
              { name: dropdownItems.ALL, value: '' },
              { name: dropdownItems.PUBLISHED, value: 'published' },
              { name: dropdownItems.UNPUBLISHED, value: 'unpublished' }
          ]);
          let objectStaus = reactive({ name: dropdownItems.ALL });
          const methodToRunOnSelectStatus = async payload => {

            object = payload;
            $configData.reactiveFilterFields.value.sortBy = payload.value ? `status ${payload.value}` : '';
            await $configData.getData({
              ...$configData.getQuery(),
              sortBy: $configData.reactiveFilterFields.value.sortBy
            })
          };
          // ---------------- sort dropdown status

          // --------------- multiple deletion of users
          const deleteMultipleUsers = selected => {
            const ids = selected.map(item => item.id)
            $configAction.startDeletionData(ids)
          };
          // --------------- multiple deletion of users

          const $configData = pageDataWorkerSetup({
              $initData: {
                reactiveList: route.meta.communitiesQuestionsData.data.items.map(transformOperatorItems),
                reactiveFilterFields: {
                  ...filterFields,
                  ...route.query
                },
                reactivePagination: $getPagination(route.meta.communitiesQuestionsData.data),
                formData: []
              },
              $updateOneDataRequest,
              $getPagination,
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

          const switchStatus = async (id, status) => {
            const setStatus = status === "published" ? "unpublished" : "published"
            const data = { status: setStatus }
            await $api.CommunityQuestionsRequest.patch(id, data)
            await $configData.getData();
          };

          const infoModalDataTitles = {
            client_name : 'Name',
            created_at : 'Date of creation'
          }

          // ------------------- Info Modal
          let infoModalData = ref({})
          const openModalInfoInner = data => {
            infoModalData.value = data
            $configAction.openModalInfo()
          }
          const closeModalInfoInner = () => {
            infoModalData.value = {}
            $configAction.closeModalInfo()
          }
          // ------------------- Info Modal

          // ------------------- Respond to community issue Modal
          let respondIssueModalData = ref({})
          const openModalRespondIssueInner = data => {
            respondIssueModalData.value = data
            $configAction.openModalRespondCommunityIssue(data.id)
          }
          const closeModalRespondIssueInner = () => {
            respondIssueModalData.value = {}
            $configAction.closeModalRespondCommunityIssue()
          }
          const onSubmit = async data => {
            const id = $configAction.idInfo.value

            const result = await $configData.updateOne(id, data);

            if(result) {
              await $configData.getData();
              $configAction.closeModalRespondCommunityIssue()
            }

          }
          // ------------------- Respond to community issue Modal


          return {
              ...$configData,
              ...$configAction,
              selected,
              headers,
              object,
              methodToRunOnSelect,
              updateRating,
              deleteMultipleUsers,
              cancelRating,
              arrayOfCategoryObject,
              envAddress,
              dropdownCategories,
              switchStatus,
              handleApiSorting: handleApiSorting($configData),
              arrayOfStatusObject,
              objectStaus,
              methodToRunOnSelectStatus,
              infoModalDataTitles,
              infoModalData,
              openModalInfoInner,
              closeModalInfoInner,
              openModalRespondIssueInner,
              closeModalRespondIssueInner,
              respondIssueModalData,
              onSubmit

          };
        }
    }
</script>

<style lang="scss">
.search-filter-block {
  display: flex;
  margin-bottom: 10px;
  justify-content: space-between;
}
@import '../../assets/styles/_colors.scss';
@import '../../assets/styles/_mixins.scss';
@import '../../assets/styles/_table.scss';
@import '../../assets/styles/_pagination.scss';
@import '../../assets/styles/_filter-dropdown.scss';
@import '../../assets/styles/_search-window.scss';
@import '../../assets/styles/_multiple-delete-block';
@import '../../assets/styles/_small-btn.scss';
@import '../../assets/styles/_big-modal-window';


</style>
