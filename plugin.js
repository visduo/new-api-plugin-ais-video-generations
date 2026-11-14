const VIDEO_MODEL_RESOLUTIONS = {
    "ais-video-generations-test": ["480p", "720p", "768p", "1080p", "2k", "4k"],
    "32-seedance-2.0-fast": ["480p", "720p"],
    "32-seedance-2.0-mini": ["480p", "720p"],
    "3301-seedance-2.5": ["720p"],
    "3302-seedance-2.5": ["720p"],
    "3303-seedance-2.0": ["720p"],
    "3304-seedance-2.5": ["720p"],
    "3305-minimax-h3": ["768p"],
    "3306-seedance-2.0-mini": ["720p"],
    "3307-seedance-2.0": ["720p"],
    "3308-seedance-2.0-fast": ["720p"],
};
const VIDEO_MODEL_BILLING = {
    "3301-seedance-2.5": "generation",
    "3302-seedance-2.5": "generation",
    "3303-seedance-2.0": "generation",
    "3304-seedance-2.5": "generation",
    "3305-minimax-h3": "generation",
    "3306-seedance-2.0-mini": "generation",
    "3307-seedance-2.0": "generation",
    "3308-seedance-2.0-fast": "generation",
};

const DEFAULT_VIDEO_RESOLUTIONS = ["480p", "720p", "768p", "1080p", "2k", "4k"];
const RESOLUTION_LABELS = {
    "480p": { en: "480p", zh: "480p" },
    "720p": { en: "720p", zh: "720p" },
    "768p": { en: "768p", zh: "768p" },
    "1080p": { en: "1080p", zh: "1080p" },
    "2k": { en: "2k", zh: "2k" },
    "4k": { en: "4k", zh: "4k" },
};

const VIDEO_SECONDS_FIELD = {
    type: "number",
    unit: "second",
    description: { en: "Video generation unit price", zh: "视频生成单价" },
};
const VIDEO_GENERATIONS_FIELD = {
    type: "number",
    unit: "count",
    unitLabel: { en: "generation", zh: "条" },
    description: { en: "Video generation unit price", zh: "视频生成单价" },
};
const DEFAULT_VIDEO_PROFILE = {
    billing: "second",
    resolutions: DEFAULT_VIDEO_RESOLUTIONS,
};

function billingFor(model) {
    return VIDEO_MODEL_BILLING[model] || "second";
}

function videoUsageSchema(profile) {
    if (profile.billing === "generation") {
        return { generations: VIDEO_GENERATIONS_FIELD };
    }
    return {
        seconds: VIDEO_SECONDS_FIELD,
        resolution: {
            enum: profile.resolutions,
            enumLabels: Object.fromEntries(profile.resolutions.map((resolution) => [resolution, RESOLUTION_LABELS[resolution]])),
            description: { en: "Output video resolution", zh: "输出视频分辨率" },
        },
    };
}

function videoUsageExamples(profile) {
    if (profile.billing === "generation") {
        return [{ label: "1 条 · " + profile.resolutions[0], facts: { generations: 1 } }];
    }
    return profile.resolutions.map((resolution) => ({
        label: "5s · " + resolution,
        facts: { seconds: 5, resolution: resolution },
    }));
}

function videoUsageProfiles() {
    const groups = new Map();
    for (const [model, resolutions] of Object.entries(VIDEO_MODEL_RESOLUTIONS)) {
        const profile = { billing: billingFor(model), resolutions: resolutions };
        const key = JSON.stringify([profile.billing, profile.resolutions]);
        if (!groups.has(key)) {
            groups.set(key, { models: [], profile: profile });
        }
        groups.get(key).models.push(model);
    }
    return Array.from(groups.values(), ({ models, profile }) => ({
        models: models,
        schema: videoUsageSchema(profile),
        examples: videoUsageExamples(profile),
    }));
}

