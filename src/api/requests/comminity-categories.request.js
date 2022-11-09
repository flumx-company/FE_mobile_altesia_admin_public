
import {
    REQUEST_CLIENT_NAME,
    REQUEST_VERSIONS,
    REQUEST_END_POINT
} from "../request.key/request.const";
import { ApiRequest } from "../http/request";

export class CommunityCategoriesRequest extends ApiRequest {
    $endPoint = REQUEST_END_POINT.COMMUNITY_CATEGORIES;

    $defaultVersion = REQUEST_VERSIONS.V1;

    $defaultClient = REQUEST_CLIENT_NAME.CLIENT;

    update(id, data, headers, config) {
        return this.$axios.patch(
            this.$concatParams(
                this.$createUrl({
                    ...config,
                    clientName: REQUEST_CLIENT_NAME.ADMIN
                }),
                id
            ),
            data,
            headers
        )
    }

    deleteSelected(ids = [], headers, config) {
        return this.$axios.delete(
            this.$concatParams(
                this.$createUrl({
                    clientName: REQUEST_CLIENT_NAME.ADMIN
                }),
            ),
            {
                ...headers,
                data: {
                    ids
                }
            },
        );
    }

    create(data, headers, config) {
        return this.$axios.post(
            this.$createUrl({
                clientName: REQUEST_CLIENT_NAME.ADMIN
            }),
            data,
            headers
        );
    };
}
