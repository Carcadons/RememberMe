// Navigation compatibility layer - simplified for now
// TODO: Replace with actual React Router implementation

import { useState, useEffect, useCallback } from 'react';

// Mock navigation hooks for web
export const useNavigation = () => {
  return {
    navigate: (route: string, params?: any) => {
      console.log('Navigating to:', route, params);
      // TODO: Implement with React Router
    },
    goBack: () => {
      console.log('Going back');
      // TODO: Implement with React Router
    },
    reset: (options: any) => {
      console.log('Resetting navigation:', options);
      // TODO: Implement with React Router
    },
  };
};

export const useRoute = () => {
  // TODO: Implement with React Router
  return {
    params: {},
    name: '',
  };
};

export const useFocusEffect = (callback: () => void) => {
  useEffect(() => {
    callback();
  }, []); // Simplified - runs once on mount
};

export const NavigationContainer = ({ children }: any) => {
  return <>{children}</>;
};

export const createBottomTabNavigator = () => {
  return {
    Navigator: ({ children }: any) => <>{children}</>,
    Screen: ({ component: Component }: any) => <Component />,
  };
};

export const createStackNavigator = () => {
  return {
    Navigator: ({ children }: any) => <>{children}</>,
    Screen: ({ component: Component }: any) => <Component />,
  };
};

// RouteProp and NavigationProp types for TypeScript
export type RouteProp<T extends {}, U extends keyof T> = {
  params: T[U];
  name: U;
};

export type NavigationProp<T extends {}> = {
  navigate: (route: keyof T, params?: any) => void;
  goBack: () => void;
  reset: (options: any) => void;
};
