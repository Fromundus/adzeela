import dynamic from 'next/dynamic';
import React, { forwardRef } from 'react';

const Select = dynamic(() => import('react-select').then(mod => mod.default), { ssr: false });

const ReactSelect = forwardRef((props: any, ref) => {
  return (
    <Select
      {...props}
      ref={ref}
      // menuPortalTarget={document.body}
      styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
    />
  );
});

export default ReactSelect;
