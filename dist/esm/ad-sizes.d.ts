export declare type AdSizeString = 'fluid' | `${number},${number}`;
export declare type AdSize = Readonly<{
    width: number;
    height: number;
    toString: () => AdSizeString;
}>;
export declare type SizeKeys = '160x600' | '300x1050' | '300x250' | '300x600' | '728x90' | '970x250' | 'billboard' | 'empty' | 'fabric' | 'fluid' | 'googleCard' | 'halfPage' | 'inlineMerchandising' | 'leaderboard' | 'merchandising' | 'merchandisingHigh' | 'merchandisingHighAdFeature' | 'mobilesticky' | 'mpu' | 'outOfPage' | 'outstreamDesktop' | 'outstreamGoogleDesktop' | 'outstreamMobile' | 'portrait' | 'skyscraper' | 'video';
export declare const adSizes: Record<SizeKeys, AdSize>;
export declare const getAdSize: (size: SizeKeys) => AdSize;
export declare const _: {
    createAdSize: (width: number, height: number) => AdSize;
};
