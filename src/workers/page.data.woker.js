import { reactive, computed, ref } from "vue";
import { finishSpinner, startSpinner } from "../../packages/altesia-loading-worker";
import { useRouter } from "vue-router";
import { isObject, isFunction } from "../helpers/utils";

const $getData = (getDataConfig) => {
    let {
        $getDataRequest,
        reactiveList,
        $handleGetData,
        reactivePagination,
        $updateList,
        $handleErrorData,
        $getPagination,
        updateQuery,
        getQuery
    } = isObject(getDataConfig, {});

    $getDataRequest = isFunction($getDataRequest, () => {});
    $handleGetData = isFunction($handleGetData, () => {});
    $updateList = isFunction($updateList, (e) => e.data.items);
    $handleErrorData = isFunction($handleErrorData, () => {});
    $getPagination = isFunction($getPagination, (e) => e.data.meta);
    getQuery = isFunction(getQuery, () => {});
    updateQuery = isFunction(updateQuery, () => {});

    return async (query) => {
        startSpinner();
        if(query) {
            updateQuery(query);
        }

        try {
            const result = await $getDataRequest(query || getQuery());

            reactiveList.value = $updateList(result);
            reactivePagination.value = $getPagination(result);
            $handleGetData(result);
        } catch ( error ) {
            $handleErrorData(error);
        }

        finishSpinner();

        return {
            reactiveList,
            reactivePagination
        }
    }
};

const $getOneData = (getOneDataConfig) => {
    let {
        $getOneDataRequest,
        reactiveFormData,
        setFormData,
        $handleOneGetData,
        $handleOneErrorData
    } = isObject(getOneDataConfig,{});

    $getOneDataRequest = isFunction($getOneDataRequest, () => {});
    $handleOneGetData = isFunction($handleOneGetData, () => {});
    $handleOneErrorData = isFunction($handleOneErrorData, () => {});
    setFormData = isFunction(setFormData, () => {});

    return async (id) => {
        startSpinner();

        try {
            const { data } = await $getOneDataRequest(id);
            setFormData(reactiveFormData, data);
            $handleOneGetData(data);
        } catch ( error ) {
            $handleOneErrorData(error);
        }
        finishSpinner();
    }
};

const $updateOneData = (getDataConfig) => {
    let {
        $updateOneDataRequest,
        reactiveFormData,
        getRawFromFormData,
        clearFormData,
        $handleUpdateOneData,
        $handleUpdateOneErrorData,
    } = isObject(getDataConfig,{});

    $updateOneDataRequest = isFunction($updateOneDataRequest, () => {});
    getRawFromFormData = isFunction(getRawFromFormData, () => {});
    clearFormData = isFunction(clearFormData, () => {});
    $handleUpdateOneData = isFunction($handleUpdateOneData, () => {});
    $handleUpdateOneErrorData = isFunction($handleUpdateOneErrorData, () => {});

    return async (id, updateData) => {
      console.log('$updateOneData', id, updateData)
        startSpinner();

        try {
            const { data } = await $updateOneDataRequest(
                id,
                isObject(updateData, getRawFromFormData(reactiveFormData))
            );

            clearFormData(reactiveFormData);
            $handleUpdateOneData(data);
            finishSpinner();
            return true
        } catch ( error ) {
            $handleUpdateOneErrorData(error);
            return false
        }
    }
};

const $deleteOneData = (getDataConfig) => {
    let {
        $deleteOneDataRequest,
        $handleDeleteOneData,
        $handleDeleteOneErrorData,
        $getData
    } = isObject(getDataConfig,{});

    $deleteOneDataRequest = isFunction($deleteOneDataRequest, () => {});
    $handleDeleteOneData = isFunction($handleDeleteOneData, () => {});
    $handleDeleteOneErrorData = isFunction($handleDeleteOneErrorData, () => {});
    $getData = isFunction($getData, () => {});

    return async (id) => {
        startSpinner();

        try {
            const { data } = await $deleteOneDataRequest(id);
            $handleDeleteOneData(data);
            await $getData();
        } catch ( error ) {
            $handleDeleteOneErrorData(error);
            finishSpinner();
            return false;
        }

        finishSpinner();
        return true;
    }
};


