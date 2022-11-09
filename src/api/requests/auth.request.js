import { ApiRequest } from "../http/request";

import { requestDataPipe } from "../request.pipe/request.data.pipe";

import {
    REQUEST_CLIENT_NAME,
    REQUEST_VERSIONS,
} from "../request.key/request.const";

const signInConfig = {
    clientName: REQUEST_CLIENT_NAME.CLIENT,
    endPoint: 'login'
};
//
// const adminConfig = {
//     endPoint: 'me'
// };

export class AuthRequest extends ApiRequest {
    $endPoint = '';

    $defaultVersion = REQUEST_VERSIONS.V1;

    $defaultClient = REQUEST_CLIENT_NAME.ADMIN;

    signIn(data, headers) {
        return this.$axios.post(
            this.$concatParams(
                this.$createUrl(signInConfig)
            ),
            data,
            headers
        ).then(requestDataPipe);
    }
    //
    getAdmin(headers) {
        return Promise.resolve(headers)
        //
        // this.$axios.get(
        //     this.$concatParams(
        //         this.$createUrl(adminConfig)
        //     ),
        //     headers
        // ).then(requestDataPipe);
    }
}

