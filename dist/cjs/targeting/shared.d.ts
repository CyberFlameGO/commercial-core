declare const brands: {
    readonly Foundation: "f";
    readonly Paid: "p";
    readonly Sponsored: "s";
};
declare const contentTypes: readonly ["article", "audio", "crossword", "gallery", "interactive", "liveblog", "network-front", "section", "tag", "video"];
declare const editions: {
    readonly UnitedKingdom: "uk";
    readonly UnitedStates: "us";
    readonly Australia: "au";
    readonly International: "int";
};
declare const platforms: {
    readonly R2: "r2";
    readonly NextGen: "ng";
    readonly MobileApp: "app";
    readonly AcceleratedMobilePages: "amp";
};
declare const surges: {
    readonly 0: "0";
    readonly 50: "5";
    readonly 100: "4";
    readonly 200: "3";
    readonly 300: "2";
    readonly 400: "1";
};
/**
 * Shared Targeting is passed by `frontend` https://git.io/JDJ6W
 *
 * It is generated in `commercial-shared` https://git.io/JDJ62
 *
 *
 *
 */
export declare type SharedTargeting = {
    /**
     * **Bl**og tags – [see on Ad Manager][gam]
     *
     * Type: _Dynamic_
     *
     * [gam]: https://admanager.google.com/59666047#inventory/custom_targeting/detail/custom_key_id=186687
     */
    bl: string[];
    /**
     * **Br**anding - [see on Ad Manager][gam]
     *
     * Type: _Predefined_
     *
     * [gam]: https://admanager.google.com/59666047#inventory/custom_targeting/detail/custom_key_id=259767
     */
    br: typeof brands[keyof typeof brands];
    /**
     * **Co**ntributors and Authors - [see on Ad Manager][gam]
     *
     * Array of all contributors to the content on the page
     *
     * Type: _Dynamic_
     *
     * [gam]: https://admanager.google.com/59666047#inventory/custom_targeting/detail/custom_key_id=186207
     */
    co: string[];
    /**
     * **C**ontent **T**ype - [see on Ad Manager][gam]
     *
     * Type: _Predefined_
     *
     * [gam]: https://admanager.google.com/59666047#inventory/custom_targeting/detail/custom_key_id=177807
     */
    ct: typeof contentTypes[number];
    /**
     * **Edition** - [see on Ad Manager][gam]
     *
     * Type: _Predefined_
     *
     * [gam]: https://admanager.google.com/59666047#inventory/custom_targeting/detail/custom_key_id=174207
     */
    edition: typeof editions[keyof typeof editions];
    /**
     * **K**eywords - [see on Ad Manager][gam]
     *
     * Type: _Dynamic_
     *
     * [gam]: https://admanager.google.com/59666047#inventory/custom_targeting/detail/custom_key_id=177687
     */
    k: string[];
    /**
     * **Ob**server Content - [see on Ad Manager][gam]
     *
     * [gam]: https://admanager.google.com/59666047#inventory/custom_targeting/detail/custom_key_id=256887
     */
    ob: 't';
    /**
     * **P**latform - [see on Ad Manager][gam]
     *
     * [gam]: https://admanager.google.com/59666047#inventory/custom_targeting/detail/custom_key_id=180207
     */
    p: typeof platforms[keyof typeof platforms];
    /**
     * **Se**ries - [see on Ad Manager][gam]
     *
     * [gam]: https://admanager.google.com/59666047#inventory/custom_targeting/detail/custom_key_id=180447
     */
    se: string[];
    /**
     * **Sh**ort URL - [see on Ad Manager][gam]
     *
     * [gam]: https://admanager.google.com/59666047#inventory/custom_targeting/detail/custom_key_id=286047
     */
    sh: `https://www.theguardian.com/p/${string}`;
    /**
     * **Su**rging Article - [see on Ad Manager][gam]
     *
     * Type: _Predefined_
     *
     * [gam]: https://admanager.google.com/59666047#inventory/custom_targeting/detail/custom_key_id=185007
     */
    su: Array<typeof surges[keyof typeof surges]>;
    /**
     * **T**o**n**es - [see on Ad Manager][gam]
     *
     * [gam]: https://admanager.google.com/59666047#inventory/custom_targeting/detail/custom_key_id=191487
     */
    tn: string[];
    /**
     * **U**niform **R**esource **L**ocator - [see on Ad Manager][gam]
     *
     * Relative to `www.theguardian.com`, starts with `/`
     *
     * Type: _Dynamic_
     *
     * [gam]: https://admanager.google.com/59666047#inventory/custom_targeting/detail/custom_key_id=174327
     */
    url: `/${string}`;
};
/**
 * What goes in comes out
 */
export declare const getSharedTargeting: (shared: Partial<SharedTargeting>) => Partial<SharedTargeting>;
export declare const _: {
    getSurgingParam: (surging: number) => SharedTargeting['su'];
};
export {};
