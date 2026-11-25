import { useNavigate } from 'react-router-dom';
import { Botao } from '../../../components/ui';
import { PerfilTela } from '../componentes/PerfilTela';

export function MeuPerfilPagina() {
    const navegar = useNavigate();

    return (
        <PerfilTela
            alvo="eu"
            mostrarEstadoAtivo
            tituloAnuncios="Meus anúncios"
            textoVazio="Você ainda não publicou nenhum anúncio."
            acoes={<Botao onClick={() => navegar('/perfil/editar')}>Editar perfil</Botao>}
        />
    );
}