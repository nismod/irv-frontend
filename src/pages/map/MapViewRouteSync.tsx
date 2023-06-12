import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { DefaultValue } from 'recoil';
import { RecoilSync } from 'recoil-sync';

export function MapViewRouteSync({ children }) {
  const { view } = useParams();
  const updateItemRef = useRef(null);

  useEffect(() => {
    updateItemRef.current?.('view', view);
  }, [view]);

  return (
    <RecoilSync
      storeKey="map-view-route"
      read={(itemKey) => {
        if (itemKey === 'view') {
          return view;
        } else return new DefaultValue();
      }}
      listen={({ updateItem }) => {
        updateItemRef.current = updateItem;

        return () => {
          updateItemRef.current = null;
        };
      }}
    >
      {children}
    </RecoilSync>
  );
}
