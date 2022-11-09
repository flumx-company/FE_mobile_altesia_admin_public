import { CommunityRequest } from "./requests/comminity.request";
import { AuthRequest } from "./requests/auth.request";
import { EventsRequest } from "./requests/events.request";
import { OpportunitiesRequest } from "./requests/opportunities.request";
import { ManagingRequest } from "./requests/managing.request";
import { UsersRequest } from "./requests/users.request";
import { RequestedFeaturesRequest } from "./requests/requested.features.request";
import { CommunityCategoriesRequest } from "./requests/comminity-categories.request";
import { CommunityQuestionsRequest } from "./requests/comminity-questions.request";
import { ManagingIndustriesRequest } from "./requests/managing-industries.request";
import { ManagingMissionsRequest } from "./requests/managing-missions.request";
import { ManagingSpecialtiesRequest } from "./requests/managing-specialties.request";
import { CommunityResponsesRequest } from "./requests/comminity-responses.request";

/**
 *
 * @type {{
 *      AuthRequest: AuthRequest,
 *      OpportunitiesRequest: OpportunitiesRequest,
 *      CommunityRequest: CommunityRequest,
 *      EventsRequest: EventsRequest,
 *      ManagingRequest: ManagingRequest,
 *      UsersRequest: UsersRequest,
 *      RequestedFeaturesRequest: RequestedFeaturesRequest
 * }}
 */
export const $api = {
    CommunityRequest: new CommunityRequest(),
    CommunityCategoriesRequest: new CommunityCategoriesRequest(),
    CommunityQuestionsRequest: new CommunityQuestionsRequest(),
    CommunityResponsesRequest: new CommunityResponsesRequest(),
    ManagingIndustriesRequest: new ManagingIndustriesRequest(),
    ManagingMissionsRequest: new ManagingMissionsRequest(),
    ManagingSpecialtiesRequest: new ManagingSpecialtiesRequest(),
    AuthRequest: new AuthRequest(),
    EventsRequest: new EventsRequest(),
    OpportunitiesRequest: new OpportunitiesRequest(),
    ManagingRequest: new ManagingRequest(),
    UsersRequest: new UsersRequest(),
    RequestedFeaturesRequest: new RequestedFeaturesRequest()
};
