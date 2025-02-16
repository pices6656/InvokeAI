import { defineStyle, defineStyleConfig } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';

const invokeAI = defineStyle((props) => {
  const { colorScheme: c } = props;
  // must specify `_disabled` colors if we override `_hover`, else hover on disabled has no styles

  if (c === 'base') {
    const _disabled = {
      bg: mode('base.200', 'base.700')(props),
      color: mode('base.500', 'base.150')(props),
      svg: {
        fill: mode('base.500', 'base.150')(props),
      },
      opacity: 1,
    };

    return {
      bg: mode('base.200', 'base.600')(props),
      color: mode('base.850', 'base.100')(props),
      borderRadius: 'base',
      textShadow: mode(
        '0 0 0.3rem var(--invokeai-colors-base-50)',
        '0 0 0.3rem var(--invokeai-colors-base-900)'
      )(props),
      svg: {
        fill: mode('base.850', 'base.100')(props),
        filter: mode(
          'drop-shadow(0px 0px 0.3rem var(--invokeai-colors-base-100))',
          'drop-shadow(0px 0px 0.3rem var(--invokeai-colors-base-800))'
        )(props),
      },
      _disabled,
      _hover: {
        bg: mode('base.300', 'base.500')(props),
        color: mode('base.900', 'base.50')(props),
        svg: {
          fill: mode('base.900', 'base.50')(props),
        },
        _disabled,
      },
      _checked: {
        bg: mode('accent.400', 'accent.600')(props),
        color: mode('base.50', 'base.100')(props),
        svg: {
          fill: mode(`${c}.50`, `${c}.100`)(props),
          filter: mode(
            `drop-shadow(0px 0px 0.3rem var(--invokeai-colors-${c}-600))`,
            `drop-shadow(0px 0px 0.3rem var(--invokeai-colors-${c}-800))`
          )(props),
        },
        _disabled,
        _hover: {
          bg: mode('accent.500', 'accent.500')(props),
          color: mode('white', 'base.50')(props),
          svg: {
            fill: mode('white', 'base.50')(props),
          },
          _disabled,
        },
      },
    };
  }

  const _disabled = {
    bg: mode(`${c}.200`, `${c}.700`)(props),
    color: mode(`${c}.100`, `${c}.150`)(props),
    svg: {
      fill: mode(`${c}.100`, `${c}.150`)(props),
    },
    opacity: 1,
    filter: mode(undefined, 'saturate(65%)')(props),
  };

  return {
    bg: mode(`${c}.400`, `${c}.600`)(props),
    color: mode(`base.50`, `base.100`)(props),
    borderRadius: 'base',
    textShadow: mode(
      `0 0 0.3rem var(--invokeai-colors-${c}-600)`,
      `0 0 0.3rem var(--invokeai-colors-${c}-900)`
    )(props),
    svg: {
      fill: mode(`base.50`, `base.100`)(props),
      filter: mode(
        `drop-shadow(0px 0px 0.3rem var(--invokeai-colors-${c}-600))`,
        `drop-shadow(0px 0px 0.3rem var(--invokeai-colors-${c}-800))`
      )(props),
    },
    _disabled,
    _hover: {
      bg: mode(`${c}.500`, `${c}.500`)(props),
      color: mode('white', `base.50`)(props),
      svg: {
        fill: mode('white', `base.50`)(props),
      },
      _disabled,
    },
    _checked: {
      bg: mode('accent.400', 'accent.600')(props),
      color: mode('base.50', 'base.100')(props),
      svg: {
        fill: mode(`base.50`, `base.100`)(props),
        filter: mode(
          `drop-shadow(0px 0px 0.3rem var(--invokeai-colors-${c}-600))`,
          `drop-shadow(0px 0px 0.3rem var(--invokeai-colors-${c}-800))`
        )(props),
      },
      _disabled,
      _hover: {
        bg: mode('accent.500', 'accent.500')(props),
        color: mode('white', 'base.50')(props),
        svg: {
          fill: mode('white', 'base.50')(props),
        },
        _disabled,
      },
    },
  };
});

export const buttonTheme = defineStyleConfig({
  variants: {
    invokeAI,
  },
  defaultProps: {
    variant: 'invokeAI',
    colorScheme: 'base',
  },
});
