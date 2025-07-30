using GeoLoc.src.app.DTOs;
using GeoLoc.src.app.Models;

namespace GeoLoc.src.app.use_cases
{
    public class create_perfil_usuario
    {
        private readonly GeoLoc.src.app.repositories.IPerfilUsuarioRepository _perfilUsuarioRepository;
        public create_perfil_usuario(
            GeoLoc.src.app.repositories.IPerfilUsuarioRepository perfilUsuarioRepository)
        {
            _perfilUsuarioRepository = perfilUsuarioRepository;
        }

        public async Task<IUsuarioResponse> execute(IUsuarioRequest perfilUsuario)
        {
            IUsuarioResponse created = await this._perfilUsuarioRepository.Create(perfilUsuario);

            return created;
        }
    }
}
