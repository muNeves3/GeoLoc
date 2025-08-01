using GeoLoc.src.app.DTOs;

namespace GeoLoc.src.app.repositories
{
    public interface ISalaRepository
    {
        Task<ISalaResponse> Create(ISalaRequest salaRequest);
    }
}
