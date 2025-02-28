import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { Spacer, ListItemText } from './styles';

import { DistTags } from '../../../types/packageMeta';

interface Props {
  tags: DistTags;
}

const VersionsTagList: React.FC<Props> = ({ tags }) => (
  <List dense={true}>
    {Object.keys(tags)
      .reverse()
      .map(tag => (
        <ListItem className="version-item" key={tag}>
          <ListItemText>{tag}</ListItemText>
          <Spacer />
          <ListItemText>{tags[tag]}</ListItemText>
        </ListItem>
      ))}
  </List>
);

export default VersionsTagList;
