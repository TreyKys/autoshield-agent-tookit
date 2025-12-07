import type {
  LanguageModel,
} from 'ai';

export function adaptV1ToV2(baseModel: any): LanguageModel {
  // If it's already v2, return as-is
  if (baseModel?.specificationVersion === 'v2') return baseModel as LanguageModel;

  // Create adapter object
  const adapter: Partial<LanguageModel> = {
    specificationVersion: 'v2',
    supportedUrls: baseModel?.supportedUrls ?? [],
    provider: baseModel?.provider ?? 'unknown',
    modelId: baseModel?.modelId ?? baseModel?.id ?? 'unknown-model',
    // doGenerate wrapper: convert v2 call options -> v1 options, call baseModel.doGenerate, then convert response shape
    doGenerate: async (options: any) => {
      // convert some v2 options to v1-like options if needed
      const v1Options: any = {
        // minimal mapping for prompt/messages:
        inputFormat: (options as any).inputFormat ?? 'messages',
        prompt: (options as any).prompt ?? (options as any).messages ?? '',
        mode: (options as any).mode ?? { type: 'regular' },
        // copy other fields if needed
      };

      const v1Resp = await baseModel.doGenerate?.(v1Options);
      // convert v1Resp into v2 content array
      const contents: any[] = [];
      if (v1Resp?.text) {
        contents.push({ type: 'output_text', text: v1Resp.text } as any);
      }
      // you can map other structured outputs similarly (reasoning, citations...)
      return {
        content: contents,
        finishReason: 'stop' as any,
        warnings: []
      } as any;
    },
    // doStream wrapper
    doStream: (opts: any) => {
      if (typeof baseModel.doStream === 'function') {
        // assume v1 streaming shape is close enough; just call through
        return baseModel.doStream(opts);
      }
      // fallback: return a resolved promise with an empty readable stream
      return Promise.resolve({ stream: new ReadableStream(), rawCall: {} } as any);
    }
  };

  return adapter as LanguageModel;
}
