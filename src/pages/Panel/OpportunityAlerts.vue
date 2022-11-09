<template>
    <div>


        <VTable
                style="overflow-x: scroll"
                id="new-table"
                v-model="selected"
                :is-loading="false"
                :use-api-sorting="true"
                :headers="headers"
                :items="reactiveList"
                :is-pagination-mode-enabled="false"
                @handle-api-sorting="handleApiSorting"
        >
            <template v-slot:[`item.action_opportunity`]="{ item }">
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
            <template v-slot:no-content>
                <div class="no-data-to-show" v-if="reactivePage > 1 && !reactiveList.length">
                    You do not have data for page {{ reactivePage }} please
                    <button class="small-button" @click="changePage(1)">open page 1</button>
                </div>
            </template>
        </VTable>

        <pagination
          v-model="reactivePage"
          :records="reactivePagination.totalItems"
          :per-page="reactivePagination.itemsPerPage"
        />


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
                        <div
                          class="event-img"
                          v-if="
                            initialValues.event.attachmentFiles &&
                            initialValues.event.attachmentFiles.length &&
                            initialValues.event.attachmentFiles[0].mineType === 'image/jpeg'
                          "
                        >
                            <img :src="`${envAddress}${initialValues.event.attachmentFiles[0].path}`" alt="">
                        </div>
                        <div
                          class="event-file"
                          v-else-if="
                            initialValues.event.attachmentFiles &&
                            initialValues.event.attachmentFiles.length &&
                            initialValues.event.attachmentFiles[0].mineType !== 'image/jpeg'
                          "
                        >
                            <a :href="`${envAddress}${initialValues.event.attachmentFiles[0].path}`" download>
                                <img src="../../assets/images/attached-file.svg" alt="">
                                <span class="file-name">
                                  {{initialValues.event.attachmentFiles[0].originalName.slice(0, initialValues.event.attachmentFiles[0].originalName.indexOf('.'))}}
                                </span>
                                <span class="file-extantion">
                                  {{initialValues.event.attachmentFiles[0].originalName.slice(initialValues.event.attachmentFiles[0].originalName.indexOf('.'))}}
                                </span>
                            </a>
                        </div>
                        <div v-else>No file attached</div>
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
    </div>
</template>

<script>
    import { reactive, ref, computed } from "vue";
    import { useRoute } from "vue-router";
    import { Field, Form, ErrorMessage } from "vee-validate";
    import * as yup from 'yup';
    import { useRouter } from "vue-router";

    require('dotenv').config();

    import VTable from 'vue3-table-component';
    import Pagination from 'v-pagination-3';
    import dropdown from 'vue-dropdowns';
    import StarRating from './../../components/star-rating';

    import dayjs from "dayjs";

    import { pageDataWorkerSetup } from "../../workers/page.data.woker";
    import { $api } from "../../api";
    import { pageActionWorkerSetup } from "../../workers/page.action.woker";
    import ModalWindow from "../../components/ModalWindow";
    import RadioDropdown from '../../components/Radio-dropdown.vue';
    import ToggleSwitch from '../../components/ToggleSwitch.vue';
    import Attachment from "../../components/Attachment";

    const $getRequest = (id) => (query) => $api.OpportunitiesRequest.getAllAlertsByOportunityId(id, query);

    const $getPagination = e => e.data.meta;

    const transformOperatorItems = (data) => {
        return {
            ...data,
            created_at: dayjs(data.created_at).format('D MMM YYYY'),
        }
    };

    const handleApiSorting = ($configData) => async (e) => {
        const orderBy = e
            .map(i => `${ i.field } ${ i.order }`)
            .join();

        await $configData.getData({
            ...$configData.getQuery(),
            orderBy
        })
    };


    const columnHeaders = [
        {
            text: 'Date of register',
            value: 'created_at',
            sortable: true
        },
        {
            text: 'Title',
            value: 'title'
        },
        {
            text: 'Description',
            value: 'description'
        },
        {
            text: 'Additional image',
            value: 'image'
        },
        {
            text: 'Action Opportunity',
            value: 'action_opportunity',
        }
    ];

    const filterFields = {
        limit: 5,
        page: 1,
        search: '',
        sortBy: '',
        orderBy: ''
    };

    const dropdownItems = {
        ALL: 'All',
        OPENED: 'Opened',
        CLOSED: 'Closed'
    };

    const onSubmit = (configData, configAction) => {
        return async (data) => {
            const id = configAction.idInfo.value;
            try {
                await $api.OpportunitiesRequest.replyAlertByOpportunityId( id, data );
                await configData.getData();
                configAction.closeRespondRequestModal()
            } catch ( e ) {
                console.log(e)
            }
        }
    };

    export default {
        name: "Opportunities",
        components: {
            VTable,
            StarRating,
            Pagination,
            'dropdown': dropdown,
            'modal-window': ModalWindow,
            'radio-dropdown': RadioDropdown,
            'toggle-switch': ToggleSwitch,
            Field,
            Form,
            ErrorMessage,
            Attachment
        },

        setup() {
            const envAddress = ref(process.env.VUE_APP_FILE_LINK);

            const schema = yup.object({
                description: yup
                    .string()
                    .required()
            });

            let initialValues = ref({});

            const editRepliedRequest = (event, id) => {
                initialValues.value = {
                    event,
                    description: event.replied_description
                };

                $configAction.respondToRequest(id)
            };

            const route = useRoute();

            const $configData = pageDataWorkerSetup({
                $initData: {
                    reactiveList: route.meta.opportunityAlertData.data.items.map(transformOperatorItems),
                    reactiveFilterFields: {
                        ...filterFields,
                        ...route.query
                    },
                    reactivePagination: $getPagination(route.meta.opportunityAlertData),
                    formData: []
                },

                $getPagination,
                $getDataRequest: $getRequest(route.params.id_opportunity),
                $updateList: (usersData) => usersData.data.items.map(transformOperatorItems)
            });

            const $configAction = pageActionWorkerSetup({
                reactiveList: $configData.reactiveList
            });

            const headers = reactive(columnHeaders);

            const selected = ref([]);

            return {
                ...$configData,
                ...$configAction,
                selected,
                headers,
                onSubmit: onSubmit($configData, $configAction),
                schema,
                envAddress,
                editRepliedRequest,
                initialValues,
                handleApiSorting: handleApiSorting($configData)
            };
        }
    }
</script>

<style lang="scss">
    @import '../../assets/styles/_colors.scss';
    @import '../../assets/styles/_mixins.scss';
    @import '../../assets/styles/_table.scss';
    @import '../../assets/styles/_pagination.scss';
    @import '../../assets/styles/_filter-dropdown.scss';
    @import '../../assets/styles/_search-window.scss';
    @import '../../assets/styles/_multiple-delete-block';
    @import '../../assets/styles/_create-btn';
    @import '../../assets/styles/_big-modal-window';

    .search-filter-block {
        display: flex;
        margin-bottom: 10px;
        align-items: flex-end;
    }

</style>