const $createOneData = (getDataConfig) => {
    let {
        $createOneDataRequest,
        // formData,
        // getRawFromFormData,
        // clearFormData,
        $handleCreateOneData,
        $handleCreateOneErrorData
    } = isObject(getDataConfig,{});

    $createOneDataRequest = isFunction($createOneDataRequest, () => {});
    // getRawFromFormData = isFunction(getRawFromFormData, () => {});
    $handleCreateOneData = isFunction($handleCreateOneData, () => {});
    $handleCreateOneErrorData = isFunction($handleCreateOneErrorData, () => {});

    return async (formData) => {
        startSpinner();

        try {
            const { data } = await $createOneDataRequest(formData);
            // clearFormData(formData);
            $handleCreateOneData(data);
            finishSpinner();
            return true;
        } catch ( error ) {
            $handleCreateOneErrorData(error);
            finishSpinner();
            return false;
        }
    }
};


const $getQuery = (queryConfig) => {
    const { reactiveFilterFields } = queryConfig;
    return () => {
        const queryObj = isObject(reactiveFilterFields.value, {});

        return Object.keys(queryObj)
            .filter(item => !!queryObj[item])
            .reduce((prev, cur) => ({
                ...prev,
                [cur]: queryObj[cur]
            }), {});
    }
};


const $updateQuery = (queryConfig) => {
    const { $router } = queryConfig;

    return (query) => {

        query = Object.keys(query)
            .filter(item => !!query[item])
            .reduce((prev, cur) => ({
                ...prev,
                [cur]: query[cur]
            }), {});

        return $router
            .replace({
                path: $router.currentRoute.value.path,
                query
            })
            .catch(err=>err);
    }
};

export const pageDataWorkerSetup = (config) => {
    const {
        $updateList,
        $initData,
        $getPagination,

        $getDataRequest,
        $handleGetData,
        $handleErrorData,

        $getOneDataRequest,
        $handleGetOneData,
        $handleGetOneErrorData,

        $updateOneDataRequest,
        $handleUpdateOneData,
        $handleUpdateOneErrorData,

        $deleteOneDataRequest,
        $handleDeleteOneData,
        $handleDeleteOneErrorData,

        $createOneDataRequest,
        $handleCreateOneData,
        $handleCreateOneErrorData

    } = isObject(config,{});

    const $router = useRouter();

    const reactiveList = ref(isObject($initData.reactiveList, []));
    const reactiveFormData = ref(isObject($initData.formData, []));
    const reactivePagination = ref(isObject($initData.reactivePagination, {}));
    const reactiveFilterFields = ref(isObject($initData.reactiveFilterFields, {}));

    const setFormData = () => {};
    const clearFormData = () => {};
    const getRawFromFormData = () => {};

    const updateQuery = $updateQuery({
        $router
    });

    const getQuery = $getQuery({
        reactiveFilterFields
    });

    const getData = $getData({
        $getPagination,
        $updateList,

        $getDataRequest,
        $handleGetData,
        $handleErrorData,

        reactiveList,
        reactivePagination,
        reactiveFilterFields,

        updateQuery,
        getQuery
    });

    const getOne = $getOneData({
        $getOneDataRequest,
        $handleGetOneData,
        $handleGetOneErrorData,

        reactiveFormData,
        setFormData
    });

    const updateOne = $updateOneData({
        $updateOneDataRequest,
        $handleUpdateOneData,
        $handleUpdateOneErrorData,
        reactiveFormData,

        getRawFromFormData,
        clearFormData
    });

    const deleteOneData = $deleteOneData({
        $deleteOneDataRequest,
        $handleDeleteOneData,
        $handleDeleteOneErrorData,
        $getData: getData
    });

    const createOneData = $createOneData({
        $createOneDataRequest,
        $handleCreateOneData,
        $handleCreateOneErrorData,

        // reactiveFormData,
//
        // getRawFromFormData,
        // clearFormData
    });


    const reactivePage = computed({
        get: () => (reactiveFilterFields && Number(reactiveFilterFields.value.page)) || $initData.defaultPage || 1,
        async set (page) {
            if (page === reactivePage.value) {
                return;
            }

            reactiveFilterFields.value.page = page;

            await getData({
                ...getQuery(),
                page
            });
        }
    });

    return {
        getData,
        getOne,
        updateOne,
        deleteOneData,
        createOneData,
        reactiveList,
        updateQuery,
        getQuery,
        reactivePage,
        reactiveFilterFields,
        reactivePagination,
        changePage: () => reactivePage.value = 1
    };
};
