import PropTypes from 'prop-types';
import React, { CSSProperties } from 'react';
import styled, { css } from 'styled-components';
import { px } from '../../utils/px';

export interface IPaddingProps {
  readonly padding?: number;
  readonly paddingX?: number;
  readonly paddingY?: number;
  readonly paddingTop?: number;
  readonly paddingRight?: number;
  readonly paddingBottom?: number;
  readonly paddingLeft?: number;
}

export const paddingPropTypes = {
  padding: PropTypes.number,
  paddingX: PropTypes.number,
  paddingY: PropTypes.number,
  paddingTop: PropTypes.number,
  paddingRight: PropTypes.number,
  paddingBottom: PropTypes.number,
  paddingLeft: PropTypes.number,
};

interface IBoxProps extends IPaddingProps {
  readonly backgroundColor?: string;
  readonly backgroundImage?: string;
  readonly border?: string;
  readonly borderRadius?: number;
  readonly boxShadow?: string;
  readonly className?: string;
  readonly component?: React.ElementType;
  readonly style?: CSSProperties;
}

const propTypes = {
  ...paddingPropTypes,

  backgroundColor: PropTypes.string,
  backgroundImage: PropTypes.string,
  border: PropTypes.string,
  borderRadius: PropTypes.number,
  boxShadow: PropTypes.string,
  className: PropTypes.string,
  component: PropTypes.elementType as any,
  style: PropTypes.object,
};

const getPaddingStyles = (paddingProps: IPaddingProps) => {
  const {
    padding,
    paddingX,
    paddingY,
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,
  } = paddingProps;

  const pt = paddingTop ?? paddingY ?? padding ?? 0;
  const pr = paddingRight ?? paddingX ?? padding ?? 0;
  const pb = paddingBottom ?? paddingY ?? padding ?? 0;
  const pl = paddingLeft ?? paddingX ?? padding ?? 0;

  return css`
    padding: ${px(pt)} ${px(pr)} ${px(pb)} ${px(pl)};
  `;
};

const StyledBox = styled.div<IPaddingProps & {
  readonly backgroundColor?: string;
  readonly backgroundImage?: string;
  readonly border?: number;
  readonly borderRadius?: number;
  readonly boxShadow?: string;
}>`
  ${({ padding }) => padding};
  ${({ backgroundColor }) => backgroundColor && css`background-color: ${backgroundColor};`};
  ${({ backgroundImage }) => backgroundImage && css`background-image: ${backgroundImage.toString()};`};
  ${({ boxShadow }) => boxShadow && css`box-shadow: ${boxShadow};`};
  ${({ border }) => border && css`border: ${border};`};
  ${({ borderRadius }) => borderRadius && css`border-radius: ${px(borderRadius)};`};
`;

const splitPaddingAndRestProps = (props: React.PropsWithChildren<IBoxProps>) => {
  const {
    padding,
    paddingTop,
    paddingBottom,
    paddingLeft,
    paddingRight,
    paddingX,
    paddingY,
    ...restProps
  } = props;
  return {
    restProps,
    paddingProps: {
      padding,
      paddingTop,
      paddingBottom,
      paddingLeft,
      paddingRight,
      paddingX,
      paddingY,
    },
  };
};

export const Box: React.FC<IBoxProps> = React.forwardRef<HTMLElement, IBoxProps>((props, forwardedRef) => {
  const {
    paddingProps,
    restProps,
  } = splitPaddingAndRestProps(props);
  const {
    children,
    component = 'div',
    ...otherProps
  } = restProps;
  const padding = getPaddingStyles(paddingProps);

  return (
    <StyledBox
      as={component}
      padding={padding}
      ref={forwardedRef}
      {...otherProps}
    >
      {children}
    </StyledBox>
  );
});

Box.displayName = 'Box';
Box.propTypes = propTypes;
