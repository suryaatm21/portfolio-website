// Fix JSX component type conflicts by making Element assignable to ReactNode
declare global {
  namespace React {
    // Make Element compatible with ReactPortal by adding children property
    interface ReactElement {
      children?: ReactNode;
    }
  }

  // Make Element extend ReactElement to fix component compatibility
  interface Element extends React.ReactElement {
    children?: React.ReactNode;
  }
}

export {};
