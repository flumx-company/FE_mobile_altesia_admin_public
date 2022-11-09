
import {
    REQUEST_CLIENT_NAME,
    REQUEST_END_POINT,
    REQUEST_VERSIONS,
} from "../request.key/request.const";
import { ApiRequest } from "../http/request";
import { requestDataPipe } from "../request.pipe/request.data.pipe";

export class OpportunitiesRequest extends ApiRequest {
    $endPoint = REQUEST_END_POINT.OPPORTUNITIES;

    $defaultVersion = REQUEST_VERSIONS.V1;

    $defaultClient = REQUEST_CLIENT_NAME.ADMIN;

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

    updateStatus(id, data, headers, config) {
      return this.$axios.put(
        this.$concatParams(
          this.$createUrl(config),
          id
        ),
        data,
        headers
      ).then(requestDataPipe);
    }

    getAllAlertsByOportunityId(id, objQuery, headers, config) {
      const url = this.$concatParams(
        this.$createUrl({
            ...config,
            clientName: REQUEST_CLIENT_NAME.CLIENT
        }),
        id,
        'alerts'
      );

      const queryData = this.$createQuery(typeof objQuery === 'object' ? objQuery : {});

      const query = queryData ? `?${queryData}` : '';

      return this.$axios.get(
        url + query,
        headers
      ).then(requestDataPipe);
    }

    replyAlertByOpportunityId(id, data, headers, config) {
        return this.$axios.post(
            this.$concatParams(
                this.$createUrl(config),
                'alerts',
                id,
                'reply',
            ),
            data,
            headers
        ).then(requestDataPipe);
    }
}
