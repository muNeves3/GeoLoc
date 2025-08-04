using GeoLoc.src.app.DTOs;

namespace GeoLoc.src.app.repositories
{
    public interface ISalaRepository
    {
        Task<ISalaResponse> Create(ISalaRequest salaRequest);
        Task<List<ISalaResponse>> GetSalasEdificio(string idEdificio);
        Task<ISalaResponse> GetByIdAsync(Guid id);
    }
}
