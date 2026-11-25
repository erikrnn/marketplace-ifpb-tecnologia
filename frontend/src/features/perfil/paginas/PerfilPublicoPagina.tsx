import { useParams } from 'react-router-dom';
import { PerfilTela } from '../componentes/PerfilTela';

export function PerfilPublicoPagina() {
    const { id } = useParams();
    const idNumero = Number(id);

    // /usuarios/abc ou /usuarios/0: nem chega a chamar a API.
    if (!Number.isInteger(idNumero) || idNumero < 1) {
        return (
            <main style={{ maxWidth: 960, margin: '0 auto', padding: 24 }}>
                <p role="alert">Estudante não encontrado.</p>
            </main>
        );
    }

    // key={idNumero}: ao ir de /usuarios/2 para /usuarios/3, o React recria a tela
    // do zero, em vez de reaproveitar o estado do perfil anterior.
    return (
        <PerfilTela
            key={idNumero}
            alvo={idNumero}
            textoVazio="Este estudante não tem anúncios ativos no momento."
        />
    );
}