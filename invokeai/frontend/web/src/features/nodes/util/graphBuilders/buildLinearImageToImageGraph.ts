import { RootState } from 'app/store/store';
import {
  ImageResizeInvocation,
  ImageToLatentsInvocation,
} from 'services/api/types';
import { NonNullableGraph } from 'features/nodes/types/types';
import { log } from 'app/logging/useLogger';
import {
  LATENTS_TO_IMAGE,
  PIPELINE_MODEL_LOADER,
  NEGATIVE_CONDITIONING,
  NOISE,
  POSITIVE_CONDITIONING,
  IMAGE_TO_IMAGE_GRAPH,
  IMAGE_TO_LATENTS,
  LATENTS_TO_LATENTS,
  RESIZE,
} from './constants';
import { addControlNetToLinearGraph } from '../addControlNetToLinearGraph';
import { modelIdToPipelineModelField } from '../modelIdToPipelineModelField';
import { addDynamicPromptsToGraph } from './addDynamicPromptsToGraph';

const moduleLog = log.child({ namespace: 'nodes' });

/**
 * Builds the Image to Image tab graph.
 */
export const buildLinearImageToImageGraph = (
  state: RootState
): NonNullableGraph => {
  const {
    positivePrompt,
    negativePrompt,
    model: modelId,
    cfgScale: cfg_scale,
    scheduler,
    steps,
    initialImage,
    img2imgStrength: strength,
    shouldFitToWidthHeight,
    width,
    height,
  } = state.generation;

  /**
   * The easiest way to build linear graphs is to do it in the node editor, then copy and paste the
   * full graph here as a template. Then use the parameters from app state and set friendlier node
   * ids.
   *
   * The only thing we need extra logic for is handling randomized seed, control net, and for img2img,
   * the `fit` param. These are added to the graph at the end.
   */

  if (!initialImage) {
    moduleLog.error('No initial image found in state');
    throw new Error('No initial image found in state');
  }

  const model = modelIdToPipelineModelField(modelId);

  // copy-pasted graph from node editor, filled in with state values & friendly node ids
  const graph: NonNullableGraph = {
    id: IMAGE_TO_IMAGE_GRAPH,
    nodes: {
      [POSITIVE_CONDITIONING]: {
        type: 'compel',
        id: POSITIVE_CONDITIONING,
        prompt: positivePrompt,
      },
      [NEGATIVE_CONDITIONING]: {
        type: 'compel',
        id: NEGATIVE_CONDITIONING,
        prompt: negativePrompt,
      },
      [NOISE]: {
        type: 'noise',
        id: NOISE,
      },
      [PIPELINE_MODEL_LOADER]: {
        type: 'pipeline_model_loader',
        id: PIPELINE_MODEL_LOADER,
        model,
      },
      [LATENTS_TO_IMAGE]: {
        type: 'l2i',
        id: LATENTS_TO_IMAGE,
      },
      [LATENTS_TO_LATENTS]: {
        type: 'l2l',
        id: LATENTS_TO_LATENTS,
        cfg_scale,
        scheduler,
        steps,
        strength,
      },
      [IMAGE_TO_LATENTS]: {
        type: 'i2l',
        id: IMAGE_TO_LATENTS,
        // must be set manually later, bc `fit` parameter may require a resize node inserted
        // image: {
        //   image_name: initialImage.image_name,
        // },
      },
    },
    edges: [
      {
        source: {
          node_id: PIPELINE_MODEL_LOADER,
          field: 'clip',
        },
        destination: {
          node_id: POSITIVE_CONDITIONING,
          field: 'clip',
        },
      },
      {
        source: {
          node_id: PIPELINE_MODEL_LOADER,
          field: 'clip',
        },
        destination: {
          node_id: NEGATIVE_CONDITIONING,
          field: 'clip',
        },
      },
      {
        source: {
          node_id: PIPELINE_MODEL_LOADER,
          field: 'vae',
        },
        destination: {
          node_id: LATENTS_TO_IMAGE,
          field: 'vae',
        },
      },
      {
        source: {
          node_id: LATENTS_TO_LATENTS,
          field: 'latents',
        },
        destination: {
          node_id: LATENTS_TO_IMAGE,
          field: 'latents',
        },
      },
      {
        source: {
          node_id: IMAGE_TO_LATENTS,
          field: 'latents',
        },
        destination: {
          node_id: LATENTS_TO_LATENTS,
          field: 'latents',
        },
      },
      {
        source: {
          node_id: NOISE,
          field: 'noise',
        },
        destination: {
          node_id: LATENTS_TO_LATENTS,
          field: 'noise',
        },
      },
      {
        source: {
          node_id: PIPELINE_MODEL_LOADER,
          field: 'vae',
        },
        destination: {
          node_id: IMAGE_TO_LATENTS,
          field: 'vae',
        },
      },
      {
        source: {
          node_id: PIPELINE_MODEL_LOADER,
          field: 'unet',
        },
        destination: {
          node_id: LATENTS_TO_LATENTS,
          field: 'unet',
        },
      },
      {
        source: {
          node_id: NEGATIVE_CONDITIONING,
          field: 'conditioning',
        },
        destination: {
          node_id: LATENTS_TO_LATENTS,
          field: 'negative_conditioning',
        },
      },
      {
        source: {
          node_id: POSITIVE_CONDITIONING,
          field: 'conditioning',
        },
        destination: {
          node_id: LATENTS_TO_LATENTS,
          field: 'positive_conditioning',
        },
      },
    ],
  };

  // handle `fit`
  if (
    shouldFitToWidthHeight &&
    (initialImage.width !== width || initialImage.height !== height)
  ) {
    // The init image needs to be resized to the specified width and height before being passed to `IMAGE_TO_LATENTS`

    // Create a resize node, explicitly setting its image
    const resizeNode: ImageResizeInvocation = {
      id: RESIZE,
      type: 'img_resize',
      image: {
        image_name: initialImage.imageName,
      },
      is_intermediate: true,
      width,
      height,
    };

    graph.nodes[RESIZE] = resizeNode;

    // The `RESIZE` node then passes its image to `IMAGE_TO_LATENTS`
    graph.edges.push({
      source: { node_id: RESIZE, field: 'image' },
      destination: {
        node_id: IMAGE_TO_LATENTS,
        field: 'image',
      },
    });

    // The `RESIZE` node also passes its width and height to `NOISE`
    graph.edges.push({
      source: { node_id: RESIZE, field: 'width' },
      destination: {
        node_id: NOISE,
        field: 'width',
      },
    });

    graph.edges.push({
      source: { node_id: RESIZE, field: 'height' },
      destination: {
        node_id: NOISE,
        field: 'height',
      },
    });
  } else {
    // We are not resizing, so we need to set the image on the `IMAGE_TO_LATENTS` node explicitly
    (graph.nodes[IMAGE_TO_LATENTS] as ImageToLatentsInvocation).image = {
      image_name: initialImage.imageName,
    };

    // Pass the image's dimensions to the `NOISE` node
    graph.edges.push({
      source: { node_id: IMAGE_TO_LATENTS, field: 'width' },
      destination: {
        node_id: NOISE,
        field: 'width',
      },
    });
    graph.edges.push({
      source: { node_id: IMAGE_TO_LATENTS, field: 'height' },
      destination: {
        node_id: NOISE,
        field: 'height',
      },
    });
  }

  // add dynamic prompts, mutating `graph`
  addDynamicPromptsToGraph(graph, state);

  // add controlnet, mutating `graph`
  addControlNetToLinearGraph(graph, LATENTS_TO_LATENTS, state);

  return graph;
};
