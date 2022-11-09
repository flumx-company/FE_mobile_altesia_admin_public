
import {
    REQUEST_CLIENT_NAME,
    REQUEST_VERSIONS,
    REQUEST_END_POINT
} from "../request.key/request.const";
import { ApiRequest } from "../http/request";

export class ManagingSpecialtiesRequest extends ApiRequest {
    $endPoint = REQUEST_END_POINT.MANAGING_SPECIALTIES;

    $defaultVersion = REQUEST_VERSIONS.V1;

    $defaultClient = REQUEST_CLIENT_NAME.CLIENT;

    create(data, headers, config) {
        return this.$axios.post(
            this.$createUrl({
                clientName: REQUEST_CLIENT_NAME.ADMIN
            }),
            data,
            headers
        );
    };

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

    update(id, data, headers, config) {
        return this.$axios.put(
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

}

