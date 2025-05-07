import {useState} from "react";
import {Proveedor} from "./types.tsx";
import {Flex, FormControl} from "@chakra-ui/react";
import MyPagination from "../../components/MyPagination.tsx";


export default function ConsultarProveedores() {

    const [chkbox, setChkbox] = useState<string[]>(["material empaque"]);
    const [searchText, setSearchText] = useState("");
    const [proveedores, setProveedores] = useState<Proveedor[]>([]);

    // states para pagination
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 10; // adjust as needed


    const fetchProveedores = async (pageNumber: number) => {

    }

    // Handle page changes from the pagination component
    const handlePageChange = (newPage: number) => {
        fetchProveedores(newPage);
    };


    return(
        <Flex direction={"column"} p={4}>

            <Flex direction={"row"} mb={4} align="center">
                <FormControl>

                </FormControl>
            </Flex>

            <></>

            <MyPagination
                page={page}
                totalPages={totalPages}
                loading={loading}
                handlePageChange={handlePageChange}
            />
        </Flex>
    )
}