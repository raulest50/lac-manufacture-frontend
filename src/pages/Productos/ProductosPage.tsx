import {useState, useEffect} from 'react';
import {Container} from '@chakra-ui/react';
import axios from 'axios';
import {useAuth} from '../../context/AuthContext';
import EndPointsURL from '../../api/EndPointsURL';

import MyHeader from '../../components/MyHeader.tsx';
import {Authority, WhoAmIResponse} from '../../api/global_types.tsx';
import ProductosMenuSelection from './ProductosMenuSelection';
import BasicOperationsTabs from './Basic/BasicOperationsTabs.tsx';
import TerminadosSemiterminadosTabs from './DefSemiTer/TerminadosSemiterminadosTabs.tsx';
import DefinicionProcesosTabs from './DefProcesses/DefinicionProcesosTabs.tsx';

function ProductosPage() {
    const [productosAccessLevel, setProductosAccessLevel] = useState<number>(0);
    const { user } = useAuth();
    const endPoints = new EndPointsURL();

    const [viewMode, setViewMode] = useState<'menu' | 'basic' | 'terminados' | 'procesos'>('menu');

    useEffect(() => {
        const fetchUserAccessLevel = async () => {
            try {
                const response = await axios.get<WhoAmIResponse>(endPoints.whoami);
                const authorities = response.data.authorities;

                // Buscar la autoridad para el módulo PRODUCTOS
                const productosAuthority = authorities.find(
                    (auth:Authority) => auth.authority === "ACCESO_PRODUCTOS",
                );

                if (productosAuthority) {
                    setProductosAccessLevel(parseInt(productosAuthority.nivel));
                }
            } catch (error) {
                console.error("Error al obtener el nivel de acceso:", error);
            }
        };

        fetchUserAccessLevel();
    }, []);

    function renderContent() {
        switch (viewMode) {
            case 'basic':
                return (
                    <BasicOperationsTabs
                        user={user}
                        productosAccessLevel={productosAccessLevel}
                        onBack={() => setViewMode('menu')}
                    />
                );
            case 'terminados':
                return (
                    <TerminadosSemiterminadosTabs
                        user={user}
                        productosAccessLevel={productosAccessLevel}
                        onBack={() => setViewMode('menu')}
                    />
                );
            case 'procesos':
                return <DefinicionProcesosTabs onBack={() => setViewMode('menu')} />;
            default:
                return (
                    <ProductosMenuSelection
                        setViewMode={setViewMode}
                        user={user}
                        productosAccessLevel={productosAccessLevel}
                    />
                );
        }
    }

    return (
        <Container minW={['auto', 'container.lg', 'container.xl']} w="full" h="full">
            <MyHeader title="Productos" />
            {renderContent()}
        </Container>
    );
}

export default ProductosPage;
