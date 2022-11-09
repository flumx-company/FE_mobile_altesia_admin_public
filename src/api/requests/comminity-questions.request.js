
import {
    REQUEST_CLIENT_NAME,
    REQUEST_VERSIONS,
    REQUEST_END_POINT
} from "../request.key/request.const";
import { ApiRequest } from "../http/request";
import { requestDataPipe } from "../request.pipe/request.data.pipe";

export class CommunityQuestionsRequest extends ApiRequest {
    $endPoint = REQUEST_END_POINT.COMMUNITY_QUESTIONS;

    $defaultVersion = REQUEST_VERSIONS.V1;

    $defaultClient = REQUEST_CLIENT_NAME.ADMIN;

    deleteSelected(ids = [], headers, config) {
        return this.$axios.delete(
            this.$concatParams(
                this.$createUrl({
                  clientName: REQUEST_CLIENT_NAME.CLIENT
                }),
            ),
            {
                ...headers,
                data: {
                  ids
                }
            },
        ).then(requestDataPipe);
    }

    update(id, data, headers, config) {
      return this.$axios.post(
          this.$concatParams(
              this.$createUrl({
                clientName: REQUEST_CLIENT_NAME.CLIENT
              }),
              id,
              'response',
              'reply',
          ),
          data,
          headers
      ).then(requestDataPipe);
  }
}

