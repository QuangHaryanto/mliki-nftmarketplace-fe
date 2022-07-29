import VVActivityVC from "../components/Activity/VVActivityVC";
import VVExploreVC from "../components/Explore/VVExploreVC";
import VVHomeVC from "../components/Home/VVHomeVC";
import VVCreatorsVC from "../components/Creators/VVCreatorsVC";
import VVProfileVC from "../components/profile/VVProfileVC";
import VVmycollectionVW from "../components/mycollection/VVmycollectionVW";
import VVmyactivityVW from "../components/myactivity/VVmyactivityVW";
import VVsettingsVC from "../components/settings/VVsettingsVC";
import VVCollectionActionVC from "../components/collectionAction/VVCollectionActionVC";
import VVCollectionViewVC from "../components/viewcollection/VVCollectionViewVC";
import VVItemActionVC from "../components/item/action/VVItemActionVC";
import VVItemImportVC from "../components/item/import/VVItemImportVC";
import VVItemWalletVC from "../components/settings/wallet/VVItemWalletVC";
import VVCollectionCreatedVC from "../components/viewcollection/collectioncreated/VVCollectionCreatedVC";
import VVItemDetailVC from "../components/item/detail/VVItemDetailVC";
import VVCollectionAuctionVC from "../components/viewcollection/collectionauction/VVCollectionAuctionVC";
import VVCollectionSoldVC from "../components/viewcollection/collectionsold/VVCollectionSoldVC";
import VVProfileCollectedVC from "../components/profile/profilecollected/VVProfileCollectedVC";
import VVProfileCreatedVC from "../components/profile/profilecreated/VVProfileCreatedVC";
import VVnotificationVC from "../components/notification/VVnotificationVC";
import VVConnectVC from "../components/connect/VVConnectVC";
import VVUploadOptionsVC from "../components/item/VVUploadOptionsVC";
import VVFaqVC from "../components/faq/VVFaqVC";
export const publicRoutes = [
    {
       path: "/",
       exact: true,
       component: VVHomeVC,
    },
    {
        path: "/connect",
        exact: false,
        component: VVConnectVC,
    },
    {
        path: "/marketplace",
        exact: false,
        component: VVExploreVC,
    },
    {
        path: "/activity",
        exact: false,
        component: VVActivityVC,
    },
    {
        path: "/creators",
        exact: false,
        component: VVCreatorsVC,
    },
    {
        path: "/addcollection",
        exact: false,
        component: VVCollectionActionVC,
    },
    {
        path: "/addcollection/:collectionId",
        exact: false,
        component: VVCollectionActionVC,
    },
    {
        path: "/additem/:collectionId",
        exact: false,
        component: VVItemActionVC,
    },
    {
        path: "/additem/:collectionId/:itemId",
        exact: false,
        component: VVItemActionVC,
    },
    {
        path: "/item/:itemId",
        exact: false,
        component: VVItemDetailVC,
    },
    {
        path: "/upload-options",
        exact: false,
        component: VVUploadOptionsVC,
    },
    {
        path: "/faq",
        exact: false,
        component: VVFaqVC,
    },    
    {
        path: "/import-item",
        exact: false,
        component: VVItemImportVC,
    },
    {
        path: "/wallet",
        exact: false,
        component: VVItemWalletVC,
    },
    {
        path: "/profile/:profileId",
        exact: false,
        component: VVProfileVC,
        routes: [
            {
                path: "/profile/:profileId/collected",
                exact: false,
                component: VVProfileCollectedVC,
            },
            {
                path: "/profile/:profileId/created",
                exact: false,
                component: VVProfileCreatedVC,
            },
            {
                path: "/profile/:profileId/collection",
                exact: false,
                component: VVmycollectionVW,
            },
            {
                path: "/profile/:profileId/notification",
                exact: false,
                component: VVnotificationVC,
            },
            {
                path: "/profile/:profileId/activity",
                exact: false,
                component: VVmyactivityVW,
            },
            {
                path: "/profile/:profileId/settings",
                exact: false,
                component: VVsettingsVC,
            }
        ]
    },
    {
        path: "/collection/:collectionId",
        exact: false,
        component: VVCollectionViewVC,
        routes: [
            {
                path: "/collection/:collectionId/created",
                exact: false,
                component: VVCollectionCreatedVC,
            },
            {
                path: "/collection/:collectionId/onauction",
                exact: false,
                component: VVCollectionAuctionVC,
            },
            {
                path: "/collection/:collectionId/sold",
                exact: false,
                component: VVCollectionSoldVC,
            },
            {
                path: "/collection/:collectionId/activity",
                exact: false,
                component: VVmyactivityVW,
            }
        ]
    }
];

