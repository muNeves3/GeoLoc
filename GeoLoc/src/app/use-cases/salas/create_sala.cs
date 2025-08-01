using GeoLoc.src.app.DTOs;
using GeoLoc.src.app.repositories;

namespace GeoLoc.src.app.use_cases.salas
{
    public class create_sala
    {
        private readonly ISalaRepository _salaRepository;
        public create_sala(ISalaRepository salaRepository)
        {
            _salaRepository = salaRepository;
        }
        public async Task<ISalaResponse> execute(ISalaRequest salaRequest)
        {
            if (salaRequest == null)
            {
                throw new ArgumentNullException(nameof(salaRequest), "Sala request cannot be null.");
            }
            return await _salaRepository.Create(salaRequest);
        }
    }
}
