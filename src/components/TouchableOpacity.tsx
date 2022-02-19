import React from 'react';
import {
  TouchableOpacity as RNTOpacity,
  TouchableOpacityProps as RNTProps,
} from 'react-native';

export interface Props extends RNTProps {
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const TouchableOpacity: React.FC<Props> = ({ children, ...rest }) => (
  <RNTOpacity {...rest}>{children}</RNTOpacity>
);

export default TouchableOpacity;
