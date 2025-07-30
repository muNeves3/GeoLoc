using GeoLoc.src.app.DTOs;

namespace GeoLoc.src.app.repositories
{
    public interface ICentroRepository
    {
        Task<ICentroResponse> Create(ICentroRequest centro);
        Task<List<ICentroResponse>> GetAll();
    }
}
