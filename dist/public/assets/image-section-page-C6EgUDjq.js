import { t as createLucideIcon, r as reactExports, y as useControllableState, j as jsxRuntimeExports, z as createContextScope, W as createCollection, E as composeEventHandlers, A as Primitive, x as useComposedRefs, O as useDirection, H as useSize, I as cn, b as useToast, u as useQuery, d as useMutation, B as Button, L as LoaderCircle, C as Check, q as queryClient, f as apiRequest } from "./index-YI274i2g.js";
import { C as Card, a as CardHeader, b as CardTitle, d as CardDescription, c as CardContent } from "./card-CI4cfoX7.js";
import { D as Dialog, b as DialogContent, c as DialogHeader, d as DialogTitle, e as DialogDescription, f as DialogFooter } from "./dialog-D2jaJFMY.js";
import { c as clamp } from "./index-IXOTxK3N.js";
import { u as usePrevious } from "./index-DyHwhc4a.js";
import { T as Trash2 } from "./trash-2-xT2Lz1PH.js";
const ArrowDown = createLucideIcon("ArrowDown", [
  ["path", { d: "M12 5v14", key: "s699le" }],
  ["path", { d: "m19 12-7 7-7-7", key: "1idqje" }]
]);
const ArrowUp = createLucideIcon("ArrowUp", [
  ["path", { d: "m5 12 7-7 7 7", key: "hav0vg" }],
  ["path", { d: "M12 19V5", key: "x0mq9r" }]
]);
const Upload = createLucideIcon("Upload", [
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
  ["polyline", { points: "17 8 12 3 7 8", key: "t8dd8p" }],
  ["line", { x1: "12", x2: "12", y1: "3", y2: "15", key: "widbto" }]
]);
const ZoomIn = createLucideIcon("ZoomIn", [
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }],
  ["line", { x1: "21", x2: "16.65", y1: "21", y2: "16.65", key: "13gj7c" }],
  ["line", { x1: "11", x2: "11", y1: "8", y2: "14", key: "1vmskp" }],
  ["line", { x1: "8", x2: "14", y1: "11", y2: "11", key: "durymu" }]
]);
var PAGE_KEYS = ["PageUp", "PageDown"];
var ARROW_KEYS = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
var BACK_KEYS = {
  "from-left": ["Home", "PageDown", "ArrowDown", "ArrowLeft"],
  "from-right": ["Home", "PageDown", "ArrowDown", "ArrowRight"],
  "from-bottom": ["Home", "PageDown", "ArrowDown", "ArrowLeft"],
  "from-top": ["Home", "PageDown", "ArrowUp", "ArrowLeft"]
};
var SLIDER_NAME = "Slider";
var [Collection, useCollection, createCollectionScope] = createCollection(SLIDER_NAME);
var [createSliderContext] = createContextScope(SLIDER_NAME, [
  createCollectionScope
]);
var [SliderProvider, useSliderContext] = createSliderContext(SLIDER_NAME);
var Slider$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      name,
      min = 0,
      max = 100,
      step = 1,
      orientation = "horizontal",
      disabled = false,
      minStepsBetweenThumbs = 0,
      defaultValue = [min],
      value,
      onValueChange = () => {
      },
      onValueCommit = () => {
      },
      inverted = false,
      form,
      ...sliderProps
    } = props;
    const thumbRefs = reactExports.useRef(/* @__PURE__ */ new Set());
    const valueIndexToChangeRef = reactExports.useRef(0);
    const isHorizontal = orientation === "horizontal";
    const SliderOrientation = isHorizontal ? SliderHorizontal : SliderVertical;
    const [values = [], setValues] = useControllableState({
      prop: value,
      defaultProp: defaultValue,
      onChange: (value2) => {
        const thumbs = [...thumbRefs.current];
        thumbs[valueIndexToChangeRef.current]?.focus();
        onValueChange(value2);
      }
    });
    const valuesBeforeSlideStartRef = reactExports.useRef(values);
    function handleSlideStart(value2) {
      const closestIndex = getClosestValueIndex(values, value2);
      updateValues(value2, closestIndex);
    }
    function handleSlideMove(value2) {
      updateValues(value2, valueIndexToChangeRef.current);
    }
    function handleSlideEnd() {
      const prevValue = valuesBeforeSlideStartRef.current[valueIndexToChangeRef.current];
      const nextValue = values[valueIndexToChangeRef.current];
      const hasChanged = nextValue !== prevValue;
      if (hasChanged) onValueCommit(values);
    }
    function updateValues(value2, atIndex, { commit } = { commit: false }) {
      const decimalCount = getDecimalCount(step);
      const snapToStep = roundValue(Math.round((value2 - min) / step) * step + min, decimalCount);
      const nextValue = clamp(snapToStep, [min, max]);
      setValues((prevValues = []) => {
        const nextValues = getNextSortedValues(prevValues, nextValue, atIndex);
        if (hasMinStepsBetweenValues(nextValues, minStepsBetweenThumbs * step)) {
          valueIndexToChangeRef.current = nextValues.indexOf(nextValue);
          const hasChanged = String(nextValues) !== String(prevValues);
          if (hasChanged && commit) onValueCommit(nextValues);
          return hasChanged ? nextValues : prevValues;
        } else {
          return prevValues;
        }
      });
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      SliderProvider,
      {
        scope: props.__scopeSlider,
        name,
        disabled,
        min,
        max,
        valueIndexToChangeRef,
        thumbs: thumbRefs.current,
        values,
        orientation,
        form,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Collection.Provider, { scope: props.__scopeSlider, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Collection.Slot, { scope: props.__scopeSlider, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          SliderOrientation,
          {
            "aria-disabled": disabled,
            "data-disabled": disabled ? "" : void 0,
            ...sliderProps,
            ref: forwardedRef,
            onPointerDown: composeEventHandlers(sliderProps.onPointerDown, () => {
              if (!disabled) valuesBeforeSlideStartRef.current = values;
            }),
            min,
            max,
            inverted,
            onSlideStart: disabled ? void 0 : handleSlideStart,
            onSlideMove: disabled ? void 0 : handleSlideMove,
            onSlideEnd: disabled ? void 0 : handleSlideEnd,
            onHomeKeyDown: () => !disabled && updateValues(min, 0, { commit: true }),
            onEndKeyDown: () => !disabled && updateValues(max, values.length - 1, { commit: true }),
            onStepKeyDown: ({ event, direction: stepDirection }) => {
              if (!disabled) {
                const isPageKey = PAGE_KEYS.includes(event.key);
                const isSkipKey = isPageKey || event.shiftKey && ARROW_KEYS.includes(event.key);
                const multiplier = isSkipKey ? 10 : 1;
                const atIndex = valueIndexToChangeRef.current;
                const value2 = values[atIndex];
                const stepInDirection = step * multiplier * stepDirection;
                updateValues(value2 + stepInDirection, atIndex, { commit: true });
              }
            }
          }
        ) }) })
      }
    );
  }
);
Slider$1.displayName = SLIDER_NAME;
var [SliderOrientationProvider, useSliderOrientationContext] = createSliderContext(SLIDER_NAME, {
  startEdge: "left",
  endEdge: "right",
  size: "width",
  direction: 1
});
var SliderHorizontal = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      min,
      max,
      dir,
      inverted,
      onSlideStart,
      onSlideMove,
      onSlideEnd,
      onStepKeyDown,
      ...sliderProps
    } = props;
    const [slider, setSlider] = reactExports.useState(null);
    const composedRefs = useComposedRefs(forwardedRef, (node) => setSlider(node));
    const rectRef = reactExports.useRef(void 0);
    const direction = useDirection(dir);
    const isDirectionLTR = direction === "ltr";
    const isSlidingFromLeft = isDirectionLTR && !inverted || !isDirectionLTR && inverted;
    function getValueFromPointer(pointerPosition) {
      const rect = rectRef.current || slider.getBoundingClientRect();
      const input = [0, rect.width];
      const output = isSlidingFromLeft ? [min, max] : [max, min];
      const value = linearScale(input, output);
      rectRef.current = rect;
      return value(pointerPosition - rect.left);
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      SliderOrientationProvider,
      {
        scope: props.__scopeSlider,
        startEdge: isSlidingFromLeft ? "left" : "right",
        endEdge: isSlidingFromLeft ? "right" : "left",
        direction: isSlidingFromLeft ? 1 : -1,
        size: "width",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          SliderImpl,
          {
            dir: direction,
            "data-orientation": "horizontal",
            ...sliderProps,
            ref: composedRefs,
            style: {
              ...sliderProps.style,
              ["--radix-slider-thumb-transform"]: "translateX(-50%)"
            },
            onSlideStart: (event) => {
              const value = getValueFromPointer(event.clientX);
              onSlideStart?.(value);
            },
            onSlideMove: (event) => {
              const value = getValueFromPointer(event.clientX);
              onSlideMove?.(value);
            },
            onSlideEnd: () => {
              rectRef.current = void 0;
              onSlideEnd?.();
            },
            onStepKeyDown: (event) => {
              const slideDirection = isSlidingFromLeft ? "from-left" : "from-right";
              const isBackKey = BACK_KEYS[slideDirection].includes(event.key);
              onStepKeyDown?.({ event, direction: isBackKey ? -1 : 1 });
            }
          }
        )
      }
    );
  }
);
var SliderVertical = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      min,
      max,
      inverted,
      onSlideStart,
      onSlideMove,
      onSlideEnd,
      onStepKeyDown,
      ...sliderProps
    } = props;
    const sliderRef = reactExports.useRef(null);
    const ref = useComposedRefs(forwardedRef, sliderRef);
    const rectRef = reactExports.useRef(void 0);
    const isSlidingFromBottom = !inverted;
    function getValueFromPointer(pointerPosition) {
      const rect = rectRef.current || sliderRef.current.getBoundingClientRect();
      const input = [0, rect.height];
      const output = isSlidingFromBottom ? [max, min] : [min, max];
      const value = linearScale(input, output);
      rectRef.current = rect;
      return value(pointerPosition - rect.top);
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      SliderOrientationProvider,
      {
        scope: props.__scopeSlider,
        startEdge: isSlidingFromBottom ? "bottom" : "top",
        endEdge: isSlidingFromBottom ? "top" : "bottom",
        size: "height",
        direction: isSlidingFromBottom ? 1 : -1,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          SliderImpl,
          {
            "data-orientation": "vertical",
            ...sliderProps,
            ref,
            style: {
              ...sliderProps.style,
              ["--radix-slider-thumb-transform"]: "translateY(50%)"
            },
            onSlideStart: (event) => {
              const value = getValueFromPointer(event.clientY);
              onSlideStart?.(value);
            },
            onSlideMove: (event) => {
              const value = getValueFromPointer(event.clientY);
              onSlideMove?.(value);
            },
            onSlideEnd: () => {
              rectRef.current = void 0;
              onSlideEnd?.();
            },
            onStepKeyDown: (event) => {
              const slideDirection = isSlidingFromBottom ? "from-bottom" : "from-top";
              const isBackKey = BACK_KEYS[slideDirection].includes(event.key);
              onStepKeyDown?.({ event, direction: isBackKey ? -1 : 1 });
            }
          }
        )
      }
    );
  }
);
var SliderImpl = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeSlider,
      onSlideStart,
      onSlideMove,
      onSlideEnd,
      onHomeKeyDown,
      onEndKeyDown,
      onStepKeyDown,
      ...sliderProps
    } = props;
    const context = useSliderContext(SLIDER_NAME, __scopeSlider);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.span,
      {
        ...sliderProps,
        ref: forwardedRef,
        onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
          if (event.key === "Home") {
            onHomeKeyDown(event);
            event.preventDefault();
          } else if (event.key === "End") {
            onEndKeyDown(event);
            event.preventDefault();
          } else if (PAGE_KEYS.concat(ARROW_KEYS).includes(event.key)) {
            onStepKeyDown(event);
            event.preventDefault();
          }
        }),
        onPointerDown: composeEventHandlers(props.onPointerDown, (event) => {
          const target = event.target;
          target.setPointerCapture(event.pointerId);
          event.preventDefault();
          if (context.thumbs.has(target)) {
            target.focus();
          } else {
            onSlideStart(event);
          }
        }),
        onPointerMove: composeEventHandlers(props.onPointerMove, (event) => {
          const target = event.target;
          if (target.hasPointerCapture(event.pointerId)) onSlideMove(event);
        }),
        onPointerUp: composeEventHandlers(props.onPointerUp, (event) => {
          const target = event.target;
          if (target.hasPointerCapture(event.pointerId)) {
            target.releasePointerCapture(event.pointerId);
            onSlideEnd(event);
          }
        })
      }
    );
  }
);
var TRACK_NAME = "SliderTrack";
var SliderTrack = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeSlider, ...trackProps } = props;
    const context = useSliderContext(TRACK_NAME, __scopeSlider);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.span,
      {
        "data-disabled": context.disabled ? "" : void 0,
        "data-orientation": context.orientation,
        ...trackProps,
        ref: forwardedRef
      }
    );
  }
);
SliderTrack.displayName = TRACK_NAME;
var RANGE_NAME = "SliderRange";
var SliderRange = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeSlider, ...rangeProps } = props;
    const context = useSliderContext(RANGE_NAME, __scopeSlider);
    const orientation = useSliderOrientationContext(RANGE_NAME, __scopeSlider);
    const ref = reactExports.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, ref);
    const valuesCount = context.values.length;
    const percentages = context.values.map(
      (value) => convertValueToPercentage(value, context.min, context.max)
    );
    const offsetStart = valuesCount > 1 ? Math.min(...percentages) : 0;
    const offsetEnd = 100 - Math.max(...percentages);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.span,
      {
        "data-orientation": context.orientation,
        "data-disabled": context.disabled ? "" : void 0,
        ...rangeProps,
        ref: composedRefs,
        style: {
          ...props.style,
          [orientation.startEdge]: offsetStart + "%",
          [orientation.endEdge]: offsetEnd + "%"
        }
      }
    );
  }
);
SliderRange.displayName = RANGE_NAME;
var THUMB_NAME = "SliderThumb";
var SliderThumb = reactExports.forwardRef(
  (props, forwardedRef) => {
    const getItems = useCollection(props.__scopeSlider);
    const [thumb, setThumb] = reactExports.useState(null);
    const composedRefs = useComposedRefs(forwardedRef, (node) => setThumb(node));
    const index = reactExports.useMemo(
      () => thumb ? getItems().findIndex((item) => item.ref.current === thumb) : -1,
      [getItems, thumb]
    );
    return /* @__PURE__ */ jsxRuntimeExports.jsx(SliderThumbImpl, { ...props, ref: composedRefs, index });
  }
);
var SliderThumbImpl = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeSlider, index, name, ...thumbProps } = props;
    const context = useSliderContext(THUMB_NAME, __scopeSlider);
    const orientation = useSliderOrientationContext(THUMB_NAME, __scopeSlider);
    const [thumb, setThumb] = reactExports.useState(null);
    const composedRefs = useComposedRefs(forwardedRef, (node) => setThumb(node));
    const isFormControl = thumb ? context.form || !!thumb.closest("form") : true;
    const size = useSize(thumb);
    const value = context.values[index];
    const percent = value === void 0 ? 0 : convertValueToPercentage(value, context.min, context.max);
    const label = getLabel(index, context.values.length);
    const orientationSize = size?.[orientation.size];
    const thumbInBoundsOffset = orientationSize ? getThumbInBoundsOffset(orientationSize, percent, orientation.direction) : 0;
    reactExports.useEffect(() => {
      if (thumb) {
        context.thumbs.add(thumb);
        return () => {
          context.thumbs.delete(thumb);
        };
      }
    }, [thumb, context.thumbs]);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "span",
      {
        style: {
          transform: "var(--radix-slider-thumb-transform)",
          position: "absolute",
          [orientation.startEdge]: `calc(${percent}% + ${thumbInBoundsOffset}px)`
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Collection.ItemSlot, { scope: props.__scopeSlider, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Primitive.span,
            {
              role: "slider",
              "aria-label": props["aria-label"] || label,
              "aria-valuemin": context.min,
              "aria-valuenow": value,
              "aria-valuemax": context.max,
              "aria-orientation": context.orientation,
              "data-orientation": context.orientation,
              "data-disabled": context.disabled ? "" : void 0,
              tabIndex: context.disabled ? void 0 : 0,
              ...thumbProps,
              ref: composedRefs,
              style: value === void 0 ? { display: "none" } : props.style,
              onFocus: composeEventHandlers(props.onFocus, () => {
                context.valueIndexToChangeRef.current = index;
              })
            }
          ) }),
          isFormControl && /* @__PURE__ */ jsxRuntimeExports.jsx(
            BubbleInput,
            {
              name: name ?? (context.name ? context.name + (context.values.length > 1 ? "[]" : "") : void 0),
              form: context.form,
              value
            },
            index
          )
        ]
      }
    );
  }
);
SliderThumb.displayName = THUMB_NAME;
var BubbleInput = (props) => {
  const { value, ...inputProps } = props;
  const ref = reactExports.useRef(null);
  const prevValue = usePrevious(value);
  reactExports.useEffect(() => {
    const input = ref.current;
    const inputProto = window.HTMLInputElement.prototype;
    const descriptor = Object.getOwnPropertyDescriptor(inputProto, "value");
    const setValue = descriptor.set;
    if (prevValue !== value && setValue) {
      const event = new Event("input", { bubbles: true });
      setValue.call(input, value);
      input.dispatchEvent(event);
    }
  }, [prevValue, value]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("input", { style: { display: "none" }, ...inputProps, ref, defaultValue: value });
};
function getNextSortedValues(prevValues = [], nextValue, atIndex) {
  const nextValues = [...prevValues];
  nextValues[atIndex] = nextValue;
  return nextValues.sort((a, b) => a - b);
}
function convertValueToPercentage(value, min, max) {
  const maxSteps = max - min;
  const percentPerStep = 100 / maxSteps;
  const percentage = percentPerStep * (value - min);
  return clamp(percentage, [0, 100]);
}
function getLabel(index, totalValues) {
  if (totalValues > 2) {
    return `Value ${index + 1} of ${totalValues}`;
  } else if (totalValues === 2) {
    return ["Minimum", "Maximum"][index];
  } else {
    return void 0;
  }
}
function getClosestValueIndex(values, nextValue) {
  if (values.length === 1) return 0;
  const distances = values.map((value) => Math.abs(value - nextValue));
  const closestDistance = Math.min(...distances);
  return distances.indexOf(closestDistance);
}
function getThumbInBoundsOffset(width, left, direction) {
  const halfWidth = width / 2;
  const halfPercent = 50;
  const offset = linearScale([0, halfPercent], [0, halfWidth]);
  return (halfWidth - offset(left) * direction) * direction;
}
function getStepsBetweenValues(values) {
  return values.slice(0, -1).map((value, index) => values[index + 1] - value);
}
function hasMinStepsBetweenValues(values, minStepsBetweenValues) {
  if (minStepsBetweenValues > 0) {
    const stepsBetweenValues = getStepsBetweenValues(values);
    const actualMinStepsBetweenValues = Math.min(...stepsBetweenValues);
    return actualMinStepsBetweenValues >= minStepsBetweenValues;
  }
  return true;
}
function linearScale(input, output) {
  return (value) => {
    if (input[0] === input[1] || output[0] === output[1]) return output[0];
    const ratio = (output[1] - output[0]) / (input[1] - input[0]);
    return output[0] + ratio * (value - input[0]);
  };
}
function getDecimalCount(value) {
  return (String(value).split(".")[1] || "").length;
}
function roundValue(value, decimalCount) {
  const rounder = Math.pow(10, decimalCount);
  return Math.round(value * rounder) / rounder;
}
var Root = Slider$1;
var Track = SliderTrack;
var Range = SliderRange;
var Thumb = SliderThumb;
const Slider = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  Root,
  {
    ref,
    className: cn(
      "relative flex w-full touch-none select-none items-center",
      className
    ),
    ...props,
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Track, { className: "relative h-2 w-full grow overflow-hidden rounded-full bg-secondary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Range, { className: "absolute h-full bg-primary" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Thumb, { className: "block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" })
    ]
  }
));
Slider.displayName = Root.displayName;
function ImageSectionPage() {
  const { toast } = useToast();
  const [imageList, setImageList] = reactExports.useState([]);
  const [isCropModalOpen, setIsCropModalOpen] = reactExports.useState(false);
  const [selectedImageSrc, setSelectedImageSrc] = reactExports.useState(null);
  const [zoom, setZoom] = reactExports.useState(1);
  const [pan, setPan] = reactExports.useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = reactExports.useState(false);
  const [dragStart, setDragStart] = reactExports.useState({ x: 0, y: 0 });
  const [isUploading, setIsUploading] = reactExports.useState(false);
  const canvasRef = reactExports.useRef(null);
  const imageRef = reactExports.useRef(null);
  const fileInputRef = reactExports.useRef(null);
  const { data: bannerSetting, isLoading: bannerLoading } = useQuery({
    queryKey: ["/api/settings/BANNER_IMAGES"]
  });
  reactExports.useEffect(() => {
    if (bannerSetting?.value) {
      try {
        const parsed = JSON.parse(bannerSetting.value);
        if (Array.isArray(parsed)) {
          setImageList(parsed);
        }
      } catch (e) {
        console.error("Failed to parse banner images:", e);
      }
    }
  }, [bannerSetting]);
  const saveImagesMutation = useMutation({
    mutationFn: async (newList) => {
      const res = await apiRequest("POST", "/api/settings", {
        key: "BANNER_IMAGES",
        value: JSON.stringify(newList)
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings/BANNER_IMAGES"] });
      toast({
        title: "Banners Saved",
        description: "Banners list updated successfully on the store."
      });
    },
    onError: (err) => {
      toast({
        title: "Failed to save",
        description: err.message || "An error occurred.",
        variant: "destructive"
      });
    }
  });
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImageSrc(reader.result);
        setZoom(1);
        setPan({ x: 0, y: 0 });
        setIsCropModalOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };
  reactExports.useEffect(() => {
    if (!isCropModalOpen || !selectedImageSrc || !canvasRef.current) return;
    const img = new Image();
    img.src = selectedImageSrc;
    img.onload = () => {
      imageRef.current = img;
      drawCanvas();
    };
  }, [isCropModalOpen, selectedImageSrc, zoom, pan]);
  const drawCanvas = () => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const targetRatio = canvas.width / canvas.height;
    const imgRatio = img.width / img.height;
    let drawWidth = canvas.width;
    let drawHeight = canvas.height;
    let drawX = 0;
    let drawY = 0;
    if (imgRatio > targetRatio) {
      drawWidth = canvas.height * imgRatio;
      drawX = (canvas.width - drawWidth) / 2;
    } else {
      drawHeight = canvas.width / imgRatio;
      drawY = (canvas.height - drawHeight) / 2;
    }
    ctx.save();
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    ctx.translate(centerX + pan.x, centerY + pan.y);
    ctx.scale(zoom, zoom);
    ctx.translate(-centerX, -centerY);
    ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
    ctx.restore();
  };
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  const handleCropSave = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setIsUploading(true);
    canvas.toBlob(async (blob) => {
      if (!blob) {
        toast({ title: "Error", description: "Failed to generate cropped image", variant: "destructive" });
        setIsUploading(false);
        return;
      }
      const formData = new FormData();
      formData.append("image", blob, "banner.jpg");
      try {
        const response = await fetch("/api/settings/upload", {
          method: "POST",
          body: formData
        });
        if (!response.ok) throw new Error("Upload failed");
        const data = await response.json();
        const newUrl = data.imageUrl;
        const updatedList = [...imageList, newUrl];
        setImageList(updatedList);
        saveImagesMutation.mutate(updatedList);
        setIsCropModalOpen(false);
      } catch (err) {
        toast({
          title: "Upload Failed",
          description: err.message || "Failed to upload image banner.",
          variant: "destructive"
        });
      } finally {
        setIsUploading(false);
      }
    }, "image/jpeg", 0.92);
  };
  const handleMoveUp = (index) => {
    if (index === 0) return;
    const list = [...imageList];
    const temp = list[index];
    list[index] = list[index - 1];
    list[index - 1] = temp;
    setImageList(list);
    saveImagesMutation.mutate(list);
  };
  const handleMoveDown = (index) => {
    if (index === imageList.length - 1) return;
    const list = [...imageList];
    const temp = list[index];
    list[index] = list[index + 1];
    list[index + 1] = temp;
    setImageList(list);
    saveImagesMutation.mutate(list);
  };
  const handleDelete = (index) => {
    const list = imageList.filter((_, idx) => idx !== index);
    setImageList(list);
    saveImagesMutation.mutate(list);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-10 animate-in", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-5xl font-black tracking-tighter text-white drop-shadow-2xl uppercase italic", children: "Image Section" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/40 text-xs font-bold uppercase tracking-widest", children: "Manage custom sliding banners for the storefront header" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          onClick: () => fileInputRef.current?.click(),
          className: "rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-black uppercase tracking-widest text-xs h-12 px-6 shadow-xl shadow-purple-600/20 active:scale-95 transition-all",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "w-4 h-4 mr-2" }),
            " Upload Banner"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        type: "file",
        ref: fileInputRef,
        onChange: handleFileChange,
        accept: "image/*",
        className: "hidden"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "glass-card border-0 overflow-hidden shadow-2xl relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-tr from-purple-500/5 via-indigo-500/5 to-transparent pointer-events-none" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-xl font-bold flex items-center gap-2", children: "Active Banners" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Banners will be shown in the storefront header slide in this order. Upload rectangular images for the best visual experience." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: bannerLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center py-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-8 h-8 animate-spin text-purple-600" }) }) : imageList.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-20 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto text-purple-400", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "w-10 h-10" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/40 font-black uppercase tracking-widest text-xs", children: "No custom banner images uploaded yet." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            onClick: () => fileInputRef.current?.click(),
            className: "rounded-xl border-white/10 hover:bg-white/5 text-white text-xs font-black uppercase tracking-widest",
            children: "Upload first image"
          }
        )
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-6", children: imageList.map((imgUrl, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "group relative bg-[#0f0a1a] rounded-[2rem] border border-white/5 overflow-hidden flex flex-col md:flex-row md:items-center justify-between p-4 gap-6 hover:border-purple-500/30 transition-all duration-300",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-6 flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl bg-purple-600/10 text-purple-400 flex items-center justify-center font-black text-lg", children: index + 1 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full md:w-60 h-28 rounded-2xl overflow-hidden border border-white/10 relative", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: imgUrl,
                  alt: `Banner ${index + 1}`,
                  className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-mono text-white/30 truncate max-w-xs hidden lg:block", children: imgUrl })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 self-end md:self-auto", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  size: "icon",
                  variant: "ghost",
                  onClick: () => handleMoveUp(index),
                  disabled: index === 0,
                  className: "rounded-xl hover:bg-white/5 disabled:opacity-20",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUp, { className: "w-4 h-4 text-white" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  size: "icon",
                  variant: "ghost",
                  onClick: () => handleMoveDown(index),
                  disabled: index === imageList.length - 1,
                  className: "rounded-xl hover:bg-white/5 disabled:opacity-20",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDown, { className: "w-4 h-4 text-white" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  size: "icon",
                  variant: "ghost",
                  onClick: () => handleDelete(index),
                  className: "rounded-xl hover:bg-red-500/10 text-red-400",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4" })
                }
              )
            ] })
          ]
        },
        index
      )) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: isCropModalOpen, onOpenChange: setIsCropModalOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "bg-[#0f0a1a] border border-white/10 text-white max-w-3xl rounded-[2.5rem] p-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-2xl font-black uppercase tracking-tight italic text-purple-400", children: "Crop Store Banner" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { className: "text-white/40", children: "Pan by dragging the image on the canvas. Use the slider below to zoom." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 my-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative border border-white/10 rounded-[2rem] overflow-hidden bg-neutral-950 flex items-center justify-center h-[340px]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "canvas",
            {
              ref: canvasRef,
              width: 660,
              height: 300,
              onMouseDown: handleMouseDown,
              onMouseMove: handleMouseMove,
              onMouseUp: handleMouseUp,
              onMouseLeave: handleMouseUp,
              className: "cursor-move max-w-full"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 pointer-events-none border-2 border-purple-500 rounded-sm" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 px-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs font-bold uppercase tracking-wider text-white/50", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ZoomIn, { className: "w-3.5 h-3.5" }),
              " Scale"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              Math.round(zoom * 100),
              "%"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Slider,
            {
              value: [zoom],
              min: 1,
              max: 3,
              step: 0.01,
              onValueChange: (val) => setZoom(val[0]),
              className: "text-purple-600"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "flex gap-3 mt-4 justify-end", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            disabled: isUploading,
            onClick: () => setIsCropModalOpen(false),
            className: "rounded-2xl border-white/10 text-white hover:bg-white/5 font-bold text-xs uppercase tracking-widest px-6",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            disabled: isUploading,
            onClick: handleCropSave,
            className: "rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs uppercase tracking-widest px-6 shadow-xl",
            children: [
              isUploading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin mr-2" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-4 h-4 mr-2" }),
              "Crop & Upload"
            ]
          }
        )
      ] })
    ] }) })
  ] });
}
export {
  ImageSectionPage as default
};
