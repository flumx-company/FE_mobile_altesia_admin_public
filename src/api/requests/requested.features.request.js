
import {
    REQUEST_CLIENT_NAME,
    REQUEST_END_POINT,
    REQUEST_VERSIONS,
} from "../request.key/request.const";
import { ApiRequest } from "../http/request";

export class RequestedFeaturesRequest extends ApiRequest {
    $endPoint = REQUEST_END_POINT.REQUESTED_FEATURES;

    $defaultVersion = REQUEST_VERSIONS.V1;

    $defaultClient = REQUEST_CLIENT_NAME.ADMIN;
}

