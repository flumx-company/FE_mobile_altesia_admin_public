<template>
    <div class="managin-page">


        <div class="search-filter-block">
            <div class="search-window">
                <input type="text" v-model="search" placeholder="Search">
                <div class="search-button">
                    <img src="../../assets/images/lense.svg" alt="">
                </div>
            </div>
        </div>


        <div class="managing-block">
            <div class="top-buttons-line">
                <div
                        v-if="!isEditeMode"
                        class="edit-btn"
                        @click="toggleEditeMode"
                >
                    <img src="../../assets/images/edit.svg" alt="">
                    Edit
                </div>

                <div
                        v-if="isEditeMode"
                        class="editing-btns"
                >
                    <div
                            @click="toggleEditeMode"
                            class="cancel"
                    >
                        Cancel
                    </div>
<!--                    <div class="save-exit" >-->
<!--                        <img src="../../assets/images/save-icon.svg" alt="">-->
<!--                        Save & Exit-->
<!--                    </div>-->
                </div>

            </div>

            <div class="elements-block">
                <div class="items-title">
                    <div class="title">
                        Missions
                    </div>
                    <div
                            v-if="isEditeMode"
                            class="clear-block"
                            @click="startToDeletionData('missions', searchedData.searchedData.map(i => i.id))"
                    >
                        Clear all
                    </div>
                </div>
                <div class="items-block">

                    <div
                            class="item"
                            v-for="item in searchedData.missions"
                            :key="item.id"
                            @dblclick.self="isEditeMode && startToEditionData('missions', item.id, item)"
                    >
                        {{ item.name }}
                        <span v-if="isEditeMode"  @click="startToDeletionData('missions', [item.id])">
                    &times;
                      </span>
                    </div>

                    <div class="empty"  v-if="!searchedData.missions.length">
                        Empty
                    </div>

                    <div class="create-new-btn" @click="openModal('missions')"  v-if="isEditeMode">
                        Create new item
                        <img src="../../assets/images/plus.svg" alt="">
                    </div>
                </div>
            </div>

            <div class="elements-block">
                <div class="items-title">
                    <div class="title">
                        Industries
                    </div>
                    <div
                            v-if="isEditeMode"
                            class="clear-block"
                            @click="startToDeletionData('industries', searchedData.industries.map(i => i.id))"
                    >
                        Clear all
                    </div>
                </div>

                <div class="items-block">

                    <div
                            class="item"
                            v-for="item in searchedData.industries"
                            :key="item.id"
                            @dblclick.self="isEditeMode && startToEditionData('industries', item.id, item)"
                    >
                        {{ item.name }}
                        <span v-if="isEditeMode"  @click="startToDeletionData('industries', [item.id])">
                    &times;
                      </span>
                    </div>

                    <div class="empty"  v-if="!searchedData.industries.length">
                        Empty
                    </div>

                    <div class="create-new-btn" @click="openModal('industries')"  v-if="isEditeMode">
                        Create new item
                        <img src="../../assets/images/plus.svg" alt="">
                    </div>
                </div>
            </div>

<!--            <div class="elements-block">-->
<!--                <div class="items-title">-->
<!--                    <div class="title">-->
<!--                        Skill types-->
<!--                    </div>-->
<!--                    <div-->
<!--                            v-if="isEditeMode"-->
<!--                            class="clear-block"-->
<!--                    >-->
<!--                        Clear all-->
<!--                    </div>-->
<!--                </div>-->
<!--                <div class="items-block">-->

<!--                    <div-->
<!--                            class="item"-->
<!--                            v-for="item in items.skills"-->
<!--                            :key="item.id"-->
<!--                    >-->
<!--                        {{ item.name }}-->
<!--                        <span v-if="isEditeMode">-->
<!--                    &times;-->
<!--                      </span>-->
<!--                    </div>-->

<!--                    <div class="empty"  v-if="!items.skills.length">-->
<!--                        Empty-->
<!--                    </div>-->

<!--                    <div class="create-new-btn" @click="openModal('skills')"  v-if="isEditeMode">-->
<!--                        Create new item-->
<!--                        <img src="../../assets/images/plus.svg" alt="">-->
<!--                    </div>-->
<!--                </div>-->