export const meta = {
    apiVersion: 1,
    key: "visduo_ais-video-generations",
    name: "AIS Service Video Generations",
    description: {
        en: "AIS Service Video Generations",
        zh: "AIS Service Video Generations",
    },
    version: "3.1.1",
    author: { name: "多栈科技" },
    website: "https://ais.6os.net/",
    fetchMode: "per_task",
    upstreams: ["new_api"],
    models: [
        "ais-video-generations-test",
        "32-seedance-2.0-fast",
        "32-seedance-2.0-mini",
        "3301-seedance-2.5",
        "3302-seedance-2.5",
        "3303-seedance-2.0",
        "3304-seedance-2.5",
        "3305-minimax-h3",
        "3306-seedance-2.0-mini",
        "3307-seedance-2.0",
        "3308-seedance-2.0-fast",
    ],
    usageSchema: {
        seconds: {
            type: "number",
            unit: "second",
            description: { en: "Video generation unit price", zh: "视频生成单价" },
        },
        resolution: {
            enum: ["480p", "720p", "768p", "1080p", "2k", "4k"],
            enumLabels: {
                "480p": { en: "480p", zh: "480p" },
                "720p": { en: "720p", zh: "720p" },
                "768p": { en: "768p", zh: "768p" },
                "1080p": { en: "1080p", zh: "1080p" },
                "2k": { en: "2k", zh: "2k" },
                "4k": { en: "4k", zh: "4k" },
            },
            description: { en: "Output video resolution", zh: "输出视频分辨率" },
        },
    },
    usageExamples: [
        { label: "5s · 480p", facts: { seconds: 5, resolution: "480p" } },
        { label: "5s · 720p", facts: { seconds: 5, resolution: "720p" } },
        { label: "5s · 768p", facts: { seconds: 5, resolution: "768p" } },
        { label: "5s · 1080p", facts: { seconds: 5, resolution: "1080p" } },
        { label: "5s · 2k", facts: { seconds: 5, resolution: "2k" } },
        { label: "5s · 4k", facts: { seconds: 5, resolution: "4k" } },
    ],
    usageProfiles: [
        {
            models: ["ais-video-generations-test"],
            schema: {
                seconds: {
                    type: "number",
                    unit: "second",
                    description: { en: "Video generation unit price", zh: "视频生成单价" },
                },
                resolution: {
                    enum: ["480p", "720p", "768p", "1080p", "2k", "4k"],
                    enumLabels: {
                        "480p": { en: "480p", zh: "480p" },
                        "720p": { en: "720p", zh: "720p" },
                        "768p": { en: "768p", zh: "768p" },
                        "1080p": { en: "1080p", zh: "1080p" },
                        "2k": { en: "2k", zh: "2k" },
                        "4k": { en: "4k", zh: "4k" },
                    },
                    description: { en: "Output video resolution", zh: "输出视频分辨率" },
                },
            },
            examples: [
                { label: "5s · 480p", facts: { seconds: 5, resolution: "480p" } },
                { label: "5s · 720p", facts: { seconds: 5, resolution: "720p" } },
                { label: "5s · 768p", facts: { seconds: 5, resolution: "768p" } },
                { label: "5s · 1080p", facts: { seconds: 5, resolution: "1080p" } },
                { label: "5s · 2k", facts: { seconds: 5, resolution: "2k" } },
                { label: "5s · 4k", facts: { seconds: 5, resolution: "4k" } },
            ],
        },
        {
            models: ["32-seedance-2.0-fast", "32-seedance-2.0-mini"],
            schema: {
                seconds: {
                    type: "number",
                    unit: "second",
                    description: { en: "Video generation unit price", zh: "视频生成单价" },
                },
                resolution: {
                    enum: ["480p", "720p"],
                    enumLabels: {
                        "480p": { en: "480p", zh: "480p" },
                        "720p": { en: "720p", zh: "720p" },
                    },
                    description: { en: "Output video resolution", zh: "输出视频分辨率" },
                },
            },
            examples: [
                { label: "5s · 480p", facts: { seconds: 5, resolution: "480p" } },
                { label: "5s · 720p", facts: { seconds: 5, resolution: "720p" } },
            ],
        },
        {
            models: [
                "3301-seedance-2.5",
                "3302-seedance-2.5",
                "3303-seedance-2.0",
                "3304-seedance-2.5",
                "3306-seedance-2.0-mini",
                "3307-seedance-2.0",
                "3308-seedance-2.0-fast",
            ],
            schema: {
                generations: {
                    type: "number",
                    unit: "count",
                    unitLabel: { en: "generation", zh: "条" },
                    description: { en: "Video generation unit price", zh: "视频生成单价" },
                },
            },
            examples: [
                { label: "1 条 · 720p", facts: { generations: 1 } },
            ],
        },
        {
            models: ["3305-minimax-h3"],
            schema: {
                generations: {
                    type: "number",
                    unit: "count",
                    unitLabel: { en: "generation", zh: "条" },
                    description: { en: "Video generation unit price", zh: "视频生成单价" },
                },
            },
            examples: [
                { label: "1 条 · 768p", facts: { generations: 1 } },
            ],
        },
    ],
    routes: [
        {
            method: "POST",
            path: "/ais-video-generations/v1/jobs",
            type: "submit",
            decode: "decodeJob",
            render: "renderJob",
        },
        {
            method: "GET",
            path: "/ais-video-generations/v1/jobs/:task_id",
            type: "query",
            render: "renderJob",
        },
    ],
};

