
import {
    REQUEST_CLIENT_NAME,
    REQUEST_VERSIONS,
    REQUEST_END_POINT
} from "../request.key/request.const";
import { ApiRequest } from "../http/request";
import { requestDataPipe } from "../request.pipe/request.data.pipe";

export class CommunityResponsesRequest extends ApiRequest {
    $endPoint = REQUEST_END_POINT.COMMUNITY_RESPONSES;

    $defaultVersion = REQUEST_VERSIONS.V1;

    $defaultClient = REQUEST_CLIENT_NAME.CLIENT;

    updateStatus(id, data, headers, config) {
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
        ).then(requestDataPipe);
    }
}