<!--            </div>-->

            <div class="elements-block">
                <div class="items-title">
                    <div class="title">
                        Skill types
                    </div>
                    <div
                            v-if="isEditeMode"
                            class="clear-block"
                            @click="startToDeletionData('skills', searchedData.skills.map(i => i.id))"
                    >
                        Clear all
                    </div>
                </div>
                <div class="items-block">

                    <div
                            class="item"
                            v-for="item in searchedData.skills"
                            :key="item.id"
                            @dblclick.self="isEditeMode && startToEditionData('skills', item.id, item)"
                    >
                        {{ item.name }}
                        <span v-if="isEditeMode"
                              @click="startToDeletionData('skills', [item.id])"
                              >
                    &times;
                      </span>
                    </div>

                    <div class="empty" v-if="!searchedData.skills.length">
                        Empty
                    </div>

                    <div class="create-new-btn" @click="openModal('skills')"  v-if="isEditeMode">
                        Create new item
                        <img src="../../assets/images/plus.svg" alt="">
                    </div>
                </div>


            </div>

            <div class="elements-block">
                <div class="items-title">
                    <div class="title">
                        Community Categories
                    </div>
                    <div
                            v-if="isEditeMode"
                            class="clear-block"
                            @click="startToDeletionData('communityCategories', searchedData.communityCategories.map(i => i.id))"
                    >
                        Clear all
                    </div>
                </div>
                <div class="items-block">

                    <div
                            class="item"
                            v-for="item in searchedData.communityCategories"
                            :key="item.id"
                            @dblclick.self="isEditeMode && startToEditionData('communityCategories', item.id, item)"
                    >
                        {{ item.name }}
                        <span v-if="isEditeMode"
                              @click="startToDeletionData('communityCategories', [item.id])"
                        >
                    &times;
                      </span>
                    </div>

                    <div class="empty" v-if="!searchedData.communityCategories.length">
                        Empty
                    </div>

                    <div class="create-new-btn" @click="openModal('communityCategories')"  v-if="isEditeMode">
                        Create new item
                        <img src="../../assets/images/plus.svg" alt="">
                    </div>
                </div>


            </div>
            <modal-window
                    width="648px"
                    v-if="isModalMode === 'create' || isModalMode === 'edit'"
                    @close="closeRespondRequestModal"
            >
                <template v-slot:title>
                   Create new item
                </template>
                <template v-slot:create-form-category>
                    <Form
                            @submit="isModalMode === 'create' ? createSchema($event) : updateSchema($event)"
                            :initial-values="editionDataInit"
                            :validation-schema="schema">
                        <div class="big-modal-window">
                            <div class="right-side">
                                <div class="information-block">
                                    <label for="name">
                                        Your answer
                                        <Field
                                                as="input"
                                                name="name"
                                                id="name"
                                        />
                                    </label>
                                    <ErrorMessage name="name" />
                                </div>
                                <div class="btns-block">
                                    <button type="submit" class="btn save" @click="closeRespondRequestModal">
                                        close
                                    </button>
                                    <button type="submit" class="btn save-publish">
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Form>
                </template>
            </modal-window>

            <modal-window v-if="isModalMode === 'delete'" @close="closeRespondRequestModal">
                <template v-slot:title>
                    Do you really want to delete
                    {{ deletionData.length > 1 ? 'these records?' : 'this record?' }}
                </template>
                <template v-slot:back>
                    <div @click="closeRespondRequestModal">Back</div>
                </template>
                <template v-slot:delete >
                    <div @click="deleteData">Delete</div>
                </template>
            </modal-window>
        </div>
    </div>
</template>

