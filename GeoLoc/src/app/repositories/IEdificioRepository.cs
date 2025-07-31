using GeoLoc.src.app.DTOs;

namespace GeoLoc.src.app.repositories
{
    public interface IEdificioRepository
    {
        Task<IEdificioResponse> Create(IEdificioRequest edificio);
    }
}
