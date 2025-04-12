export enum FeatureFlag {
    TRANSCRIPTION = "transcriptions",
    IMAGE_GENERATION = "image-generations",
    ANALYSE_VIDEO = "video-analysis",
    TITLE_GENERATION = "title-generations",
    SCRIPT_GENERATION = "script-generations",
}

export const featureFlagEvents: Record<FeatureFlag, {event:string}>= {
    [FeatureFlag.TRANSCRIPTION]: {event: "transcribe"},
    [FeatureFlag.IMAGE_GENERATION]: {event: "image-generations"},
    [FeatureFlag.ANALYSE_VIDEO]: {event: "video-analysis"},
    [FeatureFlag.TITLE_GENERATION]: {event: "title-generations"},
    [FeatureFlag.SCRIPT_GENERATION]: {event: ""},
}