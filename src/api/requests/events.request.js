import {
    REQUEST_CLIENT_NAME,
    REQUEST_END_POINT,
    REQUEST_VERSIONS,
} from "../request.key/request.const";
import { ApiRequest } from "../http/request";


export class EventsRequest extends ApiRequest {
    $endPoint = REQUEST_END_POINT.EVENTS;

    $defaultVersion = REQUEST_VERSIONS.V1;

    $defaultClient = REQUEST_CLIENT_NAME.ADMIN;

    updateStatus(id, data, headers, config) {
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
      ).then(requestDataPipe);
  }
}

