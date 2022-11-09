
import {
    REQUEST_CLIENT_NAME,
    REQUEST_END_POINT,
    REQUEST_VERSIONS,
} from "../request.key/request.const";
import { ApiRequest } from "../http/request";


export class ManagingRequest extends ApiRequest {
    $endPoint = REQUEST_END_POINT.MANAGING;

    $defaultVersion = REQUEST_VERSIONS.V1;

    $defaultClient = REQUEST_CLIENT_NAME.ADMIN;
}

