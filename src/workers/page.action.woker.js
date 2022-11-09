import { ref, computed } from "vue";
import { isObject } from "../helpers/utils";

const MODAL_TYPE_ENUM = {
    CREATION: 'CREATION',
    DELETION: 'DELETION',
    EDITION: 'EDITION',
    INFO: 'INFO',
    HIDE: ''
};

export const pageActionWorkerSetup = (config) => {
    const modalActiveType = ref('');
    const idInfo = ref('');
    const updatedData = ref('');
    const attachedFileName = ref(null);

    const isFileExtentionValid = (fileName) => {
      const dotIndex = fileName.lastIndexOf('.') + 1;
      const extention = fileName.slice(dotIndex) ;
      const extentionsArray = ['jpeg', 'jpg'];

      return extentionsArray.includes(extention)
    }

    const inputFileName = e => {
      if (isFileExtentionValid(e.target.files[0].name)) {
        attachedFileName.value = e.target.files[0].name;
      } else {
        attachedFileName.value = 'NOT CORRECT TYPE OF THE FILE'
      }
    }

    const isDeleteModalOpened = computed(() => modalActiveType.value === MODAL_TYPE_ENUM.DELETION);
    const isModalEditRatingOpened = computed(() => modalActiveType.value === MODAL_TYPE_ENUM.EDITION);
    const isModalCreateOpportunity = computed(() => modalActiveType.value === MODAL_TYPE_ENUM.CREATION || modalActiveType.value === MODAL_TYPE_ENUM.EDITION);
    const isModalCreateEvent = computed(() => modalActiveType.value === MODAL_TYPE_ENUM.CREATION || modalActiveType.value === MODAL_TYPE_ENUM.EDITION);
    const isModalRespondRequest = computed(() => modalActiveType.value === MODAL_TYPE_ENUM.EDITION);
    const isModalInfo = computed(() => modalActiveType.value === MODAL_TYPE_ENUM.INFO);
    const isModalRespondCommunityIssue = computed(() => modalActiveType.value === MODAL_TYPE_ENUM.EDITION);



    return {
        idInfo,
        isDeleteModalOpened,
        isModalEditRatingOpened,
        isModalCreateOpportunity,
        isModalCreateEvent,
        attachedFileName,
        isModalRespondRequest,
        isModalInfo,
        isModalRespondCommunityIssue,
        inputFileName,
        startEditionData: async (rowData) => {
            const result = await config.getOne(rowData.id);
            if(result) {
                modalActiveType.value = MODAL_TYPE_ENUM.EDITION;
            }
        },
        editData: async (id) => {
            const result = await config.updateOne(id);
            if(result) {
                modalActiveType.value = MODAL_TYPE_ENUM.HIDE;
            }
        },
        startCreationData: () => {
            modalActiveType.value = MODAL_TYPE_ENUM.CREATION;
        },
        createData: async (data) => {
            const result = await config.createOneData(data);
            if(result) {
                modalActiveType.value = MODAL_TYPE_ENUM.HIDE;
            }
        },


        startDeletionData: (id) => {
            idInfo.value = id;
            modalActiveType.value = MODAL_TYPE_ENUM.DELETION;
        },
        closeDeletion: () => {
            idInfo.value = '';
            modalActiveType.value = MODAL_TYPE_ENUM.HIDE;
        },
        deleteData: async () => {
            const result = await config.deleteOneData(idInfo.value);
            if(result) {
                idInfo.value = '';
                modalActiveType.value = MODAL_TYPE_ENUM.HIDE;
            }
        },

        startRating: (id, data) => {
          idInfo.value = id;
          updatedData.value = data;
          modalActiveType.value = MODAL_TYPE_ENUM.EDITION;
        },
        setRating: async () => {
          const e = await config.updateOne(idInfo.value, updatedData.value);
          console.error(e)
          await config.getData();
          idInfo.value = '';
          updatedData.value = '';
          modalActiveType.value = MODAL_TYPE_ENUM.HIDE;

        },
        closeRating: () => {
          idInfo.value = '';
          updatedData.value = '';
          modalActiveType.value = MODAL_TYPE_ENUM.HIDE;
        },

        createOpportunity: id => {
          if (isObject(id) || !id) {
            modalActiveType.value = MODAL_TYPE_ENUM.CREATION;
          } else {
            modalActiveType.value = MODAL_TYPE_ENUM.EDITION;
            idInfo.value = id;
          }
        },
        closeOpportunityModal: () => {
          attachedFileName.value = null;
          modalActiveType.value = MODAL_TYPE_ENUM.HIDE;
          idInfo.value = '';
        },

        createEvent: id => {
          if (isObject(id)) {
            modalActiveType.value = MODAL_TYPE_ENUM.CREATION;
          } else {
            modalActiveType.value = MODAL_TYPE_ENUM.EDITION;
            idInfo.value = id;
          }
        },
        closeEventModal: () => {
          attachedFileName.value = null;
          idInfo.value = '';
          modalActiveType.value = MODAL_TYPE_ENUM.HIDE;
        },

        respondToRequest: id => {
          idInfo.value = id;
          modalActiveType.value = MODAL_TYPE_ENUM.EDITION;
        },
        closeRespondRequestModal: () => {
          idInfo.value = '';
          modalActiveType.value = MODAL_TYPE_ENUM.HIDE;
        },

        openModalInfo: () => {
          modalActiveType.value = MODAL_TYPE_ENUM.INFO;
        },
        closeModalInfo: () => {
          modalActiveType.value = MODAL_TYPE_ENUM.HIDE;
        },

        openModalRespondCommunityIssue: id => {
          idInfo.value = id;
          modalActiveType.value = MODAL_TYPE_ENUM.EDITION;
        },
        closeModalRespondCommunityIssue: () => {
          modalActiveType.value = MODAL_TYPE_ENUM.HIDE;
        }
    }
};
