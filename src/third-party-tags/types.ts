export type TagAttribute = {
	name: string;
	value: string;
};

export type ThirdPartyTag = {
	async?: boolean;
	attrs?: TagAttribute[];
	beforeLoad?: () => void;
	insertSnippet?: () => void;
	loaded?: boolean;
	onLoad?: () => void;
	shouldRun: boolean;
	name?: string;
	url?: string;
	useImage?: boolean;
};

export type GetThirdPartyTag = (options: {
	shouldRun: boolean;
}) => ThirdPartyTag;
