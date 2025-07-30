using GeoLoc.src.app.DTOs;
using GeoLoc.src.app.Models;

namespace GeoLoc.src.app.repositories
{
    public interface IPerfilUsuarioRepository
    {
        Task<IUsuarioResponse> Create(IUsuarioRequest perfil);
    }
}