function object(value) {
    return value !== null && typeof value === "object" && !Array.isArray(value);
}

function trimmed(value) {
    return String(value === undefined || value === null ? "" : value).trim();
}

function resolutionValue(value) {
    const text = trimmed(value).toLowerCase();
    return text;
}

function modelProfile(model) {
    const name = trimmed(model);
    if (Object.prototype.hasOwnProperty.call(VIDEO_MODEL_RESOLUTIONS, name)) {
        return { billing: billingFor(name), resolutions: VIDEO_MODEL_RESOLUTIONS[name] };
    }
    return DEFAULT_VIDEO_PROFILE;
}

function profileFor(ctx) {
    const source = object(ctx) ? ctx : {};
    const upstreamModel = trimmed(source.upstreamModel);
    if (Object.prototype.hasOwnProperty.call(VIDEO_MODEL_RESOLUTIONS, upstreamModel)) {
        return modelProfile(upstreamModel);
    }
    return modelProfile(source.model);
}

function factsFromSource(source, profile) {
    if (profile.billing === "generation") {
        return { generations: 1 };
    }
    const metadata = object(source) && object(source.metadata) ? source.metadata : {};
    const facts = {};
    const seconds = Number(metadata.duration);
    if (Number.isFinite(seconds) && seconds > 0) {
        facts.seconds = seconds;
    }
    const resolution = resolutionValue(metadata.quality);
    if (resolution) {
        facts.resolution = resolution;
    }
    return facts;
}

function requestFacts(ctx) {
    return factsFromSource(ctx.requestBody || {}, profileFor(ctx));
}

function authorization(ctx) {
    const key = typeof ctx.apiKey === "string" ? ctx.apiKey.trim() : "";
    if (key) {
        const token = key.replace(/^Bearer\s+/i, "");
        if (!token || /\s/.test(token)) {
            throw new Error("invalid upstream channel key");
        }
        return "Bearer " + token;
    }
    const header = typeof ctx.authHeader === "string" ? ctx.authHeader.trim() : "";
    if (/^Bearer\s+[^\s]+$/i.test(header)) {
        return header;
    }
    throw new Error("upstream channel key is missing");
}

function resultUrlFrom(source) {
    if (!object(source)) {
        return "";
    }
    const metadata = object(source.metadata) ? source.metadata : {};
    const value = metadata.result_url || "";
    return typeof value === "string" ? value.trim() : "";
}

