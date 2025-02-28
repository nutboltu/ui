import React, { useContext } from 'react';

import { DetailContext } from '../../pages/Version';

import { Heading } from './styles';

import VersionsTagList from './VersionsTagList';
import VersionsHistoryList from './VersionsHistoryList';

import { DIST_TAGS } from '../../../lib/constants';

export const NOT_AVAILABLE = 'Not available';
export const LABEL_CURRENT_TAGS = 'Current Tags';
export const LABEL_VERSION_HISTORY = 'Version History';

const Versions: React.FC = () => {
  const detailContext = useContext(DetailContext);

  const { packageMeta, packageName } = detailContext;

  if (!packageMeta) {
    return null;
  }

  // @ts-ignore - Property 'dist-tags' does not exist on type 'PackageMetaInterface'
  const { versions = {}, time = {}, [DIST_TAGS]: distTags = {} } = packageMeta;

  return (
    <>
      {distTags && Object.keys(distTags).length > 0 && (
        <>
          <Heading variant="subtitle1">{LABEL_CURRENT_TAGS}</Heading>
          <VersionsTagList tags={distTags} />
        </>
      )}
      {versions && Object.keys(versions).length > 0 && packageName && (
        <>
          <Heading variant="subtitle1">{LABEL_VERSION_HISTORY}</Heading>
          <VersionsHistoryList packageName={packageName} time={time} versions={versions} />
        </>
      )}
    </>
  );
};

export default Versions;
