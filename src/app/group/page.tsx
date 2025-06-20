'use client';

import { useState } from 'react';
import style from '../../../styles/group/groupPage.module.scss';
import NonGroup from './nonGroup';
import IfGroup from './ifGroup';

const GroupPage = () => {
  const [hotPlaceList, setHotPlaceList] = useState<any>(null);

  return (
    <div className={style.body}>
      {hotPlaceList ? <IfGroup /> : <NonGroup />}
    </div>
  );
};

export default GroupPage;
