import { ThemeOverride } from '@chakra-ui/react';

import { InvokeAIColors } from './colors/colors';
import { accordionTheme } from './components/accordion';
import { buttonTheme } from './components/button';
import { checkboxTheme } from './components/checkbox';
import { formLabelTheme } from './components/formLabel';
import { inputTheme } from './components/input';
import { menuTheme } from './components/menu';
import { modalTheme } from './components/modal';
import { numberInputTheme } from './components/numberInput';
import { popoverTheme } from './components/popover';
import { progressTheme } from './components/progress';
import { no_scrollbar } from './components/scrollbar';
import { selectTheme } from './components/select';
import { sliderTheme } from './components/slider';
import { switchTheme } from './components/switch';
import { tabsTheme } from './components/tabs';
import { textTheme } from './components/text';
import { textareaTheme } from './components/textarea';
import { tooltipTheme } from './components/tooltip';

export const theme: ThemeOverride = {
  config: {
    cssVarPrefix: 'invokeai',
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
  layerStyles: {
    body: {
      bg: 'base.50',
      color: 'base.900',
      '.chakra-ui-dark &': { bg: 'base.900', color: 'base.50' },
    },
    first: {
      bg: 'base.100',
      color: 'base.900',
      '.chakra-ui-dark &': { bg: 'base.850', color: 'base.100' },
    },
    second: {
      bg: 'base.200',
      color: 'base.900',
      '.chakra-ui-dark &': { bg: 'base.800', color: 'base.100' },
    },
  },
  styles: {
    global: () => ({
      layerStyle: 'body',
      '*': { ...no_scrollbar },
    }),
  },
  direction: 'ltr',
  fonts: {
    body: `'Inter Variable', sans-serif`,
  },
  shadows: {
    light: {
      accent: `0 0 10px 0 var(--invokeai-colors-accent-300)`,
      accentHover: `0 0 10px 0 var(--invokeai-colors-accent-400)`,
      ok: `0 0 7px var(--invokeai-colors-ok-600)`,
      working: `0 0 7px var(--invokeai-colors-working-600)`,
      error: `0 0 7px var(--invokeai-colors-error-600)`,
    },
    dark: {
      accent: `0 0 10px 0 var(--invokeai-colors-accent-600)`,
      accentHover: `0 0 10px 0 var(--invokeai-colors-accent-500)`,
      ok: `0 0 7px var(--invokeai-colors-ok-400)`,
      working: `0 0 7px var(--invokeai-colors-working-400)`,
      error: `0 0 7px var(--invokeai-colors-error-400)`,
    },
    nodeSelectedOutline: `0 0 0 2px var(--invokeai-colors-base-500)`,
  },
  colors: InvokeAIColors,
  components: {
    Button: buttonTheme, // Button and IconButton
    Input: inputTheme,
    Textarea: textareaTheme,
    Tabs: tabsTheme,
    Progress: progressTheme,
    Accordion: accordionTheme,
    FormLabel: formLabelTheme,
    Switch: switchTheme,
    NumberInput: numberInputTheme,
    Select: selectTheme,
    Slider: sliderTheme,
    Popover: popoverTheme,
    Modal: modalTheme,
    Checkbox: checkboxTheme,
    Menu: menuTheme,
    Text: textTheme,
    Tooltip: tooltipTheme,
  },
};
