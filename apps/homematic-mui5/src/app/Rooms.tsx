import {
  Container,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import { useGetRooms } from '../hooks/useApi';
import MeetingRoomOutlinedIcon from '@mui/icons-material/MeetingRoomOutlined';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/system';

export const Rooms = () => {
  const navigate = useNavigate();

  const { data, isFetched } = useGetRooms();

  const rooms = data?.data.result;

  if (isFetched && rooms) {
    return (
      <Container maxWidth="md">
        <List>
          {rooms.map((room, index) => (
            <Box key={index}>
              <ListItem
                disablePadding
                key={room.id}
                onClick={() =>
                  navigate(
                    `/room/${room.id}?channelIds=${room.channelIds.join(',')}`
                  )
                }
              >
                <ListItemButton>
                  <MeetingRoomOutlinedIcon />

                  <ListItemText
                    primary={room.name}
                    sx={{ marginLeft: '20px' }}
                  />
                </ListItemButton>
              </ListItem>
              {rooms.length === index + 1 ? null : <Divider />}
            </Box>
          ))}
        </List>
      </Container>
    );
  } else {
    return null;
  }
};
