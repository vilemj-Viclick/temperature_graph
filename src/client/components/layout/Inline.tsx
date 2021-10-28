import PropTypes from 'prop-types';
import React from 'react';
import styled, { css } from 'styled-components';
import { px } from '../../utils/px';
import { Box } from './Box';

interface IInlineProps {
  readonly spacing?: number;
  readonly spacingX?: number;
  readonly spacingY?: number;
  readonly className?: string;
}

const propTypes = {
  spacing: PropTypes.number,
  spacingX: PropTypes.number,
  spacingY: PropTypes.number,
  className: PropTypes.string,
};

const Wrapper = styled.div<{
  readonly ref?: React.Ref<HTMLDivElement>;
  readonly $spacing?: number;
  readonly $spacingX?: number;
  readonly $spacingY?: number;
}>`
    padding-top: 1px;

    ${({ $spacing }) => $spacing && css`
        margin-left: ${px(-1 * $spacing)};

        &:before {
            display: block;
            margin-top: ${px(-1 * ($spacing + 1))};
            content: "";
        }
    `};

    ${({ $spacingY }) => $spacingY && css`
        &:before {
            display: block;
            margin-top: ${px(-1 * ($spacingY + 1))};
            content: "";
        }
    `};

    ${({ $spacingX }) => $spacingX && css`
        margin-left: ${px(-1 * $spacingX)};
    `};
`;

const Container = styled.div`
    display: flex;
    flex-wrap: wrap;
`;

export const Inline: React.FC<IInlineProps> = React.forwardRef<HTMLDivElement, IInlineProps>(({
  spacing,
  spacingX,
  spacingY,
  children,
  className,
}, forwardedRef) => {
  return (
    <Wrapper
      ref={forwardedRef}
      $spacing={spacing}
      $spacingX={spacingX}
      $spacingY={spacingY}
      className={className}
    >
      <Container>
        {
          React.Children.map(children, (child) => child && (
            <Box
              paddingTop={spacingY || spacing}
              paddingLeft={spacingX || spacing}
            >
              {child}
            </Box>
          ))
        }
      </Container>
    </Wrapper>
  );
});

Inline.displayName = 'Inline';
Inline.propTypes = propTypes;
