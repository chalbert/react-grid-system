import React from 'react';
import PropTypes from 'prop-types';
import { getConfiguration } from '../../config';
import getStyle from './style';

export const GutterWidthContext = React.createContext(false);

export default class Row extends React.PureComponent {
  static displayName = 'Row';

  static propTypes = {
    /**
     * Content of the element
     */
    children: PropTypes.node.isRequired,
    /**
     * Vertical column alignment
     */
    align: PropTypes.oneOf(['normal', 'start', 'center', 'end', 'stretch']),
    /**
     * Horizontal column alignment
     */
    justify: PropTypes.oneOf([
      'start',
      'center',
      'end',
      'between',
      'around',
      'initial',
      'inherit',
    ]),
    /**
     * No gutter for this row
     */
    nogutter: PropTypes.bool,
    /**
     * Custom gutter width for this row
     */
    gutterWidth: PropTypes.number,
    /**
     * Optional styling
     */
    style: PropTypes.objectOf(
      PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    ),
    /**
     * Set to apply some debug styling
     */
    debug: PropTypes.bool,
    /**
    * Use your own component
    */
    as: PropTypes.elementType,
    /**
    * Alias of "as" prop
    */
    component: PropTypes.elementType,
    /**
     * Whether the cols should not wrap
     */
    nowrap: PropTypes.bool,
  };

  static defaultProps = {
    align: 'normal',
    justify: 'start',
    nogutter: false,
    gutterWidth: null,
    style: {},
    debug: false,
    as: null,
    component: null,
  };

  constructor(props) {
    super(props);

    const { as, component } = props;
    const Component = as || component || 'div';
    const { componentDecorator } = getConfiguration();
    this.decoratedComponent = componentDecorator(Component, this);
  }

  render = () => {
    const {
      children,
      style,
      align,
      justify,
      debug,
      nogutter,
      gutterWidth,
      component,
      nowrap,
      ...otherProps
    } = this.props;
    let theGutterWidth = getConfiguration().gutterWidth;
    if (nogutter) theGutterWidth = 0;
    if (typeof gutterWidth === 'number') theGutterWidth = gutterWidth;
    const theStyle = getStyle({
      gutterWidth: theGutterWidth,
      align,
      justify,
      debug,
      moreStyle: style,
      nowrap,
    });
    return React.createElement(
      this.decoratedComponent,
      { style: theStyle, ...otherProps },
      <GutterWidthContext.Provider value={theGutterWidth}>
        {children}
      </GutterWidthContext.Provider>,
    );
  };
}