<script>
    import { ref, computed } from 'vue';
    import { useRoute } from "vue-router";
    import { Field, Form, ErrorMessage } from "vee-validate";
    import ModalWindow from "../../components/ModalWindow";
    import * as yup from "yup";
    import { $api } from "../../api";
    import { finishSpinner, startSpinner } from "../../../packages/altesia-loading-worker";

    const getRequests = {
        missions: () => $api.ManagingMissionsRequest.getAll(),
        industries: () => $api.ManagingIndustriesRequest.getAll(),
        skills: () => $api.ManagingSpecialtiesRequest.getAll(),
        communityCategories: () => $api.CommunityCategoriesRequest.getAll()
    };

    const updateRequests = {
        missions: (id, data) => $api.ManagingMissionsRequest.update(id, data),
        industries: (id, data) => $api.ManagingIndustriesRequest.update(id, data),
        skills: (id, data) => $api.ManagingSpecialtiesRequest.update(id, data),
        communityCategories: (id, data) => $api.CommunityCategoriesRequest.update(id, data)
    };

    const deleteRequests = {
        missions: (ids) => $api.ManagingMissionsRequest.deleteSelected(ids),
        industries: (ids) => $api.ManagingIndustriesRequest.deleteSelected(ids),
        skills: (ids) => $api.ManagingSpecialtiesRequest.deleteSelected(ids),
        communityCategories: (ids) => $api.CommunityCategoriesRequest.deleteSelected(ids)
    };

    const createRequests = {
        missions: (data) => $api.ManagingMissionsRequest.create(data),
        industries: (data) => $api.ManagingIndustriesRequest.create(data),
        skills: (data) => $api.ManagingSpecialtiesRequest.create(data),
        communityCategories: (data) => $api.CommunityCategoriesRequest.create(data)
    };

    export default {
        name: "Managing",
        components: {
            'modal-window': ModalWindow,
            Field,
            Form,
            ErrorMessage
        },
        setup() {
            const route = useRoute();

            const items = ref({
                missions: route.meta.managingMissionsData.data,
                industries: route.meta.managingIndustriesData.data,
                skills: route.meta.managingSpecialtiesData.data,
                communityCategories: route.meta.communityCategoriesData.data
            });

            const isEditeMode = ref(false);
            const isModalMode = ref('');
            const deletionData = ref([]);
            const editionData = ref('');
            const editionDataInit = ref({});
            const modalModeType = ref('');

            const search = ref('');

            const searchedData = computed(() => ({
                missions: items.value.missions.filter(item => item.name.includes(search.value)),
                industries: items.value.industries.filter(item => item.name.includes(search.value)),
                skills: items.value.skills.filter(item => item.name.includes(search.value)),
                communityCategories: items.value.communityCategories.filter(item => item.name.includes(search.value))
            }));

            const toggleEditeMode = () => {
                isEditeMode.value = !isEditeMode.value
            };

            const schema = yup.object({
                name: yup
                    .string()
                    .required()
            });

            const openModal = (modeType) => {
                isModalMode.value = 'create';
                modalModeType.value = modeType;
            };

            const closeRespondRequestModal = () => {
                isModalMode.value = '';
                modalModeType.value = '';
                deletionData.value = [];
                editionDataInit.value = {};
            };

            const startToDeletionData = (modeType, ids) => {
                isModalMode.value = 'delete';
                deletionData.value = ids;
                modalModeType.value = modeType;
            };

            const startToEditionData = (modeType, id, data) => {
                isModalMode.value = 'edit';
                modalModeType.value = modeType;
                editionData.value = id;
                editionDataInit.value = {
                    name: data.name
                }
            };

            const createSchema = async (formData) => {
                if(createRequests[modalModeType.value]) {
                    startSpinner();
                    try {
                        await createRequests[modalModeType.value](formData);
                        const { data } = await getRequests[modalModeType.value]();
                        items.value[modalModeType.value] = data;
                        closeRespondRequestModal()
                    } catch ( e ) {
                        console.log(e)
                    }

                    finishSpinner();
                }
            };

            const deleteData = async () => {
                if(deleteRequests[modalModeType.value]) {
                    startSpinner();
                    try {
                        await deleteRequests[modalModeType.value](deletionData.value);
                        const { data } = await getRequests[modalModeType.value]();
                        items.value[modalModeType.value] = data;
                        closeRespondRequestModal()
                    } catch ( e ) {
                        console.log(e)
                    }

                    finishSpinner();
                }
            };

            const updateSchema = async (formData) => {
                if(updateRequests[modalModeType.value]) {
                    startSpinner();
                    try {
                        await updateRequests[modalModeType.value](editionData.value, formData);
                        const { data } = await getRequests[modalModeType.value]();
                        items.value[modalModeType.value] = data;
                        closeRespondRequestModal()
                    } catch ( e ) {
                        console.log(e)
                    }

                    finishSpinner();
                }
            };


            return {
                items,
                isEditeMode,
                toggleEditeMode,
                schema,
                updateSchema,
                isModalMode,
                deletionData,
                openModal,
                createSchema,
                closeRespondRequestModal,
                startToDeletionData,
                startToEditionData,
                deleteData,
                editionDataInit,
                search,
                searchedData
            }
        }
    }
</script>

<style scoped lang="scss">
    @import '../../assets/styles/_colors.scss';
    @import '../../assets/styles/_mixins.scss';
    @import '../../assets/styles/_search-window.scss';
    @import '../../assets/styles/_managing.scss';
    @import '../../assets/styles/_search-window.scss';

    .empty {
        color: red;
        padding: 5px;
        border: 1px solid red;
        border-radius: 3px;
        width: 134px;
        display: inline-block;
        margin-right: 8px;
        margin-top: 12px;
    }
</style>
