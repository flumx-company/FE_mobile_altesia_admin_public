import { createRouter, createWebHistory } from 'vue-router';

import LoginPage from "../pages/Login";
import PanelPageWrapper from "../pages/Panel";
import CommunityPage from "../pages/Panel/Community";
import CommunityResponses from "../pages/Panel/CommunityResponses";
import EventsPage from "../pages/Panel/Events";
import ManagingPage from "../pages/Panel/Managing";
import OpportunitiesPage from "../pages/Panel/Opportunities";
import OpportunityAlerts from "../pages/Panel/OpportunityAlerts";
import RequestedFeaturesPage from "../pages/Panel/RequestedFeatures";
import UsersPage from "../pages/Panel/Users";

import { AltesiaRouterResolver, AltesiaRouterResolverByLoginPage } from "../resolvers";
import { $api } from "../api";
import { CommunityResponsesRequest } from "../api/requests/comminity-responses.request";

export const ROUTES = {
    HOME: '',
    COMMUNITY: 'community',
    LOGIN: '/login',
    PANEL: '/panel',
    EVENTS: 'events',
    MANAGING: 'managing',
    OPPORTUNITIES: 'opportunities',
    OPPORTUNITIES_ALERTS: 'opportunities/:id_opportunity/alerts',
    COMMUNITY_RESPONSES: 'community/:id_community/responses',
    REQUESTED_FEATURES: 'requested-features',
    USERS: 'users',
};
//CommunityResponses.vue

const routes = [
    {
        path: ROUTES.LOGIN,
        component: LoginPage,
        beforeEnter: AltesiaRouterResolverByLoginPage
    },
    {
        path: ROUTES.PANEL,
        component: PanelPageWrapper,
        children: [
            {
                path: ROUTES.COMMUNITY,
                component: CommunityPage,
                beforeEnter: AltesiaRouterResolver.routeInterceptor((to) => ({
                    communitiesQuestionsData: () => $api.CommunityQuestionsRequest.getAll(to.query),
                    communitiesCategoriesData: () => $api.CommunityCategoriesRequest.getAll(to.query)
                }))
            },{
                path: ROUTES.COMMUNITY_RESPONSES,
                component: CommunityResponses,
                beforeEnter: AltesiaRouterResolver.routeInterceptor((to) => ({
                    communitiesResponsesData: () => $api.CommunityResponsesRequest.getAll({
                        ...to.query,
                        communityQuestionId: to.params.id_community
                    })
                }))
            },
            {
                path: ROUTES.EVENTS,
                component: EventsPage,
                beforeEnter: AltesiaRouterResolver.routeInterceptor((to) => ({
                    eventsData: () => $api.EventsRequest.getAll(to.query)
                }))
            },
            {
                path: ROUTES.MANAGING,
                component: ManagingPage,
                beforeEnter: AltesiaRouterResolver.routeInterceptor(() => ({
                    managingIndustriesData: () => $api.ManagingIndustriesRequest.getAll(),
                    managingMissionsData: () => $api.ManagingMissionsRequest.getAll(),
                    managingSpecialtiesData: () => $api.ManagingSpecialtiesRequest.getAll(),
                    communityCategoriesData: () =>$api.CommunityCategoriesRequest.getAll()
                }))
            },
            {
                path: ROUTES.OPPORTUNITIES,
                component: OpportunitiesPage,
                beforeEnter: AltesiaRouterResolver.routeInterceptor((to) => ({
                    opportunitiesData: () => $api.OpportunitiesRequest.getAll(to.query)
                }))
            },
            {
                path: ROUTES.OPPORTUNITIES_ALERTS,
                component: OpportunityAlerts,
                beforeEnter: AltesiaRouterResolver.routeInterceptor((to) => ({
                    opportunityAlertData: () => $api.OpportunitiesRequest.getAllAlertsByOportunityId(
                        to.params.id_opportunity,
                        to.query
                    ),
                }))
            }, {
                path: ROUTES.REQUESTED_FEATURES,
                component: RequestedFeaturesPage,
                beforeEnter: AltesiaRouterResolver.routeInterceptor((to) => ({
                    requestedFeaturesData: () => $api.RequestedFeaturesRequest.getAll(to.query),
                }))
            }, {
                path: ROUTES.USERS,
                component: UsersPage,
                beforeEnter: AltesiaRouterResolver.routeInterceptor((to) => ({
                    usersData: () => $api.UsersRequest.getAll(to.query),
                }))
            },
        ],
    },
    { path: '/:pathMatch(.*)*', redirect: `${ROUTES.PANEL}/${ROUTES.USERS}` },
];

export const router = createRouter({
    history: createWebHistory('/admin'),
    routes
});


export default router;