function resultUrlFor(task) {
    const direct = resultUrlFrom(task && task.data);
    if (direct) {
        return direct;
    }
    const data = task && task.data;
    if (object(data) && object(data.result) && Array.isArray(data.result.videos) && data.result.videos.length > 0) {
        const first = data.result.videos[0];
        if (object(first) && typeof first.url === "string" && first.url) {
            return first.url;
        }
    }
    if (task && task.result_url) {
        return trimmed(task.result_url);
    }
    return "";
}

function progressFor(body) {
    if (!object(body)) {
        return "";
    }
    const progress = Number(body.progress);
    return Number.isFinite(progress) && progress > 0 && progress < 100 ? progress + "%" : "";
}

function actionFor(request) {
    const metadata = object(request && request.metadata) ? request.metadata : {};
    return Array.isArray(metadata.reference_images) && metadata.reference_images.length > 0 ||
        Array.isArray(metadata.reference_videos) && metadata.reference_videos.length > 0 ||
        Array.isArray(metadata.reference_audios) && metadata.reference_audios.length > 0
        ? "image_to_video"
        : "text_to_video";
}

export function buildSubmitRequest(ctx) {
    const request = object(ctx.requestBody) ? ctx.requestBody : {};
    const base = ctx.baseUrl.replace(/\/$/, "");
    const headers = { Authorization: authorization(ctx), "Content-Type": "application/json" };
    headers["Idempotency-Key"] = ctx.publicTaskId;
    headers.Prefer = "respond-async";
    return {
        url: base + "/ais-video-generations/v1/jobs",
        method: "POST",
        headers: headers,
        body: Object.assign({}, request, {
            model: trimmed(ctx.upstreamModel) || trimmed(ctx.model) || trimmed(request.model),
        }),
        action: actionFor(request),
    };
}

export function parseSubmitResponse(ctx, response) {
    const body = response.body;
    if (!object(body)) {
        throw new Error("invalid upstream response");
    }
    if (body.error) {
        const upstreamError = object(body.error) ? body.error : { message: body.error };
        const code = trimmed(upstreamError.code) || "upstream_error";
        const message = trimmed(upstreamError.message) || "Video generation failed";
        return {
            taskId: trimmed(ctx.publicTaskId) || "failed-submit",
            taskData: body,
            immediate: {
                code: 0,
                status: "FAILURE",
                progress: "100%",
                reason: message,
                errorCode: code,
            },
        };
    }
    if (![200, 202].includes(response.statusCode) || typeof body.id !== "string" || !body.id) {
        throw new Error("upstream did not return a valid task id");
    }
    let state;
    try {
        state = { request: requestFacts(ctx) };
    } catch (error) {
        state = undefined;
    }
    return { taskId: body.id, taskData: body, state: state };
}

export function buildQueryRequest(ctx) {
    if (typeof ctx.taskId !== "string" || !ctx.taskId) {
        throw new Error("invalid upstream task id");
    }
    return {
        url: ctx.baseUrl.replace(/\/$/, "") + "/ais-video-generations/v1/jobs/" + encodeURIComponent(ctx.taskId),
        method: "GET",
        headers: { Authorization: authorization(ctx) },
    };
}

export function parseTaskResult(ctx, body, response) {
    if (!object(body)) {
        return { status: "UNKNOWN" };
    }
    if (body.id !== undefined && String(body.id) !== String(ctx.taskId)) {
        return { status: "UNKNOWN" };
    }
    const status = String(body.status || "").toLowerCase();
    if (status === "queued") {
        return { status: "QUEUED" };
    }
    if (status === "processing" || status === "in_progress") {
        const result = { status: "IN_PROGRESS" };
        const progress = progressFor(body);
        if (progress) {
            result.progress = progress;
        }
        return result;
    }
    if (status === "succeeded" || status === "completed") {
        const videos = object(body.result) && Array.isArray(body.result.videos) ? body.result.videos : [];
        const url = videos.length > 0 && object(videos[0]) && typeof videos[0].url === "string"
            ? videos[0].url
            : resultUrlFrom(body);
        return { status: "SUCCESS", url: url };
    }
    if (status === "failed") {
        return {
            status: "FAILURE",
            reason: trimmed(body.error && body.error.message) || "Upstream video generation failed",
        };
    }
    return { status: "UNKNOWN", reason: "unrecognized task status: " + String(body.status || "") };
}

