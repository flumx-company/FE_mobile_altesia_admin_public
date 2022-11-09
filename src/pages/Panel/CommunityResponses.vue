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
            <template v-slot:[`item.action`]="{ item }">
                <toggle-switch
                        @click.stop="switchStatus(item.id, item.status)"
                        :currentStatus="item.status"
                ></toggle-switch>

            </template>
            <template v-slot:no-content>
                <div class="no-data-to-show" v-if="reactivePage > 1 && !reactiveList.length">
                    You do not have data for page {{ reactivePage }} please 
                    <button class="small-button" @click="changePage(1)">open page 1</button>
                </div>
            </template>
            <template v-slot:[`item.communityRatings`]="{ item }">
                <star-rating
                        :rating="item.averageRating"
                        :star-size="20"
                        :show-rating="false"
                        :read-only="true"
                        :inactiveColor="'#40BB15'"
                        :maxRating="5"
                ></star-rating>
            </template>
        </VTable>

        <pagination v-model="reactivePage"
                    :records="reactivePagination.totalItems"
                    :per-page="reactivePagination.itemsPerPage"
        />

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

    const $getRequest = (communityQuestionId) => (query) => $api.CommunityResponsesRequest.getAll({
        ...query,
        communityQuestionId
    });

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
            text: 'Answer',
            value: 'answer'
        },

        {
            text: 'Community Ratings',
            value: 'communityRatings'
        },
        {
            text: 'Action',
            value: 'action'
        },
    ];

    const filterFields = {
        limit: 5,
        page: 1,
        search: '',
        sortBy: '',
        orderBy: ''
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
            ErrorMessage
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
                    reactiveList: route.meta.communitiesResponsesData.data.items.map(transformOperatorItems),
                    reactiveFilterFields: {
                        ...filterFields,
                        ...route.query
                    },
                    reactivePagination: $getPagination(route.meta.communitiesResponsesData),
                    formData: []
                },
                $getPagination,
                $getDataRequest: $getRequest(route.params.id_community),
                $updateList: (usersData) => usersData.data.items.map(transformOperatorItems)
            });

            const $configAction = pageActionWorkerSetup({
                reactiveList: $configData.reactiveList
            });

            const switchStatus = async (id, status) => {
                const setStatus = status === "published" ? "unpublished" : "published";
                const data = { status: setStatus };
                await $api.CommunityResponsesRequest.updateStatus(id, data);
                await $configData.getData();
            };

            const headers = reactive(columnHeaders);

            const selected = ref([]);

            return {
                ...$configData,
                ...$configAction,
                selected,
                headers,
                schema,
                envAddress,
                switchStatus,
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
    @import '../../assets/styles/_small-btn.scss';

    .search-filter-block {
        display: flex;
        margin-bottom: 10px;
        align-items: flex-end;
    }

</style>
