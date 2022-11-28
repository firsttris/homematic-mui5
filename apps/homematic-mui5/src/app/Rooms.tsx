import {
  Container,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { useGetRooms } from '../hooks/useApi';
import InboxIcon from '@mui/icons-material/Inbox';
import { useNavigate } from 'react-router-dom';

export const Rooms = () => {
  const navigate = useNavigate();

  const { data, isFetched } = useGetRooms();

  const rooms = data?.data.result;

  if (isFetched && rooms) {
    return (
      <Container maxWidth="md">
        <List>
          {rooms.map((room) => (
            <ListItem
              disablePadding
              key={room.id}
              onClick={() => navigate(`/room/${room.id}`)}
            >
              <ListItemButton>
                <ListItemIcon>
                  <InboxIcon />
                </ListItemIcon>
                <ListItemText primary={room.name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Container>
    );
  } else {
    return null;
  }
};