export function extractUsage(ctx) {
    const profile = profileFor(ctx);
    const facts = requestFacts(ctx);
    if (ctx.usagePurpose === "billing_ratios") {
        return profile.billing === "second" && facts.seconds !== undefined ? { seconds: facts.seconds } : null;
    }
    return facts;
}

export function extractUsageOnComplete(task, taskResult, body) {
    if (!taskResult || taskResult.status !== "SUCCESS") {
        return {};
    }
    return factsFromSource(body, profileFor(task));
}

export function listArtifacts(task) {
    return task && task.status === "SUCCESS"
        ? [{ key: "video", type: "video" }]
        : [];
}

export function buildContentRequest(ctx) {
    if (ctx.artifactKey !== "video") {
        throw new Error("artifact not found");
    }
    const url = resultUrlFor({ data: ctx.data });
    if (!url) {
        throw new Error("artifact not found");
    }
    return {
        url: url,
        method: (ctx.clientRequest && ctx.clientRequest.method) || "GET",
        credentialless: true,
    };
}

function renderTask(ctx, task) {
    const status = String(task.status || "").toUpperCase();
    const metadata = object(task.data && task.data.metadata) ? task.data.metadata : {};
    const taskData = object(task.data) ? task.data : {};
    const upstreamError = object(taskData.error) ? taskData.error : {};
    const model = trimmed(ctx.model) || trimmed(taskData.model) || trimmed(task.model) || trimmed(ctx.upstreamModel);
    const output = {
        id: task.task_id,
        object: "ais.job",
        type: "video",
        model: model,
        status: status === "SUCCESS" ? "succeeded" : status === "FAILURE" ? "failed" : "processing",
        progress: Number(String(task.progress || "").replace("%", "")) || 0,
        created_at: Number(task.created_at) || 0,
    };
    if (status === "SUCCESS") {
        output.completed_at = Number(task.finished_at) || 0;
        output.result = { videos: [] };
        const url = resultUrlFor(task);
        if (url) {
            output.result.videos.push({ url: url });
        }
    }
    if (status === "FAILURE") {
        output.completed_at = Number(task.finished_at) || 0;
        output.error = {
            code: trimmed(upstreamError.code) || "generation_failed",
            message: String(task.fail_reason || trimmed(upstreamError.message) || "Video generation failed"),
        };
    }
    if (metadata.quality) {
        output.resolution = metadata.quality;
    }
    if (metadata.duration !== undefined) {
        output.duration = Number(metadata.duration) || 0;
    }
    return output;
}

export const native = {
    decodeJob(ctx) {
        if (!ctx.body || ctx.body.kind !== "json") {
            throw new Error("JSON body required");
        }
        const request = ctx.body.value;
        if (!object(request)) {
            throw new Error("request body must be an object");
        }
        const model = trimmed(ctx.model) || trimmed(request.model) || trimmed(ctx.upstreamModel);
        return {
            kind: "submit",
            model: model,
            action: actionFor(request),
            requestBody: Object.assign({}, request, { model: model }),
        };
    },

    renderJob(ctx, task) {
        return renderTask(ctx, task);
    },

    error(ctx, error) {
        return {
            id: "",
            object: "ais.job",
            type: "video",
            status: "failed",
            error: {
                code: error.code || "invalid_request",
                message: error.message,
            },
        };
    },
};
