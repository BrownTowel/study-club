import { Link } from 'react-router-dom'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Chat } from '../../templates/chat';

export const Entrance = () => {

    return (
        <>
            <div>Entrance Page</div><Link to="/app/calendar">LINK</Link>

            <Box width="100%" display="flex">
                <Box width="50%"><Typography variant="h2" gutterBottom>Lorem ipsum</Typography></Box>
                <Chat></Chat>
            </Box>

        </>
    );
};