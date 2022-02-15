"use strict";
/* istanbul ignore file -- there's no point check this for test coverage */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pickTargetingValues = exports.getViewportTargeting = exports.getSharedTargeting = exports.getSessionTargeting = exports.getPersonalisedTargeting = exports.getContentTargeting = exports.constants = exports.disabledAds = exports.buildAdsConfigWithConsent = exports.getPermutivePFPSegments = exports.getPermutiveSegments = exports.clearPermutiveSegments = exports.isAdBlockInUse = exports.getAdSize = exports.adSizes = exports.initCommercialMetrics = exports.bypassCommercialMetricsSampling = exports.EventTimer = exports.remarketing = exports.inizio = exports.twitter = exports.fbPixel = exports.permutive = exports.ias = void 0;
var ias_1 = require("./third-party-tags/ias");
Object.defineProperty(exports, "ias", { enumerable: true, get: function () { return ias_1.ias; } });
var permutive_1 = require("./third-party-tags/permutive");
Object.defineProperty(exports, "permutive", { enumerable: true, get: function () { return permutive_1.permutive; } });
var facebook_pixel_1 = require("./third-party-tags/facebook-pixel");
Object.defineProperty(exports, "fbPixel", { enumerable: true, get: function () { return facebook_pixel_1.fbPixel; } });
var twitter_uwt_1 = require("./third-party-tags/twitter-uwt");
Object.defineProperty(exports, "twitter", { enumerable: true, get: function () { return twitter_uwt_1.twitter; } });
var inizio_1 = require("./third-party-tags/inizio");
Object.defineProperty(exports, "inizio", { enumerable: true, get: function () { return inizio_1.inizio; } });
var remarketing_1 = require("./third-party-tags/remarketing");
Object.defineProperty(exports, "remarketing", { enumerable: true, get: function () { return remarketing_1.remarketing; } });
var EventTimer_1 = require("./EventTimer");
Object.defineProperty(exports, "EventTimer", { enumerable: true, get: function () { return EventTimer_1.EventTimer; } });
var sendCommercialMetrics_1 = require("./sendCommercialMetrics");
Object.defineProperty(exports, "bypassCommercialMetricsSampling", { enumerable: true, get: function () { return sendCommercialMetrics_1.bypassCommercialMetricsSampling; } });
Object.defineProperty(exports, "initCommercialMetrics", { enumerable: true, get: function () { return sendCommercialMetrics_1.initCommercialMetrics; } });
var ad_sizes_1 = require("./ad-sizes");
Object.defineProperty(exports, "adSizes", { enumerable: true, get: function () { return ad_sizes_1.adSizes; } });
Object.defineProperty(exports, "getAdSize", { enumerable: true, get: function () { return ad_sizes_1.getAdSize; } });
var detectAdBlocker_1 = require("./detectAdBlocker");
Object.defineProperty(exports, "isAdBlockInUse", { enumerable: true, get: function () { return detectAdBlocker_1.isAdBlockInUse; } });
var permutive_2 = require("./permutive");
Object.defineProperty(exports, "clearPermutiveSegments", { enumerable: true, get: function () { return permutive_2.clearPermutiveSegments; } });
Object.defineProperty(exports, "getPermutiveSegments", { enumerable: true, get: function () { return permutive_2.getPermutiveSegments; } });
Object.defineProperty(exports, "getPermutivePFPSegments", { enumerable: true, get: function () { return permutive_2.getPermutivePFPSegments; } });
var ad_targeting_youtube_1 = require("./ad-targeting-youtube");
Object.defineProperty(exports, "buildAdsConfigWithConsent", { enumerable: true, get: function () { return ad_targeting_youtube_1.buildAdsConfigWithConsent; } });
Object.defineProperty(exports, "disabledAds", { enumerable: true, get: function () { return ad_targeting_youtube_1.disabledAds; } });
exports.constants = __importStar(require("./constants"));
var content_1 = require("./targeting/content");
Object.defineProperty(exports, "getContentTargeting", { enumerable: true, get: function () { return content_1.getContentTargeting; } });
var personalised_1 = require("./targeting/personalised");
Object.defineProperty(exports, "getPersonalisedTargeting", { enumerable: true, get: function () { return personalised_1.getPersonalisedTargeting; } });
var session_1 = require("./targeting/session");
Object.defineProperty(exports, "getSessionTargeting", { enumerable: true, get: function () { return session_1.getSessionTargeting; } });
var shared_1 = require("./targeting/shared");
Object.defineProperty(exports, "getSharedTargeting", { enumerable: true, get: function () { return shared_1.getSharedTargeting; } });
var viewport_1 = require("./targeting/viewport");
Object.defineProperty(exports, "getViewportTargeting", { enumerable: true, get: function () { return viewport_1.getViewportTargeting; } });
var pick_targeting_values_1 = require("./targeting/pick-targeting-values");
Object.defineProperty(exports, "pickTargetingValues", { enumerable: true, get: function () { return pick_targeting_values_1.pickTargetingValues; } });
