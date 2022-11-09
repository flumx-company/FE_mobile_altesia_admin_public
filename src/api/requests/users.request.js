import {
    REQUEST_CLIENT_NAME,
    REQUEST_END_POINT,
    REQUEST_VERSIONS,
} from "../request.key/request.const";
import { ApiRequest } from "../http/request";
import { requestDataPipe } from "../request.pipe/request.data.pipe";




export class UsersRequest extends ApiRequest {
    $endPoint = REQUEST_END_POINT.USERS;

    $defaultVersion = REQUEST_VERSIONS.V1;

    $defaultClient = REQUEST_CLIENT_NAME.ADMIN;

    deleteSelected(ids = [], headers, config) {
      return this.$axios.delete(
          this.$concatParams(
              this.$createUrl({
                endPoint: 'user'
              }),
          ),
          {
              ...headers,
              data: {
                ids
              }
          },
      );
    };

    patch(id, data, headers, config) {
      return this.$axios.patch(
        this.$concatParams(
          this.$createUrl({
            endPoint: 'user'
          }),
          id
        ),
        data,
        headers
      ).then(requestDataPipe);
    }
}
