// src/components/UserFullRoleCRUD.tsx
import { useState } from 'react';
import {
    Box,
} from '@chakra-ui/react';
import CreateUser from "./CreateUser.tsx";
import UserViewer from "./UserViewer.tsx";

export default function UserFullRoleCRUD() {

    const VIEW_MODES = {USER_VIEWER:0, CREATE_USER:1};
    const [viewMode, setViewMode] = useState(VIEW_MODES.USER_VIEWER);

    function ConditionalRender(){
        if(viewMode === VIEW_MODES.USER_VIEWER){
            return(
                <UserViewer setViewMode={setViewMode}/>
            )
        } else{
            return(
                <CreateUser
                    onCancel={() => setViewMode(VIEW_MODES.USER_VIEWER)}
                    onUserCreated={() => {
                        // fetchUsers();
                        setViewMode(VIEW_MODES.USER_VIEWER);
                    }}
                />
            )
        }
    }

    return (
        <Box p={4} flex={1} h={"inherit"}>
            <ConditionalRender />
        </Box>
    );
}
