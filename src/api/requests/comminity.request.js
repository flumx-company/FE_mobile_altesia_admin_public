
import {
    REQUEST_CLIENT_NAME,
    REQUEST_VERSIONS,
    REQUEST_END_POINT
} from "../request.key/request.const";
import { ApiRequest } from "../http/request";

export class CommunityRequest extends ApiRequest {
    $endPoint = REQUEST_END_POINT.COMMUNITY;

    $defaultVersion = REQUEST_VERSIONS.V1;

    $defaultClient = REQUEST_CLIENT_NAME.ADMIN;
}

